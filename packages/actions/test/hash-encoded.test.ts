import {Effect, Schema} from 'effect';
import {describe, expect, test, vi} from 'vitest';
import {defineAction} from '../src/action.ts';
import {ConfirmationStore, ConfirmationStoreLive} from '../src/confirmation.ts';
import {dispatch, hashEncoded} from '../src/dispatcher.ts';
import {emptyRegistry, registerAction} from '../src/registry.ts';

describe('confirmation payload hashing', () => {
  test('canonicalizes object keys while preserving array ordering', () => {
    expect(hashEncoded({b: [1, true, null], a: 'x'})).toBe(hashEncoded({a: 'x', b: [1, true, null]}));
    expect(hashEncoded([1, 2])).not.toBe(hashEncoded([2, 1]));
    const shared = {a: 1};
    expect(hashEncoded([shared, shared])).toBe(hashEncoded([{a: 1}, {a: 1}]));
  });

  const cycle: Record<string, unknown> = {};
  cycle.self = cycle;
  const unsupported: ReadonlyArray<readonly [string, unknown]> = [
    ['positive infinity', Infinity],
    ['negative infinity', -Infinity],
    ['NaN', NaN],
    ['undefined', undefined],
    ['function', () => 0],
    ['symbol', Symbol('value')],
    ['bigint', 1n],
    ['Date', new Date(0)],
    ['Map', new Map()],
    ['cycle', cycle],
    ['nested undefined', {value: undefined}],
    ['undefined array member', [undefined]],
    ['sparse array', Array(1)],
    ['symbol key', {[Symbol('key')]: 1}],
  ];

  test.each(unsupported)('rejects %s instead of silently changing the confirmation payload', (_label, value) => {
    expect(() => hashEncoded(value)).toThrow(TypeError);
  });

  test('invalid encoded input returns a typed error without running or consuming confirmation', async () => {
    const run = vi.fn(() => Effect.succeed('ran'));
    const action = defineAction({
      name: 'numberWrite',
      input: Schema.Struct({n: Schema.Number}),
      output: Schema.String,
      scope: 'facilitator',
      intent: 'explicit',
      run,
    });
    const registry = registerAction(emptyRegistry, action);
    const caller = {principalId: 'p', roomId: 'r', role: 'facilitator' as const};
    const binding = {actionName: action.name, payloadHash: hashEncoded({n: 1}), principalId: 'p', roomId: 'r'};
    await Effect.runPromise(
      Effect.gen(function* () {
        const store = yield* ConfirmationStore;
        const token = yield* store.mint(binding, 60_000);
        const result = yield* Effect.result(dispatch(registry, {
          name: action.name,
          payload: {n: Infinity},
          confirmationToken: token,
        }, caller));
        expect(result._tag).toBe('Failure');
        if (result._tag === 'Failure') expect(result.failure._tag).toBe('ActionInputInvalid');
        expect(run).not.toHaveBeenCalled();
        yield* store.consume(token, binding);
      }).pipe(Effect.provide(ConfirmationStoreLive)),
    );
  });
});
