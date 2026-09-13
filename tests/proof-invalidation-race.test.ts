import { test } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import * as db from '../vendor/proof-sdk/server/db-postgres.ts';
import * as collab from '../vendor/proof-sdk/server/collab.ts';

for (const selfInvalidation of [false, true]) test(`invalidation drains SQL, rolls back stale writes, coalesces teardown (self callback: ${selfInvalidation})`, { skip: !process.env.DATABASE_URL, timeout: 30000 }, async () => {
  const previous = process.env.PROOF_DATABASE_SCHEMA;
  const schema = `proof_test_${randomUUID().replaceAll('-', '')}`;
  process.env.PROOF_DATABASE_SCHEMA = schema;
  let restore: (() => void) | undefined;
  let release!: () => void;
  const paused = new Promise<void>(resolve => { release = resolve; });
  try {
    await db.initializeDatabase();
    const slug = `invalidate-race-${selfInvalidation ? 'self' : 'external'}`;
    await db.createDocument(slug, '# Original\n', {}, 'Race', 'test', randomUUID());
    const handle = await collab.loadCanonicalYDoc(slug, { liveRequired: false });
    assert(handle);
    await collab.__unsafePrimeLoadedDocForTests(slug, handle.ydoc);
    const before = await db.getDocumentBySlug(slug);
    const updates = await db.getYUpdatesAfter(slug, 0);
    const connection = db.getDb();
    const original = connection.prepare;
    let reached!: () => void;
    const inserted = new Promise<void>(resolve => { reached = resolve; });
    let intercepted = false;
    connection.prepare = (sql: string) => {
      const prepared = original(sql);
      if (!sql.includes('INSERT INTO document_y_updates')) return prepared;
      return new Proxy(prepared, { get(target, key) {
        const method = target[key as keyof typeof target];
        return async (...values: unknown[]) => {
          const result = await (method as (...args: unknown[]) => Promise<unknown>)(...values);
          if (!intercepted) {
            intercepted = true;
            // Simulate a persistence callback requesting its own invalidation.
            // It must fence the transaction without awaiting its own completion.
            if (selfInvalidation) await collab.invalidateLoadedCollabDocumentAndWait(slug);
            reached();
            await paused;
          }
          return result;
        };
      } });
    };
    restore = () => { connection.prepare = original; };
    handle.ydoc.getMap('marks').set('uncommitted', { kind: 'comment', text: 'Must roll back', by: 'human:test' });
    const persistence = collab.__unsafePersistDocAwaitForTests(slug, handle.ydoc, 'collab');
    await inserted;
    let finished = 0;
    const firstOperation = collab.invalidateLoadedCollabDocumentAndWait(slug);
    const secondOperation = collab.invalidateLoadedCollabDocumentAndWait(slug);
    assert.equal(firstOperation, secondOperation, 'Concurrent callers must share exactly one teardown');
    const first = firstOperation.then(() => { finished++; });
    const second = secondOperation.then(() => { finished++; });
    await new Promise(resolve => setTimeout(resolve, 30));
    assert.equal(finished, 0, 'Both invalidations must wait for the outstanding SQL transaction');
    release();
    await Promise.all([persistence, first, second]);
    assert.equal(finished, 2);
    assert.deepEqual(await db.getYUpdatesAfter(slug, 0), updates, 'The inserted delta must roll back');
    assert.deepEqual(await db.getDocumentBySlug(slug), before, 'Projection and blob must roll back with the delta');
    assert.equal((await collab.getCollabQuarantineGateStatus(slug)).active, false);
    await handle.cleanup?.();
  } finally {
    release(); restore?.();
    try { await db.getDb().query(`DROP SCHEMA "${schema}" CASCADE`); }
    finally { await db.closeDatabase(); if (previous === undefined) delete process.env.PROOF_DATABASE_SCHEMA; else process.env.PROOF_DATABASE_SCHEMA = previous; }
  }
});

