import {Effect, Scheduler} from 'effect';
import {describe, expect, test} from 'vitest';
import {ConfirmationStore, ConfirmationStoreLive} from '../src/confirmation.ts';

const binding = {actionName: 'startTimer', payloadHash: 'hash-1', principalId: 'facilitator-1', roomId: 'room-1'};

const run = <A, E>(effect: Effect.Effect<A, E, ConfirmationStore>) =>
  Effect.runPromise(effect.pipe(Effect.provide(ConfirmationStoreLive)));

describe('ConfirmationStore', () => {
  test('mints and consumes a token bound to exact action/payload/principal/room', async () => {
    await run(
      Effect.gen(function* () {
        const store = yield* ConfirmationStore;
        const token = yield* store.mint(binding, 60_000);
        yield* store.consume(token, binding);
      }),
    );
  });

  test('rejects a mismatched principal, room, action, or payload', async () => {
    for (const override of [{principalId: 'other'}, {roomId: 'other'}, {actionName: 'other'}, {payloadHash: 'other'}]) {
      await expect(
        run(
          Effect.gen(function* () {
            const store = yield* ConfirmationStore;
            const token = yield* store.mint(binding, 60_000);
            yield* store.consume(token, {...binding, ...override});
          }),
        ),
      ).rejects.toThrow();
    }
  });

  test('rejects replay: a consumed token cannot be consumed again', async () => {
    await expect(
      run(
        Effect.gen(function* () {
          const store = yield* ConfirmationStore;
          const token = yield* store.mint(binding, 60_000);
          yield* store.consume(token, binding);
          yield* store.consume(token, binding);
        }),
      ),
    ).rejects.toThrow();
  });

  test('rejects an unknown token', async () => {
    await expect(
      run(
        Effect.gen(function* () {
          const store = yield* ConfirmationStore;
          yield* store.consume('not-a-real-token', binding);
        }),
      ),
    ).rejects.toThrow();
  });

  test('rejects an expired token (expiresAt <= now)', async () => {
    await expect(
      run(
        Effect.gen(function* () {
          const store = yield* ConfirmationStore;
          const token = yield* store.mint(binding, 1);
          yield* Effect.sleep('5 millis');
          yield* store.consume(token, binding);
        }),
      ),
    ).rejects.toThrow();
  });

  test('rejects non-finite or non-positive TTLs', async () => {
    await expect(
      run(
        Effect.gen(function* () {
          const store = yield* ConfirmationStore;
          yield* store.mint(binding, 0);
        }),
      ),
    ).rejects.toThrow();
    await expect(
      run(
        Effect.gen(function* () {
          const store = yield* ConfirmationStore;
          yield* store.mint(binding, Number.POSITIVE_INFINITY);
        }),
      ),
    ).rejects.toThrow();
  });

  // Budget 3 reproduces the former split read/write race; budget 1 stalls rc117.
  test('exactly one of 16 concurrent consumes of the same token succeeds', async () => {
    const outcomes = await Effect.runPromise(
      Effect.gen(function* () {
        const store = yield* ConfirmationStore;
        const token = yield* store.mint(binding, 60_000);
        return yield* Effect.all(
          Array.from({length: 16}, () => Effect.result(store.consume(token, binding))),
          {concurrency: 'unbounded'},
        );
      }).pipe(Effect.provide(ConfirmationStoreLive), Effect.provideService(Scheduler.MaxOpsBeforeYield, 3)),
    );
    const successes = outcomes.filter((outcome) => outcome._tag === 'Success');
    expect(successes).toHaveLength(1);
  });
});
