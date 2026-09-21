import {Context, Effect, Layer, Schema} from 'effect';
import {defineAction} from '../src/action.ts';
import type {Caller} from '../src/caller.ts';
import {CallerResolver} from '../src/caller-resolver.ts';
import {ConfirmationStoreLive} from '../src/confirmation.ts';
import {dispatch, dispatchDecoded} from '../src/dispatcher.ts';
import {ActionsHttpHandlers} from '../src/adapters/http.ts';
import {emptyRegistry, registerAction} from '../src/registry.ts';

// Unannotated `input` in `run` infers its fields from `input`'s schema.
defineAction({
  name: 'typeCheckInference',
  input: Schema.Struct({count: Schema.Number}),
  output: Schema.Struct({doubled: Schema.Number}),
  scope: 'both',
  intent: 'read',
  run: (input) => Effect.succeed({doubled: input.count * 2}),
});

// A `run` returning a shape that doesn't match `output` fails to compile.
defineAction({
  name: 'typeCheckWrongOutput',
  input: Schema.Struct({}),
  output: Schema.Struct({ok: Schema.Boolean}),
  scope: 'both',
  intent: 'read',
  // @ts-expect-error run's output does not satisfy the declared output schema
  run: () => Effect.succeed({wrong: 'shape'}),
});

// A `run` reading a field `input` doesn't declare fails to compile.
defineAction({
  name: 'typeCheckWrongInput',
  input: Schema.Struct({a: Schema.String}),
  output: Schema.Struct({}),
  scope: 'both',
  intent: 'read',
  run: (input) => {
    // @ts-expect-error `b` does not exist on the declared input type
    const b = input.b;
    return Effect.succeed({}).pipe(Effect.tap(() => Effect.sync(() => b)));
  },
});

class RequiredService extends Context.Service<RequiredService, {readonly ping: Effect.Effect<string>}>()('type-tests/RequiredService') {}

const needsService = defineAction({
  name: 'typeCheckNeedsService',
  input: Schema.Struct({}),
  output: Schema.Struct({pong: Schema.String}),
  scope: 'both',
  intent: 'read',
  run: () =>
    Effect.gen(function* () {
      const service = yield* RequiredService;
      const pong = yield* service.ping;
      return {pong};
    }),
});

const caller: Caller = {principalId: 'p', roomId: 'r', role: 'participant'};

const registry = registerAction(emptyRegistry, needsService);

// Providing ConfirmationStore must leave RequiredService visible on the
// direct dispatcher path.
const directWithConfirmation = dispatchDecoded(needsService, {}, caller, undefined).pipe(Effect.provide(ConfirmationStoreLive));
// @ts-expect-error RequiredService is still missing after ConfirmationStore is provided.
Effect.runSync(directWithConfirmation);

// The same requirement survives the public registry dispatcher.
const registryWithConfirmation = dispatch(registry, {name: needsService.name, payload: {}}, caller).pipe(Effect.provide(ConfirmationStoreLive));
// @ts-expect-error RequiredService is still missing after ConfirmationStore is provided.
Effect.runSync(registryWithConfirmation);

class HttpRequiredService extends Context.Service<HttpRequiredService, {readonly value: string}>()('type-tests/HttpRequiredService') {}
const httpNeedsService = defineAction({
  name: 'typeCheckHttpNeedsService',
  input: Schema.Struct({}),
  output: Schema.String,
  scope: 'both',
  intent: 'read',
  run: () => Effect.map(HttpRequiredService, (service) => service.value),
});
const httpHandlers = ActionsHttpHandlers(registerAction(emptyRegistry, httpNeedsService)).pipe(
  Layer.provide(ConfirmationStoreLive),
  Layer.provide(Layer.succeed(CallerResolver, {resolve: () => Effect.succeed(caller)})),
);
// @ts-expect-error HTTP handlers still require the action's HttpRequiredService.
Effect.runPromise(Layer.launch(httpHandlers));
Effect.runPromise(Layer.launch(httpHandlers.pipe(Layer.provide(Layer.succeed(HttpRequiredService, {value: 'ok'})))));
