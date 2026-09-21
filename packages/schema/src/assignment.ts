import {Schema} from 'effect';
import {AssignmentId, CourseId, CourseVersion} from './ids.ts';
import {LessonId, LocalizedText, SlideId} from './shared.ts';

export const Assignment = Schema.Struct({
  id: AssignmentId,
  lessonId: LessonId,
  slideId: Schema.optional(SlideId),
  courseId: CourseId,
  version: CourseVersion,
  title: LocalizedText,
  minutes: Schema.Int.pipe(Schema.check(Schema.isGreaterThanOrEqualTo(1))),
  goal: Schema.optional(LocalizedText),
  steps: Schema.optional(Schema.Array(LocalizedText)),
  expected: Schema.optional(Schema.String),
  check: Schema.optional(Schema.String),
  allowed: Schema.optional(Schema.Array(Schema.String)),
  stop: Schema.optional(Schema.String),
  checks: Schema.optional(Schema.Array(Schema.String)),
  hints: Schema.optional(Schema.Array(LocalizedText)),
  stretch: Schema.optional(Schema.String),
  starterPath: Schema.optional(Schema.String),
  starterFiles: Schema.optional(Schema.Array(Schema.String)),
  /** Legacy day-1 mission spans several lessons; `lessonId` stays the primary association. */
  lessonIds: Schema.optional(Schema.Array(LessonId)),
  dataset: Schema.optional(Schema.String),
});
export type Assignment = Schema.Schema.Type<typeof Assignment>;

export const decodeAssignment = (input: unknown): Assignment => Schema.decodeUnknownSync(Assignment)(input);
