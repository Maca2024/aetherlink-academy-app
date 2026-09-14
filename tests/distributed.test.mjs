import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { randomBytes, randomUUID } from 'node:crypto';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { createProofDatabase } from '../vendor/proof-sdk/server/postgres.ts';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(new URL('../vendor/proof-sdk/package.json', import.meta.url));
const { HocuspocusProvider, HocuspocusProviderWebsocket } = require('@hocuspocus/provider');
const Y = require('yjs');
const WS = require('ws');
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
async function until(check, label, timeout = 20000) {
  const end = Date.now() + timeout;
  while (Date.now() < end) {
    if (await check()) return;
    await delay(100);
  }
  throw new Error(`Timed out: ${label}`);
}
async function request(base, route, body, token, expected = 200) {
  const response = await fetch(base + route, {
    signal: AbortSignal.timeout(15000),
    method: body ? 'POST' : 'GET',
    headers: { 'content-type': 'application/json', ...(token ? { authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const result = await response.json();
  assert.equal(response.status, expected, `${route}: ${result.error || 'unexpected status'}`);
  return result;
}
async function connect(base, token, slug) {
  const response = await fetch(`${base}/api/documents/${slug}/collab-session`, {
    signal: AbortSignal.timeout(15000),
    headers: { cookie: `academy=${token}`, 'x-proof-client-version': '0.30.0', 'x-proof-client-build': 'distributed-test', 'x-proof-client-protocol': '3' },
  });
  assert.equal(response.status, 200);
  const { session } = await response.json();
  assert(session);
  const url = new URL(session.collabWsUrl);
  url.search = '';
  class AuthedWS extends WS { constructor(target) { super(target, { headers: { cookie: `academy=${token}` } }); } }
  const socket = new HocuspocusProviderWebsocket({ url: url.toString(), parameters: { token: session.token, role: session.role, slug }, WebSocketPolyfill: AuthedWS });
  let closeEvents = 0;
  socket.on('close', () => { closeEvents += 1; });
  const doc = new Y.Doc();
  const provider = new HocuspocusProvider({ websocketProvider: socket, name: slug, document: doc, token: session.token });
  let closed = false;
  const client = { doc, provider, get closeEvents() { return closeEvents; }, close() {
    if (closed) return;
    closed = true;
    const connectingWebSocket = socket.webSocket?.readyState === WS.CONNECTING ? socket.webSocket : null;
    provider.destroy();
    if (connectingWebSocket) connectingWebSocket.once('close', () => socket.destroy());
    else socket.destroy();
    doc.destroy();
  } };
  try { await until(() => provider.isSynced, 'real Proof client sync'); return client; }
  catch (error) { client.close(); throw error; }
}

test('two real Academy/Proof processes converge through Redis and survive process loss', {
  skip: process.env.ACADEMY_DISTRIBUTED_TEST !== '1', timeout: 150000,
}, async () => {
  assert(process.env.DATABASE_URL && (process.env.REDIS_URL || process.env.KV_URL));
  const id = randomUUID().replaceAll('-', '');
  const academySchema = `academy_test_${id}`;
  const proofSchema = `proof_test_${id}`;
  const temp = await mkdtemp(path.join(tmpdir(), 'academy-distributed-'));
  const hostKey = randomBytes(32).toString('hex');
  const sharedEnv = { ...process.env, ACADEMY_HOST_KEY: hostKey, PROOF_COLLAB_SIGNING_SECRET: randomBytes(32).toString('hex'), ACADEMY_STORAGE: 'postgres', ACADEMY_DATABASE_SCHEMA: academySchema, PROOF_DATABASE_SCHEMA: proofSchema, ACADEMY_REDIS_PREFIX: academySchema, PROOF_REDIS_PREFIX: proofSchema, COLLAB_COMPACTION_EVERY: '2', NODE_ENV: 'test' };
  delete sharedEnv.VERCEL;
  const processes = [];
  const clients = [];
  const logs = [];
  const ports = [4351, 4352];
  const bases = ports.map(port => `http://127.0.0.1:${port}`);
  const database = createProofDatabase({ connectionString: process.env.DATABASE_URL, schema: proofSchema });
  function start(index) {
    const child = spawn(process.execPath, ['scripts/start.mjs'], {
      cwd: root, detached: true, stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...sharedEnv, PORT: String(ports[index]), PROOF_PORT: String(4451 + index), ACADEMY_PUBLIC_URL: bases[index], ACADEMY_DATA: path.join(temp, String(index)) },
    });
    child.stdout.on('data', chunk => logs.push(chunk.toString()));
    child.stderr.on('data', chunk => logs.push(chunk.toString()));
    processes.push(child);
    return child;
  }
  async function stop(child, signal = 'SIGTERM') {
    if (child.exitCode !== null || child.signalCode !== null) return;
    const exited = new Promise(resolve => child.once('exit', resolve));
    try { process.kill(-child.pid, signal); } catch (error) { if (error.code !== 'ESRCH') throw error; }
    let deadline;
    try {
      await Promise.race([exited, new Promise(resolve => { deadline = setTimeout(() => { try { process.kill(-child.pid, 'SIGKILL'); } catch {} resolve(); }, 28000); })]);
    } finally { clearTimeout(deadline); }
  }
  async function ready(index, child) {
    await until(async () => {
      if (child.exitCode !== null || child.signalCode !== null) throw new Error(`App ${index} exited during startup`);
      try { const response = await fetch(bases[index] + '/game/health', { signal: AbortSignal.timeout(1000) }); return response.ok && (await response.json()).proof; } catch { return false; }
    }, `app ${index} ready`, 40000);
  }
  try {
    const first = start(0), second = start(1);
    await Promise.all([ready(0, first), ready(1, second)]);
    const host = await request(bases[0], '/game/create', { name: 'Distributed verification', hostKey });
    const a = await request(bases[0], '/game/join', { code: host.code, name: 'Process A test' });
    const b = await request(bases[1], '/game/join', { code: host.code, name: 'Process B test' });
    const state = await request(bases[1], '/game/state', null, a.token);
    const slug = state.documentSlug;
    let one = await connect(bases[0], a.token, slug); clients.push(one);
    const fragment = client => client.doc.getXmlFragment('prosemirror');
    let markMap = one.doc.getMap('marks');
    const mcp = await request(bases[1], '/game/mcp-token', {}, a.token);
    const quote = 'Een verse lezer kan de juiste controle uitvoeren en de uitkomst uitleggen.';
    async function waitForProcessAConvergence(closeEventsBefore, label, check, timeout = 10000) {
      const deadline = Date.now() + timeout;
      let watchedClient = one;
      let watchedCloseEvents = closeEventsBefore;
      let closeObservedAt = null;
      while (Date.now() < deadline) {
        if (await check()) return;
        if (watchedClient.closeEvents > watchedCloseEvents) {
          closeObservedAt ??= Date.now();
          if (Date.now() - closeObservedAt >= 3000) {
            watchedClient.close();
            one = await connect(bases[0], a.token, slug); clients.push(one);
            markMap = one.doc.getMap('marks');
            watchedClient = one;
            watchedCloseEvents = one.closeEvents;
            closeObservedAt = null;
          }
        }
        await delay(100);
      }
      throw new Error(`Timed out: ${label}`);
    }
    async function suggestFromProcessB(content) {
      const closeEventsBefore = one.closeEvents;
      const suggestion = await request(bases[1], '/game/mcp/suggest_document', {
        requestId: randomUUID(),
        quote,
        content,
      }, mcp.token);
      const markId = Object.keys(suggestion.marks || {}).find(id => suggestion.marks[id]?.content === content);
      assert(markId, 'MCP suggestion response contains its pending mark');
      await waitForProcessAConvergence(
        closeEventsBefore,
        `process A receives suggestion ${markId} in place or after fallback reconnect`,
        () => markMap.has(markId),
      );
      return markId;
    }

    const rejectedContent = 'Een verse lezer controleert de instructie via het gedistribueerde proces.';
    const rejectedId = await suggestFromProcessB(rejectedContent);
    const rejectionCloseEventsBefore = one.closeEvents;
    await request(bases[1], '/game/suggestion-review', {
      id: rejectedId,
      decision: 'reject',
      requestId: randomUUID(),
    }, host.token);
    await waitForProcessAConvergence(
      rejectionCloseEventsBefore,
      'process A removes rejected suggestion mark in place or after fallback reconnect',
      () => !markMap.has(rejectedId),
    );

    const acceptedContent = 'Een verse lezer voert de gedistribueerde controle exact eenmaal uit.';
    const acceptedId = await suggestFromProcessB(acceptedContent);
    const acceptanceCloseEventsBefore = one.closeEvents;
    await request(bases[1], '/game/suggestion-review', {
      id: acceptedId,
      decision: 'accept',
      requestId: randomUUID(),
    }, host.token);
    const occurrences = (value, needle) => value.split(needle).length - 1;
    await waitForProcessAConvergence(
      acceptanceCloseEventsBefore,
      'process A receives accepted content once in place or after fallback reconnect',
      () => occurrences(fragment(one).toString(), acceptedContent) === 1,
    );
    let processADocument;
    await until(async () => {
      processADocument = await request(bases[0], '/game/mcp/get_document', {}, mcp.token);
      return occurrences(processADocument.markdown, acceptedContent) === 1;
    }, 'process A MCP read receives accepted content once', 3000);
    assert.equal(occurrences(processADocument.markdown, acceptedContent), 1, 'Process A MCP read contains accepted content once');
    const two = await connect(bases[1], b.token, slug); clients.push(two);
    const initialNodeCount = fragment(one).length;
    const assertShape = client => {
      assert.equal(fragment(client).length, initialNodeCount, 'No duplicated top-level document nodes');
      const xml = fragment(client).toString();
      assert.equal(xml.split('ALPHA').length - 1, 1);
      assert.equal(xml.split('BETA').length - 1, 1);
    };
    const textA = fragment(one).get(0).get(0), textB = fragment(two).get(0).get(0);
    assert(textA instanceof Y.XmlText && textB instanceof Y.XmlText);
    one.doc.transact(() => textA.insert(textA.length, ' ALPHA'), 'human:distributed-a');
    two.doc.transact(() => textB.insert(textB.length, ' BETA'), 'human:distributed-b');
    await until(() => fragment(one).toString() === fragment(two).toString() && fragment(one).toString().includes('ALPHA') && fragment(one).toString().includes('BETA'), 'cross-process convergence');
    assertShape(one); assertShape(two);
    await until(async () => { const doc = await request(bases[1], '/game/document', null, b.token); return doc.markdown.includes('ALPHA') && doc.markdown.includes('BETA'); }, 'durable projection');
    one.close(); clients.splice(clients.indexOf(one), 1);
    await stop(first, 'SIGKILL');
    const restarted = start(0); await ready(0, restarted);
    const three = await connect(bases[0], a.token, slug); clients.push(three);
    await until(() => fragment(three).toString() === fragment(two).toString(), 'reconnect after process loss');
    assertShape(three); assertShape(two);
    const original = await request(bases[0], '/game/mcp-token', {}, a.token);
    await request(bases[1], '/game/mcp-token', {}, a.token);
    await request(bases[0], '/game/mcp/get_mission', {}, original.token, 401);
    console.log('Verified two real processes, concurrent Proof edits, shared Redis, process loss, reconnect and cross-instance token revocation');
  } finally {
    for (const client of clients) client.close();
    await Promise.all(processes.map(child => stop(child)));
    const logDir = process.env.ACADEMY_TEST_LOG_DIR || path.resolve(root, '../../work');
    await mkdir(logDir, { recursive: true });
    const evidence = path.join(logDir, 'distributed-server.log');
    await writeFile(evidence, logs.join(''), { mode: 0o600 });
    try {
      await database.query(`DROP SCHEMA IF EXISTS "${academySchema}" CASCADE`);
      await database.query(`DROP SCHEMA IF EXISTS "${proofSchema}" CASCADE`);
    } finally { await database.close(); await rm(temp, { recursive: true, force: true }); }
    assert(!/Failed to persist document|Await initializeDatabase before|Transaction scope is not available|fast-quarantined pathological slug|graceful shutdown failed/.test(logs.join('')), 'Healthy collaboration fixture produced persistence, quarantine or shutdown errors; inspect private work/distributed-server.log');
  }
});
