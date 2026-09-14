import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { retrySuggestionAcceptFromPersistedState } from '../vendor/proof-sdk/server/document-engine.ts';

const initialFailure = {
  ok: false as const,
  code: 'REQUIRED_MARKS_MISSING' as const,
  error: 'Live marks were incomplete',
  strippedMarkdown: 'stale',
  hydratedMarkIds: [],
  missingRequiredMarkIds: ['suggestion-1'],
};

test('suggestion accept retries once from consistent persisted state', async () => {
  const sourceDocument = { markdown: 'stale', marks: '{}', yjs_source: 'live' as const };
  const persistedDocument = {
    markdown: 'persisted',
    marks: JSON.stringify({ 'suggestion-1': { kind: 'replace', status: 'pending' } }),
  };
  let reads = 0;
  let retries = 0;
  const success = {
    ok: true as const,
    markdown: 'accepted',
    marks: {},
    strippedMarkdown: 'persisted',
    repairedStrippedMarkdown: 'accepted',
    hydratedMarkIds: ['suggestion-1'],
    missingRequiredMarkIds: [],
  };

  const result = await retrySuggestionAcceptFromPersistedState({
    slug: 'doc-1',
    markId: 'suggestion-1',
    sourceDocument,
    initialFailure,
    readPersistedDocument: async () => {
      reads += 1;
      return persistedDocument;
    },
    finalizeSuggestion: async (args) => {
      retries += 1;
      assert.equal(args.markdown, persistedDocument.markdown);
      assert.deepEqual(args.marks, JSON.parse(persistedDocument.marks));
      assert.equal(args.action, 'accept');
      return success;
    },
  });

  assert.equal(reads, 1);
  assert.equal(retries, 1);
  assert.equal(result?.ok, true);
  if (!result?.ok) assert.fail('Expected persisted retry success');
  assert.strictEqual(result.document, persistedDocument);
  assert.strictEqual(result.result, success);
});

test('suggestion accept retries from persisted state when the source is not a local live document', async () => {
  const sourceDocument = { markdown: 'stale', marks: '{}' };
  const persistedDocument = {
    markdown: 'persisted',
    marks: JSON.stringify({ 'suggestion-1': { kind: 'replace', status: 'pending' } }),
  };
  let retries = 0;
  const success = {
    ok: true as const,
    markdown: 'accepted',
    marks: {},
    strippedMarkdown: 'persisted',
    repairedStrippedMarkdown: 'accepted',
    hydratedMarkIds: ['suggestion-1'],
    missingRequiredMarkIds: [],
  };

  const result = await retrySuggestionAcceptFromPersistedState({
    slug: 'doc-non-live',
    markId: 'suggestion-1',
    sourceDocument,
    initialFailure,
    readPersistedDocument: async () => persistedDocument,
    finalizeSuggestion: async () => {
      retries += 1;
      return success;
    },
  });

  assert.equal(retries, 1);
  assert.equal(result?.ok, true);
  if (!result?.ok) assert.fail('Expected persisted retry success');
  assert.strictEqual(result.document, persistedDocument);
});

test('suggestion accept returns the original 409 when persisted state is inconsistent', async () => {
  const sourceDocument = { markdown: 'stale', marks: '{}', yjs_source: 'live' as const };
  const persistedDocument = { markdown: 'also stale', marks: '{}' };
  let reads = 0;
  let retries = 0;

  const result = await retrySuggestionAcceptFromPersistedState({
    slug: 'doc-2',
    markId: 'suggestion-2',
    sourceDocument,
    initialFailure,
    readPersistedDocument: async () => {
      reads += 1;
      return persistedDocument;
    },
    finalizeSuggestion: async () => {
      retries += 1;
      return {
        ...initialFailure,
        code: 'MARK_NOT_HYDRATED' as const,
        error: 'Persisted marks were incomplete',
      };
    },
  });

  assert.equal(reads, 1);
  assert.equal(retries, 1);
  assert.deepEqual(result, {
    ok: false,
    response: {
      status: 409,
      body: {
        success: false,
        code: 'MARK_REHYDRATION_INCOMPLETE',
        error: initialFailure.error,
        missingMarkIds: initialFailure.missingRequiredMarkIds,
      },
    },
  });
});

