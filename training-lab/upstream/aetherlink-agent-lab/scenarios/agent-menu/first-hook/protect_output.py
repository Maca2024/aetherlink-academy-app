#!/usr/bin/env python3
"""PreToolUse hook that confines Write|Edit to participant-output/.

The project directory comes from ``CLAUDE_PROJECT_DIR`` when it is set. When
the hook is run directly, its current working directory is the project
directory instead. Both the requested path and the boundary are resolved
before the containment check, so ``..`` and symlink escapes are rejected.
"""
from __future__ import annotations

import json
import os
from pathlib import Path
import sys
from typing import Any


# Learner exercise setting: keep this as the one place to choose the output
# directory. It is deliberately relative to the project root.
ALLOWED = "participant-output/"


def _block(message: str) -> int:
    print(f"Blocked by first-hook: {message}", file=sys.stderr)
    return 2


def _resolved(path: Path) -> Path:
    """Resolve existing symlinks while still supporting a new output file."""
    return path.resolve(strict=False)


def _is_descendant(path: Path, directory: Path) -> bool:
    """Return true only for a strict descendant of directory."""
    try:
        path.relative_to(directory)
    except ValueError:
        return False
    return path != directory


def check_input(payload: Any) -> tuple[bool, str]:
    """Validate and check one decoded hook payload."""
    if not isinstance(payload, dict):
        return False, "malformed hook input or missing file_path"

    tool_input = payload.get("tool_input")
    if not isinstance(tool_input, dict):
        return False, "malformed hook input or missing file_path"

    requested = tool_input.get("file_path")
    if not isinstance(requested, str) or not requested.strip():
        return False, "malformed hook input or missing file_path"

    try:
        project_value = os.environ.get("CLAUDE_PROJECT_DIR") or os.getcwd()
        project_dir = _resolved(Path(project_value))
        if not project_dir.is_dir():
            return False, "project directory is missing or is not a directory"

        allowed_dir = _resolved(project_dir / ALLOWED)
        candidate_path = Path(requested)
        if not candidate_path.is_absolute():
            candidate_path = project_dir / candidate_path
        candidate = _resolved(candidate_path)
    except (OSError, RuntimeError, ValueError, TypeError):
        # Invalid paths (including embedded NULs) must never become an allow.
        return False, "malformed path"

    # Check both boundaries. The first prevents an ALLOWED symlink from
    # pointing outside the project; the second rejects traversal and escaping
    # symlinks beneath participant-output/.
    if not _is_descendant(candidate, project_dir):
        return False, f"agents may only write under {ALLOWED} in the project directory (asked for: {requested})"
    if not _is_descendant(candidate, allowed_dir):
        return False, f"agents may only write under {ALLOWED} in the project directory (asked for: {requested})"
    return True, ""


def main() -> int:
    try:
        payload = json.load(sys.stdin)
    except (json.JSONDecodeError, UnicodeDecodeError, OSError):
        return _block("malformed hook input or missing file_path")

    allowed, reason = check_input(payload)
    return 0 if allowed else _block(reason)


if __name__ == "__main__":
    raise SystemExit(main())
