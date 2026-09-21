# n8n route quickstart

Choose the workflow named by the daily branch. Both workflows are local demo
artifacts. Credentials are selected in the n8n UI and never committed.

| Route | Training day | Workflow | Output contract |
| --- | --- | --- | --- |
| Squad 1 payment operations | Day 4 | [`workflows/ticket-coach.json`](workflows/ticket-coach.json) | Preserved ticket sections, proposal, positive and negative tests, `OPEN questions` |
| Squad 2 mock GitLab review | Day 3 | [`workflows/repo-reviewer.json`](workflows/repo-reviewer.json) | Three to eight anchored findings, consistency check, `OPEN questions` |

## Squad 2 repository-review workflow

Squad 2 Day 3 uses [`workflows/repo-reviewer.json`](workflows/repo-reviewer.json).
It is a credential-free mock GitLab snapshot. The workflow does not connect to
GitLab and does not read a participant checkout. The snapshot node contains six
fictional changed-file entries so the exercise remains reproducible and safe.

1. Import `workflows/repo-reviewer.json`.
2. Select a model credential in **Anthropic Chat Model** and record the actual
   model and access mode in the run log.
3. Confirm **Mock GitLab snapshot → Repository Review Agent** and
   **Calculator → Repository Review Agent** are connected.
4. Execute once. Save the preview yourself and record the execution ID, model,
   intermediate Calculator call, findings, reviewer, and `OPEN` checks.
5. Run the shape checker on the saved output:

   ```sh
   python3 scenarios/agent-menu/tools/check_menu_output.py \
     --agent repo-reviewer --output participant-output/findings.md
   ```

The output must contain three to eight findings with `Path`, `Evidence`,
`Observation`, `Severity`, and `Proposal`, followed by `Checked and consistent`
and `OPEN questions`. The checker proves output shape only. A human still
confirms each finding against the supplied snapshot. Never paste a real GitLab
URL, token, repository content, or customer data into this workflow.

This workflow is a static, credential-free import artifact. It was checked
against official n8n documentation and the official n8n repository's
`agent-v3-with-tool.json` sample. The node types and versions in the export are:

| Node | Type | Version | Connection |
| --- | --- | ---: | --- |
| When clicking `Execute workflow` | `n8n-nodes-base.manualTrigger` | 1 | main → Ticket input |
| Ticket input | `n8n-nodes-base.set` | 3.4 | main → AI Agent |
| AI Agent | `@n8n/n8n-nodes-langchain.agent` | 3.1 | receives input, model, tool |
| Anthropic Chat Model | `@n8n/n8n-nodes-langchain.lmChatAnthropic` | 1.6 | `ai_languageModel` → AI Agent |
| Calculator | `@n8n/n8n-nodes-langchain.toolCalculator` | 1 | `ai_tool` → AI Agent |

The JSON contains no credential object or API key. After import, select an
existing Anthropic API credential in the Anthropic Chat Model node. The learner
owns that choice in the UI; do not export credentials back into this repository.
Anthropic is the prepared default because the afternoon rebuild runs on Claude:
keeping the model family the same on both platforms leaves the platform as the
main visible difference. On n8n Cloud the node can also run on gateway credits
instead of a personal API key; record which access mode was used.

## Import and configure

1. Open n8n and choose **Import from File**.
2. Select [workflows/ticket-coach.json](workflows/ticket-coach.json).
3. Open **Anthropic Chat Model**, choose a credential in the credential
   selector, and keep the model shown as `Claude Sonnet 5` (`claude-sonnet-5`)
   unless the human reviewer chooses another available model. Record the
   actual model. If the approved account uses another provider (for example
   OpenAI), replace the sub-node with that provider's chat-model node in the UI,
   reconnect it to the AI Agent's model input, and record the substitution; the
   functional ticket contract stays the same.
4. Confirm the **Calculator** node is connected to the AI Agent's tool input.
   Do not replace it with a basic LLM chain.
5. Open **Ticket input** and verify the supplied ticket ID is
   `TICKET-OPS-101`. The complete fictional ticket text is embedded in that
   node so the run is reproducible and local.