test('canonical content changes preserve access epochs while access and safety fences remain', () => {
  const canonicalSource = readFileSync(path.resolve('vendor/proof-sdk/server/canonical-document.ts'), 'utf8');
  const mutationStart = canonicalSource.indexOf('export async function mutateCanonicalDocument(');
  const mutationEnd = canonicalSource.indexOf('\nexport async function repairCanonicalProjection(', mutationStart);
  assert.notEqual(mutationStart, -1);
  assert.notEqual(mutationEnd, -1);
  const canonicalMutation = canonicalSource.slice(mutationStart, mutationEnd);
  assert(!canonicalMutation.includes('shouldBumpAccessEpoch'));
  assert(!canonicalMutation.includes('access_epoch = access_epoch +'));
  assert(canonicalMutation.includes('publishCanonicalChange({'));

  const engineSource = readFileSync(path.resolve('vendor/proof-sdk/server/document-engine.ts'), 'utf8');
  const statusStart = engineSource.indexOf('async function updateSuggestionStatusAsync(');
  const statusEnd = engineSource.indexOf('\nasync function resolveComment(', statusStart);
  assert.notEqual(statusStart, -1);
  assert.notEqual(statusEnd, -1);
  const asyncSuggestionStatus = engineSource.slice(statusStart, statusEnd);
  assert(!asyncSuggestionStatus.includes('bumpDocumentAccessEpoch(slug)'));
  assert(!asyncSuggestionStatus.includes('invalidateLoadedCollabDocumentAndWait(slug)'));

  const collabSource = readFileSync(path.resolve('vendor/proof-sdk/server/collab.ts'), 'utf8');
  assert(collabSource.includes('const accessEpoch = (await bumpDocumentAccessEpoch(slug));'));
  const postgresSource = readFileSync(path.resolve('vendor/proof-sdk/server/db-postgres.ts'), 'utf8');
  assert(postgresSource.includes('if (changes > 0 && shouldBumpEpoch) {'));
  assert(postgresSource.includes('(await bumpDocumentAccessEpoch(slug));'));
});

