import {Context, Effect, Schema} from 'effect';
import {defineAction} from '../src/action.ts';

class SchemaService extends Context.Service<SchemaService, {readonly value: string}>()('type-tests/SchemaService') {}

const servicefulInput = Schema.String as unknown as Schema.Codec<string, string, SchemaService, never>;

defineAction({
  name: 'typeCheckServicefulInput',
  // @ts-expect-error Action input codecs must have DecodingServices = never.
  input: servicefulInput,
  output: Schema.Struct({ok: Schema.Boolean}),
  scope: 'both',
  intent: 'read',
  run: () => Effect.succeed({ok: true}),
});
