#!/usr/bin/env python3
"""Run the support-triage contract checks without third-party packages."""

from __future__ import annotations

import argparse
import json
import sys
import tempfile
from pathlib import Path

from support_triage import ValidationError, _read_json, route, validate_ticket


HERE = Path(__file__).resolve().parent
FIXTURES = HERE.parent / "fixtures"


def read(name: str):
    return json.loads((FIXTURES / name).read_text(encoding="utf-8"))


def self_check() -> int:
    ticket = validate_ticket(read("ticket.json"))
    expected = {"low": "auto_reply", "medium": "investigate", "high": "escalate"}
    for priority, action in expected.items():
        decision = read(f"decision-{priority}.json")
        routed = route(decision, ticket)
        assert routed["action"] == action, routed
        assert routed["ticket_id"] == ticket["ticket_id"], routed
        assert routed["risk_note"] == decision["risk_note"], routed
        assert routed["draft_only"] is True and routed["human_approval_required"] is True

    for name in ("decision-unknown-priority.json", "decision-conflicting.json"):
        try:
            route(read(name), ticket)
        except ValidationError:
            continue
        raise AssertionError(f"{name} unexpectedly passed")
    wrong_id = read("decision-high.json")
    wrong_id["ticket_id"] = "WL-9999"
    try:
        route(wrong_id, ticket)
    except ValidationError:
        pass
    else:
        raise AssertionError("conflicting ticket_id unexpectedly passed")
    for field, value in (("priority", {"nested": "high"}), ("sentiment", ["angry"])):
        bad_enum = read("decision-high.json")
        bad_enum[field] = value
        try:
            route(bad_enum, ticket)
        except ValidationError:
            pass
        else:
            raise AssertionError(f"non-string {field} unexpectedly passed")
    for field, value in (("risk_note", None), ("draft_only", False)):
        bad_gate = read("decision-high.json")
        bad_gate[field] = value
        try:
            route(bad_gate, ticket)
        except ValidationError:
            pass
        else:
            raise AssertionError(f"bad {field} unexpectedly passed")
    with tempfile.NamedTemporaryFile("w", encoding="utf-8", suffix=".json") as broken:
        broken.write("{ this is not JSON")
        broken.flush()
        try:
            _read_json(Path(broken.name))
        except ValidationError:
            pass
        else:
            raise AssertionError("syntactically broken JSON unexpectedly passed")
    try:
        validate_ticket(read("ticket-malformed.json"))
    except ValidationError:
        pass
    else:
        raise AssertionError("ticket-malformed.json unexpectedly passed")
    # Customer text is data, even when it contains an instruction-like string.
    validate_ticket(read("ticket-adversarial.json"))
    print("PASS support-triage: priority routing, identity/risk preservation, and rejection cases")
    print("OPEN: a human must review the model draft before any action is taken")
    return 0


def check_files(ticket_path: Path, decision_path: Path) -> int:
    try:
        ticket = validate_ticket(json.loads(ticket_path.read_text(encoding="utf-8")))
        decision = json.loads(decision_path.read_text(encoding="utf-8"))
        print(json.dumps(route(decision, ticket), indent=2, sort_keys=True))
        return 0
    except (OSError, json.JSONDecodeError, ValidationError) as exc:
        print(f"FAIL support-triage: {exc}", file=sys.stderr)
        return 1


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--ticket", type=Path)
    parser.add_argument("--decision", type=Path)
    args = parser.parse_args(argv)
    if (args.ticket is None) != (args.decision is None):
        parser.error("--ticket and --decision must be supplied together")
    if args.ticket:
        return check_files(args.ticket, args.decision)
    return self_check()


if __name__ == "__main__":
    raise SystemExit(main())
