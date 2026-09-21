import type {Effect, Schema} from 'effect';
import type {ActionRole, Caller} from './caller.ts';

export type ActionScope = ActionRole | 'both';
export type ActionIntent = 'read' | 'explicit';

/**
 * `I`/`O` are constrained to `Schema.Codec<_, _, never, never>` — schemas
 * with no decoding/encoding service requirements — so `decodeUnknownEffect`
 * and `encodeUnknownEffect` on `input`/`output` are statically `R = never`
 * with no cast. `run` is tied to `I['Type']`/`O['Type']` and keeps its own
 * `R`; the host layer must supply `R` wherever `dispatch` is executed.
 */
export interface ActionDefinition<
  Name extends string,
  I extends Schema.Codec<unknown, unknown, never, never>,
  O extends Schema.Codec<unknown, unknown, never, never>,
  R,
> {
  readonly name: Name;
  readonly input: I;
  readonly output: O;
  readonly scope: ActionScope;
  readonly intent: ActionIntent;
  readonly run: (input: I['Type'], caller: Caller) => Effect.Effect<O['Type'], unknown, R>;
}

export const defineAction = <
  Name extends string,
  I extends Schema.Codec<unknown, unknown, never, never>,
  O extends Schema.Codec<unknown, unknown, never, never>,
  R,
>(
  definition: ActionDefinition<Name, I, O, R>,
): ActionDefinition<Name, I, O, R> => definition;
