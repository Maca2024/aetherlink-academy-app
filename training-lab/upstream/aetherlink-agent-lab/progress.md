# Progress

Status: `PARTICIPANT MATERIAL — local static checks verified; live model runs OPEN`

This is a current-state board, not a diary.

## Current verified state

- Repository structure: `VERIFIED — local templates, synthetic fixtures, route-specific checkers`
- n8n workflow import: `OPEN — learner must import the branch workflow in the n8n UI`
- n8n execution: `OPEN — requires learner-selected model credential and human readback`
- Claude Code preview: `OPEN — requires a learner run in the checkout`
- Route contract: `VERIFIED — Squad 1 ticket-coach and Squad 2 repository-review contracts are documented in intent.md`
- Last independently rechecked artifact: `n8n/workflows/repo-reviewer.json` parses as JSON; no live execution claimed
- Support triage route: `VERIFIED — guide, sanitized n8n source, Claude Code coordinator plus two specialist starters, synthetic fixtures, and stdlib validator/router`
- Support triage source fidelity: `VERIFIED — n8n/workflows/support-triage.json matches the supplied export after credential and meta removal; no live execution claimed`
- Support triage static check: `VERIFIED — priority mapping, ticket_id/risk_note preservation, malformed/unknown/conflicting rejection cases`
- Support triage remote check: `VERIFIED — .github/workflows/support-triage.yml runs syntax, fixtures, example decision, and sanitized-source checks without installs`
- Support triage n8n execution: `OPEN — learner must select a model credential in the UI and capture both specialist calls`
- Support triage Claude Code execution: `OPEN — learner must run the project subagents and capture the trace`
- Local Claude smoke: `OPEN — both specialists were reached, but human review rejected an unsupported completed-action claim; learner access and live acceptance remain OPEN`

## Blockers

| Blocker | Mechanism or impact | Owner | Evidence | Status |
| --- | --- | --- | --- | --- |
| No live model credential or execution readback | n8n and Claude Code runs cannot be claimed from static files | Learner operator | n8n UI and local run log | `OPEN` |

## Next actions

| Action | Owner | Due | Acceptance check | Evidence |
| --- | --- | --- | --- | --- |
| Import the route workflow and select a model credential in the UI | `Learner operator` | `YYYY-MM-DD` | Selected workflow executes and its route-specific output passes the checker | `OPEN` |
| Run the Claude equivalent with the same route input and prompt | `Learner operator` | `YYYY-MM-DD` | Ticket or repository-review contract passes its checker | `OPEN` |
| Record the human review and unresolved questions | `Reviewer` | `YYYY-MM-DD` | Source paths, output, reviewer, and `OPEN` items are readable from the run log | `OPEN` |
| Run the support-triage n8n → Claude Code route | `Learner operator` | `YYYY-MM-DD` | `scenarios/support-triage/README.md` steps completed and both specialist calls observed | `OPEN` |

## Evidence links

- n8n execution: `OPEN`
- Claude preview/output: `OPEN`
- Human review: `OPEN`
