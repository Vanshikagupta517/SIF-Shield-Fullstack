export interface AnalysisResult {
  report_id: string;
  sif_precursor: boolean;
  risk_score: number;
  risk_level: string;
  confidence: number;
  hazard: string;
  unsafe_action: string;
  evidence: string[];
  control_gap: {
    required: string;
    observed: string;
    status: string;
  };
  potential_consequences: string[];
  safety_rule: string;
  recommended_actions: string[];
  explanation: string;
  why_flagged: string[];
  risk_breakdown: Record<string, number>;
  historical: { pct: number; hazard: string; gap: string; date: string; dept: string }[];
  trend: { month: string; count: number }[];
  trend_control: string;
  analysis_source: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export async function analyzeReport(report: string): Promise<AnalysisResult> {
  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ report }),
  });

  if (!response.ok) {
    let message = "Unable to analyse the report.";
    try {
      const data = await response.json();
      message = data.detail || message;
    } catch {
      // Keep the default message when the server does not return JSON.
    }
    throw new Error(message);
  }

  return response.json();
}
