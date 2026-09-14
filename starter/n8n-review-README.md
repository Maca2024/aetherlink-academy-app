# Local n8n review fixture

Import `n8n-repository-review.json` into an attendee-owned n8n instance. It has
no credentials and no external nodes. Run it with the manual trigger and label
the result `deterministic-run`; it is a shape and boundary exercise, not an AI
model run. A participant may replace the code node with an existing, approved
model adapter, but must record the provider, input, output and trace. Do not
request a new API key for this exercise. `live-model-run-observed` remains
`OPEN` until an actual captured run exists.

Required review output fields are `finding`, `file`, `evidence`, `severity`,
`suggested_next_step`, and `needs_human_decision`. A human must review before
accepting a suggested change. The fictional scenario is `GL-REVIEW-001`; no
GitLab, Jira, Confluence, payment or production write is allowed.
