from pathlib import Path
import json
import uuid

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from services.analyzer import analyze_report

app = FastAPI(title="SIF-SHIELD Safety Intelligence API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://localhost:5173", "https://localhost:8443", "http://localhost:8443"],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


class AnalyzeRequest(BaseModel):
    report: str = Field(min_length=10, max_length=10000)


class ControlGap(BaseModel):
    required: str
    observed: str
    status: str


class AnalyzeResponse(BaseModel):
    report_id: str
    sif_precursor: bool
    risk_score: int
    risk_level: str
    confidence: float
    hazard: str
    unsafe_action: str
    evidence: list[str]
    control_gap: ControlGap
    potential_consequences: list[str]
    safety_rule: str
    recommended_actions: list[str]
    explanation: str
    why_flagged: list[str]
    risk_breakdown: dict[str, int]
    historical: list[dict]
    trend: list[dict]
    trend_control: str
    analysis_source: str


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


def _historical_for(hazard: str, control: str) -> tuple[list[dict], list[dict]]:
    # Clearly illustrative prototype data. Replace with OIL historical records when available.
    templates = {
        "Confined Space": [
            {"pct": 92, "hazard": "Confined-space maintenance", "gap": "Atmospheric testing not verified", "date": "Mar 2023", "dept": "Illustrative Field"},
            {"pct": 87, "hazard": "Vessel inspection", "gap": "Gas monitoring unavailable", "date": "Sep 2022", "dept": "Illustrative Asset"},
        ],
        "Working at Height": [
            {"pct": 88, "hazard": "Elevated platform work", "gap": "Fall protection not verified", "date": "Feb 2023", "dept": "Illustrative Projects"},
            {"pct": 79, "hazard": "Scaffold inspection", "gap": "Anchor point not verified", "date": "Jun 2022", "dept": "Illustrative Field"},
        ],
        "Electrical": [
            {"pct": 95, "hazard": "Electrical maintenance", "gap": "LOTO verification skipped", "date": "Apr 2023", "dept": "Illustrative Process Unit"},
            {"pct": 83, "hazard": "Switchgear maintenance", "gap": "Isolation verification missing", "date": "Oct 2022", "dept": "Illustrative Field"},
        ],
    }
    historical = templates.get(hazard, [])
    counts = [2, 3, 4, 5, 6, 7] if historical else [0, 0, 1, 1, 0, 1]
    trend = [{"month": m, "count": c} for m, c in zip(["Apr", "May", "Jun", "Jul", "Aug", "Sep"], counts)]
    return historical, trend


@app.post("/analyze", response_model=AnalyzeResponse)
def analyze(request: AnalyzeRequest) -> AnalyzeResponse:
    report = request.report.strip()
    if len(report) < 10:
        raise HTTPException(status_code=422, detail="Please enter a valid safety report.")

    result = analyze_report(report)
    missing = result["missing_controls"]
    control = missing[0] if missing else "Critical control verification"
    historical, trend = _historical_for(result["hazard"], control)

    explanation = (
        f"The report indicates {result['hazard'].lower()} and identifies "
        f"{result['observed'].lower()}. This creates a potential safety exposure that should be reviewed and controlled."
        if result["hazard"] != "General Safety"
        else "No specific high-severity hazard/control failure combination was identified. Safety review is still recommended."
    )

    actions = list(dict.fromkeys(result.get("recommended_actions", [])))
    if not actions:
        actions = ["Pause the activity and verify applicable controls before resuming"]

    return AnalyzeResponse(
        report_id=f"SIF-{uuid.uuid4().hex[:8].upper()}",
        sif_precursor=bool(result["sif_precursor"]),
        risk_score=int(result["risk"]["score"]),
        risk_level=result["risk"]["level"],
        confidence=float(result["confidence"]),
        hazard=result["hazard"],
        unsafe_action=result["unsafe_action"],
        evidence=result["evidence"],
        control_gap=ControlGap(
            required=control,
            observed=result["observed"],
            status="NOT VERIFIED" if missing else "NO GAP IDENTIFIED",
        ),
        potential_consequences=result["potential_consequences"],
        safety_rule=result.get("safety_rule", result["hazard"]),
        recommended_actions=actions[:5],
        explanation=explanation,
        why_flagged=result.get("why_flagged", []),
        risk_breakdown=result["risk"]["breakdown"],
        historical=historical,
        trend=trend,
        trend_control=control,
        analysis_source=result["analysis_source"],
    )
