import {Schema} from 'effect';
import {CourseId, CourseVersion, RoomId} from './ids.ts';

/** A room pins the course version it reads at creation; later publishes never move it. */
export const Room = Schema.Struct({
  id: RoomId,
  courseId: CourseId,
  pinnedVersion: CourseVersion,
});
export type Room = Schema.Schema.Type<typeof Room>;

export const decodeRoom = (input: unknown): Room => Schema.decodeUnknownSync(Room)(input);
