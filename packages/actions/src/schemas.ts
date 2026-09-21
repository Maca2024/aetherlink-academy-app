import {Schema} from 'effect';

export const EmptyInput = Schema.Record(Schema.String, Schema.Never);
