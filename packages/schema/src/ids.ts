import {Schema} from 'effect';

const IdText = Schema.String.pipe(Schema.check(Schema.isPattern(/^[A-Za-z0-9_-]{1,64}$/)));

export const CourseId = IdText.pipe(Schema.brand('CourseId'));
export type CourseId = Schema.Schema.Type<typeof CourseId>;

export const TrackId = IdText.pipe(Schema.brand('TrackId'));
export type TrackId = Schema.Schema.Type<typeof TrackId>;

export const DayId = IdText.pipe(Schema.brand('DayId'));
export type DayId = Schema.Schema.Type<typeof DayId>;

export const AssignmentId = IdText.pipe(Schema.brand('AssignmentId'));
export type AssignmentId = Schema.Schema.Type<typeof AssignmentId>;

export const QuizQuestionId = IdText.pipe(Schema.brand('QuizQuestionId'));
export type QuizQuestionId = Schema.Schema.Type<typeof QuizQuestionId>;

export const RoomId = IdText.pipe(Schema.brand('RoomId'));
export type RoomId = Schema.Schema.Type<typeof RoomId>;

export const ChatThreadId = IdText.pipe(Schema.brand('ChatThreadId'));
export type ChatThreadId = Schema.Schema.Type<typeof ChatThreadId>;

export const ChatMessageId = IdText.pipe(Schema.brand('ChatMessageId'));
export type ChatMessageId = Schema.Schema.Type<typeof ChatMessageId>;

export const ParticipantId = IdText.pipe(Schema.brand('ParticipantId'));
export type ParticipantId = Schema.Schema.Type<typeof ParticipantId>;

export const FacilitatorCredentialId = IdText.pipe(Schema.brand('FacilitatorCredentialId'));
export type FacilitatorCredentialId = Schema.Schema.Type<typeof FacilitatorCredentialId>;

/** Every content row is pinned to a course revision; publishing never mutates it. */
export const CourseVersion = Schema.Int.pipe(Schema.check(Schema.isGreaterThanOrEqualTo(1)), Schema.brand('CourseVersion'));
export type CourseVersion = Schema.Schema.Type<typeof CourseVersion>;
