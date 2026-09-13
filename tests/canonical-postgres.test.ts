import { test } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import * as db from '../vendor/proof-sdk/server/db-postgres.ts';
import * as canonical from '../vendor/proof-sdk/server/canonical-document.ts';

test('canonical mutation rejects stale PostgreSQL revisions without changing durable state', { skip: !process.env.DATABASE_URL }, async () => {
  const previousSchema = process.env.PROOF_DATABASE_SCHEMA;
  const schema = `proof_canonical_${randomUUID().replaceAll('-', '')}`;
  process.env.PROOF_DATABASE_SCHEMA = schema;
  try {
    await db.initializeDatabase();
    const missing = await canonical.mutateCanonicalDocument({ slug: 'missing', nextMarkdown: '# Next', nextMarks: {}, source: 'test' });
    assert.deepEqual(missing, { ok: false, status: 404, code: 'NOT_FOUND', error: 'Document not found' });
    const initial = await db.createDocument('revision-test', '# Original', {}, 'Revision test', 'test', randomUUID());
    assert.equal(await db.updateDocumentAtomicByRevision(initial.slug, initial.revision, '# Concurrent winner'), true);
    const before = await db.getDocumentBySlug(initial.slug);
    const rejected = await canonical.mutateCanonicalDocument({ slug: initial.slug, nextMarkdown: '# Stale overwrite', nextMarks: {}, source: 'test', baseRevision: initial.revision });
    assert.equal(rejected.ok, false);
    if (rejected.ok) throw new Error('Stale mutation unexpectedly succeeded');
    assert.equal(rejected.status, 409);
    assert.equal(rejected.code, 'STALE_BASE');
    assert.deepEqual(await db.getDocumentBySlug(initial.slug), before);
    assert.equal(await db.getLatestYStateVersion(initial.slug), 0);
    assert.deepEqual(await db.getYUpdatesAfter(initial.slug, 0), []);
  } finally {
    try {
      await db.getDb().query(`DROP SCHEMA "${schema}" CASCADE`);
      const remaining = await db.getDb().query('SELECT nspname FROM pg_catalog.pg_namespace WHERE nspname = $1', [schema]);
      assert.deepEqual(remaining.rows, []);
      console.log(`Removed isolated schema ${schema}`);
    } finally {
      await db.closeDatabase();
      if (previousSchema === undefined) delete process.env.PROOF_DATABASE_SCHEMA;
      else process.env.PROOF_DATABASE_SCHEMA = previousSchema;
    }
  }
});

test('canonical replacements retain the same Yjs identities for the next collaboration update', { skip: !process.env.DATABASE_URL }, async () => {
  const previousSchema = process.env.PROOF_DATABASE_SCHEMA;
  const schema = `proof_canonical_${randomUUID().replaceAll('-', '')}`;
  process.env.PROOF_DATABASE_SCHEMA = schema;
  const Y = await import('../vendor/proof-sdk/node_modules/yjs/dist/yjs.mjs');
  const collab = await import('../vendor/proof-sdk/server/collab.ts');
  try {
    await db.initializeDatabase();
    const slug = `identity-${randomUUID()}`;
    await db.createDocument(slug, '# Original\n\nBefore acceptance.\n', {}, 'Identity test', 'test', randomUUID());
    const result = await canonical.mutateCanonicalDocument({ slug, nextMarkdown: '# Original\n\nAfter acceptance.\n', nextMarks: {}, source: 'test-accepted' });
    assert.equal(result.ok, true, JSON.stringify(result));
    const handle = await collab.loadCanonicalYDoc(slug, { liveRequired: false });
    assert.ok(handle);
    const persisted = new Y.Doc();
    const snapshot = await db.getLatestYSnapshot(slug);
    if (snapshot) Y.applyUpdate(persisted, snapshot.snapshot);
    for (const update of await db.getYUpdatesAtOrAfter(slug, Number(snapshot?.version ?? 0))) Y.applyUpdate(persisted, update.update);
    const expected = await canonical.deriveProjectionFromCanonicalDoc(persisted);
    const nextClient = new Y.Doc();
    Y.applyUpdate(nextClient, Y.encodeStateAsUpdate(handle.ydoc));
    nextClient.getMap('marks').set('review', { kind: 'comment', by: 'human:reviewer', text: 'Reviewed', quote: 'Original' });
    Y.applyUpdate(persisted, Y.encodeStateAsUpdate(nextClient, Y.encodeStateVector(persisted)));
    const replayed = await canonical.deriveProjectionFromCanonicalDoc(persisted);
    assert.equal(replayed.markdown, expected.markdown, 'A subsequent comment update must not duplicate accepted content');
    assert.equal(persisted.getText('markdown').toString(), expected.markdown);
    assert.ok(replayed.marks.review);
    await handle.cleanup?.();
  } finally {
    try { await db.getDb().query(`DROP SCHEMA "${schema}" CASCADE`); }
    finally { await db.closeDatabase(); if (previousSchema === undefined) delete process.env.PROOF_DATABASE_SCHEMA; else process.env.PROOF_DATABASE_SCHEMA = previousSchema; }
  }
});

