# Ticket-coach exercise

This participant exercise builds one narrow, source-bounded ticket coach twice.
Use `TICKET-OPS-101` first. The n8n version comes first so the learner can see
the trigger, supplied input, model, and tool connections. The Claude Code
version then expresses the same input/output contract in a local project agent.

## Shared contract

Read [ticket-inputs.md](ticket-inputs.md), [shared-prompt.md](shared-prompt.md),
and [ticket-template.md](ticket-template.md).
The chosen ticket's `Current situation` and `Desired situation` sections must
be copied verbatim. The draft must contain exactly one each of:

- `Technical proposal`
- `Positive tests`
- `Negative tests`
- `OPEN questions`

Keep facts from the input, proposed implementation, tests, and unresolved
questions visibly separate. The same functional instruction is used in both
platforms; only the adapter differs. n8n receives the ticket in an embedded
Set-node field and uses its Calculator tool. Claude Code reads the local files
with `Read`, `Glob`, and `Grep`. If a detail is missing, write `OPEN`; never
invent a cause, policy, source row, credential, owner, endpoint, or payout
decision.

## 1. n8n run

Follow [n8n/README.md](../../n8n/README.md). Import the workflow, choose a
chat-model credential in the UI, execute it manually, and inspect the AI Agent
output. Save the output only if a human chooses to do so. Record the n8n
execution ID/time, model, input ticket ID, tool connection, and review result.

## 2. Claude Code run

From the root of your cloned `aetherlink-agent-lab` checkout, copy the starter
into the repository's own `.claude/agents/` folder (the checkout is the learner
project; `.claude/` is not committed):

```sh
mkdir -p .claude/agents
cp -n scenarios/ticket-agent/starter/.claude/agents/ticket-coach.md .claude/agents/ticket-coach.md
claude --version
```

In Claude Code, invoke the project agent and ask it to read the same input and
template:

```text
Use the ticket-coach subagent. Read scenarios/ticket-agent/ticket-inputs.md and use the TICKET-OPS-101 input. Return a draft that follows scenarios/ticket-agent/ticket-template.md. Preview the complete draft in chat; do not write files or use remote tools.
```

Preview the complete response before saving anything. Keep model, access mode,
input, and prompt fixed when comparing runs. The starter has read-only tools
(`Read, Glob, Grep`) and intentionally has no hidden target example in its
agent directory.

## Checker

Run from this directory after a human preview:

```sh
python3 check_ticket.py --input ticket-inputs.md --ticket TICKET-OPS-101 --output examples/valid-output.md
```

That command should pass for the supplied valid example. The invalid example
should fail:

```sh
python3 check_ticket.py --input ticket-inputs.md --ticket TICKET-OPS-101 --output examples/invalid-output.md
```

The checker validates protected text and heading shape only. It cannot prove
source accuracy, meaningful tests, Calculator use, or a real n8n/Claude run.