## Manual smoke test

Run **Execute workflow** once. A successful run must produce an AI Agent output
that:

1. includes the exact `Current situation` and `Desired situation` text from
   [ticket-inputs.md](../scenarios/ticket-agent/ticket-inputs.md);
2. includes `Technical proposal`, `Positive tests`, `Negative tests`, and
   `OPEN questions` headings;
3. keeps the fee mismatch visible, shows the stated 15 minor EUR difference,
   and does not invent a cause or approve the batch; and
4. shows at least one Calculator tool call with input and result in the
   returned intermediate steps. Missing tool evidence leaves the run `OPEN`.

Record the execution ID/time, selected model, ticket ID, output, and human
review decision in a local note or [progress.md](../progress.md). Mark any
missing readback `OPEN`. This is the exact smoke test to run on a real n8n
instance; no real n8n runtime was started during preparation, so import and
execution are not claimed here.

## Node-by-node map

**Manual Trigger → Ticket input.** Clicking Execute emits one item. The Set
node then supplies `ticket_id`, `ticket_title`, and `ticket` fields.

**Ticket input → AI Agent.** The agent's prompt is the `ticket` field. Its
system message is the same bounded contract used by the Claude starter.

**Anthropic Chat Model → AI Agent.** This is the required language-model sub-node.
Select its credential in the UI; no credential is serialized in the file.

**Calculator → AI Agent.** This is the real tool connection. The agent is
instructed to use it for ticket arithmetic, while the output must still show
the source values and units.

## Manual build path

The JSON is a ready reference, but a learner can build the same demo in the
editor:

1. Add **Manual Trigger** and connect its main output to an **Edit Fields (Set)** node.
2. In Edit Fields, add string fields `ticket_id` = `TICKET-OPS-101`,
   `ticket_title` = `Explain a fee mismatch before reconciliation`, and `ticket`
   containing the complete `TICKET-OPS-101` block from [ticket-inputs.md](../scenarios/ticket-agent/ticket-inputs.md).
3. Add **AI Agent** and connect the Set node's main output to it. Set the
   prompt type to **Define** and the text expression to `={{ $json.ticket }}`.
   Copy the bounded system message from the imported **AI Agent** node.
4. Add **Anthropic Chat Model** (or the approved compatible chat-model node),
   select its credential in the UI, and connect its model output to the AI
   Agent's `ai_languageModel` input.
5. Add **Calculator** and connect its output to the AI Agent's `ai_tool`
   input. This connection is what makes the exercise an agent tool loop.
6. Execute manually and inspect the AI Agent's intermediate steps and final
   output using the smoke test above.

The imported workflow is the source of truth for node versions and exact
connections. The manual path is a learner reproduction, so record any UI
version difference as `OPEN` rather than silently changing the contract.

## Official references consulted

- [Manual Trigger](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.manualtrigger/)
- [AI Agent](https://docs.n8n.io/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.agent/)
- [Anthropic Chat Model](https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.lmchatanthropic/)
- [OpenAI Chat Model](https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.lmchatopenai/) (alternative provider)
- [Calculator](https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.toolcalculator/)
- [Official n8n agent-with-tool sample JSON](https://raw.githubusercontent.com/n8n-io/n8n/master/packages/%40n8n/nodes-langchain/nodes/agents/Agent/test/integration/workflows/agent-v3-with-tool.json)
- [Official n8n Set-node sample JSON](https://raw.githubusercontent.com/n8n-io/n8n/master/packages/%40n8n/workflow-sdk/test-fixtures/committed-workflows/0.json)

## Transfer after comparison

After a human accepts the n8n/Claude comparison on `TICKET-OPS-101`, replace
`ticket_id`, `ticket_title`, and the complete `ticket` field with the
`TICKET-OPS-102` block from the same input file. Keep the instructions unchanged.
Run again and record the evidence separately. Never change only the ID while
leaving ticket 101 text in the workflow. The tool must use the newly supplied
values; no explanation of the difference is confirmed by arithmetic alone.
