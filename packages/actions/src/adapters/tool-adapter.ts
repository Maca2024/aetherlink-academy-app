import {Effect} from 'effect';
import {CallerResolver} from '../caller-resolver.ts';
import {ConfirmationStore} from '../confirmation.ts';
import {dispatch} from '../dispatcher.ts';
import type {ActionError, CallerResolutionFailed} from '../errors.ts';
import {toFullJsonSchema} from '../json-schema.ts';
import type {ActionRegistry} from '../registry.ts';

/** Serializable, transport-agnostic tool metadata — safe to send to any client, including a browser. */
export interface ActionDescriptor {
  readonly name: string;
  readonly description: string;
  readonly scope: string;
  readonly intent: string;
  readonly inputSchema: unknown;
  readonly outputSchema: unknown;
}

export const describeActions = <R>(registry: ActionRegistry<R>): ReadonlyArray<ActionDescriptor> =>
  registry.map((action) => ({
    name: action.name,
    description: `${action.intent === 'explicit' ? 'Explicit write' : 'Read'} action (scope: ${action.scope}).`,
    scope: action.scope,
    intent: action.intent,
    inputSchema: toFullJsonSchema(action.input),
    outputSchema: toFullJsonSchema(action.output),
  }));

export interface ActionToolCallArgs {
  /** Untrusted transport-level token; resolved to a `Caller` via `CallerResolver`. */
  readonly token: string;
  readonly payload: unknown;
  readonly confirmationToken?: string | undefined;
}

export interface ActionTool<R = unknown> extends ActionDescriptor {
  readonly call: (
    args: ActionToolCallArgs,
  ) => Effect.Effect<unknown, ActionError | CallerResolutionFailed, CallerResolver | ConfirmationStore | R>;
}

/**
 * Server-side model-facing tool descriptor, used by `toMcpTools` and
 * `toChatTools`. Both derive their wire schema from the same
 * `Schema.toJsonSchemaDocument` output and route calls through the same
 * `dispatch` boundary as the HTTP adapter — no adapter re-implements auth,
 * confirmation checks, or validation. Requires `node:crypto` (via
 * `dispatch`), so it must not be imported into a browser bundle — see
 * `adapters/web-mcp.ts` for the browser-safe split.
 */
export const buildActionTools = <R>(registry: ActionRegistry<R>): ReadonlyArray<ActionTool<R>> => {
  const descriptors = describeActions(registry);
  return registry.map((action, i) => ({
    ...descriptors[i]!,
    call: ({token, payload, confirmationToken}: ActionToolCallArgs) =>
      Effect.gen(function* () {
        const resolver = yield* CallerResolver;
        const caller = yield* resolver.resolve(token);
        return yield* dispatch(registry, {name: action.name, payload, confirmationToken}, caller);
      }),
  }));
};
