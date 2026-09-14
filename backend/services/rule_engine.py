import json
import re
from pathlib import Path
from typing import Any

RULES_PATH = Path(__file__).resolve().parent.parent / "data" / "safety_rules.json"
RULES: dict[str, dict[str, Any]] = json.loads(RULES_PATH.read_text(encoding="utf-8"))


def match_rule(text: str) -> tuple[str, dict[str, Any]]:
    lower = text.lower()
    best_name = "General Safety"
    best_rule: dict[str, Any] = {
        "keywords": [],
        "required_controls": ["Relevant critical control verification"],
        "potential_consequences": ["Safety incident", "Serious injury if controls fail"],
        "recommended_actions": ["Pause the activity and verify applicable controls before resuming"],
        "safety_rule": "General Safety Review",
    }
    best_hits = 0
    for name, rule in RULES.items():
        hits = sum(1 for keyword in rule["keywords"] if re.search(r"\b" + re.escape(keyword.lower()) + r"\b", lower))
        if hits > best_hits:
            best_name, best_rule, best_hits = name, rule, hits
    return best_name, best_rule


def find_missing_controls(text: str, rule: dict[str, Any]) -> list[str]:
    lower = text.lower()
    missing: list[str] = []
    negative_markers = [
        "without", "no ", "not ", "unavailable", "unverified", "not verified",
        "failed", "failure", "skipped", "missing", "absent", "not completed",
        "not obtained", "not signed", "not inspected", "not connected"
    ]
    has_negative = any(marker in lower for marker in negative_markers)
    if not has_negative:
        return []

    for control in rule["required_controls"]:
        terms = [part.strip().lower() for part in control.replace("/", " ").split() if len(part) > 3]
        if any(term in lower for term in terms) or has_negative:
            missing.append(control)
    return missing[:3]
