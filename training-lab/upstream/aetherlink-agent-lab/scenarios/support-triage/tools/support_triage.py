#!/usr/bin/env python3
"""Deterministic validation and routing for the support-triage exercise.

The model writes a draft decision. This module only checks its shape and
chooses the next human review queue; it never sends a customer message.
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any


PRIORITIES = {"low", "medium", "high"}
SENTIMENTS = {"neutral", "frustrated", "angry"}
ACTION_BY_PRIORITY = {
    "low": "auto_reply",
    "medium": "investigate",
    "high": "escalate",
}
TEAM_BY_ACTION = {
    "auto_reply": "Self-service support",
    "investigate": "Support team",
    "escalate": "Payments escalation team",
}
REQUIRED_TICKET = {"ticket_id", "customer", "message"}
ALLOWED_TICKET = REQUIRED_TICKET
REQUIRED_DECISION = {
    "ticket_id",
    "priority",
    "sentiment",
    "recommended_action",
    "summary",
    "customer_reply",
    "risk_note",
    "draft_only",
    "human_approval_required",
}
ALLOWED_DECISION = REQUIRED_DECISION


class ValidationError(ValueError):
    """A participant-facing contract violation."""


def _nonempty_string(value: Any, field: str) -> None:
    if not isinstance(value, str) or not value.strip():
        raise ValidationError(f"{field} must be a non-empty string")


def validate_ticket(ticket: Any) -> dict[str, Any]:
    """Validate the local synthetic input and return it unchanged."""
    if not isinstance(ticket, dict):
        raise ValidationError("ticket must be a JSON object")
    missing = sorted(REQUIRED_TICKET - ticket.keys())
    if missing:
        raise ValidationError(f"ticket missing required field(s): {', '.join(missing)}")
    unknown = sorted(set(ticket) - ALLOWED_TICKET)
    if unknown:
        raise ValidationError(f"ticket has unsupported field(s): {', '.join(unknown)}")
    for field in REQUIRED_TICKET:
        _nonempty_string(ticket[field], field)
    return ticket


def validate_decision(decision: Any, ticket: dict[str, Any] | None = None) -> dict[str, Any]:
    """Validate a coordinator draft, including identity and action consistency."""
    if not isinstance(decision, dict):
        raise ValidationError("decision must be a JSON object")
    missing = sorted(REQUIRED_DECISION - decision.keys())
    if missing:
        raise ValidationError(f"decision missing required field(s): {', '.join(missing)}")
    unknown = sorted(set(decision) - ALLOWED_DECISION)
    if unknown:
        raise ValidationError(f"decision has unsupported field(s): {', '.join(unknown)}")
    for field in ("ticket_id", "summary", "customer_reply", "risk_note"):
        _nonempty_string(decision[field], field)
    if not isinstance(decision["priority"], str) or decision["priority"] not in PRIORITIES:
        raise ValidationError("decision priority must be low, medium, or high")
    if not isinstance(decision["sentiment"], str) or decision["sentiment"] not in SENTIMENTS:
        raise ValidationError("decision sentiment must be neutral, frustrated, or angry")
    expected_action = ACTION_BY_PRIORITY[decision["priority"]]
    if decision["recommended_action"] != expected_action:
        raise ValidationError(
            f"recommended_action conflicts with priority: expected {expected_action}"
        )
    if decision["draft_only"] is not True:
        raise ValidationError("draft_only must be true; this exercise never sends")
    if decision["human_approval_required"] is not True:
        raise ValidationError("human_approval_required must be true")
    if ticket is not None:
        validate_ticket(ticket)
        if decision["ticket_id"] != ticket["ticket_id"]:
            raise ValidationError("ticket_id does not match the supplied ticket")
    return decision


def route(decision: dict[str, Any], ticket: dict[str, Any] | None = None) -> dict[str, Any]:
    """Return a safe routing envelope for a validated draft."""
    validate_decision(decision, ticket)
    action = decision["recommended_action"]
    return {
        "ticket_id": decision["ticket_id"],
        "priority": decision["priority"],
        "action": action,
        "team": TEAM_BY_ACTION[action],
        "summary": decision["summary"],
        "customer_reply": decision["customer_reply"],
        "risk_note": decision["risk_note"],
        "draft_only": True,
        "human_approval_required": True,
    }


def _read_json(path: Path) -> Any:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        raise ValidationError(f"invalid JSON in {path}: {exc.msg}") from exc
    except OSError as exc:
        raise ValidationError(f"cannot read {path}: {exc}") from exc


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("ticket", type=Path, help="synthetic input JSON")
    parser.add_argument("decision", type=Path, help="human-previewed coordinator JSON")
    args = parser.parse_args(argv)
    try:
        ticket = validate_ticket(_read_json(args.ticket))
        decision = _read_json(args.decision)
        print(json.dumps(route(decision, ticket), indent=2, sort_keys=True))
        return 0
    except ValidationError as exc:
        print(f"FAIL validation: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
