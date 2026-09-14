import { test } from 'node:test';
import assert from 'node:assert/strict';
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
