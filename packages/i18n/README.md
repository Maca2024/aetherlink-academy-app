# @academy/i18n

Locale dictionaries and the translate core for the wave apps. Owner issue: F0-FOUNDATION (AET-20).

`src/en.json` and `src/nl.json` are byte copies of the verified legacy catalogs in `src/i18n/`. The legacy files stay where they are until the cutover issue moves them; `test/parity.test.ts` fails when the copies drift. `src/index.ts` is the TypeScript port of `src/i18n/core.mjs` with identical behaviour: English default, no browser-locale sniffing, `localStorage['academy-locale']`, NL falls back to EN and then to the key.
