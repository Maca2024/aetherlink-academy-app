# Stretch — `retro-writer`

**What it does.** Reads a fictional exported Jira sprint (`sprint-42-export.json`)
and drafts the retro document before the meeting: sprint facts with the
numbers used, themes with issue keys and quotes, what went well, what blocked
the team, proposed actions as questions, and open items. It never queries
Jira, and it never judges people.

**When to choose it.** Only if you finished Option A, B, or C including the
checker, or if your trainer assigns it. It is the same loop with a JSON input
instead of Markdown, so the new lesson is *computing facts from structured
data* (done vs. carried over, cycle time) and keeping opinion out of them.

## Contract (what the checker verifies)

Headings exactly once, in order: `### Sprint facts`, `### Themes`,
`### What went well`, `### What blocked us`, `### Proposed actions`,
`### OPEN questions`. Every issue key cited as `[FIN-4nn]` must exist in the
export; `Themes` and `Proposed actions` must cite at least one key each. No
language that ranks or blames individuals (the export only has roles anyway).

## Task cards

### Card 1 — first run (individual, 25 min)

- **Goal:** a retro draft with computed facts and cited themes that passes the checker.
- **Input:** `scenarios/agent-menu/retro-writer/fixtures/sprint-42-export.json`.
- **Steps:**
  1. Install the starter and start Claude Code in the checkout root.
  2. Type exactly:
     ```
     Use the retro-writer subagent. Read scenarios/agent-menu/retro-writer/fixtures/sprint-42-export.json and return the retro draft defined in scenarios/agent-menu/retro-writer/README.md. Preview in chat only; do not write files or use remote tools.
     ```
  3. Run `python3 scenarios/agent-menu/tools/trace_summary.py`.
  4. Check one computed number yourself (for example: how many issues are `Done`? which resolved dates give the longest cycle time?).
  5. Save the preview you accept to `participant-output/retro.md`, then
     `python3 scenarios/agent-menu/tools/check_menu_output.py --agent retro-writer --output participant-output/retro.md`
- **Result:** preview, trace summary, one hand-checked number, checker line.
- **Time limit:** 25 minutes.

### Card 2 — theme challenge in a group of 3–4 (20 min)

- **Goal:** find one theme that rests on a single comment and should be `OPEN — one source`.
- **Result:** the theme, the key, and the sentence that should change.
- **Time limit:** 20 minutes.

## Day 5 evaluator prompt

```
Use the evaluator subagent. Evaluate participant-output/retro.md against the contract in scenarios/agent-menu/retro-writer/README.md and the export it cites. Return the verdict shape only.
```

## Boundary

The export is synthetic; authors are roles, not people. A real version of
this agent would need an approved Jira export or connector, a data-handling
decision, and team consent — all `OPEN` and out of scope here.
