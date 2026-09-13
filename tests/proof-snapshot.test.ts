import { test } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';

test('private PostgreSQL snapshots enforce freshness, availability and publication fencing', {
  skip: !process.env.DATABASE_URL,
  timeout: 30000,
}, async () => {
  const schema = `proof_test_${randomUUID().replaceAll('-', '')}`;
  const previousSchema = process.env.PROOF_DATABASE_SCHEMA;
  process.env.PROOF_DATABASE_SCHEMA = schema;
  const db = await import('../vendor/proof-sdk/server/db-postgres.ts');
  const snapshots = await import('../vendor/proof-sdk/server/snapshot.ts');
  const collab = await import('../vendor/proof-sdk/server/collab.ts');
  try {
    await db.initializeDatabase();
    assert.equal(await snapshots.getSnapshotHtml('missing'), null);
    assert.equal(await snapshots.refreshSnapshotForSlug('missing'), false);
    await db.createDocument('snapshot', '# PRIVATE_BODY_71df\n\nOriginal body.', {}, 'Snapshot fixture');
    assert.equal(await snapshots.refreshSnapshotForSlug('snapshot'), true);
    const current = await snapshots.getSnapshotHtml('snapshot');
    assert.equal(typeof current, 'string');
    assert(current?.includes('PRIVATE_BODY_71df'));
    assert.equal(snapshots.getSnapshotPublicUrl('snapshot'), null);
    assert.equal(snapshots.getSnapshotPublicUrl('missing'), null);
    const stored = await db.getDb().query('SELECT html FROM document_html_snapshots WHERE document_slug=$1', ['snapshot']);
    assert.equal(stored.rows[0]?.html, current);

    await db.updateDocument('snapshot', '# REVISED_BODY_62ad');
    assert.equal(await snapshots.getSnapshotHtml('snapshot'), null, 'An old revision must not be served');
    assert.equal(await snapshots.refreshSnapshotForSlug('snapshot'), true);
    assert((await snapshots.getSnapshotHtml('snapshot'))?.includes('REVISED_BODY_62ad'));

    await db.pauseDocument('snapshot');
    assert.equal(await snapshots.getSnapshotHtml('snapshot'), null);
    assert.equal(await snapshots.refreshSnapshotForSlug('snapshot'), true);
    const paused = await snapshots.getSnapshotHtml('snapshot');
    assert.equal(typeof paused, 'string');
    assert(!paused?.includes('REVISED_BODY_62ad'));
    assert(!paused?.includes('PRIVATE_BODY_71df'));

    await db.resumeDocument('snapshot');
    assert.equal(await snapshots.refreshSnapshotForSlug('snapshot'), true);
    assert((await snapshots.getSnapshotHtml('snapshot'))?.includes('REVISED_BODY_62ad'));
    await db.revokeDocument('snapshot');
    assert.equal(await snapshots.getSnapshotHtml('snapshot'), null);
    assert.equal(await snapshots.refreshSnapshotForSlug('snapshot'), true);
    assert(!(await snapshots.getSnapshotHtml('snapshot'))?.includes('REVISED_BODY_62ad'));
    await db.deleteDocument('snapshot');
    await snapshots.refreshSnapshotForSlug('snapshot');
    assert.equal(await snapshots.getSnapshotHtml('snapshot'), null, 'Deleted documents have no readable snapshot');

    await db.createDocument('race', '# BEFORE_RACE_418a', {}, 'Race fixture');
    const database = db.getDb();
    const originalQuery = database.query;
    let raced = false;
    database.query = async (sql, values) => {
      if (!raced && sql.includes('INSERT INTO document_html_snapshots')) {
        raced = true;
        await db.updateDocument('race', '# AFTER_RACE_607c');
      }
      return originalQuery(sql, values);
    };
    try {
      assert.equal(await snapshots.refreshSnapshotForSlug('race'), false, 'A revision changing after rendering must lose the publication fence');
      assert(raced);
      assert.equal(await snapshots.getSnapshotHtml('race'), null);
    } finally {
      database.query = originalQuery;
    }
    assert.equal(await snapshots.refreshSnapshotForSlug('race'), true);
    const final = await snapshots.getSnapshotHtml('race');
    assert(final?.includes('AFTER_RACE_607c'));
    assert(!final?.includes('BEFORE_RACE_418a'));
  } finally {
    try {
      try {
        await collab.stopCollabRuntime({ skipDocFlush: true });
      } finally {
        await db.getDb().query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
        const remaining = await db.getDb().query('SELECT 1 FROM pg_catalog.pg_namespace WHERE nspname=$1', [schema]);
        assert.equal(remaining.rowCount, 0, 'The disposable snapshot schema was removed');
      }
    } finally {
      await db.closeDatabase();
      if (previousSchema === undefined) delete process.env.PROOF_DATABASE_SCHEMA;
      else process.env.PROOF_DATABASE_SCHEMA = previousSchema;
    }
  }
});
