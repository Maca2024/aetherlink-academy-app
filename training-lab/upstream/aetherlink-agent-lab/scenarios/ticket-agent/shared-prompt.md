# Shared functional instruction

Use only the supplied selected ticket text (`TICKET-OPS-101` for the baseline;
`TICKET-OPS-102` only after the comparison gate) and the participant output
contract. Return a complete draft in the chat output. Preserve the supplied
`Current situation` and `Desired situation` sections verbatim. Then add exactly
one `Technical proposal`, `Positive tests`, `Negative tests`, and `OPEN
questions` section. Use level-three Markdown headings (`###`) exactly as
named in the output contract. Keep source facts separate from proposals and tests. Cite
the exact supplied input section for every technical proposal or test
assumption; if the input does not support it, label it `OPEN`. Use only
arithmetic directly supported by the supplied text and show the values and
units. Never invent financial math, causes, source IDs, policy, owners,
credentials, endpoints, remote records, approvals, or a resolved payment state.
Keep any discrepancy unresolved until a human reviews the source.

The n8n adapter supplies the ticket as an embedded Set-node field and provides
the Calculator tool through an `ai_tool` connection. The Claude Code adapter
reads the same ticket and contract files with its read-only `Read`, `Glob`, and
`Grep` tools. These are platform adapters; the functional instruction and
input/output contract stay the same.

Include at least two positive and two negative behavior checks. Write each check as Given / When / Then.
