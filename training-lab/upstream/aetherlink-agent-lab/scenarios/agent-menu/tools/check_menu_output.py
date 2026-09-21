#!/usr/bin/env python3
"""Shape checker for the Day 4/5 agent-menu outputs.

Usage:
    python3 scenarios/agent-menu/tools/check_menu_output.py --agent ticket-triage  --output participant-output/triage.md
    python3 scenarios/agent-menu/tools/check_menu_output.py --agent runbook-writer --output participant-output/runbook.md
    python3 scenarios/agent-menu/tools/check_menu_output.py --agent repo-reviewer  --output participant-output/findings.md
    python3 scenarios/agent-menu/tools/check_menu_output.py --agent retro-writer   --output participant-output/retro.md
    python3 scenarios/agent-menu/tools/check_menu_output.py --agent evaluator      --output participant-output/evaluation.md

Run it from the repository root on a human-previewed output that you saved
yourself. It checks headings and labelled lines, plus limited citation forms:
repo-reviewer `Path` values are checked against the local repository and
retro-writer issue keys against its fixture. Ticket-triage `Source` lines and
runbook-writer `[source: ...]` markers are shape-only; they do not prove that
a path or source row exists. It does NOT judge whether the content is correct,
whether the agent actually ran, or whether a payment question is answered.
The human must verify every cited path and source row. Exit codes: 0 PASS, 1
FAIL, 2 usage or file error.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
TICKETS = [f"FIN-00{i}" for i in range(1, 7)]
CLASSES = {"timing", "duplicate", "fee-mismatch", "payout-mismatch", "needs-evidence", "epic"}


def h3(text: str) -> list[str]:
    return [m.strip() for m in re.findall(r"^### (.+?)\s*$", text, re.MULTILINE)]


def section(text: str, heading: str) -> str:
    m = re.search(rf"^### {re.escape(heading)}\s*\n(.*?)(?=^### |\Z)", text, re.MULTILINE | re.DOTALL)
    return m.group(1) if m else ""


def require_once(text: str, headings: list[str], errors: list[str], ordered: bool = True) -> None:
    found = h3(text)
    for name in headings:
        n = found.count(name)
        if n != 1:
            errors.append(f"heading '### {name}' appears {n} times (expected 1)")
    if ordered and all(found.count(n) == 1 for n in headings):
        idx = [found.index(n) for n in headings]
        if idx != sorted(idx):
            errors.append("required headings are not in the contract order")


def labelled(body: str, label: str) -> str | None:
    m = re.search(rf"^\s*(?:[-*]\s*)?`?{re.escape(label)}`?:\s*(.+?)\s*$", body, re.MULTILINE)
    return m.group(1) if m else None


def check_ticket_triage(text: str) -> list[str]:
    errors: list[str] = []
    require_once(text, TICKETS + ["OPEN questions"], errors)
    for t in TICKETS:
        body = section(text, t)
        if not body:
            continue
        for label in ("Classification", "Source", "Evidence seen", "Proposed next step", "Next owner", "Risk if treated as resolved"):
            value = labelled(body, label)
            if value is None:
                errors.append(f"{t}: missing line '{label}:'")
            elif label == "Classification" and value.strip("` ").lower() not in CLASSES:
                errors.append(f"{t}: classification '{value}' not in {sorted(CLASSES)}")
            elif label == "Source" and f"tickets/{t}.md" not in value:
                errors.append(f"{t}: Source line does not cite tickets/{t}.md")
    return errors


def check_runbook_writer(text: str) -> list[str]:
    errors: list[str] = []
    require_once(text, ["Purpose", "Inputs", "Steps", "Expected output", "Stop rules", "Evidence to keep", "OPEN questions"], errors)
    sources = re.findall(r"\[source:\s*([^\]]+)\]", text)
    if len(sources) < 3:
        errors.append(f"only {len(sources)} [source: …] markers (expected at least 3)")
    steps = section(text, "Steps")
    if steps and len(re.findall(r"^\s*\d+\.", steps, re.MULTILINE)) < 3:
        errors.append("Steps section has fewer than 3 numbered steps")
    if not section(text, "OPEN questions").strip():
        errors.append("OPEN questions section is empty")
    return errors


def check_repo_reviewer(text: str) -> list[str]:
    errors: list[str] = []
    findings = [h for h in h3(text) if re.fullmatch(r"F-\d{2}", h)]
    if not 3 <= len(findings) <= 8:
        errors.append(f"{len(findings)} findings (expected 3–8 '### F-nn' sections)")
    require_once(text, ["Checked and consistent", "OPEN questions"], errors, ordered=False)
    for f in findings:
        body = section(text, f)
        for label in ("Path", "Evidence", "Observation", "Severity", "Proposal"):
            if labelled(body, label) is None:
                errors.append(f"{f}: missing line '{label}:'")
        path = labelled(body, "Path")
        if path:
            candidate = path.strip("` ").split(":")[0].split(" ")[0]
            if not (ROOT / candidate).exists():
                errors.append(f"{f}: Path '{candidate}' does not exist in the repository")
        sev = labelled(body, "Severity")
        if sev and not re.match(r"`?(low|medium|high)`?\b", sev, re.IGNORECASE):
            errors.append(f"{f}: Severity must start with low, medium, or high")
    return errors


def check_retro_writer(text: str) -> list[str]:
    errors: list[str] = []
    require_once(text, ["Sprint facts", "Themes", "What went well", "What blocked us", "Proposed actions", "OPEN questions"], errors)
    fixture = ROOT / "scenarios/agent-menu/retro-writer/fixtures/sprint-42-export.json"
    keys = {i["key"] for i in json.loads(fixture.read_text(encoding="utf-8"))["issues"]}
    cited = set(re.findall(r"\[(FIN-4\d\d)\]", text))
    unknown = sorted(cited - keys)
    if unknown:
        errors.append(f"cited issue keys not in the export: {unknown}")
    for name in ("Themes", "Proposed actions"):
        body = section(text, name)
        if body and not re.search(r"\[FIN-4\d\d\]", body):
            errors.append(f"{name} section cites no issue key like [FIN-401]")
    if re.search(r"\b(underperform|blame|lazy|slow developer|fault of)\b", text, re.IGNORECASE):
        errors.append("text contains individual-judgement language")
    return errors


def check_evaluator(text: str) -> list[str]:
    errors: list[str] = []
    require_once(text, ["Verdict", "Criteria", "Revise instructions", "OPEN"], errors)
    verdict = section(text, "Verdict").strip().strip("`* ")
    if verdict not in {"PASS", "REVISE"}:
        errors.append(f"Verdict must be exactly PASS or REVISE (got '{verdict[:30]}')")
    crit = section(text, "Criteria")
    results = re.findall(r"^- C([1-5]) .*? — (PASS|FAIL) — ", crit, re.MULTILINE)
    criterion_ids = [criterion_id for criterion_id, _ in results]
    expected_ids = [str(i) for i in range(1, 6)]
    if criterion_ids != expected_ids:
        found = ", ".join(f"C{i}" for i in criterion_ids) or "none"
        errors.append(f"expected exactly one criterion each for C1..C5 in order; found {found}")
    if verdict == "PASS" and any(r[1] == "FAIL" for r in results):
        errors.append("Verdict PASS but a criterion is FAIL")
    if verdict == "REVISE" and results and all(r[1] == "PASS" for r in results):
        errors.append("Verdict REVISE but every criterion is PASS")
    return errors


CHECKS = {
    "ticket-triage": check_ticket_triage,
    "runbook-writer": check_runbook_writer,
    "repo-reviewer": check_repo_reviewer,
    "retro-writer": check_retro_writer,
    "evaluator": check_evaluator,
}


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--agent", required=True, choices=sorted(CHECKS))
    parser.add_argument("--output", required=True, type=Path)
    args = parser.parse_args()
    try:
        text = args.output.read_text(encoding="utf-8")
    except OSError as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 2
    errors = CHECKS[args.agent](text)
    if errors:
        print(f"FAIL shape: {args.agent}")
        for e in errors:
            print(f"- {e}")
        return 1
    print(f"PASS shape: {args.agent}; required headings, labelled lines, and configured citation shapes are present")
    print("OPEN: verify every cited path and source row, then review content and the agent run; any payment question still needs human review")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
