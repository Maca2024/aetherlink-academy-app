import { test } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { createProofDatabase } from '../vendor/proof-sdk/server/postgres.ts';

test('Proof PostgreSQL migration, transactions and binary state', { skip: !process.env.DATABASE_URL }, async () => {
  const schema = `proof_test_${randomUUID().replaceAll('-', '')}`;
  const database = createProofDatabase({ connectionString: process.env.DATABASE_URL, schema });
  const second = createProofDatabase({ connectionString: process.env.DATABASE_URL, schema });
  try {
    await Promise.all([database.initialize(), second.initialize()]);
    await database.initialize();
    await database.transaction(async () => {
      await database.query('LOCK TABLE documents IN ROW EXCLUSIVE MODE');
      let deadline;
      const initializing = second.initialize();
      try {
        await Promise.race([
          initializing,
          new Promise((_, reject) => { deadline = setTimeout(() => reject(new Error('Restart attempted DDL while a live writer held its table lock')), 2000); }),
        ]);
      } finally {
        clearTimeout(deadline);
        // Observe the attempt even if the regression deadline rejects first.
        void initializing.catch(() => {});
      }
    });
    const migration = (await database.query("SELECT value FROM system_metadata WHERE key='proof_schema_migration'")).rows[0].value;
    await database.query("UPDATE system_metadata SET value='unsupported:checksum' WHERE key='proof_schema_migration'");
    await assert.rejects(second.initialize(), /version or checksum differs/);
    await database.query("DELETE FROM system_metadata WHERE key='proof_schema_migration'");
    await assert.rejects(second.initialize(), /unversioned.*offline migration/);
    await database.query("INSERT INTO system_metadata (key,value,updated_at) VALUES ('proof_schema_migration',$1,$2)", [migration, new Date().toISOString()]);
    const tables = await database.query('SELECT table_name FROM information_schema.tables WHERE table_schema = $1', [schema]);
    assert.deepEqual(tables.rows.map(row => row.table_name).sort(), [
      'active_collab_connections', 'document_access', 'document_blocks', 'document_events',
      'document_html_snapshots', 'document_projections', 'document_y_snapshots', 'document_y_updates', 'documents',
      'events', 'idempotency_keys', 'library_documents', 'maintenance_runs', 'mark_tombstones',
      'mutation_idempotency', 'mutation_outbox', 'server_incident_events', 'share_auth_sessions',
      'system_metadata', 'user_document_visits',
    ].sort());
    const now = '2026-09-13T12:00:00.000Z';
    await database.query('INSERT INTO documents (slug, markdown, created_at, updated_at) VALUES ($1, $2, $3, $3)', ['document', 'Hello', now]);
    const bytes = Buffer.from([0, 255, 128, 1, 10, 0]);
    const inserted = await database.query('INSERT INTO document_y_updates (document_slug, update_blob, created_at) VALUES ($1, $2, $3) RETURNING seq', ['document', bytes, now]);
    assert.equal(inserted.rowCount, 1);
    assert.equal(BigInt(inserted.rows[0].seq), 1n);
    const loaded = await second.query('SELECT update_blob, created_at FROM document_y_updates WHERE seq = $1', [inserted.rows[0].seq]);
    assert.deepEqual(loaded.rows[0].update_blob, bytes);
    assert.equal(loaded.rows[0].created_at, now);
    await assert.rejects(database.transaction(async () => {
      await database.query("UPDATE documents SET markdown = 'rolled back' WHERE slug = 'document'");
      throw new Error('rollback requested');
    }), /rollback requested/);
    assert.equal((await second.query("SELECT markdown FROM documents WHERE slug = 'document'")).rows[0].markdown, 'Hello');
    await database.transaction(async () => {
      const outer = (await database.query('SELECT pg_backend_pid() AS pid')).rows[0].pid;
      await database.query("UPDATE documents SET markdown = 'outer survives' WHERE slug = 'document'");
      await assert.rejects(database.transaction(async () => {
        assert.equal((await database.query('SELECT pg_backend_pid() AS pid')).rows[0].pid, outer);
        await database.query("UPDATE documents SET markdown = 'inner rolls back' WHERE slug = 'document'");
        await database.query("INSERT INTO documents (slug, markdown, created_at, updated_at) VALUES ('document', 'duplicate', $1, $1)", [now]);
      }), error => error.code === '23505');
      assert.equal((await database.query("SELECT markdown FROM documents WHERE slug = 'document'")).rows[0].markdown, 'outer survives');
      await database.transaction(async () => {
        assert.equal((await database.query('SELECT pg_backend_pid() AS pid')).rows[0].pid, outer);
        await database.query("UPDATE documents SET title = 'nested committed' WHERE slug = 'document'");
      });
    });
    let releaseBackground;
    const backgroundGate = new Promise(resolve => { releaseBackground = resolve; });
    let detachedTask, retainedTask;
    await database.transaction(async () => {
      detachedTask = database.outsideTransaction(async () => {
        await backgroundGate;
        return database.query('SELECT 1 AS alive');
      });
      retainedTask = (async () => {
        await backgroundGate;
        return database.query('SELECT 1 AS must_not_reuse_expired_scope');
      })();
    });
    const retainedRejection = assert.rejects(retainedTask, /Transaction scope is not available/);
    releaseBackground();
    assert.equal((await detachedTask).rows[0].alive, 1);
    await retainedRejection;
    const final = (await second.query("SELECT markdown, title FROM documents WHERE slug = 'document'")).rows[0];
    assert.deepEqual(final, { markdown: 'outer survives', title: 'nested committed' });
    await assert.rejects(database.query('INSERT INTO document_y_updates (document_slug, update_blob, created_at) VALUES ($1, $2, $3)', ['missing', bytes, now]), error => error.code === '23503');
  } finally {
    await second.close();
    try {
      await database.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
    } finally {
      await database.close();
    }
  }
});
