import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {Context, Effect, Layer} from 'effect';
import {ConfigError} from './errors.ts';

export type ProofMode = 'child' | 'remote';

export interface ServerConfigShape {
  readonly host: string;
  readonly port: number;
  readonly publicUrl: string;
  readonly revision: string | null;
  readonly databaseUrl: string;
  readonly redisUrl: string;
  readonly proof: {
    readonly mode: ProofMode;
    readonly baseUrl: string;
    readonly port: number;
    readonly cwd: string;
    readonly signingSecret: string | null;
    readonly databaseSchema: string;
    readonly redisPrefix: string;
    readonly extraCaCerts: string | null;
  };
  readonly webDist: string | null;
}

export class ServerConfig extends Context.Service<ServerConfig, ServerConfigShape>()('@academy/server/ServerConfig') {}

export const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..');

export const DEFAULT_PORT = 4318;
export const DEFAULT_PROOF_PORT = 4418;

const requireEnv = (env: NodeJS.ProcessEnv, key: string): Effect.Effect<string, ConfigError> => {
  const value = env[key]?.trim();
  return value ? Effect.succeed(value) : Effect.fail(new ConfigError({key, message: `${key} is required`}));
};

const parsePort = (raw: string | undefined, fallback: number, key: string): Effect.Effect<number, ConfigError> => {
  if (raw === undefined || raw.trim() === '') return Effect.succeed(fallback);
  const value = Number(raw);
  return Number.isInteger(value) && value > 0 && value < 65536
    ? Effect.succeed(value)
    : Effect.fail(new ConfigError({key, message: `${key} must be a TCP port, got ${JSON.stringify(raw)}`}));
};

export const readConfig = (env: NodeJS.ProcessEnv): Effect.Effect<ServerConfigShape, ConfigError> =>
  Effect.gen(function* () {
    const port = yield* parsePort(env.PORT, DEFAULT_PORT, 'PORT');
    const proofPort = yield* parsePort(env.PROOF_PORT, DEFAULT_PROOF_PORT, 'PROOF_PORT');
    const databaseUrl = yield* requireEnv(env, 'DATABASE_URL');
    const redisUrl = env.REDIS_URL?.trim() || env.KV_URL?.trim();
    if (!redisUrl) return yield* new ConfigError({key: 'REDIS_URL', message: 'REDIS_URL (or KV_URL) is required'});
    const remote = env.PROOF_URL?.trim();
    const publicUrl = env.ACADEMY_PUBLIC_URL?.trim() || `http://127.0.0.1:${port}`;
    return {
      host: env.HOST?.trim() || '127.0.0.1',
      port,
      publicUrl,
      revision: env.SOURCE_REVISION?.trim() || null,
      databaseUrl,
      redisUrl,
      proof: {
        mode: remote ? 'remote' : 'child',
        baseUrl: remote ? remote.replace(/\/$/, '') : `http://127.0.0.1:${proofPort}`,
        port: proofPort,
        cwd: env.PROOF_SDK_DIR?.trim() || path.join(repoRoot, 'vendor', 'proof-sdk'),
        signingSecret: env.PROOF_COLLAB_SIGNING_SECRET?.trim() || null,
        databaseSchema: env.PROOF_DATABASE_SCHEMA?.trim() || 'proof_wave',
        redisPrefix: env.PROOF_REDIS_PREFIX?.trim() || 'proof-wave',
        extraCaCerts: env.NODE_EXTRA_CA_CERTS?.trim() || null,
      },
      webDist: env.ACADEMY_WEB_DIST?.trim() || null,
    };
  });

export const ServerConfigLive = (env: NodeJS.ProcessEnv = process.env): Layer.Layer<ServerConfig, ConfigError> =>
  Layer.effect(ServerConfig, readConfig(env));
