# Agent menu — Squad 2 Day 4 Claude Code build

Squad 2 builds the mock GitLab repository reviewer in n8n on Day 3, then
rebuilds the same functional contract in Claude Code on Day 4. Squad 1 uses
this menu on its existing Day 5 continuation to harden a payment-ticket agent.
Everything is local, fictional, and read-only for the agent; you decide what to
save.

| Option | Agent | Input it reads | Output it returns | Closest real task |
| --- | --- | --- | --- | --- |
| A | [`ticket-triage`](ticket-triage/README.md) | six `FIN-00n` tickets + CSV rows | Jira-shaped triage report per ticket | grooming the queue before stand-up |
| B | [`runbook-writer`](runbook-writer/README.md) | one reviewed run log + templates | Confluence-shaped runbook | turning a done ticket into a procedure |
| C | [`repo-reviewer`](repo-reviewer/README.md) | this repository's docs and data | findings report with file evidence | reviewing a merge request for consistency |
| Stretch | [`retro-writer`](retro-writer/README.md) | fictional Jira sprint export | retro draft with themes and actions | preparing the sprint retro |

Day 4 also contains [your first hook](first-hook/README.md): first see the loop through the trace hook, then set one rule on it.

Pick by the work you want to be faster at next week, not by difficulty; all
four use the same tools (`Read`, `Glob`, `Grep`) and the same rules. Groups
of 3–4 form **after** the individual block and are strongest when the group
mixes two different options.

## Install the starter once (Day 4, 5 minutes)

From your `aetherlink-agent-lab` checkout root:

```sh
mkdir -p .claude
cp -Rn scenarios/agent-menu/starter/.claude/. .claude/
ls .claude/agents .claude/hooks .claude/settings.json
```

The `/.claude` destination already exists in a Day 3 checkout, so copy the
starter's contents into it. The `-n` flag preserves files that are already
there. In particular, if `.claude/settings.json` already exists, this command
does not overwrite it. Compare the two settings files and manually merge any
missing starter hook entries into the existing JSON while preserving its other
configuration:

```sh
if [ -e .claude/settings.json ]; then
  echo "Preserved existing .claude/settings.json; manually merge missing hook entries."
  diff -u .claude/settings.json scenarios/agent-menu/starter/.claude/settings.json || true
fi
```

On Windows PowerShell, copy the directories and only copy `settings.json` when
the destination does not already have one:

```powershell
$starter = "scenarios/agent-menu/starter/.claude"
New-Item -ItemType Directory -Force .claude | Out-Null
$starterRoot = (Resolve-Path -LiteralPath $starter).Path
$destinationRoot = (Resolve-Path -LiteralPath ".claude").Path
Get-ChildItem -LiteralPath $starterRoot -File -Recurse -Force |
  Where-Object FullName -ne (Join-Path $starterRoot "settings.json") |
  ForEach-Object {
    $relative = $_.FullName.Substring($starterRoot.Length).TrimStart([char[]]@("\", "/"))
    $destination = Join-Path $destinationRoot $relative
    if (-not (Test-Path -LiteralPath $destination)) {
      New-Item -ItemType Directory -Force (Split-Path -Parent $destination) | Out-Null
      Copy-Item -LiteralPath $_.FullName -Destination $destination -Recurse
    }
  }
if (Test-Path -LiteralPath ".claude/settings.json") {
  Write-Host "Preserved existing .claude/settings.json; manually merge missing hook entries."
} else {
  Copy-Item -LiteralPath "$starter/settings.json" -Destination ".claude/settings.json"
}
```

You now have five project subagents (`ticket-triage`, `runbook-writer`,
`repo-reviewer`, `retro-writer`, `evaluator`) and a hook that writes a trace
of each successful observed `PostToolUse` call (plus the configured lifecycle
events) to `trace/<session>.jsonl`. Failed or blocked tool calls do not produce
a `PostToolUse` line and are not captured by this hook. Start Claude Code in
the checkout root so it loads `.claude/settings.json`; if it was already
running, restart it. Nothing is committed: `/.claude/`, `trace/`, and
`participant-output/` are ignored.

## The same loop for every option

```
your prompt + contract
  → GATHER CONTEXT   (Read / Glob / Grep the sources)
  → TAKE ACTION      (decide one bounded step; draft in chat)
  → VERIFY RESULTS   (check against the contract; checker; your review)
  → repeat with what it learned, or stop at the human gate
You can interrupt, steer, or add context at any point.
```

That is the agentic loop from the Claude Code docs; every successful observed
`PostToolUse` call inside it leaves one line in your trace. Failed or blocked
tool calls are not captured by this trace hook.

Rules that never change: the agent previews in chat and writes nothing; you
save what you accept under `participant-output/`; every claim cites a file
or row; unsupported details are `OPEN`; no Jira, GitLab, Confluence, PSP, or
bank record is created, changed, or implied. The checker checks output shape
and only some citation forms; a human must verify that every cited path and
source row actually supports the claim.

## Squad 2 Day 4 — Claude Code build (individual 25 min, then groups of 3–4)

1. Open your option's README. Read the **contract** and the **task cards**.
2. Fill `templates/run-log.md` header: option, model shown, tools, input.
3. Run the **first prompt** from the README. Preview only.
4. Run `python3 scenarios/agent-menu/tools/trace_summary.py` and answer the
   four questions it prints (asked, read, subagents, writes).
5. Save the preview you accept to `participant-output/<option>.md` yourself.
6. Run the checker: `python3 scenarios/agent-menu/tools/check_menu_output.py --agent <name> --output participant-output/<option>.md`.
7. Record PASS/FAIL/OPEN and one observed line in your run log.

## Squad 1 Day 5 — harden (evaluator-optimizer)

1. Run the `evaluator` subagent on your saved output and the option README.
2. If `REVISE`, apply **only** its numbered instructions by re-prompting your
   agent (the optimizer step). Maximum two rounds. Keep both traces.
3. Compare trace 1 and trace 2: what did the agent read differently?
4. Write the handoff with `templates/handoff.md`; a fresh reader must
   reproduce your run from it in ten minutes without asking you.

See [observability.md](observability.md) for how to read a trace and what it
can and cannot prove.
