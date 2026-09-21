# Intent — participant agent lab

Status: `TEMPLATE — complete before the first run`

## Outcome

Choose the route named by the daily branch. Squad 1 builds the bounded
payment-operations ticket coach twice, first as an n8n workflow and then as a
Claude Code project agent. Squad 2 builds the bounded mock GitLab
repository-review agent twice, first in n8n and then in Claude Code. Both
routes return a source-backed draft that a human can inspect.

## Success checks shared by both routes

- [ ] The learner can import and run the n8n workflow for the selected branch after selecting a chat-model credential in the UI.
- [ ] The AI Agent has a real Calculator tool connection and uses it for stated arithmetic where the route requires arithmetic.
- [ ] A human records model/access settings, the exact input, output evidence, reviewer, and any `OPEN` items.

### Squad 1 ticket-coach contract

- [ ] The n8n and Claude Code drafts preserve the selected ticket's `Current situation` and `Desired situation` sections exactly.
- [ ] Both drafts contain `Technical proposal`, `Positive tests`, `Negative tests`, and `OPEN questions`.

### Squad 2 repository-review contract

- [ ] The n8n and Claude Code reports contain three to eight `F-01` through `F-08` findings.
- [ ] Every finding contains `Path`, `Evidence`, `Observation`, `Severity`, and `Proposal`, followed by `Checked and consistent` and `OPEN questions`.
- [ ] Every cited path exists in the local mock repository, and a human confirms the evidence before accepting a finding.

## Boundary

- Date: `TEMPLATE — YYYY-MM-DD`
- In scope: the fictional input named by the branch (`TICKET-OPS-101` for Squad 1 or `GL-REVIEW-001` for Squad 2); n8n import/run; Claude Code preview; route-specific shape checker
- Out of scope: remote systems, live payment data, payout approval, production reconciliation, agent file writes anywhere except `participant-output/` (the Day 4 first-hook exercise enforces this), and private feedback
- Stop or escalate when: a credential is missing, an output changes protected text, arithmetic is unsupported, or a human approval would be implied

## Owners

| Role | Name | Responsibility |
| --- | --- | --- |
| Human operator | `TEMPLATE` | Chooses scope, credential, and acceptance decision |
| Agent operator | `TEMPLATE` | Runs the bounded local workflow/agent |
| Reviewer | `TEMPLATE` | Rechecks source text, arithmetic, and OPEN items |
| Evidence owner | `TEMPLATE` | Stores output, command, timestamp, and revision |

## Evidence contract

Every claimed result needs the exact input path, output artifact or n8n
execution readback, and a reviewer or reproduction path. Use `OPEN` until a
check exists. The supplied examples illustrate shape and are never learner
evidence.
