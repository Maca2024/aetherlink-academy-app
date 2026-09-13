import { test } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { createRequire } from 'node:module';
const require = createRequire(new URL('../vendor/proof-sdk/package.json', import.meta.url));
const express = require('express');

test('concurrent REST rewrite barriers preserve durable Yjs history and reload admission', { skip: !process.env.DATABASE_URL, timeout: 40000 }, async () => {
  const schema = `proof_test_${randomUUID().replaceAll('-', '')}`;
  const previous = { schema: process.env.PROOF_DATABASE_SCHEMA, prefix: process.env.PROOF_REDIS_PREFIX, secret: process.env.PROOF_COLLAB_SIGNING_SECRET };
  process.env.PROOF_DATABASE_SCHEMA = schema;
  process.env.PROOF_REDIS_PREFIX = schema;
  process.env.PROOF_COLLAB_SIGNING_SECRET = randomUUID();
  const db = await import('../vendor/proof-sdk/server/db-postgres.ts');
  const collab = await import('../vendor/proof-sdk/server/collab.ts');
  let server: any;
  try {
    await db.initializeDatabase();
    const slug = 'rewrite-history';
    const ownerSecret = randomUUID();
    await db.createDocument(slug, '# Canonical original\n\nContent to preserve.\n', {}, 'Rewrite history', 'test', ownerSecret);
    await collab.ensureCanonicalYjsBaselineForDocument(slug);
    const snapshot = await db.getLatestYSnapshot(slug);
    assert(snapshot);
    assert((await collab.startCollabRuntimeEmbedded(0)).enabled);
    const { apiRoutes } = await import('../vendor/proof-sdk/server/routes.ts');
    const app = express(); app.use(express.json()); app.use('/api', apiRoutes);
    server = await new Promise<any>(resolve => { const started = app.listen(0, '127.0.0.1', () => resolve(started)); });
    const endpoint = `http://127.0.0.1:${server.address().port}/api/documents/${slug}`;
    const responses = await Promise.all([1, 2].map(async index => {
      const response = await fetch(endpoint, { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ markdown: `# Canonical rewrite ${index}\n\nContent to preserve.\n`, ownerSecret, actor: 'test' }) });
      const result = await response.json();
      return { status: response.status, code: result.code };
    }));
    assert(responses.some(result => result.status === 200), JSON.stringify(responses));
    assert(responses.every(result => result.status === 200 || result.status === 409), JSON.stringify(responses));
    const preserved = await db.getDb().query('SELECT snapshot_blob FROM document_y_snapshots WHERE document_slug=$1 AND version=$2', [slug, snapshot.version]);
    assert.equal(preserved.rowCount, 1, 'Ordinary rewrite admission must never clear the durable baseline');
    assert.deepEqual(preserved.rows[0].snapshot_blob, Buffer.from(snapshot.snapshot));
    const gate = await collab.getCollabQuarantineGateStatus(slug);
    assert.equal(gate.active, false, 'Repeated ordinary rewrites are not pending-delta deletion pathology');
    const readable = await collab.getCanonicalReadableDocumentSync(slug, 'test');
    assert(readable?.markdown.includes('Content to preserve.'));
    assert((await db.getLatestYStateVersion(slug)) > 0);
    const durableBefore = await db.getDb().query('SELECT seq, update_blob FROM document_y_updates WHERE document_slug=$1 ORDER BY seq', [slug]);
    for (const action of ['pause', 'resume', 'revoke']) {
      const response = await fetch(`${endpoint}/${action}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ownerSecret }) });
      assert.equal(response.status, 200, `${action} must succeed`);
      assert.deepEqual((await db.getDb().query('SELECT seq, update_blob FROM document_y_updates WHERE document_slug=$1 ORDER BY seq', [slug])).rows, durableBefore.rows, `${action} must preserve every durable update`);
      const baseline = await db.getDb().query('SELECT snapshot_blob FROM document_y_snapshots WHERE document_slug=$1 AND version=$2', [slug, snapshot.version]);
      assert.deepEqual(baseline.rows[0]?.snapshot_blob, Buffer.from(snapshot.snapshot), `${action} must preserve the original snapshot`);
      assert.equal((await collab.getCollabQuarantineGateStatus(slug)).active, false);
    }

  } finally {
    if (server) await new Promise<void>(resolve => server.close(() => resolve()));
    try { await collab.stopCollabRuntime({ skipDocFlush: true }); }
    finally {
      try { await db.getDb().query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`); }
      finally { await db.closeDatabase(); }
    }
    for (const [key, value] of [['PROOF_DATABASE_SCHEMA', previous.schema], ['PROOF_REDIS_PREFIX', previous.prefix], ['PROOF_COLLAB_SIGNING_SECRET', previous.secret]]) {
      if (value === undefined) delete process.env[key!]; else process.env[key!] = value;
    }
  }
});
