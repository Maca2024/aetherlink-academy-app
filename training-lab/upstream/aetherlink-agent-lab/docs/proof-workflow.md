# Bounded Proof workflow

This 20-minute exercise fits inside the participant lab's existing intent
block. A facilitator creates a squad-owned Proof draft in the hosted browser,
invites the squad, and configures scoped agent access when available. The
exercise reviews that draft against the local route contract and stays bounded
to synthetic data. This page does not claim that Proof has been set up. The
agent may suggest wording; a human owns approval, repository changes, and any
GitLab handoff.

Read the [Proof agent documentation](https://www.proofeditor.ai/agent-docs) for
the hosted API. The existing [Proof welcome
document](https://www.proofeditor.ai/d/v07vptke) is read-only context for an
agent and must not be edited. It is not the squad draft.

## Boundary and evidence chain

Start with the selected branch's synthetic input and the root
[intent.md](../intent.md), [progress.md](../progress.md), and
[CLAUDE.md](../CLAUDE.md). Keep drafts and decisions in the participant
workspace; agent file writes remain limited to `participant-output/` under the
existing lab contract. Mark unsupported details `OPEN`.

The intended chain is a squad-owned Proof draft/review → human-approved
`intent.md`/`progress.md` → a manually prepared export to the approved training
GitLab merge request. The root `CLAUDE.md` must retain explicit
`@intent.md`, `@progress.md`, and `@AGENTS.md` references. GitLab remains mock or
access-gated for this lab: if a human cannot verify the branch/MR, record the
intended destination and `OPEN`. Proof does not synchronise to GitLab
automatically, and the agent does not open, approve, merge, or publish an MR.

The hosted agent routes are `GET
/api/agent/<slug>/v3/document` for reading and `POST
/api/agent/<slug>/v3/edit` for editing. A write requires an access token. The
facilitator may provide scoped access for the squad draft; without it, the
agent returns suggestions for a human to enter in Proof and the API step is
`OPEN`. Never put tokens in this repository, a prompt, a site bundle, or
`participant-output/`; use an approved secret manager or process-scoped
environment when authorised.

## The 20-minute intent exercise

| Time | Activity | Required output and gate |
| --- | --- | --- |
| 0–5m | Individual draft | Each learner drafts an observable outcome, boundary, owner, and evidence check for the branch input in the squad-owned Proof document. Preserve protected ticket/repository wording and leave unknowns `OPEN`. |
| 5–10m | Squad combine | The squad compares drafts and makes one Proof candidate. Keep the selected input path, quoted evidence, proposed `intent.md`/`progress.md` changes, and unresolved questions visible. |
| 10–15m | Agent suggestions | The agent reviews the Proof candidate and returns exact-quote suggestions, reasons, risks, and `OPEN` questions. With scoped access it may add comments/suggestions; without it, the operator records them for manual entry. The welcome document remains read-only. |
| 15–20m | Human approval / export to GitLab MR | The human reviewer accepts, revises, or rejects each suggestion. The evidence owner manually prepares the approved `intent.md` and `progress.md` for the approved training GitLab branch/MR. If access is unavailable, record `OPEN` with the intended branch/MR. |

The shape checker can confirm required fields, paths, and formatting. It cannot
prove that Proof or an agent ran, that a human approved the draft, or that a
GitLab MR was exported. Capture those facts separately in the run log and
recap.

## Example review prompt

```text
Act as a bounded reviewer for this synthetic participant-lab exercise. Read
the candidate draft, the selected route input, intent.md, progress.md,
CLAUDE.md, and AGENTS.md. Check that the outcome is observable, protected
source wording is preserved, owners and evidence are explicit, and unknowns
remain OPEN. Return suggestions only. For each suggestion include the exact
quote, reason, risk, and the check a human should perform.

Review the squad-owned Proof draft. You may read
https://www.proofeditor.ai/d/v07vptke for context, but it is read-only. Add
comments or suggestions only when scoped access is available; otherwise return
them to the operator for manual entry. Do not write outside
participant-output/, contact GitLab, Jira, Confluence, PSP, bank, or
production systems, or claim approval, export, merge, or publication. Use
synthetic data only.
```

## Success checks

- [ ] One candidate draft names an observable outcome, boundary, human owner,
      reviewer, and evidence owner.
- [ ] The squad-owned Proof draft has a recorded owner, slug, and revision; the
      supplied welcome document remains read-only.
- [ ] Protected route input wording is unchanged; unsupported details remain
      `OPEN`.
- [ ] Agent suggestions quote text present in the candidate or named local
      files and include a human-checkable reason and risk.
- [ ] A human records accept, revise, or reject for every suggestion.
- [ ] Approved `intent.md` and `progress.md` are prepared for the intended
      GitLab branch/MR, or the unavailable destination is recorded `OPEN`.
- [ ] `CLAUDE.md` explicitly references `@intent.md`, `@progress.md`, and
      `@AGENTS.md`.
- [ ] The recap records owner, reviewer, evidence owner, local revision,
      GitLab branch/MR revision, and next recheck.
- [ ] No token, private client data, live payment data, or unverified run
      result appears in the lab or site.

## Recap template

Copy this into the relevant run log or dated recap.

```markdown
## Proof exercise recap — TEMPLATE

- Date/time: `YYYY-MM-DD HH:MM TZ`
- Route/branch: `squad-N/day-N`
- Synthetic input: `path and identifier`
- Owner: `human reviewer/facilitator`
- Agent operator: `name`
- Evidence owner: `name`
- Local draft revision: `participant-output/...`, commit, or timestamp
- Proof draft: `squad-owned slug, owner, and revision`
- Proof welcome reference: `read-only; unchanged`
- Agent review: `suggestions accepted/revised/rejected; run-log link`
- Approved intent.md revision: `GitLab branch/MR/commit, or OPEN`
- Approved progress.md revision: `GitLab branch/MR/commit, or OPEN`
- CLAUDE.md refs checked: `yes/no; exact path`
- Human decision: `accepted / revise / rejected`
- Open items and owner: `item — owner — due date`
- Next recheck: `date and exact command or link`

### Evidence

- Input and source paths: `...`
- Checker command/output: `...`
- Agent run readback: `...` or `OPEN`
- Reviewer reproduction path: `...`
```

The owner is accountable for the decision. A revision is the exact local
commit, run-log timestamp, or verified GitLab branch/MR reference a fresh
reader can recheck. A Proof revision is not evidence of a GitLab export, and a
shape-checker pass is not evidence of an agent run.
