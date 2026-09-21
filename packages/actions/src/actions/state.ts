import {Context, Effect, Layer, Ref} from 'effect';

interface ClassroomStateData {
  readonly screen: string;
  readonly participantCount: number;
  readonly timer: {readonly startedAt: string; readonly seconds: number} | null;
}

export interface ClassroomStateShape {
  /** The room this state instance is bound to; callers for other rooms must be rejected by the action. */
  readonly roomId: string;
  readonly getScreen: Effect.Effect<string>;
  readonly getParticipantCount: Effect.Effect<number>;
  readonly startTimer: (seconds: number) => Effect.Effect<{startedAt: string; seconds: number}>;
}

/**
 * Scoped per-room sample state for the fixture actions. Each `Layer.effect`
 * build creates its own `Ref` bound to one `roomId`, so tests and future
 * rooms get isolated instances instead of sharing a module-level mutable
 * singleton.
 */
export class ClassroomState extends Context.Service<ClassroomState, ClassroomStateShape>()(
  '@academy/actions/ClassroomState',
) {}

export const ClassroomStateLive = (
  roomId: string,
  initial: {screen: string; participantCount: number} = {screen: 'lobby', participantCount: 0},
): Layer.Layer<ClassroomState> =>
  Layer.effect(
    ClassroomState,
    Effect.gen(function* () {
      const ref = yield* Ref.make<ClassroomStateData>({...initial, timer: null});
      return {
        roomId,
        getScreen: Ref.get(ref).pipe(Effect.map((state) => state.screen)),
        getParticipantCount: Ref.get(ref).pipe(Effect.map((state) => state.participantCount)),
        startTimer: (seconds: number) =>
          Effect.gen(function* () {
            const timer = {startedAt: new Date().toISOString(), seconds};
            yield* Ref.update(ref, (state) => ({...state, timer}));
            return timer;
          }),
      };
    }),
  );

export const requireRoom = (state: ClassroomStateShape, roomId: string): Effect.Effect<void, Error> =>
  state.roomId === roomId ? Effect.void : Effect.fail(new Error(`caller room "${roomId}" does not match state room "${state.roomId}"`));
