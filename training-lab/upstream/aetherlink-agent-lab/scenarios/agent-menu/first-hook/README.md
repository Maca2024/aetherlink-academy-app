# Your first hook — see the loop, then set a rule for it

A hook is a shell command that Claude Code runs at a fixed point in the
agentic loop: before a tool acts, after it acted, when the agent stops, when a
prompt comes in. Hooks are **deterministic**: the rule always runs, whatever the
model decides. Two things you can do with them, in the order we teach them:

1. **See** — the starter's `trace_hook.py` (already installed) listens on
   `UserPromptSubmit`, `PostToolUse`, `SubagentStop`, `Stop` and writes
   `trace/<session>.jsonl`. Observe only, never intervene.
2. **Set a rule** — a `PreToolUse` hook can block an action before it happens
   (exit code `2`, message on stderr goes back to Claude as feedback).

Official guide: <https://code.claude.com/docs/en/hooks-guide> · reference:
<https://code.claude.com/docs/en/hooks> · Windows notes:
<https://code.claude.com/docs/en/hooks-guide#windows-powershell>.

## Part 1 — trainer demo (10 min): the trace hook, read aloud

The trainer opens `.claude/settings.json`, shows the four events, runs one
menu agent, then `/hooks` (read-only browser of configured hooks) and
`python3 scenarios/agent-menu/tools/trace_summary.py`. Question for the room:
*which line in the trace is the moment the agent decided something?* Answer:
none — the trace shows tool actions, not reasoning.

The same idea in SDK form, for reference only: Anthropic's
`claude-agent-sdk-demos/hello-world/hello-world.ts` registers a `PreToolUse`
hook that blocks `.js`/`.ts` writes outside one folder. Same event, same
rule, in TypeScript instead of a settings file. Not part of the exercise
(needs an API key).

## Part 2 — build your own (individual, 25 min): protect `participant-output/`

Goal: Claude may only write files under `participant-output/`. Anything else
is blocked with a message you wrote.

The boundary is evaluated against the resolved project directory. The hook
uses `CLAUDE_PROJECT_DIR` when Claude Code provides it and otherwise uses the
hook's current working directory. Relative file paths are rooted there;
absolute paths are checked as supplied. The candidate path and
`participant-output/` are resolved before containment is checked, so `..`
traversal and symlinks that escape the project or output directory are blocked.
Malformed input and a missing `file_path` fail closed with exit code `2`.

This rule is attached to the `Write|Edit` matcher only. It does not constrain
other tools such as `Bash`; keep the exercise's tool restrictions in place
when demonstrating the boundary. The shell and PowerShell launchers should
delegate their unchanged stdin to this Python implementation so every
platform applies the same resolved-path rule.

### Card — first hook

- **Goal:** a `PreToolUse` hook that blocks `Write`/`Edit` outside `participant-output/`, verified with `/hooks` and one blocked attempt.
- **Input:** this folder's scripts; your `.claude/settings.json`.
- **Steps:**
  1. Pick your script and copy it into the hooks folder:

     | Your laptop | Copy | Command in settings.json |
     | --- | --- | --- |
     | macOS / Linux / Git Bash | `cp scenarios/agent-menu/first-hook/protect-output.sh scenarios/agent-menu/first-hook/protect_output.py .claude/hooks/ && chmod +x .claude/hooks/protect-output.sh` | `"\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/protect-output.sh"` (the launcher delegates to `protect_output.py`) |
     | Any OS with Python | `cp scenarios/agent-menu/first-hook/protect_output.py .claude/hooks/` | `"python3 \"$CLAUDE_PROJECT_DIR\"/.claude/hooks/protect_output.py"` (Windows: `python` instead of `python3`) |
     | Windows PowerShell | `copy scenarios\agent-menu\first-hook\protect-output.ps1, scenarios\agent-menu\first-hook\protect_output.py .claude\hooks\` | `"python \"$env:CLAUDE_PROJECT_DIR/.claude/hooks/protect_output.py\""` |

  2. Open `.claude/settings.json` and add `PreToolUse` **as a sibling** of the
     existing events (do not replace the `hooks` object):

     ```json
     "PreToolUse": [
       {
         "matcher": "Write|Edit",
         "hooks": [
           { "type": "command", "command": "python3 \"$CLAUDE_PROJECT_DIR\"/.claude/hooks/protect_output.py", "timeout": 10 }
         ]
       }
     ]
     ```

  3. Restart Claude Code in the checkout root (settings load at start). Type
     `/hooks`: `PreToolUse` should show 1 hook. Select it to see event,
     matcher, source file and command.
  4. Test the block with this exact prompt:

     ```text
     First-hook exercise. Step 1: use the Write tool to write the text 'hook test' to notes.md in the repository root. Step 2: whatever happened in step 1, use the Write tool to write the same text to participant-output/notes.md. Then report in two sentences what happened at each step, quoting any blocked message.
     ```

     Expected: step 1 is blocked and Claude quotes your message; step 2 is
     allowed and `participant-output/notes.md` exists. (`intent.md` states the
     same boundary, so the agent and the hook agree — if you loosen one, loosen
     both.)
  5. Run `trace_summary.py`. A blocked call leaves **no** `PostToolUse` line —
     the tool never ran. Write that observation in your run log.
  6. Make it yours (pick one): change the allowed folder; add a second
     protected pattern (for example any `*.csv`); or change the message to
     name your team's rule. Re-test.
- **Result:** `/hooks` shows your hook; one blocked and one allowed attempt in the run log; your edited rule.
- **Time limit:** 25 minutes. Not working = record the exact error as `OPEN`; do not disable the trace hook to "fix" it.

## Part 3 — groups of 3–4 (15 min): compare rules

Each person shows their `/hooks` entry and one blocked message. Agree: which
rule would you want on a real repository first, and which event would it need
(`PreToolUse` to prevent, `PostToolUse` to react, `Stop` to summarise)? Record
one sentence per group.

## Windows notes (from the official guide)

- Shell-form hook commands run in Git Bash when installed, otherwise
  PowerShell. If `python3` is not found, use `python`.
- Paths arrive with backslashes; all three scripts normalise them.
- Under WSL, `powershell.exe` must be on `PATH`; test any PowerShell command
  in a PowerShell window first.
- `chmod +x` applies to macOS/Linux only.

## What this is not

Hooks cannot make the model "understand" a rule — they enforce it after the
model chose. A blocked write is a boundary held, not a lesson learned; write
the rule into `CLAUDE.md` or the subagent too if you want the agent to plan
around it. `PostToolUse` cannot undo an action. Never store credentials or
client data in a hook script; the scripts here are committed and public.
