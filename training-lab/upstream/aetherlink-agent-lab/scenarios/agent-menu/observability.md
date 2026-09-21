# Observability — understanding what the agent did

"It gave an answer" is not evidence. In this lab you can inspect the observed
part of the run: which prompt started it, which successful file reads were
recorded and in what order, which subagents stopped, whether a successful
write, edit, or shell command was observed, and where the run stopped. Three
views give you that partial record.

## 1. The trace file (hook-based, local)

The starter's `.claude/settings.json` runs `.claude/hooks/trace_hook.py` on
four Claude Code hook events. Each observed event appends one JSON line to
`trace/<session_id>.jsonl` in your checkout. `PostToolUse` runs after a tool
call succeeds, so it records successful observed calls only; failed or blocked
tool calls do not produce a `PostToolUse` line and are not captured here.

| Hook event | What the line tells you |
| --- | --- |
| `UserPromptSubmit` | the exact prompt a human typed (first 200 characters) |
| `PostToolUse` | successful observed tool name, its target (file path, pattern, command, or subagent description), and the size of what came back |
| `SubagentStop` | a subagent finished, and which type |
| `Stop` | the main agent finished, and how long its final message was |

The hook copies **no file contents and no model text** into the trace — only
the shape of observed events. It exits 0 and prints nothing, so it can never
change the agent's behaviour. Contract: <https://code.claude.com/docs/en/hooks>.

Read it with:

```sh
python3 scenarios/agent-menu/tools/trace_summary.py            # newest trace
python3 scenarios/agent-menu/tools/trace_summary.py trace/<id>.jsonl
```

The summary reports malformed lines and exits nonzero when a trace is empty or
contains malformed records. Treat that output as an incomplete trace, not as
proof of a preview-only run.

The summary prints the four questions to answer in your run log. They map onto the three phases of the agentic loop — gather context (2), take action (3, 4), verify results (your checker and review):

1. **What did the human ask?**
2. **Which sources did the agent read, in which order?** Compare with the
   sources your output cites. A cited file that was never read is a finding.
3. **Which subagents ran and stopped?**
4. **Did it write, edit, or run anything?** Report observed successful calls.
   If no event is present, write `OPEN — no observed events`; that does not
   establish that no failed or blocked attempt occurred.

## 2. The transcript (built into Claude Code)

In the Claude Code session, expand a tool call to see its full input and
result. The starter trace contains only compact event fields; it does not copy
the transcript path or full tool result. Use the trace for the story and the
Claude Code transcript for the detail.

## 3. The checker and the human gate

`check_menu_output.py` proves the output has the contract's shape. Its
existence checks are limited: repo-reviewer `Path` values are checked against
the local repository, and retro-writer issue keys are checked against the
fixture. Ticket-triage `Source` lines and runbook-writer `[source: ...]`
markers are shape checks; they do not resolve files or source rows. A human
must verify every cited path and source row against the actual fixture before
accepting the output. Record all three in the run log: trace summary, checker
result, human decision.

## What the trace cannot prove

- that the content is correct, or that arithmetic was right;
- that the model "understood" anything — it records tools, not reasoning;
- anything about a run that happened without the hooks installed;
- failed or blocked tool calls that never emitted `PostToolUse`;
- the existence or correctness of every cited path or source row.

Say `OPEN` for those, exactly as on Day 3.

## Reading exercise (Day 5, 10 minutes, groups of 3–4)

Swap trace summaries with a neighbour who chose a different option. Without
looking at their output, tell them: what they asked, the first file their
agent read, whether a subagent ran, and whether a successful write was
observed. Then
check against their output's citations. One mismatch found = one lesson for
the handoff.
