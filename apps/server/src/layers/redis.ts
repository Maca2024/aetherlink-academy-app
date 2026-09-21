import {Redis as IORedis} from 'ioredis';
import {Context, Effect, Layer} from 'effect';
import {ServerConfig} from './config.ts';
import {RedisUnreachable} from './errors.ts';
import {describeError} from './reachability.ts';

export interface RedisShape {
  readonly ping: Effect.Effect<void, RedisUnreachable>;
  readonly status: Effect.Effect<string>;
}

export class Redis extends Context.Service<Redis, RedisShape>()('@academy/server/Redis') {}

const REDIS_QUIT_TIMEOUT_MS = 2_000;

export const closeRedisClient = (client: Pick<IORedis, 'quit' | 'disconnect'>, timeoutMs = REDIS_QUIT_TIMEOUT_MS): Promise<void> =>
  new Promise((resolve) => {
    let finished = false;
    const timeout = setTimeout(finish, timeoutMs);
    const settle = () => finish();

    function finish() {
      if (finished) return;
      finished = true;
      clearTimeout(timeout);
      try {
        client.disconnect();
      } finally {
        resolve();
      }
    }

    try {
      void client.quit().then(settle, settle);
    } catch {
      finish();
    }
  });

const makeClient = (url: string): Effect.Effect<IORedis, never, never> =>
  Effect.sync(() => {
    const client = new IORedis(url, {
      lazyConnect: false,
      enableOfflineQueue: false,
      maxRetriesPerRequest: 0,
      connectTimeout: 2000,
      retryStrategy: (attempt: number) => Math.min(250 * attempt, 2000),
      reconnectOnError: () => true,
    });
    client.on('error', () => {});
    return client;
  });

export const RedisLive: Layer.Layer<Redis, never, ServerConfig> = Layer.effect(
  Redis,
  Effect.gen(function* () {
    const config = yield* ServerConfig;
    const client = yield* Effect.acquireRelease(makeClient(config.redisUrl), (c) =>
      Effect.promise(() => closeRedisClient(c)),
    );
    const ping = Effect.tryPromise({
      try: () => client.ping(),
      catch: (error) => new RedisUnreachable({message: describeError(error), cause: error}),
    }).pipe(
      Effect.flatMap((reply) =>
        reply === 'PONG' ? Effect.void : Effect.fail(new RedisUnreachable({message: `unexpected PING reply ${String(reply)}`})),
      ),
    );
    return {ping, status: Effect.sync(() => client.status)};
  }),
);
