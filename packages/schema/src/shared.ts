import {Schema} from 'effect';

const IdText = Schema.String.pipe(Schema.check(Schema.isPattern(/^[A-Za-z0-9_-]{1,64}$/)));
export const SlideId = IdText.pipe(Schema.brand('SlideId'));
export type SlideId = Schema.Schema.Type<typeof SlideId>;
export const LessonId = IdText.pipe(Schema.brand('LessonId'));
export type LessonId = Schema.Schema.Type<typeof LessonId>;

/** Source decks use plain English strings. The object form carries an optional Dutch translation. */
export const LocalizedText = Schema.Struct({en: Schema.String, nl: Schema.optional(Schema.String)});
export type LocalizedText = Schema.Schema.Type<typeof LocalizedText>;
