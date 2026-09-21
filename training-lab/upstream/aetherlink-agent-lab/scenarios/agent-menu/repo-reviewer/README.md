# Option C — `repo-reviewer`

**What it does.** Reads this repository the way a careful reviewer reads a
merge request: does the data agree with the tickets, do the READMEs promise
headings that exist, do dates respect the stated cutoff? It reports three to
eight findings, each anchored to a file that exists and a quote you can check.
Adapted from the Claude cookbook "scheduled repository reviewer" idea, run on
demand and locally — no schedule, no hosting, no GitLab write.

**Why after Day 3.** Day 3 asked the agent to produce something. This agent
*checks* something, which is the habit the team needs most before trusting any
agent output — and it makes the reviewer role in your MR flow concrete.

## Contract (what the checker verifies)

Between three and eight `### F-01` … sections, each with `Path:` (must exist
in the repository), `Evidence:`, `Observation:`, `Severity:` (`low` |
`medium` | `high`), `Proposal:`; then `### Checked and consistent` and
`### OPEN questions`.

```
### F-02
Path: scenarios/payment-reconciliation/data/psp-settlements.csv
Evidence: rows SET-1003-A and SET-1003-B both reference TX-NS-1003 with net 19600
Observation: FIN-003 expects one row quarantined; the data shows two identical rows and no quarantine marker
Severity: medium — a reader could count the batch twice
Proposal: OPEN — the fixture may be intentional; confirm with the trainer before changing data
```

## Task cards

### Card 1 — first run (individual, 25 min)

- **Goal:** a findings report with real, checkable evidence that passes the shape checker.
- **Input:** `scenarios/`, `templates/`, root `README.md`, `intent.md`, `progress.md`.
- **Steps:**
  1. Install the starter and start Claude Code in the checkout root.
  2. Type exactly:
     ```
     Use the repo-reviewer subagent. Review this repository for consistency between tickets, CSV data, and documentation, following scenarios/agent-menu/repo-reviewer/README.md. Return the findings report in chat only; do not write files, run commands, or use remote tools.
     ```
  3. Run `python3 scenarios/agent-menu/tools/trace_summary.py`; count how many files it read before its first finding.
  4. Save the preview you accept to `participant-output/findings.md`.
  5. `python3 scenarios/agent-menu/tools/check_menu_output.py --agent repo-reviewer --output participant-output/findings.md`
- **Result:** preview, trace summary, checker line, run log.
- **Time limit:** 25 minutes.

### Card 2 — verify one finding by hand in groups of 3–4 (20 min)

- **Goal:** each member reproduces one finding from the quoted evidence without the agent.
- **Steps:** open the `Path:`, find the `Evidence:` text, decide `confirmed`, `not reproducible`, or `OPEN`; compare severities across the group.
- **Result:** a confirmed/not-reproducible tally on the board; one finding chosen for the second run.
- **Time limit:** 20 minutes.

### Card 3 — second run (individual, 20 min)

- **Goal:** ask for the chosen finding to be re-examined with a specific check named.
- **Steps:** re-run with one sentence such as "re-check F-03 by summing net_minor per batch_id"; compare traces; checker.
- **Result:** what the agent read differently and whether the finding changed.
- **Time limit:** 20 minutes.

## Day 5 evaluator prompt

```
Use the evaluator subagent. Evaluate participant-output/findings.md against the contract in scenarios/agent-menu/repo-reviewer/README.md and the paths it cites. Return the verdict shape only.
```

## Boundary

Findings are proposals for a human. The agent does not edit files, open MRs,
or comment in GitLab. Fixture oddities may be intentional training material —
that is what `Proposal: OPEN` is for.
