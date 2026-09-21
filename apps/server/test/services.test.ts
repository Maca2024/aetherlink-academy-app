import {createServer} from 'node:http';
import {existsSync} from 'node:fs';
import path from 'node:path';
import {NodeHttpServer} from '@effect/platform-node';
import {Context, Effect, Exit, Layer, Scope} from 'effect';
import {HttpRouter} from 'effect/unstable/http';
import {afterAll, beforeAll, describe, expect, test} from 'vitest';
import {ServicesLive, routes} from '../src/app.ts';
import {processAlive} from '../src/layers/child-process.ts';
import {ServerConfigLive, repoRoot} from '../src/layers/config.ts';
import {ProofBridge} from '../src/layers/proof-bridge.ts';
import {
  CA_CERT,
  DATABASE_URL,
  POSTGRES_CONTAINER,
  REDIS_CONTAINER,
  REDIS_URL,
  dockerAvailable,
  pause,
  resume,
  startServices,
  stopServices,
  waitUntil,
} from './docker.ts';

const enabled = process.env.ACADEMY_WAVE_DOCKER_TEST === '1';
const APP_PORT = 43180;
const PROOF_PORT = 44180;
const base = `http://127.0.0.1:${APP_PORT}`;
const proofSdk = path.join(repoRoot, 'vendor', 'proof-sdk');
const proofInstalled = existsSync(path.join(proofSdk, 'node_modules', 'tsx'));

interface ConnectionBody {
  postgres: {reachable: boolean; error: string | null};
  redis: {reachable: boolean; error: string | null};
  proof: {reachable: boolean; error: string | null};
}

const getJson = async <T>(route: string): Promise<{status: number; body: T}> => {
  const response = await fetch(`${base}${route}`, {signal: AbortSignal.timeout(10_000)});
  return {status: response.status, body: (await response.json()) as T};
};

const connection = () => getJson<ConnectionBody>('/connection');
const health = () => getJson<{ok: boolean; proof: boolean; revision: string | null}>('/health');

describe.skipIf(!enabled)('live services: outage and recovery without a process restart', () => {
  let scope: Scope.Closeable;
  let proofPid: number | null = null;

  beforeAll(async () => {
    if (!dockerAvailable()) throw new Error('ACADEMY_WAVE_DOCKER_TEST=1 requires a running Docker daemon');
    if (!proofInstalled) throw new Error('vendor/proof-sdk dependencies are not installed; run pnpm --dir vendor/proof-sdk install --frozen-lockfile');
    await startServices();
    const env: NodeJS.ProcessEnv = {
      ...process.env,
      PORT: String(APP_PORT),
      HOST: '127.0.0.1',
      PROOF_PORT: String(PROOF_PORT),
      PROOF_URL: '',
      DATABASE_URL,
      REDIS_URL,
      SOURCE_REVISION: 'wave-foundation-test',
      PROOF_COLLAB_SIGNING_SECRET: 'wave-foundation-test-signing-secret-0123456789',
      PROOF_DATABASE_SCHEMA: 'proof_wave_test',
      PROOF_REDIS_PREFIX: 'proof-wave-test',
      ACADEMY_PUBLIC_URL: base,
      NODE_ENV: 'test',
      NODE_EXTRA_CA_CERTS: CA_CERT,
    };
    scope = await Effect.runPromise(Scope.make());
    const services = ServicesLive.pipe(Layer.provide(ServerConfigLive(env)));
    const app = routes(null).pipe(Layer.provide(services));
    const server = HttpRouter.serve(app, {disableListenLog: true, disableLogger: true}).pipe(
      Layer.provide(NodeHttpServer.layer(() => createServer(), {port: APP_PORT, host: '127.0.0.1'})),
    );
    const context = await Effect.runPromise(Layer.buildWithScope(Layer.provideMerge(server, services), scope));
    proofPid = Context.get(context, ProofBridge).child?.pid ?? null;
  }, 180_000);

  afterAll(async () => {
    if (scope) await Effect.runPromise(Scope.close(scope, Exit.void));
    if (proofPid !== null) await waitUntil('proof child exit', () => !processAlive(proofPid!), 15_000, 100);
    stopServices();
  }, 60_000);

  test('boots with a real Proof child and answers /health with every dependency reachable', async () => {
    expect(proofPid).not.toBeNull();
    await waitUntil('all dependencies reachable', async () => {
      const {body} = await connection();
      return body.postgres.reachable && body.redis.reachable && body.proof.reachable;
    }, 90_000, 1000);
    const {status, body} = await health();
    expect(status).toBe(200);
    expect(body).toEqual({ok: true, proof: true, revision: 'wave-foundation-test'});
  });

  test('stopping Postgres surfaces on /connection and /health, and restarting it recovers', async () => {
    pause(POSTGRES_CONTAINER);
    await waitUntil('postgres outage visible', async () => !(await connection()).body.postgres.reachable, 20_000);
    const during = await connection();
    expect(during.body.postgres.reachable).toBe(false);
    expect(during.body.postgres.error).toBeTruthy();
    expect(during.body.redis.reachable).toBe(true);
    const unhealthy = await health();
    expect(unhealthy.status).toBe(503);
    expect(unhealthy.body.ok).toBe(false);

    await resume(POSTGRES_CONTAINER);
    await waitUntil('postgres recovered', async () => (await connection()).body.postgres.reachable, 60_000, 1000);
    await waitUntil('health ok again', async () => (await health()).status === 200, 60_000, 1000);
    const recovered = await health();
    expect(recovered.body).toEqual({ok: true, proof: true, revision: 'wave-foundation-test'});
    expect(processAlive(proofPid!)).toBe(true);
  });

  test('stopping Redis is reported separately and recovers on restart', async () => {
    pause(REDIS_CONTAINER);
    await waitUntil('redis outage visible', async () => !(await connection()).body.redis.reachable, 20_000);
    const during = await connection();
    expect(during.body.redis.reachable).toBe(false);
    expect(during.body.postgres.reachable).toBe(true);
    expect((await health()).status).toBe(503);

    await resume(REDIS_CONTAINER);
    await waitUntil('redis recovered', async () => (await connection()).body.redis.reachable, 60_000, 1000);
    await waitUntil('health ok again', async () => (await health()).status === 200, 60_000, 1000);
  });
});

describe.skipIf(enabled)('live services test is opt-in', () => {
  test('skipped unless ACADEMY_WAVE_DOCKER_TEST=1 (needs Docker; see pnpm test:services)', () => {
    expect(enabled).toBe(false);
  });
});
