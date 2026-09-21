import assert from 'node:assert/strict';
import {writeFileSync, mkdirSync} from 'node:fs';

mkdirSync('test-results', {recursive: true});
let base;
try {
  base = new URL(process.env.SMOKE_BASE_URL || process.argv[2]);
  assert.equal(base.protocol, 'https:', 'Deployed checks require HTTPS');
  assert.equal(base.username + base.password, '', 'Credentials must not be embedded in the URL');
  assert.match(process.env.EXPECTED_REVISION || '', /^[0-9a-f]{40}$/, 'EXPECTED_REVISION must be the full source commit SHA');
} catch {
  writeFileSync('test-results/deployed-smoke.json', JSON.stringify({at:new Date().toISOString(),checks:[{name:'Valid Academy deployment metadata',passed:false}]}));
  console.error('FAIL: deployment metadata');
  process.exit(1);
}
const checks = [];
let observedRevision = null;
async function request(path, options = {}) {
  const response = await fetch(new URL(path, base), {
    redirect: 'manual', signal: AbortSignal.timeout(15_000), ...options,
  });
  return response;
}
async function check(name, fn) {
  try { await fn(); checks.push({name, passed: true}); }
  catch (error) { checks.push({name, passed: false}); console.error(`FAIL: ${name}`); }
}
await check('Academy and Proof ready', async () => {
  const res = await request('/game/health');
  assert.equal(res.status, 200);
  const body = await res.json();
  observedRevision = /^[0-9a-f]{40}$/.test(body.revision || '') ? body.revision : null;
  assert.equal(body.ok, true);
  assert.equal(body.proof, true);
  assert.equal(body.revision, process.env.EXPECTED_REVISION);
});
await check('Application HTML available', async () => {
  const res = await request('/');
  assert.equal(res.status, 200);
  assert.match(res.headers.get('content-type') || '', /text\/html/);
  assert.match(await res.text(), /id="root"/);
});
for (const path of ['/game/state', '/game/document', '/game/knowledge', '/mcp']) {
  for (const invalid of [false, true]) {
    await check(`${path} rejects ${invalid ? 'invalid' : 'missing'} credentials`, async () => {
      const res = await request(path, invalid ? {headers: {Authorization: 'Bearer ci-invalid-credential'}} : {});
      assert.ok([401, 403].includes(res.status));
    });
  }
}
const evidence = {target: base.origin, at: new Date().toISOString(), expectedRevision: process.env.EXPECTED_REVISION, observedRevision, checks};
mkdirSync('test-results', {recursive: true});
writeFileSync('test-results/deployed-smoke.json', JSON.stringify(evidence, null, 2) + '\n');
console.log(`${checks.filter(c => c.passed).length}/${checks.length} deployed smoke checks passed`);
if (checks.some(c => !c.passed)) process.exitCode = 1;
