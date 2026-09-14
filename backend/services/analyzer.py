import json
import os
import re
from typing import Any

from dotenv import load_dotenv
from groq import Groq
from pydantic import BaseModel, Field

from .rule_engine import find_missing_controls, match_rule
from .risk_engine import calculate_risk

load_dotenv()


class LLMExtraction(BaseModel):
    hazard: str = Field(default="General Safety")
    unsafe_action: str = Field(default="Safety condition requiring review")
    evidence: list[str] = Field(default_factory=list)
    missing_controls: list[str] = Field(default_factory=list)
    potential_consequences: list[str] = Field(default_factory=list)
    sif_indicators: list[str] = Field(default_factory=list)


def _extract_phrases(report: str, terms: list[str]) -> list[str]:
    phrases = []
    for term in terms:
        match = re.search(re.escape(term), report, flags=re.IGNORECASE)
        if match:
            phrase = match.group(0)
            if phrase not in phrases:
                phrases.append(phrase)
    return phrases[:6]


def _keyword_analysis(report: str) -> dict[str, Any]:
    hazard, rule = match_rule(report)
    lower = report.lower()
    missing = find_missing_controls(report, rule)

    negative_terms = [
        "without", "no ", "not ", "unavailable", "unverified", "failed", "failure",
        "skipped", "missing", "absent", "not completed", "not obtained", "not signed",
        "not inspected", "not connected"
    ]
    has_control_failure = any(t in lower for t in negative_terms)
    sif_terms = [
        "fatal", "fatality", "asphyxiation", "toxic", "oxygen deficiency", "live equipment",
        "energized", "fall from height", "confined space", "confined area", "arc flash",
        "suspended load", "line of fire"
    ]
    critical_hazards = {"Confined Space", "Working at Height", "Electrical", "Fire/Explosion", "Line of Fire", "Lifting", "Pressure"}
    sif = hazard in critical_hazards and has_control_failure and bool(missing)

    consequences = list(rule["potential_consequences"][:3])
    if hazard == "General Safety":
        consequences = ["Potential incident", "Serious injury if critical controls fail"]

    evidence_terms = rule["keywords"] + negative_terms + sif_terms
    evidence = _extract_phrases(report, evidence_terms)
    if not evidence:
        evidence = [report[:120].strip()]

    missing = missing or ([] if not has_control_failure else rule["required_controls"][:1])
    recurrence = hazard != "General Safety" and len(evidence) >= 2
    risk = calculate_risk(
        hazard=hazard,
        missing_controls=missing,
        consequences=consequences,
        report=report,
        recurrence=recurrence,
    )

    unsafe_action = "Unsafe condition or activity requiring safety review"
    for candidate in [
        "entered", "accessed", "started", "working", "contacted", "used", "performed"
    ]:
        match = re.search(rf"[^.]*\b{candidate}\b[^.]*", report, flags=re.IGNORECASE)
        if match:
            unsafe_action = match.group(0).strip()
            break

    observed = " / ".join(missing) if missing else "No explicit critical control failure identified"
    sif = sif and risk["score"] >= 51
    return {
        "hazard": hazard,
        "unsafe_action": unsafe_action,
        "evidence": evidence,
        "missing_controls": missing,
        "potential_consequences": consequences,
        "sif_precursor": sif,
        "risk": risk,
        "observed": observed,
        "analysis_source": "deterministic fallback",
        "safety_rule": rule["safety_rule"],
        "confidence": 0.82 if hazard != "General Safety" else 0.65,
        "why_flagged": [
            f"{hazard} activity or condition detected",
            *(["Critical control gap identified"] if missing else []),
            *(["Potential severe consequence identified"] if sif else []),
        ],
    }


def _groq_analysis(report: str) -> dict[str, Any] | None:
    api_key = os.getenv("GROQ_API_KEY", "").strip()
    if not api_key:
        return None

    client = Groq(api_key=api_key)
    prompt = f"""You are the NLP extraction layer for SIF-SHIELD, an industrial safety decision-support prototype.
Extract facts from the report only. Do not invent facts, do not assign a risk score, and do not decide that an accident will occur.
Return JSON only with these keys:
- hazard: short hazard category
- unsafe_action: short description
- evidence: array of exact or near-exact phrases from the report
- missing_controls: array of controls explicitly absent, not verified, unavailable, skipped, or failed
- potential_consequences: array of plausible consequences from the hazard
- sif_indicators: array of evidence-based SIF precursor indicators

Safety report:
{report}
"""
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        temperature=0,
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": "You extract structured safety facts. Never invent missing facts."},
            {"role": "user", "content": prompt},
        ],
    )
    content = response.choices[0].message.content or "{}"
    return LLMExtraction.model_validate(json.loads(content)).model_dump()


def analyze_report(report: str) -> dict[str, Any]:
    base = _keyword_analysis(report)
    try:
        llm = _groq_analysis(report)
    except Exception:
        llm = None

    if llm:
        hazard, rule = match_rule(str(llm.get("hazard", "")) + " " + report)
        missing = [str(x) for x in llm.get("missing_controls", [])][:3]
        consequences = [str(x) for x in llm.get("potential_consequences", [])][:4] or rule["potential_consequences"][:3]
        evidence = [str(x) for x in llm.get("evidence", [])][:6] or base["evidence"]
        indicators = [str(x) for x in llm.get("sif_indicators", [])]
        lower = report.lower()
        negative = any(x in lower for x in ["without", "no ", "not ", "unavailable", "unverified", "failed", "missing", "absent"])
        critical_hazards = {"Confined Space", "Working at Height", "Electrical", "Fire/Explosion", "Line of Fire", "Lifting", "Pressure"}
        sif = hazard in critical_hazards and negative and bool(missing or indicators)
        recurrence = hazard != "General Safety" and len(evidence) >= 2
        risk = calculate_risk(hazard=hazard, missing_controls=missing, consequences=consequences, report=report, recurrence=recurrence)
        base.update({
            "hazard": hazard,
            "unsafe_action": str(llm.get("unsafe_action", base["unsafe_action"])),
            "evidence": evidence,
            "missing_controls": missing,
            "potential_consequences": consequences,
            "sif_precursor": sif and risk["score"] >= 51,
            "risk": risk,
            "observed": " / ".join(missing) if missing else "No explicit critical control failure identified",
            "analysis_source": "Groq NLP + deterministic risk engine",
            "confidence": 0.94 if sif else 0.86,
            "why_flagged": [
                f"{hazard} activity or condition detected",
                *(["Critical control gap identified"] if missing else []),
                *(["SIF-related indicators found in report evidence"] if indicators else []),
            ],
        })
    return base
