# Run log — ticket-coach on TICKET-OPS-101 (EXAMPLE FIXTURE)

Status: `EXAMPLE — fictional, human-reviewed input for the runbook-writer exercise`

This is the kind of log a learner keeps during Day 3. Values come from the
fictional `TICKET-OPS-101` input; the settings are illustrative. It is an
input for the runbook exercise, not evidence that your own agent ran.

## Settings recorded

- Platform: Claude Code (CLI) in the `aetherlink-agent-lab` checkout
- Agent: project subagent `ticket-coach` from `scenarios/ticket-agent/starter/.claude/agents/ticket-coach.md`
- Tools allowed: `Read`, `Glob`, `Grep` (read-only)
- Model shown in the session: `claude-sonnet-5` (record your own)
- Input: `scenarios/ticket-agent/ticket-inputs.md`, section `TICKET-OPS-101`
- Contract: `scenarios/ticket-agent/ticket-template.md`

## Prompt typed by the human (line 12)

```
Use the ticket-coach subagent. Read scenarios/ticket-agent/ticket-inputs.md and use the TICKET-OPS-101 input. Return a draft that follows scenarios/ticket-agent/ticket-template.md. Preview the complete draft in chat; do not write files or use remote tools.
```

## Observed tool calls (from the trace)

| # | Tool | Target | Result |
|---|---|---|---|
| 1 | Read | `scenarios/ticket-agent/ticket-inputs.md` | 2 tickets found; 101 selected |
| 2 | Read | `scenarios/ticket-agent/ticket-template.md` | 8 headings, 6 checklist items |
| 3 | (none) | arithmetic in the draft | 315 − 300 = 15 minor EUR; 15750 − 315 = 15435; 15450 − 15450 = 0 |

## Output summary (line 28)

- Protected `Current situation` and `Desired situation` copied verbatim
- Headings present: Technical proposal, Positive tests (3), Negative tests (3), OPEN questions (6)
- No file written; no remote tool used

## Checker result (line 33)

```
$ python3 scenarios/ticket-agent/check_ticket.py --input scenarios/ticket-agent/ticket-inputs.md --ticket TICKET-OPS-101 --output participant-output/ticket-101-preview.md
PASS shape: TICKET-OPS-101; protected sections preserved; required headings present
OPEN: semantic quality, source accuracy, and actual Claude run still need human review
```

## Human review decision (line 41)

- Reviewer: `TEMPLATE`
- Decision: `PASS — shape and arithmetic reproduced; cause remains OPEN`
- Noted: the draft assumed the PSP used the same gross (15750) as the ledger; the input does not state a PSP gross. Kept `OPEN`.
- Not verified: whether the 15 minor EUR fee difference has a tolerance policy (no policy in the sources).

## Time and cost noted

- Wall time about 1 minute; one prompt, one subagent invocation
- Cost is account-specific: record what your session shows, or `OPEN`
