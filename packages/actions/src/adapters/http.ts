import {Effect, Schema, type Layer} from 'effect';
import {HttpApi, HttpApiBuilder, HttpApiEndpoint, HttpApiGroup, HttpApiSchema} from 'effect/unstable/httpapi';
import {ConfirmationStore} from '../confirmation.ts';
import {CallerResolver} from '../caller-resolver.ts';
import {decodeInput, dispatchDecoded} from '../dispatcher.ts';
import {ActionInputInvalid, type ActionError, type CallerResolutionFailed} from '../errors.ts';
import type {ActionRegistry} from '../registry.ts';

const errorBody = <Tag extends string>(tag: Tag, status: number) =>
  Schema.Struct({tag: Schema.Literal(tag), message: Schema.String}).pipe(HttpApiSchema.status(status));

const Error401 = errorBody('Unauthenticated', 401);
const Error403 = errorBody('Forbidden', 403);
const Error404 = errorBody('NotFound', 404);
const Error400 = errorBody('BadRequest', 400);
const Error500 = errorBody('Internal', 500);

const toHttpFailure = (error: ActionError | CallerResolutionFailed) => {
  switch (error._tag) {
    case 'CallerResolutionFailed':
      return {tag: 'Unauthenticated' as const, message: error.reason};
    case 'ActionUnauthorized':
      return {tag: 'Forbidden' as const, message: error.reason};
    case 'ActionConfirmationRejected':
      return {tag: 'Forbidden' as const, message: error.reason};
    case 'ActionNotFound':
      return {tag: 'NotFound' as const, message: `unknown action "${error.name}"`};
    case 'ActionInputInvalid':
      return {tag: 'BadRequest' as const, message: error.message};
    case 'ActionRunFailed':
    case 'ActionOutputInvalid':
      return {tag: 'Internal' as const, message: 'action execution failed'};
  }
};

const makeEndpoint = (action: ActionRegistry<unknown>[number]) => HttpApiEndpoint.post(action.name, `/actions/${action.name}`, {
  headers: {authorization: Schema.String, 'x-confirmation-token': Schema.optional(Schema.String)},
  payload: action.input,
  success: Schema.toEncoded(action.output),
  error: [Error401, Error403, Error404, Error400, Error500],
});
type DynamicEndpoint = ReturnType<typeof makeEndpoint>;
type ActionsGroup = HttpApiGroup.HttpApiGroup<'actions', DynamicEndpoint, true>;
export const toHttpApiGroup = (registry: ActionRegistry<unknown>): ActionsGroup => {
  let group = HttpApiGroup.make('actions', {topLevel: true}) as unknown as ActionsGroup;
  for (const action of registry) group = group.add(makeEndpoint(action));
  return group;
};
export const ActionsHttpApi = (registry: ActionRegistry<unknown>) => HttpApi.make('academy-actions').add(toHttpApiGroup(registry));
type BuiltHandlers = HttpApiBuilder.Handlers<unknown, ActionsGroup['endpoints'], keyof ActionsGroup['endpoints']>;

/**
 * `CallerResolver` must be provided by the host with a real session/token
 * resolver — the bearer value in `authorization` is untrusted until that
 * resolver vouches for it. The `x-confirmation-token` header carries the
 * (also untrusted) single-use confirmation token for explicit-write
 * actions; it is transport envelope metadata, never merged into the
 * decoded action payload, so it can't spoof or satisfy input validation.
 *
 * Handlers are registered with `handleRaw` and decode the JSON body
 * themselves via the shared `decodeInput` (the same function, same
 * `onExcessProperty: 'error'` policy, that MCP/chat use) instead of
 * HttpApi's own payload decoding. HttpApi's payload-decode step applies one
 * `ParseOptions` to headers *and* payload together, and real HTTP requests
 * carry headers (`host`, `content-type`, …) that aren't part of any action's
 * input schema — turning on strict excess-property checking there breaks
 * header decoding. Reading the raw body keeps "reject unknown payload
 * fields" identical across every adapter without that collision, and the
 * body is still decoded exactly once per request.
 */
export const ActionsHttpHandlers = <R>(registry: ActionRegistry<R>): Layer.Layer<HttpApiGroup.Service<'academy-actions', 'actions'>, never, CallerResolver | ConfirmationStore | R> =>
  HttpApiBuilder.group<'academy-actions', ActionsGroup, 'actions', Effect.Effect<BuiltHandlers, never, CallerResolver>>(ActionsHttpApi(registry), 'actions', (handlers) =>
    Effect.gen(function* () {
      const resolver = yield* CallerResolver;
      for (const action of registry) {
        handlers.handleRaw(
          action.name,
          ({headers, request}: {headers: {authorization: string; 'x-confirmation-token'?: string | undefined}; request: {json: Effect.Effect<unknown, unknown>}}) =>
            Effect.gen(function* () {
              const caller = yield* resolver.resolve(headers.authorization);
              const body = yield* request.json.pipe(
                Effect.mapError((cause) => new ActionInputInvalid({name: action.name, message: String(cause)})),
              );
              const input = yield* decodeInput(action, body);
              return yield* dispatchDecoded(action, input, caller, headers['x-confirmation-token']);
            }).pipe(Effect.mapError((error: ActionError | CallerResolutionFailed) => toHttpFailure(error))),
        );
      }
      // handleRaw mutates this handler collection; all runtime registry names are now installed.
      return handlers as unknown as BuiltHandlers;
    }),
  ) as Layer.Layer<HttpApiGroup.Service<'academy-actions', 'actions'>, never, CallerResolver | ConfirmationStore | R>;
