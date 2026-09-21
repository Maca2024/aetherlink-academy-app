import {Effect, Schema} from 'effect';
import {defineAction} from '../action.ts';
import {EmptyInput} from '../schemas.ts';
import {ClassroomState, requireRoom} from './state.ts';

export const getScreenState = defineAction({
  name: 'getScreenState',
  input: EmptyInput,
  output: Schema.Struct({screen: Schema.String}),
  scope: 'both',
  intent: 'read',
  run: (_input, caller) =>
    Effect.gen(function* () {
      const state = yield* ClassroomState;
      yield* requireRoom(state, caller.roomId);
      const screen = yield* state.getScreen;
      return {screen};
    }),
});
