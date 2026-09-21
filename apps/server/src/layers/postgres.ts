import {PgClient} from '@effect/sql-pg';
import {Context, Effect, Layer, Redacted} from 'effect';
import {ServerConfig} from './config.ts';
import {PostgresUnreachable} from './errors.ts';
import {describeError} from './reachability.ts';

export interface PostgresShape {
  readonly ping: Effect.Effect<void, PostgresUnreachable>;
}

export class Postgres extends Context.Service<Postgres, PostgresShape>()('@academy/server/Postgres') {}

export const PgClientLive: Layer.Layer<PgClient.PgClient, never, ServerConfig> = Layer.unwrap(
  Effect.gen(function* () {
    const config = yield* ServerConfig;
    const url = new URL(config.databaseUrl);
    const sslMode = url.searchParams.get('sslmode');
    url.searchParams.delete('sslmode');
    url.searchParams.delete('channel_binding');
    const ssl = sslMode !== null && sslMode !== 'disable' ? true : sslMode === 'disable' ? false : undefined;
    return PgClient.layer({
      url: Redacted.make(url.href),
      ...(ssl === undefined ? {} : {ssl}),
      maxConnections: 4,
      minConnections: 0,
      connectTimeout: '3 seconds',
      idleTimeout: '30 seconds',
      applicationName: 'academy-wave-foundation',
    }).pipe(Layer.orDie);
  }),
);

export const PostgresLive: Layer.Layer<Postgres, never, PgClient.PgClient> = Layer.effect(
  Postgres,
  Effect.gen(function* () {
    const sql = yield* PgClient.PgClient;
    const ping = sql`select 1 as ready`.pipe(
      Effect.asVoid,
      Effect.mapError((error) => new PostgresUnreachable({message: describeError(error), cause: error})),
    );
    return {ping};
  }),
);

export const PostgresFromConfig: Layer.Layer<Postgres, never, ServerConfig> = PostgresLive.pipe(Layer.provide(PgClientLive));
