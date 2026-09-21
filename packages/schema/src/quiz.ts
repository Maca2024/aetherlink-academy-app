import {Schema} from 'effect';
import {CourseId, CourseVersion, QuizQuestionId} from './ids.ts';
import {LessonId, LocalizedText} from './shared.ts';

const PublicQuizQuestionFields = {
  id: QuizQuestionId,
  lessonId: LessonId,
  courseId: CourseId,
  version: CourseVersion,
  question: LocalizedText,
  options: Schema.Array(LocalizedText),
  source: Schema.optional(Schema.String),
} as const;

const QuizQuestionFields = {...PublicQuizQuestionFields, answer: Schema.Int.pipe(Schema.check(Schema.isGreaterThanOrEqualTo(0)))};

/** `answer` is the facilitator-only index into `options`; it never reaches the participant projection. */
export const QuizQuestion = Schema.Struct(QuizQuestionFields).pipe(
  Schema.check(
    Schema.makeFilter<Schema.Schema.Type<Schema.Struct<typeof QuizQuestionFields>>>((question) => {
      if (question.options.length === 0) return {path: ['options'], issue: 'options must be non-empty'};
      if (question.answer >= question.options.length) return {path: ['answer'], issue: 'answer must index an existing option'};
      return undefined;
    }),
  ),
);
export type QuizQuestion = Schema.Schema.Type<typeof QuizQuestion>;

export const ParticipantQuizQuestion = Schema.Struct(PublicQuizQuestionFields);
export type ParticipantQuizQuestion = Schema.Schema.Type<typeof ParticipantQuizQuestion>;

export const decodeQuizQuestion = (input: unknown): QuizQuestion => Schema.decodeUnknownSync(QuizQuestion)(input);
export const decodeParticipantQuizQuestion = (input: unknown): ParticipantQuizQuestion => Schema.decodeUnknownSync(ParticipantQuizQuestion)(input);

export const participantQuizQuestion = (question: QuizQuestion): ParticipantQuizQuestion =>
  Schema.decodeUnknownSync(ParticipantQuizQuestion)(question);
