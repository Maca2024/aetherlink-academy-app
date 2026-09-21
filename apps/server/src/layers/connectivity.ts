import {Context, Effect, Layer} from 'effect';
import {ServerConfig} from './config.ts';
import {Postgres} from './postgres.ts';
import {ProofBridge} from './proof-bridge.ts';
import {probe, type ConnectionReport, type HealthReport} from './reachability.ts';
import {Redis} from './redis.ts';

export interface ConnectivityShape {
  readonly report: Effect.Effect<ConnectionReport>;
  readonly health: Effect.Effect<HealthReport>;
}

export class Connectivity extends Context.Service<Connectivity, ConnectivityShape>()('@academy/server/Connectivity') {}

export const ConnectivityLive: Layer.Layer<Connectivity, never, ServerConfig | Postgres | Redis | ProofBridge> = Layer.effect(
  Connectivity,
  Effect.gen(function* () {
    const config = yield* ServerConfig;
    const postgres = yield* Postgres;
    const redis = yield* Redis;
    const proof = yield* ProofBridge;
    const report: Effect.Effect<ConnectionReport> = Effect.all(
      {postgres: probe(postgres.ping), redis: probe(redis.ping), proof: probe(proof.health)},
      {concurrency: 'unbounded'},
    ).pipe(Effect.map((probes) => ({...probes, checkedAt: new Date().toISOString()})));
    const health: Effect.Effect<HealthReport> = report.pipe(
      Effect.map((r) => ({
        ok: r.postgres.reachable && r.redis.reachable && r.proof.reachable,
        proof: r.proof.reachable,
        revision: config.revision,
      })),
    );
    return {report, health};
  }),
);
