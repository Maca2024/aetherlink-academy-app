# AetherLink agent lab

This repository is a small participant lab for two bounded training routes. The
Squad 1 continuation uses one fictional payment-operations ticket. The new
Squad 2 route uses a mock GitLab repository-review request. Each route moves
from a written contract to an agent run and a human review. The repository
contains templates, synthetic inputs, importable demo material, and shape
checkers. It does not contain the course schedule, trainer answer key,
facilitator notes, private feedback, or live team integrations.

Clone this repository once for the participant workspace:

```sh
git clone https://github.com/RyanLisse/aetherlink-agent-lab.git
cd aetherlink-agent-lab
```

Use the [attendee route card](ATTENDEE-ROUTE.md) during the workshop. It tells
you which presentation or repository page to open at each timebox and when a
clone or local workflow file is actually needed.

## Daily branches

Use one branch for each training day. The branch tells you the current scope
before you start editing. Do not work directly on `main`.

| Training route | Branches | Start each day with |
| --- | --- | --- |
| Squad 2 | `squad-2/day-1` through `squad-2/day-5` | `git switch squad-2/day-N` |
| Squad 1 continuation | `squad-1/day-3` through `squad-1/day-5` | `git switch squad-1/day-N` |
| Squad 1 support triage workshop | use the daily branch supplied by the facilitator | [support-triage guide](scenarios/support-triage/README.md) |

Commit your evidence and notes on the day's branch. At the end of the day,
push that branch if the facilitator asks for a shared readback. The facilitator
reviews the branch before merging or carrying work into the next day. A branch
contains learner work only; `main` remains the clean starting template.

The branches are signposts, not proof that an agent ran. Record commands,
outputs, reviewer, and `OPEN` gaps in `progress.md` and the daily run log.

## Quickstart

1. Switch to the branch named for today's squad and day, then read
   [intent.md](intent.md), [progress.md](progress.md), and [the branch map](BRANCHING.md).
2. Follow the route for that branch. The existing Squad 1 continuation uses
   the payment ticket in [the ticket-agent guide](scenarios/ticket-agent/README.md).
   The Squad 1 support-triage workshop is a separate local n8n → Claude Code
   exercise in [the support-triage guide](scenarios/support-triage/README.md).
   Squad 2 uses
   [the repository-review guide](scenarios/agent-menu/repo-reviewer/README.md)
   and the mock GitLab snapshot.
3. On an n8n day, import the workflow named by the branch guide, select a model
   credential in the UI, and record the execution readback. On a Claude Code
   day, install the matching read-only starter and record the trace.
4. Run the relevant shape checker on a human-previewed output. A checker
   confirms shape only; it does not prove that an agent ran or that the content
   is correct.
5. Save evidence on the day's branch. Keep `OPEN` for missing access, unrun
   checks, and decisions that require the team.

The first exercise is deliberately bounded. Do not connect a remote Jira,
GitLab, Confluence, PSP, bank, or production repository. Do not approve a
payout. Keep unsupported explanations and missing evidence as `OPEN`.

## Contents

| Path | Purpose |
| --- | --- |
| [intent.md](intent.md) | Empty participant outcome and evidence contract |
| [progress.md](progress.md) | Empty current-state board |
| [n8n/README.md](n8n/README.md) | Payment-ticket n8n import, UI setup, smoke test, and evidence steps |
| [n8n/workflows/repo-reviewer.json](n8n/workflows/repo-reviewer.json) | Squad 2 mock-GitLab repository-review workflow |
| [n8n/workflows/ticket-coach.json](n8n/workflows/ticket-coach.json) | Credential-free importable n8n demo (Anthropic chat model by default; provider swappable in the UI) |
| [scenarios/ticket-agent/](scenarios/ticket-agent/) | Same ticket input, shared instruction, contract, starter, examples, and checker |
| [scenarios/support-triage/](scenarios/support-triage/) | Squad 1 n8n → Claude Code support triage, specialists, safety checks, and lifecycle guide |
| [scenarios/agent-menu/](scenarios/agent-menu/) | Squad 2 Claude Code repository reviewer, Squad 1 Day 5 menu, trace hooks, evaluator, and checkers |
| [scenarios/payment-reconciliation/data/](scenarios/payment-reconciliation/data/) | Synthetic ledger, PSP, and bank CSVs for optional local context |
| [scenarios/payment-reconciliation/tickets/](scenarios/payment-reconciliation/tickets/) | Six fictional FIN-001–FIN-006 ticket templates |
| [templates/](templates/) | Session, recap, knowledge, decision, handoff, and run-log forms |
| [docs/proof-workflow.md](docs/proof-workflow.md) | Bounded Proof review exercise and manual GitLab handoff |
| [BRANCHING.md](BRANCHING.md) | Daily branch map and handoff rules |

All amounts are fictional integer minor EUR values. Examples are discussion
material and never learner evidence.

Worked ticket outputs are intentionally included as learner examples. They are
labelled examples, not observed run results or the full reconciliation trainer
answer key. Try the ticket yourself before comparing your draft with them.
