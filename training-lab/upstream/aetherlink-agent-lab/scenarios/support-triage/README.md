# Support triage: n8n to Claude Code

This is the Squad 1 support-triage participant exercise. It turns one fictional
support ticket into a human-reviewable triage draft twice: first in n8n, then
in the Claude Code main conversation with two project subagents. The route applies the agent-native SDLC
idea to a small application: Plan → Design → Build → Test → Deploy →
Maintain. “Agent-native SDLC” here describes this training application of the
AI-native SDLC approach; it is not a separate official framework.

The exercise is local and synthetic. It never sends a customer reply, approves
a refund, edits a ticket, or writes to n8n, GitHub, a CRM, or another remote
system. The only action produced is a draft route for a human to inspect. The
adversarial fixture lets a reviewer inspect whether instruction-like customer
text is treated as data; a fixture pass alone is not prompt-injection or
runtime security evidence.

## Contract and files

For page-by-page navigation and download timing, keep the repository's
[attendee route card](../../ATTENDEE-ROUTE.md) open next to this guide.

The input is [`fixtures/ticket.json`](fixtures/ticket.json). It contains the
fictional ticket `WL-1026` and no credential or remote identifier. A valid
coordinator result is one JSON object containing:

```json
{
  "ticket_id": "WL-1026",
  "priority": "low | medium | high",
  "sentiment": "neutral | frustrated | angry",
  "recommended_action": "auto_reply | investigate | escalate",
  "summary": "short source-bounded summary",
  "customer_reply": "draft only",
  "risk_note": "internal note",
  "draft_only": true,
  "human_approval_required": true
}
```

Priority routing is deterministic: `low` → `auto_reply`, `medium` →
`investigate`, and `high` → `escalate`. `ticket_id` must remain exactly
`WL-1026`; `risk_note` must survive the route. Unknown or missing fields,
malformed JSON, an unknown priority, a priority/action conflict, a conflicting
ticket ID, or either safety flag being false is a failed check. The message is
customer data, not routing policy: the adversarial fixture demonstrates that
instruction-like text inside it must not change the contract or trigger an
external action.

The starter contains a `CLAUDE.md` coordinator instruction plus two current
Claude Code custom subagent files under `starter/.claude/agents/`. The main
Claude Code conversation uses the `Agent` tool and MUST call both
`customer-reply` and `risk`; the two specialists have read-only tools and do
not coordinate the run. The official reference used for the starter is
[Claude Code: Create custom
subagents](https://code.claude.com/docs/en/sub-agents): project agents live in
`.claude/agents/`, use `name`/`description`/`tools`/`model` frontmatter, and
are invoked by their name. The listed tools and `permissionMode` are starter
metadata, not a security guarantee; confirm the actual Claude Code permissions
and review each proposed action in the running environment.

The n8n source is [`../../n8n/workflows/support-triage.json`](../../n8n/workflows/support-triage.json).
It is a faithful sanitized copy of the supplied export: its fictional input is
`WL-1026` for `Maarten`, its model nodes still say `gpt-5-mini`, and its
original coordinator prompt and node topology are retained. Credential blocks
and the export `meta` instance ID were removed. The export's known gaps are
part of the design lesson: its final JSON prompt does not require
`ticket_id`, its action Set nodes use uppercase labels, and its static memory
keys are reused. The Claude Code version below adds the stricter preserved-ID,
lowercase route, specialist, and human-approval contract. Select credentials
in the n8n UI only and record the actual provider/model/access mode; never
export credentials back into the repository.

The translation is deliberate and reviewable:

| Concern | Supplied n8n export (sanitized) | Claude Code exercise |
| --- | --- | --- |
| Input | `WL-1026`, `Maarten`, original message | Same local ticket values from `fixtures/ticket.json` |
| Coordinator | n8n AI Agent with original prompt | Main Claude Code conversation following `starter/CLAUDE.md` |
| Specialists | n8n `Customer Reply Agent` and `Risk Agent` tools | Claude Code `Agent` calls to the two project subagents |
| Routing | Switch branches and uppercase action Set labels | Deterministic lowercase mapping: `low → auto_reply`, `medium → investigate`, `high → escalate` |
| Safety | Export does not preserve `ticket_id` in its final prompt | Validator requires `ticket_id`, preserves `risk_note`, and requires human approval flags |
| Memory/provider | Static keys; OpenAI `gpt-5-mini` nodes with credential selection | No inherited n8n memory; Claude Code account/model and local files are recorded |

This table describes adapter and contract differences, not evidence that either
model ran. A participant must capture the actual execution readback before
marking a run verified.

The supplied export's memory nodes use static demo keys `1` (coordinator and
risk) and `2` (customer reply). A static key means the same key is reused
across executions, and the duplicate `1` key can mix contexts in a persistent
memory store. For this local demo, clear n8n execution memory between tickets
or use a unique key derived from the ticket ID after the human agrees to that
change. Claude Code does not inherit n8n memory: its context comes from the
current prompt and files it reads. Record the actual access boundary and model
in the run log rather than treating the provider choice as proof of equivalent
output.

