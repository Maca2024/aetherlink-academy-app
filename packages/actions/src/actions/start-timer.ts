import {Effect, Schema} from 'effect';
import {defineAction} from '../action.ts';
import {ClassroomState, requireRoom} from './state.ts';

export const startTimer = defineAction({
  name: 'startTimer',
  input: Schema.Struct({
    seconds: Schema.Int.check(Schema.isBetween({minimum: 1, maximum: 3600})),
  }),
  output: Schema.Struct({startedAt: Schema.String, seconds: Schema.Number}),
  scope: 'facilitator',
  intent: 'explicit',
  run: (input, caller) =>
    Effect.gen(function* () {
      const state = yield* ClassroomState;
      yield* requireRoom(state, caller.roomId);
      return yield* state.startTimer(input.seconds);
    }),
});
