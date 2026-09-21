# Option A — `ticket-triage`

**What it does.** Reads the six fictional `FIN-00n` tickets, checks the CSV
rows they name, classifies each ticket, and drafts a Jira-shaped handoff line
set per ticket. It replaces the "I'll look at the queue later" hour with a
reviewed list you can paste into a stand-up — without touching Jira.

**Why after Day 3.** The `ticket-coach` handled one ticket deeply. This agent
handles six shallowly and consistently, so the new skill is *the contract
across items*, not the analysis of one.

## Contract (what the checker verifies)

One `### FIN-001` … `### FIN-006` section, in order, each with exactly these
labelled lines, then one `### OPEN questions` section:

```
### FIN-004
Classification: fee-mismatch
Source: scenarios/payment-reconciliation/tickets/FIN-004.md; internal-ledger.csv TX-NS-1004; psp-settlements.csv SET-1004-A
Evidence seen: ledger fee 315 minor EUR; PSP fee 300 minor EUR; difference 15 minor EUR
Proposed next step: request the fee schedule applied by the PSP for TX-NS-1004
Next owner: OPEN
Risk if treated as resolved: a 15 minor EUR fee gap is silently accepted without a policy source
```

Allowed classifications: `timing`, `duplicate`, `fee-mismatch`,
`payout-mismatch`, `needs-evidence`, `epic`. Anything the sources do not
support is `OPEN`. No cause, owner, approval, or resolved state may be invented.

## Task cards

### Card 1 — first run (individual, 25 min)

- **Goal:** a complete six-ticket triage preview that passes the shape checker.
- **Input:** `scenarios/payment-reconciliation/tickets/FIN-00*.md`, `scenarios/payment-reconciliation/data/*.csv`.
- **Steps:**
  1. Install the starter (menu README) and start Claude Code in the checkout root.
  2. Type exactly:
     ```
     Use the ticket-triage subagent. Read scenarios/payment-reconciliation/tickets/FIN-001.md through FIN-006.md and the CSV rows they name under scenarios/payment-reconciliation/data/. Return the triage report defined in scenarios/agent-menu/ticket-triage/README.md. Preview in chat only; do not write files or use remote tools.
     ```
  3. While it runs, watch which files it opens. When it stops, run
     `python3 scenarios/agent-menu/tools/trace_summary.py`.
  4. Read the preview. Save it yourself to `participant-output/triage.md`
     only if you accept it as a draft.
  5. `python3 scenarios/agent-menu/tools/check_menu_output.py --agent ticket-triage --output participant-output/triage.md`
- **Result:** preview, trace summary, checker line, and a filled `templates/run-log.md`.
- **Time limit:** 25 minutes. Not finished = record where you stopped as `OPEN`.

### Card 2 — review in groups of 3–4 (20 min)

- **Goal:** find one classification you disagree with and one source the agent did not read.
- **Input:** each member's trace summary and preview.
- **Steps:** compare `Sources read` with the `Source:` lines; check one arithmetic line against the CSV by hand; agree one reproducible correction.
- **Result:** one agreed correction per group on the shared board, phrased as a prompt change or an `OPEN`.
- **Time limit:** 20 minutes.

### Card 3 — second run with the correction (individual, 20 min)

- **Goal:** a second preview that fixes the agreed issue without breaking the contract.
- **Steps:** re-run the same prompt plus one sentence for the correction; new trace; checker again; note the difference in the run log.
- **Result:** two traces, two checker lines, one sentence on what changed.
- **Time limit:** 20 minutes.

## Day 5 evaluator prompt

```
Use the evaluator subagent. Evaluate participant-output/triage.md against the contract in scenarios/agent-menu/ticket-triage/README.md and the sources it cites. Return the verdict shape only.
```

## Boundary

Local fictional tickets only. FIN keys are not Jira keys. Do not create,
update, link, or comment on any real issue. The report is a draft for a human
stand-up, never a status change.
