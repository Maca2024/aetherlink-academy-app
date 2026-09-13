import { test } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { tsImport } from '../vendor/proof-sdk/node_modules/tsx/dist/esm/api/index.mjs';

test('Proof PostgreSQL domain preserves documents, access, Yjs and fenced mutations', { skip: !process.env.DATABASE_URL }, async () => {
  const schema = `proof_test_${randomUUID().replaceAll('-', '')}`;
  const previousSchema = process.env.PROOF_DATABASE_SCHEMA;
  process.env.PROOF_DATABASE_SCHEMA = schema;
  const db = await tsImport('../vendor/proof-sdk/server/db-postgres.ts', import.meta.url);
  try {
    await db.initializeDatabase();
    assert.deepEqual((await Promise.all([db.bumpGlobalCollabAdmissionEpoch(), db.bumpGlobalCollabAdmissionEpoch()])).sort(), [1, 2]);
    assert.equal(await db.getDocument('missing'), undefined);
    assert.equal(await db.getMarkTombstone('missing', 'mark'), null);
    const document = await db.createDocument('test', '# Hello', {}, 'Title', 'owner', 'owner-secret');
    assert.equal(document.slug, 'test');
    assert.equal(document.revision, 1);
    assert.equal(document.y_state_version, 0);
    assert.equal(typeof document.created_at, 'string');
    assert.equal((await db.getProjectedDocumentBySlug('test')).markdown, '# Hello');
    assert.equal((await db.resolveDocumentAccess('test', 'owner-secret')).role, 'owner_bot');
    const token = await db.createDocumentAccessToken('test', 'editor', 'editor-secret');
    assert.equal((await db.resolveDocumentAccess('test', 'editor-secret')).tokenId, token.tokenId);
    assert.equal(await db.revokeDocumentAccessTokens('test', 'editor'), 1);
    assert.equal(await db.resolveDocumentAccess('test', 'editor-secret'), null);
    assert.equal((await db.getDocumentBySlug('test')).access_epoch, 1);
    const races = await Promise.all([
      db.updateDocumentAtomicByRevision('test', 1, 'winner A'),
      db.updateDocumentAtomicByRevision('test', 1, 'winner B'),
    ]);
    assert.deepEqual(races.slice().sort(), [false, true]);
    assert.equal((await db.getDocumentBySlug('test')).revision, 2);
    assert.equal((await db.getProjectedDocumentBySlug('test')).markdown, (await db.getDocumentBySlug('test')).markdown);
    const bytes = new Uint8Array([0, 255, 128, 42]);
    const seq = await db.appendYUpdate('test', bytes, 'test');
    assert.equal(typeof seq, 'number');
    assert.equal(await db.getLatestYStateVersion('test'), seq);
    assert.deepEqual((await db.getYUpdatesAfter('test', 0))[0], { seq, update: bytes });
    assert.equal(await db.getAccumulatedYUpdateBytesAfter('test', 0), bytes.length);
    await db.saveYSnapshot('test', seq, bytes);
    assert.deepEqual(await db.getLatestYSnapshot('test'), { version: seq, snapshot: bytes });
    assert.deepEqual(await db.getSnapshotVersionsForSeqs('test', [seq, seq + 1]), new Set([seq]));
    await db.updateYStateBlob('test', bytes);
    assert.deepEqual(await db.getYStateBlob('test'), bytes);

    const expired = '2000-01-01T00:00:00.000Z';
    const future = '2099-01-01T00:00:00.000Z';
    assert.equal(await db.reservePendingIdempotencyKey('test', 'suggest', 'request', 'hash', expired, 'old'), true);
    assert.equal(await db.reservePendingIdempotencyKey('test', 'suggest', 'request', 'hash', future, 'duplicate'), false);
    assert.equal(await db.stealExpiredPendingIdempotencyKey('test', 'suggest', 'request', 'hash', new Date().toISOString(), future, 'new'), true);
    assert.equal(await db.touchPendingIdempotencyKey('test', 'suggest', 'request', future, 'old'), false);
    assert.equal(await db.releasePendingIdempotencyKey('test', 'suggest', 'request', 'old'), false);
    assert.equal(await db.completePendingIdempotencyKey('test', 'suggest', 'request', { ok: true }, 'hash', 'old'), false);
    assert.equal(await db.completePendingIdempotencyKey('test', 'suggest', 'request', { ok: true }, 'hash', 'new'), true);
    assert.deepEqual(await db.getStoredIdempotencyResult('test', 'suggest', 'request'), { ok: true });
    assert.equal((await db.getMutationIdempotencyRecord('test', 'suggest', 'request')).state, 'completed');
    assert.equal(await db.completePendingIdempotencyKey('test', 'suggest', 'request', { ok: false }, 'hash', 'new'), false);

    await db.upsertMarkTombstone('test', 'accepted', 'accepted', 2);
    assert.equal(await db.shouldRejectMarkMutationByResolvedRevision('test', 'accepted', 2), true);
    assert.deepEqual(await db.removeResurrectedMarksFromPayload('test', { accepted: { status: 'pending' }, other: { status: 'pending' } }), { marks: { other: { status: 'pending' } }, removed: ['accepted'] });
    await assert.rejects(db.getDb().transaction(async () => {
      await db.upsertMarkTombstone('test', 'rollback', 'rejected', 3);
      await db.addDocumentEvent('test', 'suggestion', { text: 'rolled back' }, 'test', 'rollback-key', 'suggest');
      throw new Error('abort mutation');
    }), /abort mutation/);
    assert.equal(await db.getMarkTombstone('test', 'rollback'), null);
    assert.equal((await db.getDb().query('SELECT count(*)::integer AS count FROM mutation_outbox')).rows[0].count, 0);
    const eventId = await db.addDocumentEvent('test', 'suggestion', { text: 'committed' }, 'test', 'request', 'suggest');
    assert.equal(typeof eventId, 'number');
    assert.equal(await db.hasDurableMutationRecordForIdempotencyKey('test', 'suggest', 'request'), true);
    assert.equal((await db.listDocumentEvents('test', 0))[0].id, eventId);
    assert.equal((await db.getDb().query('SELECT event_id FROM mutation_outbox')).rows[0].event_id, eventId);
    await db.listDocsWithStaleProjection();
    await db.listSuspiciousProjectionCandidates();
    await db.noteDocumentLiveCollabLease('test', 1);
    assert.deepEqual(await db.getRecentDocumentLiveCollabLeaseBreakdown('test', 1), { exactEpochCount: 1, anyEpochCount: 1 });
  } finally {
    try { await db.getDb().query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`); }
    finally {
      await db.closeDatabase();
      if (previousSchema === undefined) delete process.env.PROOF_DATABASE_SCHEMA;
      else process.env.PROOF_DATABASE_SCHEMA = previousSchema;
    }
  }
});
