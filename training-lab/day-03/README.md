# Day 3. Transaction alert service

Build a small service that reads the fictional transaction endpoint data, applies a transparent threshold, and emits an alert with the reason. The input and expected output are committed in `data/`.

The starter path is `day-03/starter`. The TypeScript and Go files show the same boundary logic. The JavaScript reference test reads the seeded transaction shape from `data/transactions.json` before passing it to the starter, so the expected output is tied to the committed fixture.
