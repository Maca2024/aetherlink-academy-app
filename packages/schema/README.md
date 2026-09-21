# @academy/schema

Effect 4 schemas for the curriculum domain: `Course`, `Track`, `Day`, `Lesson`, `Slide`, `Assignment`, `QuizQuestion`, `Room`, `PresenterState`, `FollowState`, `Progress`, `ChatThread`, `ChatMessage`, `FacilitatorCredential`. Branded ids live in `ids.ts`; `LocalizedText` and the ids shared with the original `Slide` slice live in `shared.ts` so every entity file can import them without a circular dependency on `index.ts` (a real bug: ES module cycles evaluate the importing file's own top-level bindings *after* the module it re-exports, so anything in `index.ts` that a re-exported file needed at its own top level was `undefined` at that point).

Authored source strings remain strings so importing the classroom deck is lossless. `LocalizedText` carries required English with optional Dutch for entity-level prose; slide body text stays plain strings to match the source.

## Slide layouts

Combining the classroom deck and the training-template deck, the source has 8 named layouts (`pillars`, `steps`, `compare`, `exercise`, `recap`, `cards`, `image`, `bars`) plus an omitted default card-grid layout. `Slide` also carries `imageAlt`, `imageCaption`, `keepCards`, `mascot`, `concepts`, and `bars` (`{stages: [{name, w, accent?, ghost?}], scale, caption}`) for the `image`/`bars`/`cards` layouts. `Lesson` additionally carries the legacy `kicker`, `loop` (`{label, prompt}[]`), and `workedExample` fields; `Day` carries `guideUrl`, `participantRepo`, `agentRepo`; `Assignment` carries the legacy `checks`, `starterFiles`, `lessonIds`.

`QuizQuestion` rejects empty `options` and an `answer` outside `[0, options.length)` via a whole-struct `Schema.makeFilter`, not a per-field check, since the bound depends on both fields together.

The source contract verifier accepts a local `slides.js` path and round-trips all 78 slides:

```sh
pnpm --filter @academy/schema run verify:upstream -- /path/to/slides.js
```

The checked source is `jyse/aetherlink-classroom-slides` branch `cons/cursus-aanpassingen` at commit `0c194f6fc38481290922b878ac5a7d31ca795c8d`. That repository has no LICENSE file, so the source is not vendored here.

## Versioning

Every content entity (`Track`, `Day`, `Lesson`, `Slide`, `Assignment`, `QuizQuestion`) carries `courseId` + `version` (`CourseVersion`, an integer branded id starting at 1). `Room` pins a `courseId` + `pinnedVersion` at creation. This package only models the shapes; immutability and the atomic publish pointer are enforced in `apps/server/src/db` (Postgres constraints and triggers), not here.

## Known gap (documented, not implemented)

`day-decks.json` slides have no `type` field (unlike `slides.js`, which does on every slide). Classifying template slides into `SlideType` is an importer decision for a later wave; this package does not guess one.

## Limitations

- Dutch source strings are not machine-translated to English here; `LocalizedText.en` must be supplied by whatever writes English, not invented by this package.
- `packages/schema/test/curriculum.test.ts` and `test/slide.test.ts` cover representative fixtures for every newly discovered field/layout; the full 124-template + 78-classroom + 5-legacy-day audit lives outside this repo (a read-only probe script) and is not re-run in CI.
