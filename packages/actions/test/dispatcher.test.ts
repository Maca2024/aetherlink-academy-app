import {Effect, Schema} from 'effect';
import {describe, expect, test, vi} from 'vitest';
import {defineAction} from '../src/action.ts';
import type {Caller} from '../src/caller.ts';
import {ConfirmationStore, ConfirmationStoreLive} from '../src/confirmation.ts';
import {dispatch, dispatchDecoded, hashEncoded} from '../src/dispatcher.ts';
import {emptyRegistry, registerAction} from '../src/registry.ts';

const facilitator: Caller = {principalId: 'fac-1', roomId: 'room-1', role: 'facilitator'};
const participant: Caller = {principalId: 'part-1', roomId: 'room-1', role: 'participant'};

const echo = defineAction({
  name: 'echo',
  input: Schema.Struct({message: Schema.String}),
  output: Schema.Struct({message: Schema.String}),
  scope: 'both',
  intent: 'read',
  run: (input) => Effect.succeed({message: input.message}),
});

const runSpy = vi.fn((input: {seconds: number}) => Effect.succeed({acknowledged: input.seconds}));
const facilitatorWrite = defineAction({
  name: 'facilitatorWrite',
  input: Schema.Struct({seconds: Schema.Number}),
  output: Schema.Struct({acknowledged: Schema.Number}),
  scope: 'facilitator',
  intent: 'explicit',
  run: runSpy,
});

// Type (number) differs from Encoded (string): proves hashing/encoding use
// the wire (Encoded) shape, and that dispatch encodes output exactly once.
const doubleTransforming = defineAction({
  name: 'doubleTransforming',
  input: Schema.Struct({value: Schema.NumberFromString}),
  output: Schema.Struct({doubled: Schema.NumberFromString}),
  scope: 'both',
  intent: 'read',
  run: (input) => Effect.succeed({doubled: input.value * 2}),
});

const registry = registerAction(registerAction(registerAction(emptyRegistry, echo), facilitatorWrite), doubleTransforming);

const withStore = <A, E>(effect: Effect.Effect<A, E, ConfirmationStore>) => Effect.provide(effect, ConfirmationStoreLive);
const run = <A, E>(effect: Effect.Effect<A, E, ConfirmationStore>) => Effect.runPromise(withStore(effect));
const runExit = <A, E>(effect: Effect.Effect<A, E, ConfirmationStore>) => Effect.runPromiseExit(withStore(effect));

describe('dispatch', () => {
  test('a read action runs for any role and round-trips Type <-> Encoded through a transforming schema', async () => {
    const result = await run(dispatch(registry, {name: 'doubleTransforming', payload: {value: '21'}}, participant));
    expect(result).toEqual({doubled: '42'});
  });

  test('unknown fields in the payload (e.g. spoofed role/confirmed) are rejected before run', async () => {
    const exit = await runExit(
      dispatch(registry, {name: 'echo', payload: {message: 'hi', confirmed: true, role: 'facilitator'}}, participant),
    );
    expect(exit._tag).toBe('Failure');
  });

  test('a participant is denied a facilitator-scoped action and run is never invoked', async () => {
    runSpy.mockClear();
    const exit = await runExit(dispatch(registry, {name: 'facilitatorWrite', payload: {seconds: 30}}, participant));
    expect(exit._tag).toBe('Failure');
    expect(runSpy).not.toHaveBeenCalled();
  });

  test('an explicit action without a confirmation token is rejected and never runs', async () => {
    runSpy.mockClear();
    const exit = await runExit(dispatch(registry, {name: 'facilitatorWrite', payload: {seconds: 30}}, facilitator));
    expect(exit._tag).toBe('Failure');
    expect(runSpy).not.toHaveBeenCalled();
  });

  test('a payload with `confirmed: true` does not substitute for a real confirmation token', async () => {
    runSpy.mockClear();
    const exit = await runExit(
      dispatch(registry, {name: 'facilitatorWrite', payload: {seconds: 30, confirmed: true}}, facilitator),
    );
    expect(exit._tag).toBe('Failure');
    expect(runSpy).not.toHaveBeenCalled();
  });

  test('a matching minted token authorizes exactly one explicit write, bound to the encoded payload', async () => {
    runSpy.mockClear();
    const result = await run(
      Effect.gen(function* () {
        const store = yield* ConfirmationStore;
        const payload = {seconds: 30};
        const token = yield* store.mint(
          {actionName: 'facilitatorWrite', payloadHash: hashEncoded(payload), principalId: facilitator.principalId, roomId: facilitator.roomId},
          60_000,
        );
        return yield* dispatch(registry, {name: 'facilitatorWrite', payload, confirmationToken: token}, facilitator);
      }),
    );
    expect(result).toEqual({acknowledged: 30});
    expect(runSpy).toHaveBeenCalledTimes(1);

    // Replay with the same (now-consumed) token fails.
    const replay = await runExit(
      dispatch(registry, {name: 'facilitatorWrite', payload: {seconds: 30}, confirmationToken: 'reuse-does-not-exist'}, facilitator),
    );
    expect(replay._tag).toBe('Failure');
  });

  test('a confirmation minted for a different payload does not authorize this one', async () => {
    runSpy.mockClear();
    const exit = await runExit(
      Effect.gen(function* () {
        const store = yield* ConfirmationStore;
        const token = yield* store.mint(
          {actionName: 'facilitatorWrite', payloadHash: hashEncoded({seconds: 30}), principalId: facilitator.principalId, roomId: facilitator.roomId},
          60_000,
        );
        return yield* dispatch(registry, {name: 'facilitatorWrite', payload: {seconds: 999}, confirmationToken: token}, facilitator);
      }),
    );
    expect(exit._tag).toBe('Failure');
    expect(runSpy).not.toHaveBeenCalled();
  });

  test('invalid input is rejected without ever consuming a confirmation token', async () => {
    const result = await run(
      Effect.gen(function* () {
        const store = yield* ConfirmationStore;
        const payload = {seconds: 30};
        const token = yield* store.mint(
          {actionName: 'facilitatorWrite', payloadHash: hashEncoded(payload), principalId: facilitator.principalId, roomId: facilitator.roomId},
          60_000,
        );
        const invalidExit = yield* Effect.exit(
          dispatch(registry, {name: 'facilitatorWrite', payload: {seconds: 'not-a-number'}, confirmationToken: token}, facilitator),
        );
        // The token minted for the valid payload above is still unconsumed afterwards.
        const validResult = yield* dispatch(registry, {name: 'facilitatorWrite', payload, confirmationToken: token}, facilitator);
        return {invalidTag: invalidExit._tag, validResult};
      }),
    );
    expect(result.invalidTag).toBe('Failure');
    expect(result.validResult).toEqual({acknowledged: 30});
  });

  test('an unknown action name is rejected', async () => {
    const exit = await runExit(dispatch(registry, {name: 'doesNotExist', payload: {}}, facilitator));
    expect(exit._tag).toBe('Failure');
  });

  test('dispatchDecoded (the HTTP path) takes an already-decoded input and produces the same result as dispatch', async () => {
    const viaDispatch = await run(dispatch(registry, {name: 'echo', payload: {message: 'hi'}}, participant));
    const viaDecoded = await run(dispatchDecoded(echo, {message: 'hi'}, participant, undefined));
    expect(viaDecoded).toEqual(viaDispatch);
  });
});