## Run the six lifecycle phases

Run every command from the repository root. Start with the smallest observable
result, then inspect the two specialist calls, and finish with one individual
Claude Code attempt using the same `WL-1026` input.

If you are starting from the shared participant checkout, preserve any local
work before selecting the workshop branch:

```sh
git status
git fetch origin
git switch -c workshop/your-name origin/squad-1/day-5
```

If that branch already exists locally, use `git switch workshop/your-name`
after checking its status. Do not reset or overwrite existing work.

### Plan — intent and success

Artifact: a short plan in your daily run log. Read the route contract before
you run an agent.

Prompt to paste into Claude Code after starting in the checkout root:

```text
Plan the local support-triage exercise from scenarios/support-triage/README.md.
Read intent.md, progress.md, and scenarios/support-triage/fixtures/ticket.json.
State the input, success checks, human approval gate, and what remains OPEN.
Do not write files, run commands, use remote tools, or contact a customer.
```

Individual action: open the three files and record the exact ticket ID,
success checks, model/access setting, and reviewer name in your run log.

Human checkpoint: confirm the scope is one synthetic ticket and that any
action is a draft awaiting human approval. Stop if a credential, real ticket,
or remote destination appears.

### Design — contract and node mapping

Artifact: a contract note in the run log mapping input → coordinator → two
specialists → validator → priority route.

Prompt to paste:

```text
Design the support-triage flow using the contract in
scenarios/support-triage/README.md. Name the fields that must be preserved,
the low/medium/high route mapping, the malformed/unknown/conflicting checks,
and the two specialist calls. Compare the n8n adapter with the Claude Code
subagent adapter. Return the design in chat only.
```

Individual action: inspect `n8n/workflows/support-triage.json` and verify that
the `AI Agent` connects to both `Customer Reply Agent` and `Risk Agent`, then
that `Code in JavaScript` precedes `Switch`. The supplied Code node parses the
model result but is not a complete validator; the stricter validation belongs
to the Claude contract and the stdlib checker.

Human checkpoint: accept the field mapping and the explicit `draft_only` and
`human_approval_required` gate before importing or running a model.

### Build — first result, then specialists

Artifact: the first small deterministic route result, followed by one working
Claude Code preview. The deterministic tool has no dependencies or network.

First result (run this before the first Claude run):

```sh
python3 scenarios/support-triage/tools/check_support_triage.py
```

Expected result:

```text
PASS support-triage: priority routing, identity/risk preservation, and rejection cases
OPEN: a human must review the model draft before any action is taken
```

