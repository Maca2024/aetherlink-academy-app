import {Data} from 'effect';

export class ActionNotFound extends Data.TaggedError('ActionNotFound')<{
  readonly name: string;
}> {}

export class ActionUnauthorized extends Data.TaggedError('ActionUnauthorized')<{
  readonly name: string;
  readonly reason: string;
}> {}

export class ActionInputInvalid extends Data.TaggedError('ActionInputInvalid')<{
  readonly name: string;
  readonly message: string;
}> {}

export class ActionConfirmationRejected extends Data.TaggedError('ActionConfirmationRejected')<{
  readonly name: string;
  readonly reason: string;
}> {}

export class ActionRunFailed extends Data.TaggedError('ActionRunFailed')<{
  readonly name: string;
  readonly cause: unknown;
}> {}

export class ActionOutputInvalid extends Data.TaggedError('ActionOutputInvalid')<{
  readonly name: string;
  readonly message: string;
}> {}

export class CallerResolutionFailed extends Data.TaggedError('CallerResolutionFailed')<{
  readonly reason: string;
}> {}

export type ActionError =
  | ActionNotFound
  | ActionUnauthorized
  | ActionInputInvalid
  | ActionConfirmationRejected
  | ActionRunFailed
  | ActionOutputInvalid;