test('invalidation waits through COMMIT and the next rewrite starts from committed state', { skip: !process.env.DATABASE_URL, timeout: 30000 }, async () => {
  const { default: pg } = await import('pg');
  const canonical = await import('../vendor/proof-sdk/server/canonical-document.ts');
  const previous = process.env.PROOF_DATABASE_SCHEMA;
  const schema = `proof_test_${randomUUID().replaceAll('-', '')}`;
  process.env.PROOF_DATABASE_SCHEMA = schema;
  const originalQuery = pg.Client.prototype.query;
  let release!: () => void;
  const pause = new Promise<void>(resolve => { release = resolve; });
  let persistence: Promise<void> | undefined;
  let invalidation: Promise<void> | undefined;
  try {
    await db.initializeDatabase();
    const slug = 'commit-invalidation';
    await db.createDocument(slug, '# Original\n', {}, 'Commit boundary', 'test', randomUUID());
    const handle = await collab.loadCanonicalYDoc(slug, { liveRequired: false });
    assert(handle);
    await collab.__unsafePrimeLoadedDocForTests(slug, handle.ydoc);
    const before = await db.getYUpdatesAfter(slug, 0);
    const writingClients = new WeakSet<object>();
    let reached!: () => void;
    const atCommit = new Promise<void>(resolve => { reached = resolve; });
    let pausedOnce = false;
    pg.Client.prototype.query = function (...args: any[]) {
      const sql = typeof args[0] === 'string' ? args[0] : args[0]?.text;
      if (sql?.includes('INSERT INTO document_y_updates') && args[1]?.[0] === slug) writingClients.add(this);
      if (sql === 'COMMIT' && writingClients.has(this) && !pausedOnce) {
        pausedOnce = true;
        reached();
        return pause.then(() => originalQuery.apply(this, args as any));
      }
      return originalQuery.apply(this, args as any);
    } as typeof originalQuery;
    handle.ydoc.getMap('marks').set('committed', { kind: 'comment', text: 'Committed before barrier returns', by: 'human:test' });
    persistence = collab.__unsafePersistDocAwaitForTests(slug, handle.ydoc, 'collab');
    await atCommit;
    let completed = false;
    invalidation = collab.invalidateLoadedCollabDocumentAndWait(slug).then(() => { completed = true; });
    await new Promise(resolve => setTimeout(resolve, 30));
    assert.equal(completed, false, 'The callback has returned but COMMIT is still part of the persistence operation');
    assert.deepEqual(await db.getYUpdatesAfter(slug, 0), before, 'The paused transaction is not committed yet');
    release();
    await invalidation;
    assert.equal(completed, true);
    const committed = await db.getYUpdatesAfter(slug, 0);
    assert(committed.length > before.length, 'A transaction already at COMMIT may finish before barrier completion');
    const fresh = await collab.loadCanonicalYDoc(slug, { liveRequired: false });
    assert(fresh);
    assert.notEqual(fresh.ydoc, handle.ydoc, 'The invalidated live document must not be repopulated by the COMMIT continuation');
    assert(fresh.ydoc.getMap('marks').has('committed'), 'Reload must observe the committed durable state');
    const result = await canonical.mutateCanonicalDocument({ slug, nextMarkdown: '# Rewrite after barrier\n', nextMarks: fresh.ydoc.getMap('marks').toJSON(), source: 'test-after-commit' });
    assert.equal(result.ok, true, JSON.stringify(result));
    const rewritten = await db.getDocumentBySlug(slug);
    await persistence;
    assert.deepEqual(await db.getDocumentBySlug(slug), rewritten, 'No old persistence continuation may overwrite the subsequent rewrite');
    assert.equal(rewritten?.markdown, '# Rewrite after barrier\n');
    await fresh.cleanup?.(); await handle.cleanup?.();
  } finally {
    release();
    await Promise.allSettled([persistence, invalidation].filter(Boolean) as Promise<void>[]);
    pg.Client.prototype.query = originalQuery;
    try { await db.getDb().query(`DROP SCHEMA "${schema}" CASCADE`); }
    finally { await db.closeDatabase(); if (previous === undefined) delete process.env.PROOF_DATABASE_SCHEMA; else process.env.PROOF_DATABASE_SCHEMA = previous; }
  }
});
