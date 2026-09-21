# Option B — `runbook-writer`

**What it does.** Takes one completed, human-reviewed run log and writes the
procedure a colleague would need to do the same thing next month: purpose,
inputs, numbered steps with the exact command or prompt, expected output,
stop rules, evidence to keep, and open questions. Confluence-shaped, but it
never publishes.

**Why after Day 3.** Day 3 produced a good run nobody else can repeat. This
agent turns *one observed run* into *a reproducible procedure* and teaches the
difference between "we saw this once" and "this is the rule".

## Contract (what the checker verifies)

Level-three headings exactly once, in this order: `### Purpose`, `### Inputs`,
`### Steps`, `### Expected output`, `### Stop rules`, `### Evidence to keep`,
`### OPEN questions`. At least three numbered steps and at least three
`[source: …]` markers pointing at the run log or the files it cites. The
`OPEN questions` section is never empty.

```
### Steps
1. From the checkout root, copy the starter agent: `cp -n scenarios/ticket-agent/starter/.claude/agents/ticket-coach.md .claude/agents/` [source: run-log-ticket-101.md, Settings recorded]
2. Type the prompt below unchanged … [source: run-log-ticket-101.md line 12]
3. Run the checker … expect `PASS shape: TICKET-OPS-101` [source: run-log-ticket-101.md line 33]
```

## Task cards

### Card 1 — first run (individual, 25 min)

- **Goal:** a runbook preview a fresh reader could follow, passing the shape checker.
- **Input:** `scenarios/agent-menu/runbook-writer/fixtures/run-log-ticket-101.md` (or your own Day 3 run log if it is complete), `templates/knowledge-note.md`, `templates/handoff.md`.
- **Steps:**
  1. Install the starter and start Claude Code in the checkout root.
  2. Type exactly:
     ```
     Use the runbook-writer subagent. Read scenarios/agent-menu/runbook-writer/fixtures/run-log-ticket-101.md and the files it cites. Return the runbook defined in scenarios/agent-menu/runbook-writer/README.md. Preview in chat only; do not write files or use remote tools.
     ```
  3. Run `python3 scenarios/agent-menu/tools/trace_summary.py`; note whether it read the templates.
  4. Save the preview you accept to `participant-output/runbook.md`.
  5. `python3 scenarios/agent-menu/tools/check_menu_output.py --agent runbook-writer --output participant-output/runbook.md`
- **Result:** preview, trace summary, checker line, run log.
- **Time limit:** 25 minutes.

### Card 2 — fresh-reader test in groups of 3–4 (20 min)

- **Goal:** someone who did not write it follows the runbook's Steps literally.
- **Steps:** a neighbour executes steps 1–3 on their own laptop, saying aloud where they hesitate; the author writes each hesitation down as a wording defect or an `OPEN`.
- **Result:** a list of hesitations; the group agrees the one that matters most.
- **Time limit:** 20 minutes.

### Card 3 — second run (individual, 20 min)

- **Goal:** the top hesitation removed without adding a rule the run log does not support.
- **Steps:** re-run with one added sentence naming the defect; checker; compare traces.
- **Result:** two previews, the sentence that changed, checker lines.
- **Time limit:** 20 minutes.

## Day 5 evaluator prompt

```
Use the evaluator subagent. Evaluate participant-output/runbook.md against the contract in scenarios/agent-menu/runbook-writer/README.md and the run log it cites. Return the verdict shape only.
```

## Boundary

The runbook describes a fictional local exercise. It must not present itself
as an approved control, claim a tolerance or policy, or be published anywhere.
