#!/usr/bin/env python3
"""Check protected ticket sections and required headings.

This is a deliberately small shape check. It does not assess semantic quality,
Given/When/Then behavior, source accuracy, or whether Claude Code ran.
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path


PROTECTED = ("Current situation", "Desired situation")
REQUIRED = (
    "Technical proposal",
    "Positive tests",
    "Negative tests",
    "OPEN questions",
)


def ticket_block(text: str, ticket: str) -> str:
    headings = list(re.finditer(r"^## ([^\n]+)$", text, re.MULTILINE))
    for index, match in enumerate(headings):
        if match.group(1).strip().startswith(ticket) or f"— {ticket}" in match.group(1):
            end = headings[index + 1].start() if index + 1 < len(headings) else len(text)
            return text[match.start() : end]
    raise ValueError(f"ticket not found in input: {ticket}")


def section(text: str, heading: str) -> str:
    pattern = rf"^### {re.escape(heading)}\s*\n(.*?)(?=^### |\Z)"
    match = re.search(pattern, text, re.MULTILINE | re.DOTALL)
    if not match:
        raise ValueError(f"missing section: {heading}")
    return match.group(1).rstrip()


def count_heading(text: str, heading: str) -> int:
    return len(re.findall(rf"^### {re.escape(heading)}\s*$", text, re.MULTILINE))


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", required=True, type=Path)
    parser.add_argument("--ticket", required=True)
    parser.add_argument("--output", required=True, type=Path)
    args = parser.parse_args()

    try:
        source = ticket_block(args.input.read_text(encoding="utf-8"), args.ticket)
        draft_text = args.output.read_text(encoding="utf-8")
        # A single preview can be a complete file, while target-examples.md
        # contains two level-two ticket blocks. Scope the latter when present.
        try:
            draft = ticket_block(draft_text, args.ticket)
        except ValueError:
            draft = draft_text
        errors: list[str] = []
        for heading in PROTECTED:
            expected = section(source, heading)
            try:
                actual = section(draft, heading)
            except ValueError as exc:
                errors.append(str(exc))
                continue
            if actual != expected:
                errors.append(f"protected section changed: {heading}")
            if count_heading(draft, heading) != 1:
                errors.append(f"protected heading count for {heading!r}: {count_heading(draft, heading)} (expected 1)")
        for heading in REQUIRED:
            count = count_heading(draft, heading)
            if count != 1:
                errors.append(f"required heading count for {heading!r}: {count} (expected 1)")
        if errors:
            print("FAIL")
            for error in errors:
                print(f"- {error}")
            return 1
        print(f"PASS shape: {args.ticket}; protected sections preserved; required headings present")
        print("OPEN: semantic quality, source accuracy, and actual Claude run still need human review")
        return 0
    except (OSError, ValueError) as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
