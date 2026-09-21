import {Schema} from 'effect';
import {CourseId, CourseVersion, DayId} from './ids.ts';
import {LessonId, LocalizedText} from './shared.ts';

export const LessonMode = Schema.Literals(['guided', 'solo', 'squad']);

export const SourceAttribution = Schema.Struct({
  repo: Schema.String,
  commit: Schema.String,
  path: Schema.optional(Schema.String),
});
export type SourceAttribution = Schema.Schema.Type<typeof SourceAttribution>;

const LoopStep = Schema.Struct({label: Schema.String, prompt: Schema.String});

export const Lesson = Schema.Struct({
  id: LessonId,
  dayId: DayId,
  courseId: CourseId,
  version: CourseVersion,
  slug: Schema.String.pipe(Schema.check(Schema.isPattern(/^[a-z0-9-]+$/))),
  title: LocalizedText,
  kicker: Schema.optional(Schema.String),
  mode: LessonMode,
  durationMinutes: Schema.Int.pipe(Schema.check(Schema.isGreaterThanOrEqualTo(1))),
  lede: Schema.optional(LocalizedText),
  loop: Schema.optional(Schema.Array(LoopStep)),
  workedExample: Schema.optional(Schema.String),
  source: Schema.optional(SourceAttribution),
});
export type Lesson = Schema.Schema.Type<typeof Lesson>;

export const decodeLesson = (input: unknown): Lesson => Schema.decodeUnknownSync(Lesson)(input);
