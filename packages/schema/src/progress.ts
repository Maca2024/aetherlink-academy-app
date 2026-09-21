import {Schema} from 'effect';
import {ParticipantId, RoomId} from './ids.ts';
import {LessonId, SlideId} from './shared.ts';

export const ProgressStatus = Schema.Literals(['started', 'completed']);

export const Progress = Schema.Struct({
  roomId: RoomId,
  participantId: ParticipantId,
  lessonId: LessonId,
  slideId: Schema.optional(SlideId),
  status: ProgressStatus,
  updatedAt: Schema.String,
});
export type Progress = Schema.Schema.Type<typeof Progress>;

export const decodeProgress = (input: unknown): Progress => Schema.decodeUnknownSync(Progress)(input);