test('a client edit during the commit does not quarantine a verified canonical mutation', { skip: !process.env.DATABASE_URL }, async () => {
  const previousSchema = process.env.PROOF_DATABASE_SCHEMA;
  const schema = `proof_canonical_${randomUUID().replaceAll('-', '')}`;
  process.env.PROOF_DATABASE_SCHEMA = schema;
  const Y = await import('../vendor/proof-sdk/node_modules/yjs/dist/yjs.mjs');
  const collab = await import('../vendor/proof-sdk/server/collab.ts');
  let originalQuery: ReturnType<typeof db.getDb>['query'] | undefined;
  try {
    await db.initializeDatabase();
    const slug = `commit-race-${randomUUID()}`;
    await db.createDocument(slug, '# Original\n', {}, 'Commit race', 'test', randomUUID());
    const handle = await collab.loadCanonicalYDoc(slug, { liveRequired: false });
    assert.ok(handle);
    await collab.__unsafePrimeLoadedDocForTests(slug, handle.ydoc);
    const connection = db.getDb();
    originalQuery = connection.query;
    let clientEditApplied = false;
    connection.query = async (sql, values) => {
      const result = await originalQuery!(sql, values);
      if (!clientEditApplied && sql.includes('SELECT revision, access_epoch, share_state FROM documents') && sql.includes('FOR UPDATE')) {
        clientEditApplied = true;
        handle.ydoc.transact(() => {
          const paragraph = new Y.XmlElement('paragraph');
          const text = new Y.XmlText();
          text.insert(0, 'A concurrent client edit.');
          paragraph.insert(0, [text]);
          const fragment = handle.ydoc.getXmlFragment('prosemirror');
          fragment.insert(fragment.length, [paragraph]);
        }, 'canonical-test-client');
      }
      return result;
    };
    const result = await canonical.mutateCanonicalDocument({ slug, nextMarkdown: '# Accepted\n', nextMarks: {}, source: 'test-accepted' });
    assert.equal(clientEditApplied, true);
    assert.equal(result.ok, true, JSON.stringify(result));
    assert.equal((await db.getDocumentProjectionBySlug(slug))?.health, 'healthy');
    assert.ok(await db.getLatestYSnapshot(slug));
    assert.match((await canonical.deriveProjectionFromCanonicalDoc(handle.ydoc)).markdown, /A concurrent client edit\./);
    await collab.__unsafePersistDocAwaitForTests(slug, handle.ydoc, 'collab');
    const persisted = await collab.__unsafeReadPersistedDocStateAsyncForTests(slug);
    assert.equal((await canonical.deriveProjectionFromCanonicalDoc(persisted.ydoc)).markdown, '# Accepted\n\nA concurrent client edit.\n');
    await handle.cleanup?.();
  } finally {
    if (originalQuery) db.getDb().query = originalQuery;
    try { await db.getDb().query(`DROP SCHEMA "${schema}" CASCADE`); }
    finally { await db.closeDatabase(); if (previousSchema === undefined) delete process.env.PROOF_DATABASE_SCHEMA; else process.env.PROOF_DATABASE_SCHEMA = previousSchema; }
  }
});
