# @academy/schema

Effect 4 schemas for the first slide-domain slice. Authored source strings remain strings so importing the classroom deck is lossless. `LocalizedText` is exported separately for localized entities and carries required English with optional Dutch.

The source has five named layouts (`pillars`, `steps`, `compare`, `exercise`, `recap`) plus the omitted default card-grid layout, six observed variants in total. The AET-22 issue requests seven layouts, but the pinned source contains no seventh layout; this slice does not invent one.

The source contract verifier accepts a local `slides.js` path and round-trips all 78 slides. The checked source is `jyse/aetherlink-classroom-slides` branch `cons/cursus-aanpassingen` at commit `0c194f6fc38481290922b878ac5a7d31ca795c8d`. That repository has no LICENSE file, so the source is not vendored here.

```sh
pnpm --filter @academy/schema run verify:upstream -- /path/to/slides.js
```
