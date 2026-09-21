import {createHash} from 'node:crypto';
import {Effect, Schema} from 'effect';
import type {ActionDefinition} from './action.ts';
import type {Caller} from './caller.ts';
import {ConfirmationStore} from './confirmation.ts';
import {
  ActionConfirmationRejected,
  ActionInputInvalid,
  ActionNotFound,
  ActionOutputInvalid,
  ActionRunFailed,
  ActionUnauthorized,
  type ActionError,
} from './errors.ts';
import {findAction, type ActionRegistry} from './registry.ts';

export interface DispatchRequest {
  readonly name: string;
  /** Untrusted, caller-supplied payload — decoded and validated before use. */
  readonly payload: unknown;
  /** Untrusted transport value; only meaningful once bound-checked against a minted record. */
  readonly confirmationToken?: string | undefined;
}

const canonicalize = (value: unknown, ancestors = new Set<object>()): unknown => {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return value;
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value !== 'object' || value === null) throw new TypeError('encoded input must contain only JSON values');
  if (ancestors.has(value)) throw new TypeError('encoded input must not contain cycles');
  if (Object.getOwnPropertySymbols(value).length > 0) throw new TypeError('encoded input must not contain symbol keys');
  const isArray = Array.isArray(value);
  if (!isArray && Object.getPrototypeOf(value) !== Object.prototype && Object.getPrototypeOf(value) !== null) {
    throw new TypeError('encoded input must contain only plain JSON objects');
  }
  ancestors.add(value);
  try {
    if (isArray) {
      if (Object.keys(value).length !== value.length) throw new TypeError('encoded input arrays must be dense without extra fields');
      return Array.from(value, (entry) => canonicalize(entry, ancestors));
    }
    return Object.fromEntries(
      Object.entries(value)
        .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
        .map(([key, entry]) => [key, canonicalize(entry, ancestors)]),
    );
  } finally {
    ancestors.delete(value);
  }
};

/** Hashes validated JSON wire values; rejects values JSON.stringify would lose or silently change. */
export const hashEncoded = (value: unknown): string => createHash('sha256').update(JSON.stringify(canonicalize(value))).digest('hex');

const decodeOptions = {onExcessProperty: 'error' as const};

export type AnyCodec = Schema.Codec<unknown, unknown, never, never>;

/** Decodes and validates a raw payload against one action's input schema, rejecting unknown fields. */
export const decodeInput = <I extends AnyCodec>(
  action: {readonly name: string; readonly input: I},
  payload: unknown,
): Effect.Effect<I['Type'], ActionInputInvalid> =>
  Schema.decodeUnknownEffect(action.input, decodeOptions)(payload).pipe(
    Effect.mapError((cause) => new ActionInputInvalid({name: action.name, message: String(cause)})),
  );

/** Schema-encodes a decoded value against an action's output schema (`Type -> Encoded`), never decode. */
export const encodeOutput = <O extends AnyCodec>(
  action: {readonly name: string; readonly output: O},
  value: O['Type'],
): Effect.Effect<O['Encoded'], ActionOutputInvalid> =>
  Schema.encodeUnknownEffect(action.output)(value).pipe(
    Effect.mapError((cause) => new ActionOutputInvalid({name: action.name, message: String(cause)})),
  );

/**
 * Authorizes, verifies confirmation, runs, and encodes the output for an
 * action whose input has already been decoded once by the caller (an
 * HttpApi payload schema, for instance). This is the shared core every
 * adapter ultimately calls — `dispatch` below is `decodeInput` plus this.
 */
export const dispatchDecoded = <I extends AnyCodec, O extends AnyCodec, R>(
  action: ActionDefinition<string, I, O, R>,
  input: I['Type'],
  caller: Caller,
  confirmationToken: string | undefined,
): Effect.Effect<O['Encoded'], ActionError, ConfirmationStore | R> =>
  Effect.gen(function* () {
    if (action.scope !== 'both' && action.scope !== caller.role) {
      return yield* new ActionUnauthorized({
        name: action.name,
        reason: `role "${caller.role}" cannot access scope "${action.scope}"`,
      });
    }

    if (action.intent === 'explicit') {
      if (!confirmationToken) {
        return yield* new ActionConfirmationRejected({name: action.name, reason: 'missing confirmation token'});
      }
      const encodedInput = yield* Schema.encodeUnknownEffect(action.input)(input).pipe(
        Effect.mapError((cause) => new ActionInputInvalid({name: action.name, message: String(cause)})),
      );
      const payloadHash = yield* Effect.try({
        try: () => hashEncoded(encodedInput),
        catch: (cause) => new ActionInputInvalid({name: action.name, message: String(cause)}),
      });
      const confirmations = yield* ConfirmationStore;
      yield* confirmations.consume(confirmationToken, {
        actionName: action.name,
        payloadHash,
        principalId: caller.principalId,
        roomId: caller.roomId,
      });
    }

    const rawOutput = yield* action.run(input, caller).pipe(
      Effect.mapError((cause) => new ActionRunFailed({name: action.name, cause})),
    );

    return yield* encodeOutput(action, rawOutput);
  });

/** Looks up the action, strictly decodes its input, and calls the shared authorization boundary. */
export const dispatch = <R>(
  registry: ActionRegistry<R>,
  request: DispatchRequest,
  caller: Caller,
): Effect.Effect<unknown, ActionError, ConfirmationStore | R> =>
  Effect.gen(function* () {
    const action = findAction(registry, request.name);
    if (!action) return yield* new ActionNotFound({name: request.name});
    const input = yield* decodeInput(action, request.payload);
    return yield* dispatchDecoded(action, input, caller, request.confirmationToken);
  });
