#!/usr/bin/env python3
"""Turn a trace/<session>.jsonl file into a readable "what happened" timeline.

Usage:
    python3 scenarios/agent-menu/tools/trace_summary.py                 # newest trace
    python3 scenarios/agent-menu/tools/trace_summary.py trace/<id>.jsonl

The summary answers the four observability questions used in the lab:
  1. What did the human ask?            (UserPromptSubmit)
  2. Which sources did the agent read?  (Read / Glob / Grep events)
  3. Which subagents ran and stopped?   (Task/Agent tool + SubagentStop)
  4. Did it try to write or run things? (Write / Edit / Bash events)
It is a readback of observed events, not a judgement of output quality. The
starter hook records successful observed PostToolUse calls; failed or blocked
tool calls are not captured. Malformed or empty traces are incomplete and
return a non-zero status.
"""

from __future__ import annotations

import json
import sys
from collections import Counter
from pathlib import Path

READ_TOOLS = {"Read", "Glob", "Grep"}
WRITE_TOOLS = {"Write", "Edit", "MultiEdit", "NotebookEdit", "Bash"}
SUBAGENT_TOOLS = {"Task", "Agent"}


def load_with_errors(path: Path) -> tuple[list[dict], int]:
    events = []
    malformed = 0
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if line:
            try:
                event = json.loads(line)
            except json.JSONDecodeError:
                malformed += 1
                continue
            if not isinstance(event, dict):
                malformed += 1
                continue
            events.append(event)
    return events, malformed


def load(path: Path) -> list[dict]:
    """Load valid event objects, retaining the original helper's return shape."""
    return load_with_errors(path)[0]


def newest_trace() -> Path | None:
    candidates = sorted(Path("trace").glob("*.jsonl"), key=lambda p: p.stat().st_mtime)
    return candidates[-1] if candidates else None


def main() -> int:
    path = Path(sys.argv[1]) if len(sys.argv) > 1 else newest_trace()
    if path is None or not path.exists():
        print("No trace file found. Run the agent once with the starter hooks installed.")
        return 2
    try:
        events, malformed = load_with_errors(path)
    except (OSError, UnicodeError) as exc:
        print(f"ERROR: could not read trace: {exc}", file=sys.stderr)
        return 2
    tools = Counter(
        e.get("tool")
        for e in events
        if isinstance(e.get("tool"), str) and e.get("tool")
    )
    reads = [e for e in events if e.get("tool") in READ_TOOLS]
    writes = [e for e in events if e.get("tool") in WRITE_TOOLS]
    subagents = [e for e in events if e.get("tool") in SUBAGENT_TOOLS or e.get("event") == "SubagentStop"]
    prompts = [e for e in events if e.get("event") == "UserPromptSubmit"]

    print(f"Trace: {path}  ({len(events)} observed events; {malformed} malformed lines)")
    print("Coverage: PostToolUse entries are successful observed calls only; failed or blocked calls are not captured.")
    if malformed:
        print(f"OPEN: trace is incomplete — {malformed} malformed non-empty line(s) were ignored.")
    if not events:
        print("OPEN: no observed events; preview-only status cannot be established.")
    print()
    print("1. Human asked")
    for e in prompts or [{}]:
        print(f"   - {e.get('prompt') or 'OPEN — no UserPromptSubmit event recorded'}")
    print()
    print("2. Sources read (in order)")
    for e in reads:
        print(f"   - {e.get('ts', 'OPEN')}  {e.get('tool', 'OPEN'):<5} {e.get('summary','')}")
    if not reads:
        print("   - OPEN — no observed read events")
    print()
    print("3. Subagents")
    for e in subagents:
        label = e.get("event") if e.get("event") == "SubagentStop" else e.get("tool")
        print(f"   - {e.get('ts', 'OPEN')}  {label:<13} {e.get('agent_type') or ''} {e.get('summary','')}")
    if not subagents:
        print("   - OPEN — no observed subagent events")
    print()
    print("4. Writes, edits, or shell commands")
    for e in writes:
        print(f"   - {e.get('ts', 'OPEN')}  {e.get('tool', 'OPEN'):<6} {e.get('summary','')}")
    if not writes:
        print("   - OPEN — no observed write, edit, or shell-command events")
    print()
    print("Tool counts: " + ", ".join(f"{k}={v}" for k, v in tools.most_common()) )
    stop = [e for e in events if e.get("event") == "Stop"]
    print(f"Stop events: {len(stop)}; final message length: {stop[-1].get('last_message_chars') if stop else 'OPEN'} chars")
    print()
    print("OPEN: the trace shows observed tool events, not whether the output is correct. Use the checker and a human review for that.")
    return 1 if malformed or not events else 0


if __name__ == "__main__":
    raise SystemExit(main())
