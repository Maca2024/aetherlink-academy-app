import { Effect } from "effect";

export const runFixture = (thunk) => Effect.runPromise(
  Effect.try({
    try: thunk,
    catch: (cause) => new Error(cause instanceof Error ? cause.message : String(cause)),
  }),
);
