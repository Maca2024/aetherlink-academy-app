import { test } from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { applyRemoteMarks, marksPluginKey } from '../vendor/proof-sdk/src/editor/plugins/marks.ts';
import { observeDeferredMarks } from '../vendor/proof-sdk/src/bridge/collab-marks-observer.ts';
import * as Y from '../vendor/proof-sdk/node_modules/yjs/dist/yjs.mjs';
import { Schema } from '../vendor/proof-sdk/node_modules/@milkdown/prose/lib/model.js';
import { EditorState, Plugin } from '../vendor/proof-sdk/node_modules/@milkdown/prose/lib/state.js';
import { EditorView } from '../vendor/proof-sdk/node_modules/@milkdown/prose/lib/view.js';
import { ySyncPlugin, prosemirrorToYXmlFragment } from '../vendor/proof-sdk/node_modules/y-prosemirror/src/y-prosemirror.js';

async function remoteRewrite(subscribe: typeof observeDeferredMarks) {
  const dom = new JSDOM('<!doctype html><body><div id="editor"></div></body>');
  const prior = new Map<string, PropertyDescriptor | undefined>();
  for (const key of ['window', 'document', 'navigator', 'getComputedStyle']) {
    prior.set(key, Object.getOwnPropertyDescriptor(globalThis, key));
    Object.defineProperty(globalThis, key, { configurable: true, value: key === 'getComputedStyle' ? dom.window.getComputedStyle.bind(dom.window) : (dom.window as any)[key] });
  }
  const local = new Y.Doc();
  const remote = new Y.Doc();
  let view: InstanceType<typeof EditorView>;
  let delivered = 0;
  const schema = new Schema({ nodes: { doc: { content: 'paragraph+' }, paragraph: { content: 'text*', toDOM: () => ['p', 0] }, text: {} }, marks: { proofAuthored: { attrs: { id: { default: '' }, by: { default: '' } }, toDOM: () => ['span', 0] } } });
  const doc = (text: string) => schema.node('doc', null, [schema.node('paragraph', null, schema.text(text))]);
  prosemirrorToYXmlFragment(doc('Original pending suggestion'), local.getXmlFragment('prosemirror'));
  local.getMap('marks').set('pending', { kind: 'replace', status: 'pending' });
  Y.applyUpdate(remote, Y.encodeStateAsUpdate(local));
  const dispose = subscribe(local, () => {
    delivered++;
    applyRemoteMarks(view, { authored: { kind: 'authored', by: 'ai:test', createdAt: '2026-09-13T00:00:00.000Z', quote: 'Accepted canonical replacement', range: { from: 1, to: 31 } } });
  });
  try {
    view = new EditorView(dom.window.document.querySelector('#editor'), { state: EditorState.create({ schema, plugins: [ySyncPlugin(local.getXmlFragment('prosemirror')), new Plugin({ key: marksPluginKey, state: { init: () => ({ metadata: {}, activeMarkId: null }), apply: (tr: any, value: any) => { const change = tr.getMeta(marksPluginKey); return change?.type === 'SET_METADATA' ? { ...value, metadata: change.metadata } : value; } } })] }) });
    assert.equal(view.state.doc.textContent, 'Original pending suggestion');
    remote.transact(() => {
      remote.getMap('marks').delete('pending');
      remote.getMap('marks').set('authored', { kind: 'authored' });
      prosemirrorToYXmlFragment(doc('Accepted canonical replacement'), remote.getXmlFragment('prosemirror'));
    }, 'canonical-accept');
    Y.applyUpdate(local, Y.encodeStateAsUpdate(remote), 'remote');
    await Promise.resolve();
    return { text: view.state.doc.textContent, xml: local.getXmlFragment('prosemirror').toString(), authored: view.state.doc.firstChild?.firstChild?.marks.some(mark => mark.type.name === 'proofAuthored'), delivered };
  } finally {
    dispose();
    view?.destroy(); local.destroy(); remote.destroy(); dom.window.close();
    for (const [key, descriptor] of prior) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else delete (globalThis as any)[key];
    }
  }
}

test('remote mark hydration runs after the actual y-prosemirror fragment update', async () => {
  const synchronous = await remoteRewrite((doc, notify) => {
    const marks = doc.getMap('marks');
    marks.observe(notify);
    return () => marks.unobserve(notify);
  });
  assert.equal(synchronous.authored, false, 'The old synchronous callback hydrates against the stale document and misses authorship');
  const result = await remoteRewrite(observeDeferredMarks);
  assert.equal(result.text, 'Accepted canonical replacement');
  assert(result.xml.includes('Accepted canonical replacement'));
  assert(!result.xml.includes('Original pending suggestion'));
  assert.equal(result.authored, true, 'Authorship anchors hydrate against the accepted document');
  assert.equal(result.delivered, 1);
});

test('queued marks coalesce and cannot cross document disposal', async () => {
  const doc = new Y.Doc();
  let delivered = 0;
  const dispose = observeDeferredMarks(doc, () => { delivered++; }, transaction => transaction.origin === 'local-marks-sync');
  doc.transact(() => doc.getMap('marks').set('local', true), 'local-marks-sync');
  await Promise.resolve();
  assert.equal(delivered, 0);
  doc.getMap('marks').set('a', true); doc.getMap('marks').set('b', true);
  await Promise.resolve();
  assert.equal(delivered, 1);
  doc.getMap('marks').set('late', true); dispose();
  await Promise.resolve();
  assert.equal(delivered, 1);
  observeDeferredMarks(doc, () => { delivered++; });
  doc.getMap('marks').set('destroyed', true); doc.destroy();
  await Promise.resolve();
  assert.equal(delivered, 1);
});

test('coalesced remote deletions exclude local intent and re-added IDs', async () => {
  const doc = new Y.Doc();
  doc.getMap('marks').set('accepted', true);
  doc.getMap('marks').set('readded', true);
  const received: string[][] = [];
  const dispose = observeDeferredMarks(doc, ids => received.push(ids), transaction => transaction.origin === 'local-marks-sync');
  doc.getMap('marks').delete('accepted');
  doc.getMap('marks').delete('readded');
  doc.getMap('marks').set('readded', true);
  doc.transact(() => doc.getMap('marks').set('unsent', true), 'local-marks-sync');
  await Promise.resolve();
  assert.deepEqual(received, [['accepted']]);
  assert(doc.getMap('marks').has('unsent'));
  dispose(); doc.destroy();
});
