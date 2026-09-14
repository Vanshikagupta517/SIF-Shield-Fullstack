from typing import Any


def calculate_risk(*, hazard: str, missing_controls: list[str], consequences: list[str], report: str, recurrence: bool) -> dict[str, Any]:
    lower = report.lower()
    score = 0
    breakdown = {
        "Potential Severity": 0,
        "Control Gap": 0,
        "Exposure": 0,
        "Hazardous Activity": 0,
        "Historical Recurrence": 0,
    }

    critical_hazards = {"Confined Space", "Working at Height", "Electrical", "Fire/Explosion", "Line of Fire", "Lifting", "Pressure"}
    if hazard in critical_hazards:
        breakdown["Potential Severity"] = 25
        score += 25

    if missing_controls:
        breakdown["Control Gap"] = min(30, 10 * len(missing_controls))
        score += breakdown["Control Gap"]

    fatal_terms = ["fatal", "fatality", "death", "asphyxiation", "arc flash", "toxic", "oxygen deficiency", "fall from height", "unexpected energization"]
    if any(term in lower for term in fatal_terms) or any("Fatality" in c for c in consequences):
        breakdown["Exposure"] = 25
        score += 25
    elif hazard != "General Safety":
        breakdown["Exposure"] = 15
        score += 15

    activity_terms = ["entered", "working", "maintenance", "inspection", "accessed", "started", "lift", "driving", "handling"]
    if any(term in lower for term in activity_terms):
        breakdown["Hazardous Activity"] = 10
        score += 10

    if recurrence:
        breakdown["Historical Recurrence"] = 10
        score += 10

    score = min(score, 100)
    if score <= 25:
        level = "LOW"
    elif score <= 50:
        level = "MEDIUM"
    elif score <= 75:
        level = "HIGH"
    else:
        level = "CRITICAL"

    return {"score": score, "level": level, "breakdown": breakdown}
