#!/usr/bin/env python3
"""Append one JSON line per Claude Code hook event to trace/<session>.jsonl.

Wired from `.claude/settings.json`. Claude Code pipes the hook payload as JSON
on stdin (see https://code.claude.com/docs/en/hooks). This script never blocks
or changes the agent: it exits 0 and prints nothing, so the trace is purely an
observation. Read the result with `tools/trace_summary.py`.

Recorded per event: timestamp, event name, agent type, tool name, a short
human-readable summary of the tool input (file path, pattern, command, or
subagent description), and the size of the tool response. Full file contents
and model text are NOT copied into the trace; the transcript already has them.
"""

from __future__ import annotations

import datetime as dt
import json
import os
import sys
from pathlib import Path


def summarize_input(tool_name: str, tool_input: dict) -> str:
    """Return the one detail a learner needs to explain what the tool did."""
    if not isinstance(tool_input, dict):
        return ""
    for key in ("file_path", "path", "pattern", "command", "url", "description", "prompt", "query"):
        value = tool_input.get(key)
        if value:
            text = str(value).replace("\n", " ")
            prefix = f"{key}=" if key != "file_path" else ""
            return (prefix + text)[:160]
    if tool_input.get("subagent_type"):
        return f"subagent={tool_input['subagent_type']}"
    return ", ".join(sorted(tool_input.keys()))[:160]


def response_size(tool_response) -> int:
    try:
        return len(json.dumps(tool_response, ensure_ascii=False))
    except TypeError:
        return len(str(tool_response))


def main() -> int:
    raw = sys.stdin.read()
    if not raw.strip():
        return 0
    try:
        payload = json.loads(raw)
    except json.JSONDecodeError:
        return 0
    if not isinstance(payload, dict):
        return 0

    try:
        project_dir = Path(os.environ.get("CLAUDE_PROJECT_DIR") or payload.get("cwd") or ".")
        trace_dir = project_dir / "trace"
        trace_dir.mkdir(parents=True, exist_ok=True)
        raw_session = str(payload.get("session_id", "unknown"))[:36]
        session = "".join(char if char in "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789._-" else "_" for char in raw_session)
        if not session or session in {".", ".."}:
            session = "unknown"

        summary = summarize_input(payload.get("tool_name", ""), payload.get("tool_input", {}))
        # Show repository-relative paths so a learner can read the trace at a glance.
        summary = summary.replace(str(project_dir.resolve()) + "/", "")

        event = {
            "ts": dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds"),
            "event": payload.get("hook_event_name"),
            "agent_type": payload.get("agent_type"),
            "agent_id": payload.get("agent_id"),
            "tool": payload.get("tool_name"),
            "summary": summary,
            "response_chars": response_size(payload.get("tool_response")) if "tool_response" in payload else None,
            "prompt": (payload.get("prompt") or "")[:200] or None,
            "last_message_chars": len(payload.get("last_assistant_message") or "") or None,
        }
        with (trace_dir / f"{session}.jsonl").open("a", encoding="utf-8") as handle:
            handle.write(json.dumps(event, ensure_ascii=False) + "\n")
    except (OSError, RuntimeError, TypeError, ValueError):
        # Hooks are observation-only. An unusable project path must never block
        # or change the agent, even when the trace cannot be written.
        return 0
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