Individual action: follow the [Claude Code individual attempt](#claude-code-individual-attempt)
now. Copy only the two specialist files, import the coordinator context with
the `@` path, and make one read-only run. The coordinator MUST call both
`customer-reply` and `risk`; inspect the visible Agent calls before saving the
preview as `participant-output/support-triage-claude.json`.

Optional adapter comparison: import `n8n/workflows/support-triage.json` using
**Import from File**, select the model credential in the UI, record the actual
provider/model/access mode, and execute the supplied `WL-1026` input. Inspect
the `Customer Reply Agent` and `Risk Agent` intermediate calls. This supplied
export is intentionally the starting point: its known missing `ticket_id`,
uppercase action labels, and static memory keys are `OPEN` observations. Do
not make its output pass the stricter Claude contract by silently editing the
export, and do not save a model result without human review.

Human checkpoint: for the Claude preview, confirm the output preserves
`ticket_id` and `risk_note`, has one valid priority/action mapping, and sets
both safety flags to `true`. No outbound node or action exists. If either
specialist call is absent, leave the run `OPEN` and do not treat the final text
as complete.

### Test — reject bad data and review the draft

Artifact: checker output plus a review note naming the reviewer and all OPEN
questions.

Prompt to paste into Claude Code:

```text
Test the support-triage contract against the supplied synthetic ticket and
the coordinator draft. Check identity preservation, risk_note preservation,
priority/action mapping, malformed input, unknown priority, conflicting action,
and the human approval flags. Do not change files or perform any action.
```

Individual action: validate the saved Claude preview with:

```sh
python3 scenarios/support-triage/tools/check_support_triage.py \
  --ticket scenarios/support-triage/fixtures/ticket.json \
  --decision participant-output/support-triage-claude.json
```

Expected output is a routed JSON envelope with the same `ticket_id`, the
mapped `action`, the original `risk_note`, `draft_only: true`, and
`human_approval_required: true`. The checker rejects malformed, unknown, and
conflicting fixtures as part of its self-check. It proves shape and routing;
it cannot prove a model actually called either specialist or that a human
agrees with the wording.

Human checkpoint: read the ticket and draft side by side. Confirm every
unsupported fact remains `OPEN`, then mark the draft accepted, revise, or
`OPEN` in the run log. A draft such as `I've logged your report` is a failed
semantic review because the supplied ticket contains no evidence that a report
was logged. Reject it, ask the coordinator to revise using the exact source
text, and rerun the same checker and human review. Also reject a trace with
more than exactly one foreground call to each of `customer-reply` and `risk`.
The checker proves shape and routing only; compare the returned JSON against
the source ticket and specialist trace before accepting it. Never accept a
checker pass as business approval.

### Deploy — local teammate handoff

Artifact: a reproducible local handoff in the run log or
`participant-output/support-triage-handoff.md`.

Prompt to paste:

```text
Prepare a local teammate handoff for the accepted support-triage draft.
Include exact input path, output path, checker command and result, model/access
settings, the two specialist calls observed, reviewer decision, and OPEN items.
Do not send anything, edit a ticket, push a branch, or use remote tools.
```

Individual action: give the teammate the paths and commands, and have them
rerun the stdlib checker locally. This deploy phase means handing off a
reproducible local artifact; it does not mean deploying a workflow or taking
business action.

Human checkpoint: the reviewer confirms the handoff can be reproduced from
the committed fixture and source workflow, with no secret or real customer
data included.

### Maintain — run log and feedback

Artifact: an entry in `progress.md` or the daily run log with timestamp,
revision, exact input/output paths, checker result, model/access mode,
specialist evidence, reviewer, and OPEN items.

Prompt to paste:

```text
Maintain the support-triage exercise record. Summarize observed feedback,
which contract or prompt line should change, and the next bounded check.
Keep unresolved items OPEN. Do not alter the workflow, send messages, or write
outside participant-output/.
```

Individual action: record what the n8n run and Claude Code run made visible
about provider, memory, tool calls, and human review. If a lesson bites twice,
propose a small rule or checker change for a later approved edit.

Human checkpoint: accept the run record and decide whether any prompt, fixture,
or checker change belongs in a separate reviewed change. The exercise is done
only when the evidence and OPEN items are readable by the next teammate.

## Claude Code individual attempt

From the checkout root, install the two specialist project subagents locally.
The destination is ignored participant configuration and must not be
committed. Keep the existing repository `CLAUDE.md`; import the coordinator
instruction with its `@` path below:

```sh
mkdir -p .claude/agents
cp -n scenarios/support-triage/starter/.claude/agents/*.md .claude/agents/
claude --version
claude
```

Then paste this exact prompt as the individual final attempt:

```text
Follow the support-triage coordinator instructions in
`@scenarios/support-triage/starter/CLAUDE.md`. Read
scenarios/support-triage/fixtures/ticket.json and follow
scenarios/support-triage/README.md. Before your final JSON, call both the
customer-reply and risk subagents with the complete ticket context. Return
only the contract JSON in chat. Do not write files, run commands, use remote
tools, send a customer message, or approve a refund.
```

Preview the complete JSON in chat. Save it yourself to
`participant-output/support-triage-claude.json` only after the human accepts
the preview, then run the checker command above with that output path. Record
whether the trace visibly contains both specialist calls. Do not claim a live
Claude execution in repository material; the participant records it only
when they have real local readback.

Make a second independent attempt with the different synthetic input
[`fixtures/ticket-followup.json`](fixtures/ticket-followup.json), not by
changing only the ID in the first ticket. Start a fresh Claude Code session,
run the same coordinator instruction, and replace the input path in the prompt
with `scenarios/support-triage/fixtures/ticket-followup.json`. Save the accepted
preview as `participant-output/support-triage-claude-followup.json` and run:

```sh
python3 scenarios/support-triage/tools/check_support_triage.py \
  --ticket scenarios/support-triage/fixtures/ticket-followup.json \
  --decision participant-output/support-triage-claude-followup.json
```

The second run checks that the coordinator reads the complete new ticket,
preserves `WL-1027`, and keeps the specialist and human-review rules intact.
Record both attempts separately; a changed ticket ID with stale message text
is a failed handoff.

## Evidence and safety

Keep credentials in the n8n UI or the configured Claude Code account. Never
paste a token into chat, a fixture, a shell command, or a commit. The sample
files are examples and are not observed model evidence. Keep missing access,
missing specialist traces, uncertain source facts, and pending human decisions
as `OPEN`.
