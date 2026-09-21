# Run log — TEMPLATE

Option: `A ticket-triage | B runbook-writer | C repo-reviewer | Stretch retro-writer`
Date and time: `YYYY-MM-DD HH:MM Europe/Amsterdam`
Learner: `TEMPLATE` · Reviewer: `TEMPLATE`

## Settings recorded

- Platform and version: `Claude Code — output of claude --version`
- Model shown in session: `TEMPLATE or OPEN`
- Subagent file: `.claude/agents/<name>.md` (revision or copy date)
- Tools allowed: `Read, Glob, Grep`
- Input files: `TEMPLATE — exact paths`
- Contract: `scenarios/agent-menu/<option>/README.md`

## Prompt typed (exact)

```
TEMPLATE
```

## Trace readback (from trace_summary.py)

1. Human asked: `TEMPLATE`
2. Sources read, in order: `TEMPLATE`
3. Subagents: `TEMPLATE or none`
4. Writes/edits/commands: `none recorded | TEMPLATE`
Trace file: `trace/<session>.jsonl`

## Output

- Saved by me to: `participant-output/<option>.md` (or `not saved`)
- Checker command and result: `TEMPLATE — PASS | FAIL | OPEN`
- One observed line I can quote: `TEMPLATE`

## Human decision

- Decision: `PASS | REVISE | BLOCKED`
- Why: `TEMPLATE`
- Not verified / OPEN: `TEMPLATE`

## Day 5 evaluator round (leave empty on Day 4)

- Evaluator verdict: `PASS | REVISE`
- Instructions applied (numbered): `TEMPLATE`
- Trace 2 difference: `TEMPLATE`