test('canonical remote apply never synthesizes receiver-owned content and retries persisted state once', () => {
  const source = readFileSync(path.resolve('vendor/proof-sdk/server/collab.ts'), 'utf8');
  const applyStart = source.indexOf('async function applyPersistedCanonicalStateInPlaceInner(');
  const applyEnd = source.indexOf('\nasync function applyPersistedCanonicalStateInPlace(', applyStart);
  assert.notEqual(applyStart, -1);
  assert.notEqual(applyEnd, -1);
  const apply = source.slice(applyStart, applyEnd);
  const applyUpdate = apply.indexOf("Y.applyUpdate(liveDoc, update, 'canonical-remote');");
  const retryRead = apply.indexOf("const retriedState = await readPersistedDocState(slug, { allowFragmentRecovery: false });", applyUpdate);
  const markdownGuard = apply.indexOf('if (!verification.markdownMatches)', retryRead);
  const marksGuard = apply.indexOf('if (liveMarkKeys.length !== persistedMarkKeys.length', markdownGuard);
  const valueAwareMarksGuard = apply.indexOf('if (!verification.marksMatch)', markdownGuard);
  const commonBaselineGuard = apply.indexOf('stateVectorContains(liveDoc, authoritativeBaseline.stateVector)', valueAwareMarksGuard);
  const refreshBookkeeping = apply.indexOf('refreshCanonicalRemoteApplyBookkeeping(slug, liveDoc, persistedState, persistedRow, authoritativeBaseline);', commonBaselineGuard);
  const successLog = apply.indexOf("console.log('[collab] live room refreshed in place'", refreshBookkeeping);
  assert(applyUpdate >= 0 && retryRead > applyUpdate);
  assert.equal(marksGuard, -1);
  assert(markdownGuard > retryRead && valueAwareMarksGuard > markdownGuard);
  assert(commonBaselineGuard > valueAwareMarksGuard && refreshBookkeeping > commonBaselineGuard && successLog > refreshBookkeeping);
  assert(source.includes('function alignLoadedAuthorityWithLiveRoom('));
  assert(source.includes('rememberLoadedDoc(slug, liveDoc, \'live\')'));
  assert(!apply.includes('applyYTextDiff('));
  assert(!apply.includes('applyMarksMapDiff('));
  assert.equal(apply.match(/readPersistedDocState\(slug, \{ allowFragmentRecovery: false \}\)/g)?.length, 2);
  assert(apply.includes('liveMarkdownLength: verification.liveMarkdown.length'));
  assert(apply.includes('persistedMarkdownLength: verification.persistedMarkdown.length'));
  assert(apply.includes('onlyInLive:'));
  assert(apply.includes('onlyInPersisted:'));
  assert(apply.includes('fromVersion'));
  assert(apply.includes('toVersion: persistedRow.y_state_version ?? 0'));
  assert(apply.includes('updatedAt: persistedRow.updated_at ?? null'));
  assert(!apply.includes('message.version'));

  const queuedApplyStart = applyEnd + 1;
  const queuedApplyEnd = source.indexOf('\nsubscribeToCanonicalChanges(', queuedApplyStart);
  const queuedApply = source.slice(queuedApplyStart, queuedApplyEnd);
  assert(queuedApply.includes('externalApplyQueues.get(slug)'));
  assert(queuedApply.includes('applyPersistedCanonicalStateInPlaceInner(slug, reason)'));

  const handlerStart = queuedApplyEnd + 1;
  const handlerEnd = source.indexOf('\nasync function reconcileStaleProjectionsOnStartup()', handlerStart);
  const handler = source.slice(handlerStart, handlerEnd);
  assert(handler.includes("applyPersistedCanonicalStateInPlace(message.slug, 'canonical-changed')"));
  assert(!handler.includes('message.version'));
});

