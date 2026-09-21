import {Context, Effect, Layer} from 'effect';
import {spawnScoped, type ChildHandle} from './child-process.ts';
import {ServerConfig, type ProofMode} from './config.ts';
import {ProofUnreachable} from './errors.ts';
import {describeError} from './reachability.ts';

export interface ProofHealth {
  readonly ok: boolean;
  readonly status: number;
  readonly body: unknown;
}

export interface ProofBridgeShape {
  readonly mode: ProofMode;
  readonly baseUrl: string;
  readonly health: Effect.Effect<ProofHealth, ProofUnreachable>;
  readonly child: ChildHandle | null;
}

export class ProofBridge extends Context.Service<ProofBridge, ProofBridgeShape>()('@academy/server/ProofBridge') {}

export const proofHealth = (baseUrl: string, timeoutMs = 2000): Effect.Effect<ProofHealth, ProofUnreachable> =>
  Effect.tryPromise({
    try: async () => {
      const response = await fetch(`${baseUrl}/health`, {signal: AbortSignal.timeout(timeoutMs)});
      const text = await response.text();
      let body: unknown = null;
      try {
        body = JSON.parse(text);
      } catch {
        body = text;
      }
      return {status: response.status, body};
    },
    catch: (error) => new ProofUnreachable({message: describeError(error), cause: error}),
  }).pipe(
    Effect.flatMap(({status, body}) => {
      const ok = status === 200 && typeof body === 'object' && body !== null && (body as {ok?: unknown}).ok === true;
      return ok
        ? Effect.succeed({ok, status, body})
        : Effect.fail(new ProofUnreachable({message: `Proof /health answered ${status}`, status}));
    }),
  );

const childEnv = (config: Context.Service.Shape<typeof ServerConfig>): Record<string, string> => {
  const inherited: Record<string, string> = {};
  for (const [key, value] of Object.entries(process.env)) if (value !== undefined) inherited[key] = value;
  return {
    ...inherited,
    ...(config.proof.extraCaCerts ? {NODE_EXTRA_CA_CERTS: config.proof.extraCaCerts} : {}),
    PORT: String(config.proof.port),
    HOST: '127.0.0.1',
    DATABASE_URL: config.databaseUrl,
    REDIS_URL: config.redisUrl,
    PROOF_DATABASE_SCHEMA: config.proof.databaseSchema,
    PROOF_REDIS_PREFIX: config.proof.redisPrefix,
    ...(config.proof.signingSecret ? {PROOF_COLLAB_SIGNING_SECRET: config.proof.signingSecret} : {}),
    COLLAB_ATTACH_TO_MAIN_HTTP: 'true',
    COLLAB_PUBLIC_BASE_URL: `${config.publicUrl.replace(/^http/, 'ws')}/ws`,
    PROOF_PUBLIC_BASE_URL: config.publicUrl,
    VITE_ENABLE_TELEMETRY: 'false',
  };
};

export const ProofBridgeLive: Layer.Layer<ProofBridge, never, ServerConfig> = Layer.effect(
  ProofBridge,
  Effect.gen(function* () {
    const config = yield* ServerConfig;
    const baseUrl = config.proof.baseUrl;
    if (config.proof.mode === 'remote') {
      return {mode: 'remote', baseUrl, health: proofHealth(baseUrl), child: null};
    }
    const child = yield* spawnScoped({
      label: 'proof',
      command: process.execPath,
      args: ['--import', 'tsx', 'server/index.ts'],
      cwd: config.proof.cwd,
      env: childEnv(config),
    }).pipe(Effect.orDie);
    return {mode: 'child', baseUrl, health: proofHealth(baseUrl), child};
  }),
);
