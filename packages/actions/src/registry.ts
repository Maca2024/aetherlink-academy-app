import type {Schema} from 'effect';
import type {ActionDefinition} from './action.ts';

type AnyCodec = Schema.Codec<unknown, unknown, never, never>;

export type ActionRegistry<R = never> = ReadonlyArray<ActionDefinition<string, AnyCodec, AnyCodec, R>>;

export const emptyRegistry: ActionRegistry<never> = [];

/** Returns a new registry and accumulates handler services; duplicate names throw. */
export const registerAction = <R, Name extends string, I extends AnyCodec, O extends AnyCodec, R2>(
  registry: ActionRegistry<R>,
  action: ActionDefinition<Name, I, O, R2>,
): ActionRegistry<R | R2> => {
  if (registry.some((existing) => existing.name === action.name)) {
    throw new Error(`@academy/actions: duplicate action name "${action.name}"`);
  }
  return [...registry, action as unknown as ActionDefinition<string, AnyCodec, AnyCodec, R | R2>];
};

export const findAction = <R>(registry: ActionRegistry<R>, name: string): ActionDefinition<string, AnyCodec, AnyCodec, R> | undefined =>
  registry.find((action) => action.name === name);
