import {Schema} from 'effect';
import {ParticipantId, RoomId} from './ids.ts';
import {SlideId} from './shared.ts';

/** Postgres snapshot of the Redis-resident presenter cursor, written on an interval so a restart can recover it. */
export const PresenterState = Schema.Struct({
  roomId: RoomId,
  slideId: SlideId,
  slideOrdinal: Schema.Int.pipe(Schema.check(Schema.isGreaterThanOrEqualTo(1))),
  updatedAt: Schema.String,
});
export type PresenterState = Schema.Schema.Type<typeof PresenterState>;

export const FollowState = Schema.Struct({
  roomId: RoomId,
  participantId: ParticipantId,
  following: Schema.Boolean,
  updatedAt: Schema.String,
});
export type FollowState = Schema.Schema.Type<typeof FollowState>;

export const decodePresenterState = (input: unknown): PresenterState => Schema.decodeUnknownSync(PresenterState)(input);
export const decodeFollowState = (input: unknown): FollowState => Schema.decodeUnknownSync(FollowState)(input);