test('persisted version checks preserve live rooms and only evict cold state', () => {
  const source = readFileSync(path.resolve('vendor/proof-sdk/server/collab.ts'), 'utf8');
  const versionRefreshCalls = source.match(/applyPersistedCanonicalStateInPlace\(slug, 'version-check'\)/g) ?? [];
  assert.equal(versionRefreshCalls.length, 4);
  const guardedVersionChecks = source.match(/if \(hasLocalLiveCollabDoc\(slug\)\) \{\s+await applyPersistedCanonicalStateInPlace\(slug, 'version-check'\);\s+\}\s+else \{\s+evictStaleLocalStateForPersistedVersion/g) ?? [];
  assert.equal(guardedVersionChecks.length, 4);
});

test('mark reconciliation does not create redundant Yjs updates for unchanged values', () => {
  const source = readFileSync(path.resolve('vendor/proof-sdk/server/collab.ts'), 'utf8');
  const helperStart = source.indexOf('function applyMarksMapDiff(');
  const helperEnd = source.indexOf('\nexport type CanonicalCollabSyncOptions', helperStart);
  assert.notEqual(helperStart, -1);
  assert.notEqual(helperEnd, -1);
  const helper = source.slice(helperStart, helperEnd);
  assert(helper.includes('stableStringify(map.get(key)) !== stableStringify(value)'));
  assert(helper.indexOf('stableStringify(map.get(key))') < helper.indexOf('map.set(key, value as unknown)'));
});

test('canonical remote apply refreshes live bookkeeping without invalidating admitted clients or pending writes', () => {
  const source = readFileSync(path.resolve('vendor/proof-sdk/server/collab.ts'), 'utf8');
  const helperStart = source.indexOf('function refreshCanonicalRemoteApplyBookkeeping(');
  const helperEnd = source.indexOf('\nfunction scheduleStaleOnStoreReload(', helperStart);
  assert.notEqual(helperStart, -1);
  assert.notEqual(helperEnd, -1);
  const helper = source.slice(helperStart, helperEnd);
  assert(!helper.includes('advancePersistGeneration(slug)'));
  assert(!helper.includes('persistTimers'));
  assert(!helper.includes('persistPending'));
  assert(helper.includes("rememberLoadedDoc(slug, liveDoc, 'live')"));
  assert(helper.includes('setAuthoritativeBaseline(slug, authoritativeBaseline)'));
  assert(helper.includes('persistedRow.updated_at ?? null'));
  assert(helper.includes('persistedRow.y_state_version ?? 0'));
  assert(helper.includes('persistedRow.access_epoch'));
  assert(helper.includes('authoritativeBaseline.snapshot'));
  assert(helper.includes('authoritativeBaseline.stateVector'));
  assert(!helper.includes('getConnections()'));

  const metadataRefreshStart = source.indexOf('function refreshCurrentPersistedCanonicalMetadata(');
  const metadataRefreshEnd = source.indexOf('\nasync function hasStaleLocalStateForPersistedVersion(', metadataRefreshStart);
  const metadataRefresh = source.slice(metadataRefreshStart, metadataRefreshEnd);
  assert(!metadataRefresh.includes('setAuthoritativeBaseline('));
  assert(!metadataRefresh.includes('loadedDocAuthorityOrigins'));
  assert(metadataRefresh.includes('loadedMeta.baselineSnapshot'));
  assert(metadataRefresh.includes('loadedMeta.baselineStateVector'));
  assert.equal(source.match(/console\.log\('\[collab\] persisted canonical content already live'/g)?.length, 2);

  const registrationStart = source.indexOf('export async function registerCanonicalYDocPersistence(');
  const registrationEnd = source.indexOf('\nasync function refreshLoadedDocDbMetaFromDb(', registrationStart);
  const registration = source.slice(registrationStart, registrationEnd);
  assert(registration.includes('buildAuthoritativeBaseline(ydoc)'));
  assert(!registration.includes('readPersistedDocState('));

  const loadedRefreshStart = source.indexOf('function applyPersistedStateToLoadedDoc(');
  const loadedRefreshEnd = source.indexOf('\nfunction refreshCanonicalRemoteApplyBookkeeping(', loadedRefreshStart);
  const loadedRefresh = source.slice(loadedRefreshStart, loadedRefreshEnd);
  assert(loadedRefresh.includes('buildAuthoritativeBaseline(nextDoc)'));
  assert(!loadedRefresh.includes('persistedState.authoritativeSnapshot'));
  assert(!loadedRefresh.includes('persistedState.stateVector'));

  const durableFilterStart = source.indexOf('function shouldIgnoreDurablePersistOrigin(');
  const durableFilterEnd = source.indexOf('\nfunction ensureDurablePersistTracking(', durableFilterStart);
  const durableFilter = source.slice(durableFilterStart, durableFilterEnd);
  assert(durableFilter.includes("origin.startsWith('canonical-')"));

  const hookStart = source.indexOf('            async onStoreDocument(data: {');
  const hookEnd = source.indexOf('            async onChange(data: {', hookStart);
  const onStoreHook = source.slice(hookStart, hookEnd);
  assert(onStoreHook.includes("getContextAccessEpoch(data.context) === null && data.transactionOrigin !== REDIS_TRANSACTION_ORIGIN"));
  assert(onStoreHook.includes('// Server-origin transactions (e.g. projection refresh / canonical apply) persist explicitly.'));

  assert.equal(source.match(/logClientContributionDroppedOrRejected\(data\.documentName, 'onStoreDocument', 'room_invalidated'\)/g)?.length, 3);
  assert.equal(source.match(/logClientContributionDroppedOrRejected\(data\.documentName, 'onChange', 'room_invalidated'\)/g)?.length, 3);
  const durableTrackingStart = source.indexOf('function ensureDurablePersistTracking(');
  const durableTrackingEnd = source.indexOf('\nfunction shouldDropWriteDuringShutdown(', durableTrackingStart);
  const durableTracking = source.slice(durableTrackingStart, durableTrackingEnd);
  assert(durableTracking.includes("'access_epoch_mismatch'"));
  assert(durableTracking.includes("'room_invalidated'"));
  assert(durableTracking.includes("'rewrite_locked'"));
  assert(durableTracking.includes("'superseded_doc_reference'"));
});

test('marks-only writes append canonical Yjs history atomically before publication', () => {
  const engineSource = readFileSync(path.resolve('vendor/proof-sdk/server/document-engine.ts'), 'utf8');
  const helperStart = engineSource.indexOf('async function persistCanonicalMarks(');
  const helperEnd = engineSource.indexOf('\nasync function persistMarksWithAuthoritativeSync(', helperStart);
  assert.notEqual(helperStart, -1);
  assert.notEqual(helperEnd, -1);
  const helper = engineSource.slice(helperStart, helperEnd);
  assert(helper.includes('mutateCanonicalDocument({'));
  assert(helper.includes('marksOnly: true'));
  assert(!helper.includes('updateMarks('));
  assert(!engineSource.includes('publishCommittedCanonicalChange('));

  const canonicalSource = readFileSync(path.resolve('vendor/proof-sdk/server/canonical-document.ts'), 'utf8');
  const mutationStart = canonicalSource.indexOf('export async function mutateCanonicalDocument(');
  const mutationEnd = canonicalSource.indexOf('\nexport async function repairCanonicalProjection(', mutationStart);
  const mutation = canonicalSource.slice(mutationStart, mutationEnd);
  assert(mutation.includes('const persistedCandidateDoc = cloneYDocWithHistory(persistedState.ydoc);'));
  assert(mutation.includes('if (args.marksOnly !== true) {'));
  assert(mutation.includes('applyMarksMapDiff(persistedCandidateDoc.getMap(\'marks\'), effectiveNextMarks);'));
  const transaction = mutation.indexOf('await getDb().transaction(async () => {');
  const append = mutation.indexOf('nextYStateVersion = await appendYUpdate(', transaction);
  const rowUpdate = mutation.indexOf('UPDATE documents', append);
  const publish = mutation.indexOf('await publishCanonicalChange({', rowUpdate);
  assert(transaction >= 0 && append > transaction && rowUpdate > append && publish > rowUpdate);
});

test('incoming browser messages wait for canonical apply without an in-place generation bump', () => {
  const source = readFileSync(path.resolve('vendor/proof-sdk/server/collab.ts'), 'utf8');
  assert.equal(source.match(/await assertCurrentCollabWriteBase\(data\.documentName, data\.context\);/g)?.length, 3);
  const guardStart = source.indexOf('async function assertCurrentCollabWriteBase(');
  const guardEnd = source.indexOf('\nfunction sameStateVector(', guardStart);
  const guard = source.slice(guardStart, guardEnd);
  assert(guard.includes('const pendingCanonicalApply = externalApplyQueues.get(slug);'));
  assert(guard.includes('await pendingCanonicalApply;'));
  assert(guard.includes("console.warn('[collab] collab write-base validation failed before merge'"));

  const helperStart = source.indexOf('function refreshCanonicalRemoteApplyBookkeeping(');
  const helperEnd = source.indexOf('\nfunction scheduleStaleOnStoreReload(', helperStart);
  const helper = source.slice(helperStart, helperEnd);
  assert(!helper.includes('advancePersistGeneration('));
  assert(!helper.includes('writeBasePersistGeneration'));
});
