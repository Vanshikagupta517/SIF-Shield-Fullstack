import { useState, useEffect, useRef } from "react";
import { analyzeReport, type AnalysisResult } from "../services/api";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

// ─── Demo Scenarios ───────────────────────────────────────────────────────────

interface Scenario {
  id: string;
  label: string;
  report: string;
  hazard: string;
  controlGap: string;
  sifPrecursor: string;
  consequence: string;
  action: string[];
  riskScore: number;
  evidence: string[];
  whyFlagged: string[];
  historical: { pct: number; hazard: string; gap: string; date: string; dept: string }[];
  trend: { month: string; count: number }[];
  trendControl: string;
  confidence?: number;
}

const SCENARIOS: Record<string, Scenario> = {
  confined: {
    id: "confined",
    label: "DEMO 01 — Confined Space",
    report:
      "Two workers entered a vessel for inspection without completing atmospheric testing. Continuous gas monitoring was unavailable. PTW had not been signed off. Supervisor was not present at point of entry. H2S detector was found to be out of calibration.",
    hazard: "Confined Space",
    controlGap: "Atmospheric Testing",
    sifPrecursor: "Potential hazardous atmosphere exposure",
    consequence: "Toxic exposure / Asphyxiation / Fatality",
    action: [
      "Stop entry immediately.",
      "Verify atmospheric conditions before any re-entry.",
      "Confirm permit-to-work is signed and current.",
      "Ensure calibrated gas monitor and rescue standby.",
      "Resume only after all critical controls are verified.",
    ],
    riskScore: 94,
    evidence: [
      '"without completing atmospheric testing"',
      '"gas monitoring was unavailable"',
      '"entered a vessel"',
      '"PTW had not been signed off"',
      '"H2S detector was found to be out of calibration"',
    ],
    whyFlagged: [
      "Confined-space activity detected",
      "Atmospheric testing not completed",
      "Gas monitoring unavailable",
      "Critical control gap identified",
      "Potential severe exposure consequence",
    ],
    historical: [
      { pct: 92, hazard: "Confined-space maintenance", gap: "Atmospheric testing not performed", date: "Mar 2023", dept: "Duliajan Field" },
      { pct: 87, hazard: "Vessel inspection", gap: "Gas monitoring unavailable", date: "Sep 2022", dept: "Digboi Refinery" },
      { pct: 84, hazard: "Tank entry", gap: "Control verification failure", date: "Jan 2022", dept: "Moran Asset" },
    ],
    trend: [
      { month: "Apr", count: 3 },
      { month: "May", count: 5 },
      { month: "Jun", count: 7 },
      { month: "Jul", count: 10 },
      { month: "Aug", count: 13 },
      { month: "Sep", count: 16 },
    ],
    trendControl: "Atmospheric Testing",
  },
  height: {
    id: "height",
    label: "DEMO 02 — Working at Height",
    report:
      "Worker accessed an elevated platform without verified fall protection and the anchor point had not been inspected. Safety harness was present but not connected. No edge protection was in place. Work-at-height permit was not obtained.",
    hazard: "Working at Height",
    controlGap: "Fall Protection / Anchor Verification",
    sifPrecursor: "Potential fall-from-height precursor",
    consequence: "Serious injury / Fatality",
    action: [
      "Stop work activity immediately.",
      "Verify fall-arrest anchor points before access.",
      "Ensure harness connection and inspection.",
      "Install edge protection prior to any work.",
      "Obtain valid work-at-height permit.",
    ],
    riskScore: 81,
    evidence: [
      '"without verified fall protection"',
      '"anchor point had not been inspected"',
      '"Safety harness was present but not connected"',
      '"No edge protection was in place"',
    ],
    whyFlagged: [
      "Working-at-height activity detected",
      "Fall-arrest anchor not verified",
      "Harness not in use",
      "Critical fall-protection control absent",
      "Potential fatal fall consequence",
    ],
    historical: [
      { pct: 88, hazard: "Elevated platform work", gap: "Fall protection not worn", date: "Feb 2023", dept: "Projects Division" },
      { pct: 79, hazard: "Scaffold inspection", gap: "Anchor point not certified", date: "Jun 2022", dept: "Duliajan Field" },
    ],
    trend: [
      { month: "Apr", count: 2 },
      { month: "May", count: 3 },
      { month: "Jun", count: 4 },
      { month: "Jul", count: 4 },
      { month: "Aug", count: 5 },
      { month: "Sep", count: 4 },
    ],
    trendControl: "Fall Protection / Anchor Verification",
  },
  electrical: {
    id: "electrical",
    label: "DEMO 03 — Electrical / LOTO",
    report:
      "Maintenance work started before electrical isolation was verified. Lockout/Tagout procedure was not completed. Energy isolation certificate was not signed. Worker contacted live equipment during the task.",
    hazard: "Unexpected Energization",
    controlGap: "Isolation / LOTO Verification",
    sifPrecursor: "Potential serious electrical exposure",
    consequence: "Electric shock / Arc flash / Fatality",
    action: [
      "Stop work immediately.",
      "De-energize and isolate all energy sources.",
      "Verify zero energy state before any access.",
      "Complete full LOTO procedure.",
      "Obtain signed energy isolation certificate.",
    ],
    riskScore: 88,
    evidence: [
      '"before electrical isolation was verified"',
      '"Lockout/Tagout procedure was not completed"',
      '"Energy isolation certificate was not signed"',
      '"Worker contacted live equipment"',
    ],
    whyFlagged: [
      "Electrical maintenance activity detected",
      "LOTO procedure not completed",
      "Isolation certificate absent",
      "Live equipment contact reported",
      "Potential fatal electrical exposure",
    ],
    historical: [
      { pct: 95, hazard: "Electrical maintenance", gap: "LOTO not completed", date: "Apr 2023", dept: "Process Unit 3" },
      { pct: 83, hazard: "Switchgear maintenance", gap: "Isolation verification skipped", date: "Oct 2022", dept: "Duliajan Field" },
      { pct: 71, hazard: "Motor overhaul", gap: "Energy isolation certificate missing", date: "Mar 2022", dept: "Drilling Division" },
    ],
    trend: [
      { month: "Apr", count: 4 },
      { month: "May", count: 6 },
      { month: "Jun", count: 9 },
      { month: "Jul", count: 11 },
      { month: "Aug", count: 14 },
      { month: "Sep", count: 17 },
    ],
    trendControl: "Isolation / LOTO Verification",
  },
};

const RISK_BREAKDOWN = (result: AnalysisResult) => [
  { label: "Potential Severity", value: result.risk_breakdown["Potential Severity"] ?? 0, max: 25, color: "#dc2626" },
  { label: "Control Gap", value: result.risk_breakdown["Control Gap"] ?? 0, max: 30, color: "#dc2626" },
  { label: "Exposure", value: result.risk_breakdown["Exposure"] ?? 0, max: 25, color: "#ea580c" },
  { label: "Hazardous Activity", value: result.risk_breakdown["Hazardous Activity"] ?? 0, max: 10, color: "#d97706" },
  { label: "Historical Recurrence", value: result.risk_breakdown["Historical Recurrence"] ?? 0, max: 10, color: "#2563eb" },
];

function resultToScenario(result: AnalysisResult, report: string): Scenario {
  return {
    id: result.report_id,
    label: result.sif_precursor ? "LIVE ANALYSIS — SIF PRECURSOR" : "LIVE ANALYSIS — REVIEW",
    report,
    hazard: result.hazard,
    controlGap: result.control_gap.status === "NOT VERIFIED" ? result.control_gap.required : "",
    sifPrecursor: result.sif_precursor ? "Potential SIF precursor detected" : "No critical SIF precursor detected",
    consequence: result.potential_consequences.join(" / "),
    action: result.recommended_actions,
    riskScore: result.risk_score,
    evidence: result.evidence.map((e) => `"${e.replace(/"/g, "")}"`),
    whyFlagged: result.why_flagged,
    historical: result.historical,
    trend: result.trend,
    trendControl: result.trend_control,
    confidence: result.confidence,
  };
}

const ANALYSIS_STEPS = [
  "Extracting evidence",
  "Identifying hazards",
  "Checking critical controls",
  "Screening for SIF precursor",
  "Comparing historical data",
  "Checking emerging trends",
];

// ─── Subcomponents ────────────────────────────────────────────────────────────

function AnnotatedText({ text, highlights }: { text: string; highlights: { phrase: string; type: string }[] }) {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const typeConfig: Record<string, { cls: string; label: string }> = {
    hazard: { cls: "highlight-hazard", label: "Hazard / Activity" },
    control: { cls: "highlight-control", label: "Missing Critical Control" },
    evidence: { cls: "highlight-evidence", label: "SIF Evidence" },
    activity: { cls: "highlight-activity", label: "Hazardous Activity" },
  };

  let result = text;
  const parts: { text: string; type?: string; phrase?: string }[] = [];

  // Simple segmentation
  let remaining = text;
  const sorted = [...highlights].sort((a, b) => {
    const ia = remaining.indexOf(a.phrase);
    const ib = remaining.indexOf(b.phrase);
    return ia - ib;
  });

  let cursor = 0;
  const chars = text;
  const used: { start: number; end: number; type: string; phrase: string }[] = [];

  for (const h of sorted) {
    const idx = chars.indexOf(h.phrase, 0);
    if (idx !== -1) {
      used.push({ start: idx, end: idx + h.phrase.length, type: h.type, phrase: h.phrase });
    }
  }

  used.sort((a, b) => a.start - b.start);

  let pos = 0;
  const segments: { text: string; type?: string; phrase?: string }[] = [];
  for (const u of used) {
    if (u.start > pos) {
      segments.push({ text: chars.slice(pos, u.start) });
    }
    segments.push({ text: u.phrase, type: u.type, phrase: u.phrase });
    pos = u.end;
  }
  if (pos < chars.length) {
    segments.push({ text: chars.slice(pos) });
  }

  return (
    <p className="font-body text-[13.5px] leading-relaxed text-[#94a3b8]">
      {segments.map((seg, i) => {
        if (!seg.type) return <span key={i}>{seg.text}</span>;
        const cfg = typeConfig[seg.type] ?? typeConfig.evidence;
        const isActive = activeTooltip === `${i}`;
        return (
          <span key={i} className="relative inline-block">
            <span
              className={`${cfg.cls} cursor-pointer`}
              onClick={() => setActiveTooltip(isActive ? null : `${i}`)}
            >
              {seg.text}
            </span>
            {isActive && (
              <span className="absolute z-10 bottom-full left-0 mb-1 bg-[#0d1520] border border-[#1e2d3d] rounded-sm px-3 py-2 text-[11px] whitespace-nowrap shadow-lg">
                <span className="font-mono text-[#64748b] uppercase tracking-widest block text-[9px] mb-0.5">{cfg.label}</span>
                <span className="text-[#dce6f0]">Click evidence to see AI reasoning</span>
              </span>
            )}
          </span>
        );
      })}
    </p>
  );
}

function AnalysisLoader({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((s) => {
        if (s >= ANALYSIS_STEPS.length - 1) {
          clearInterval(timer);
          setTimeout(() => { setDone(true); setTimeout(onDone, 600); }, 300);
          return s;
        }
        return s + 1;
      });
    }, 420);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-6 p-8">
      {!done ? (
        <>
          <div className="font-mono text-[10px] tracking-widest text-[#64748b] uppercase">
            Analysing Report...
          </div>
          <div className="w-full max-w-xs flex flex-col gap-3">
            {ANALYSIS_STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                  i < step ? "bg-[#16a34a]" : i === step ? "bg-[#2563eb]" : "bg-[#1e2d3d]"
                }`}>
                  {i < step ? (
                    <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                      <path d="M1.5 4.5l2 2L7.5 2" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <div className={`w-1.5 h-1.5 rounded-full ${i === step ? "bg-white pulse-critical" : "bg-[#374151]"}`} />
                  )}
                </div>
                <span className={`font-mono text-[11px] transition-colors ${
                  i < step ? "text-[#4ade80]" : i === step ? "text-[#93c5fd]" : "text-[#374151]"
                }`}>
                  {s}
                  {i < step && <span className="ml-2 text-[#374151]">✓</span>}
                </span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center">
          <div className="w-10 h-10 rounded-full bg-[rgba(22,163,74,0.15)] border border-[rgba(22,163,74,0.4)] flex items-center justify-center mx-auto mb-3">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8l3.5 3.5L13 4" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="font-display text-base font-700 tracking-widest text-[#4ade80] uppercase">
            SIF Intelligence Ready
          </div>
        </div>
      )}
    </div>
  );
}

function SIFChainClickable({ scenario }: { scenario: Scenario }) {
  const [expanded, setExpanded] = useState<number | null>(null);

  const nodes = [
    {
      label: "Evidence",
      value: `"${scenario.evidence[0]?.replace(/"/g, "")}"`,
      detail: `NLP extracted ${scenario.evidence.length} evidence phrases from the report text. Each is grounded in the actual words of the safety officer.`,
      color: "#06b6d4",
    },
    {
      label: "Hazard",
      value: scenario.hazard,
      detail: `Hazard classification matched against SIF-SHIELD safety knowledge base. ${scenario.hazard} is a recognized high-severity hazard category.`,
      color: "#ea580c",
    },
    {
      label: "Control Gap",
      value: scenario.controlGap ? `${scenario.controlGap} — ${scenario.sifPrecursor.includes("No critical") ? "NO GAP IDENTIFIED" : "NOT VERIFIED"}` : "No critical control gap identified",
      detail: scenario.controlGap ? `${scenario.controlGap} is a critical control considered by the prototype rule base. The analysis response reports whether it was verified.` : "No explicit critical control gap was identified in the submitted report.",
      color: scenario.controlGap ? "#dc2626" : "#16a34a",
    },
    {
      label: "SIF Precursor",
      value: scenario.sifPrecursor,
      detail: scenario.sifPrecursor.includes("No critical")
        ? "No critical SIF precursor was identified by the prototype screening logic. Human safety review is still required."
        : "A SIF precursor is a condition where a critical control may have failed and the potential consequence could include serious injury or fatality. This is a screening result, not a prediction.",
      color: scenario.sifPrecursor.includes("No critical") ? "#16a34a" : "#dc2626",
    },
    {
      label: "Consequence",
      value: scenario.consequence,
      detail: "Potential consequence based on hazard type and control gap. This is a potential outcome — not a prediction. Actual severity depends on many contextual factors.",
      color: "#dc2626",
    },
    {
      label: "Action",
      value: scenario.action[0],
      detail: `${scenario.action.length} recommended actions generated from SIF-SHIELD knowledge base. Actions are decision-support — not autonomous safety instructions.`,
      color: "#16a34a",
    },
  ];

  return (
    <div className="panel p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="font-mono text-[10px] tracking-widest text-[#64748b] uppercase mb-0.5">
            Why This Report Matters
          </div>
          <div className="font-display text-xl font-700 tracking-wide text-[#dce6f0] uppercase">
            The SIF Chain
          </div>
        </div>
        <div className="font-mono text-[10px] text-[#374151]">Click any node to see AI reasoning</div>
      </div>

      <div className="flex flex-col gap-0">
        {nodes.map((node, i) => (
          <div key={node.label}>
            <div
              className="flex gap-4 cursor-pointer group"
              onClick={() => setExpanded(expanded === i ? null : i)}
            >
              {/* Connector line */}
              <div className="flex flex-col items-center flex-shrink-0 w-6">
                <div className="w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 mt-1 transition-all"
                  style={{
                    borderColor: node.color,
                    background: expanded === i ? node.color : `${node.color}22`,
                  }}>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: expanded === i ? "#fff" : node.color }} />
                </div>
                {i < nodes.length - 1 && (
                  <div className="w-px flex-1 mt-1" style={{ background: `${node.color}33`, minHeight: "20px" }} />
                )}
              </div>

              {/* Content */}
              <div className={`flex-1 pb-3 border-b border-[#1e2d3d] last:border-0 last:pb-0 transition-all`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-mono text-[9px] tracking-widest text-[#64748b] uppercase">{node.label}</div>
                    <div className="font-display text-sm font-600 leading-snug mt-0.5 group-hover:brightness-110 transition-all"
                      style={{ color: node.color }}>
                      {node.value}
                    </div>
                  </div>
                  <svg
                    className={`w-3 h-3 flex-shrink-0 ml-3 transition-transform text-[#374151]`}
                    style={{ transform: expanded === i ? "rotate(180deg)" : "rotate(0deg)" }}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                {expanded === i && (
                  <div className="mt-2 p-3 rounded-sm text-[12px] text-[#94a3b8] leading-relaxed"
                    style={{ background: `${node.color}0d`, border: `1px solid ${node.color}30` }}>
                    {node.detail}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ControlGapPanel({ scenario }: { scenario: Scenario }) {
  return (
    <div className="border border-[rgba(220,38,38,0.35)] rounded-sm overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-3 bg-[rgba(220,38,38,0.08)]">
        <div className="w-1.5 h-1.5 rounded-full bg-[#dc2626] pulse-critical" />
        <span className="font-display text-lg font-700 tracking-widest text-[#f87171] uppercase">
          Control Gap Detected
        </span>
      </div>
      <div className="p-5 grid grid-cols-2 gap-4">
        {[
          { label: "Hazard", value: scenario.hazard, color: "#ea580c" },
          { label: "Required Control", value: scenario.controlGap, color: "#d97706" },
          { label: "Evidence", value: scenario.evidence[0]?.replace(/"/g, ""), color: "#06b6d4", mono: true },
          { label: "Status", value: scenario.controlGap ? "✕ NOT VERIFIED" : "✓ NO GAP IDENTIFIED", color: scenario.controlGap ? "#dc2626" : "#16a34a", bold: true },
          { label: "Severity", value: scenario.riskScore >= 76 ? "CRITICAL" : scenario.riskScore >= 51 ? "HIGH" : scenario.riskScore >= 26 ? "MEDIUM" : "LOW", color: scenario.riskScore >= 76 ? "#dc2626" : scenario.riskScore >= 51 ? "#ea580c" : scenario.riskScore >= 26 ? "#d97706" : "#16a34a" },
          { label: "Potential Consequence", value: scenario.consequence, color: "#f87171" },
        ].map((item) => (
          <div key={item.label} className="panel-inset p-3">
            <div className="font-mono text-[10px] tracking-widest text-[#64748b] uppercase mb-1">{item.label}</div>
            <div
              className={`text-[13px] leading-snug ${item.mono ? "font-mono text-[12px]" : "font-500"} ${item.bold ? "font-display font-700 text-base" : ""}`}
              style={{ color: item.color }}
            >
              {item.value}
            </div>
          </div>
        ))}
        <div className="col-span-2 panel-inset p-3">
          <div className="font-mono text-[10px] tracking-widest text-[#64748b] uppercase mb-1">Recommended Action</div>
          <div className="text-[13px] text-[#dce6f0]">{scenario.action[0]}</div>
        </div>
      </div>
    </div>
  );
}

function RiskBreakdown({ scenario, result }: { scenario: Scenario; result: AnalysisResult }) {
  const breakdown = RISK_BREAKDOWN(result);
  const [counted, setCounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setCounted(true), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="panel p-5">
      <div className="font-mono text-[10px] tracking-widest text-[#64748b] uppercase mb-3">Risk Prioritization</div>
      <div className="flex items-baseline gap-2 mb-1">
        <span className="font-display text-5xl font-800 text-[#f87171] leading-none">{scenario.riskScore}</span>
        <span className="font-display text-xl text-[#64748b]">/ 100</span>
        <span className={`status-badge ml-2 ${result.risk_level === "CRITICAL" ? "bg-[rgba(220,38,38,0.15)] border border-[rgba(220,38,38,0.4)] text-[#f87171]" : result.risk_level === "HIGH" ? "bg-[rgba(234,88,12,0.15)] border border-[rgba(234,88,12,0.4)] text-[#fb923c]" : "bg-[rgba(22,163,74,0.12)] border border-[rgba(22,163,74,0.35)] text-[#4ade80]"}`}>{result.risk_level}</span>
      </div>
      <div ref={ref} className="flex flex-col gap-2.5 mt-4">
        {breakdown.map((f) => (
          <div key={f.label}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[12px] text-[#94a3b8]">{f.label}</span>
              <span className="font-mono text-[11px]" style={{ color: f.color }}>
                {counted ? f.value : 0} / {f.max}
              </span>
            </div>
            <div className="h-1.5 bg-[#1e2d3d] rounded-sm overflow-hidden">
              <div
                className="h-full rounded-sm transition-all duration-700"
                style={{
                  width: counted ? `${(f.value / f.max) * 100}%` : "0%",
                  background: f.color,
                  opacity: 0.85,
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 text-[11px] text-[#4b5563]">
        Screening score for prioritization — not an accident prediction. Severity and probability are assessed independently.
      </div>
    </div>
  );
}

function HistoricalSimilarity({ scenario, onSimilar }: { scenario: Scenario; onSimilar: () => void }) {
  return (
    <div className="panel p-5">
      <div className="font-mono text-[10px] tracking-widest text-[#64748b] uppercase mb-1">Has This Happened Before?</div>
      <div className="font-display text-lg font-700 tracking-wide text-[#dce6f0] uppercase mb-3">
        {scenario.historical.length} Similar Historical Reports Found
      </div>
      <div className="flex flex-col gap-2">
        {scenario.historical.map((h, i) => (
          <div key={i} className="flex items-center gap-4 p-3 panel-inset hover:border-[#2d3d50] cursor-pointer transition-all">
            <div className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center" style={{
              background: `conic-gradient(#06b6d4 ${h.pct * 3.6}deg, #1e2d3d 0)`,
            }}>
              <div className="w-8 h-8 rounded-full bg-[#0d1520] flex items-center justify-center">
                <span className="font-display text-sm font-700 text-[#67e8f9]">{h.pct}%</span>
              </div>
            </div>
            <div className="flex-1">
              <div className="text-[13px] text-[#dce6f0] font-500">{h.hazard}</div>
              <div className="text-[11px] text-[#fb923c]">{h.gap}</div>
              <div className="font-mono text-[10px] text-[#64748b]">{h.date} · {h.dept}</div>
            </div>
          </div>
        ))}
      </div>
      <button onClick={onSimilar} className="mt-3 font-mono text-[10px] tracking-wide text-[#67e8f9] hover:text-[#06b6d4] transition-colors">
        View all similar reports →
      </button>
    </div>
  );
}

function RecurrenceChart({ scenario }: { scenario: Scenario }) {
  const last = scenario.trend[scenario.trend.length - 1];
  const first = scenario.trend[0];
  const rising = last.count > first.count;

  const CustomTip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="panel p-2 text-[11px]">
        <div className="font-mono text-[#64748b]">{label}</div>
        <div style={{ color: "#ea580c" }}>{payload[0].value} reports</div>
      </div>
    );
  };

  return (
    <div className="panel p-5">
      <div className="font-mono text-[10px] tracking-widest text-[#64748b] uppercase mb-1">Recurring Control Failure</div>
      <div className="font-display text-base font-700 text-[#dce6f0] uppercase mb-3">{scenario.trendControl}</div>

      <div className="demo-tag mb-3 inline-block">Illustrative prototype data</div>

      <ResponsiveContainer width="100%" height={120}>
        <AreaChart data={scenario.trend} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="recGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ea580c" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#ea580c" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#1e2d3d" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#64748b", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTip />} />
          <Area type="monotone" dataKey="count" stroke="#ea580c" fill="url(#recGrad)" strokeWidth={2} dot={{ fill: "#ea580c", r: 3 }} />
        </AreaChart>
      </ResponsiveContainer>

      {rising && (
        <div className="mt-3 flex items-start gap-2 p-3 bg-[rgba(217,119,6,0.08)] border border-[rgba(217,119,6,0.25)] rounded-sm">
          <span className="text-[#d97706] flex-shrink-0 mt-0.5">↑</span>
          <div>
            <div className="font-mono text-[10px] tracking-widest text-[#d97706] uppercase">Recurrence Detected</div>
            <div className="text-[12px] text-[#94a3b8] mt-0.5">
              Repeated control failure may indicate an emerging systemic risk. Review and intervention recommended.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function WhyAI({ scenario }: { scenario: Scenario }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="panel overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-[rgba(255,255,255,0.02)] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-5 bg-[#06b6d4] rounded-full" />
          <div>
            <div className="font-display text-base font-700 tracking-wide text-[#dce6f0] uppercase text-left">
              Why Did SIF-SHIELD Flag This?
            </div>
            <div className="font-mono text-[10px] text-[#64748b] text-left">Explainable AI — evidence-linked detection</div>
          </div>
        </div>
        <svg className={`w-4 h-4 text-[#64748b] transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="border-t border-[#1e2d3d] px-5 py-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="font-mono text-[10px] tracking-widest text-[#64748b] uppercase mb-2">AI Reasoning Chain</div>
              {[
                { step: "Text Evidence", value: scenario.evidence[0] ?? "", color: "#06b6d4" },
                { step: "Context", value: scenario.hazard, color: "#ea580c" },
                { step: "Safety Knowledge", value: `${scenario.controlGap} is a critical control`, color: "#d97706" },
                { step: "Decision", value: scenario.sifPrecursor, color: scenario.sifPrecursor.includes("No critical") ? "#16a34a" : "#dc2626" },
              ].map((row, i, arr) => (
                <div key={row.step} className="flex flex-col">
                  <div className="p-2.5 rounded-sm" style={{ background: `${row.color}10`, borderLeft: `2px solid ${row.color}55` }}>
                    <div className="font-mono text-[9px] tracking-widest text-[#64748b] uppercase">{row.step}</div>
                    <div className="font-mono text-[11px] mt-0.5" style={{ color: row.color }}>{row.value}</div>
                  </div>
                  {i < arr.length - 1 && (
                    <div className="flex items-center py-0.5 pl-3">
                      <div className="w-px h-3 bg-[#1e2d3d]" />
                      <svg width="8" height="8" viewBox="0 0 8 8" className="ml-[-0.5px]">
                        <polygon points="4,8 0,0 8,0" fill="#374151" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div>
              <div className="font-mono text-[10px] tracking-widest text-[#64748b] uppercase mb-2">Evidence Detected</div>
              {scenario.evidence.map((e) => (
                <div key={e} className="flex items-start gap-2 mb-2">
                  <div className="w-1 h-1 rounded-full bg-[#06b6d4] mt-1.5 flex-shrink-0" />
                  <span className="font-mono text-[11px] text-[#67e8f9]">{e}</span>
                </div>
              ))}
              <div className="mt-4">
                <div className="font-mono text-[10px] tracking-widest text-[#64748b] uppercase mb-2">Why Flagged</div>
                {scenario.whyFlagged.map((w) => (
                  <div key={w} className="flex items-start gap-2 mb-1.5">
                    <span className="text-[#16a34a] text-[11px] mt-0.5">✓</span>
                    <span className="text-[12px] text-[#94a3b8]">{w}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-[rgba(6,182,212,0.06)] border border-[rgba(6,182,212,0.2)] rounded-sm p-3 flex items-center justify-between">
            <div className="flex gap-6">
              {[
                { label: "AI Confidence", value: `${Math.round((resultScenario.confidence ?? 0.94) * 100)}%` },
                { label: "Rule Match", value: "Prototype knowledge base" },
                { label: "Model", value: "Groq NLP + risk engine" },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div className="font-mono text-[9px] text-[#4b5563] uppercase">{label}</div>
                  <div className="font-mono text-[12px] text-[#67e8f9]">{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InterventionPanel({ scenario }: { scenario: Scenario }) {
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  const items = [
    { priority: "IMMEDIATE", color: "#dc2626", action: scenario.action[0] },
    { priority: "CONTROL", color: "#ea580c", action: scenario.action[1] },
    { priority: "MANAGEMENT", color: "#d97706", action: scenario.action[2] },
    { priority: "FOLLOW-UP", color: "#16a34a", action: scenario.action[3] ?? "Validate corrective action and close." },
  ];

  return (
    <div className="panel p-5">
      <div className="font-mono text-[10px] tracking-widest text-[#64748b] uppercase mb-3">Recommended Intervention</div>
      <div className="flex flex-col gap-2 mb-4">
        {items.map((item, i) => (
          <div
            key={item.priority}
            onClick={() => setChecked((s) => ({ ...s, [i]: !s[i] }))}
            className={`flex items-center gap-3 p-3 rounded-sm cursor-pointer transition-all border ${
              checked[i] ? "opacity-50" : "hover:border-[#2d3d50]"
            } border-[#1e2d3d]`}
          >
            <div
              className="flex-shrink-0 px-2 py-0.5 rounded-sm font-mono text-[9px] font-700 tracking-widest"
              style={{ background: `${item.color}18`, border: `1px solid ${item.color}44`, color: item.color }}
            >
              {item.priority}
            </div>
            <span className={`text-[13px] flex-1 ${checked[i] ? "line-through" : "text-[#94a3b8]"}`}>{item.action}</span>
            <div
              className={`w-4 h-4 rounded-sm border flex items-center justify-center flex-shrink-0 transition-all`}
              style={{ borderColor: checked[i] ? item.color : "#374151", background: checked[i] ? item.color : "transparent" }}
            >
              {checked[i] && (
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <path d="M1.5 4l2 2 3-3.5" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2 flex-wrap">
        <button className="font-display text-[11px] font-700 tracking-wide px-3 py-1.5 bg-[#dc2626] text-white rounded-sm hover:bg-[#b91c1c] transition-colors uppercase">
          Assign Corrective Action
        </button>
        <button className="font-display text-[11px] font-700 tracking-wide px-3 py-1.5 border border-[rgba(220,38,38,0.4)] text-[#f87171] rounded-sm hover:bg-[rgba(220,38,38,0.1)] transition-colors uppercase">
          Escalate
        </button>
        <button className="font-display text-[11px] font-700 tracking-wide px-3 py-1.5 border border-[rgba(22,163,74,0.4)] text-[#4ade80] rounded-sm hover:bg-[rgba(22,163,74,0.1)] transition-colors uppercase">
          Mark Control Verified
        </button>
      </div>
    </div>
  );
}

function HumanValidation() {
  const [state, setState] = useState<"pending" | "confirmed" | "edited" | "rejected">("pending");

  return (
    <div className="border border-[#1e2d3d] rounded-sm p-5">
      <div className="font-mono text-[10px] tracking-widest text-[#64748b] uppercase mb-3">
        Safety Officer Validation
      </div>
      <div className="flex items-center gap-6 mb-4">
        <div>
          <div className="font-mono text-[9px] text-[#4b5563] uppercase">Model Decision</div>
          <div className="text-[13px] text-[#f87171] font-500 mt-0.5">Potential SIF precursor</div>
        </div>
        <div className="w-px h-8 bg-[#1e2d3d]" />
        <div>
          <div className="font-mono text-[9px] text-[#4b5563] uppercase">Safety Officer</div>
          <div className={`text-[13px] font-500 mt-0.5 ${
            state === "pending" ? "text-[#64748b]" :
            state === "confirmed" ? "text-[#4ade80]" :
            state === "edited" ? "text-[#93c5fd]" : "text-[#f87171]"
          }`}>
            {state === "pending" ? "Pending validation" :
             state === "confirmed" ? "Validated by Safety Officer" :
             state === "edited" ? "Correction recorded" : "Detection rejected"}
          </div>
        </div>
      </div>

      {state === "pending" ? (
        <>
          <div className="font-mono text-[12px] text-[#64748b] mb-3">
            Do you agree with this SIF classification?
          </div>
          <div className="flex gap-2">
            {[
              { label: "✓ Confirm", action: () => setState("confirmed"), color: "#16a34a", bg: "rgba(22,163,74,0.1)", border: "rgba(22,163,74,0.3)" },
              { label: "✎ Edit", action: () => setState("edited"), color: "#93c5fd", bg: "rgba(37,99,235,0.1)", border: "rgba(37,99,235,0.3)" },
              { label: "✕ Reject", action: () => setState("rejected"), color: "#f87171", bg: "rgba(220,38,38,0.1)", border: "rgba(220,38,38,0.3)" },
            ].map((btn) => (
              <button
                key={btn.label}
                onClick={btn.action}
                className="font-display text-sm font-600 tracking-wide px-4 py-2 rounded-sm uppercase transition-all"
                style={{ background: btn.bg, border: `1px solid ${btn.border}`, color: btn.color }}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="p-3 rounded-sm bg-[rgba(255,255,255,0.02)] border border-[#1e2d3d]">
          <div className="font-mono text-[11px] text-[#64748b]">
            {state === "confirmed"
              ? "Human validation recorded · AI detection confirmed · Feedback will improve future model accuracy."
              : state === "edited"
              ? "Correction recorded · Updated classification submitted · Model will incorporate feedback."
              : "Detection rejected · Feedback recorded · Model will adjust for this case."}
          </div>
          <button onClick={() => setState("pending")} className="font-mono text-[10px] text-[#374151] mt-2 hover:text-[#64748b]">
            Reset
          </button>
        </div>
      )}
    </div>
  );
}

function NoSIFState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="w-12 h-12 rounded-full border border-[rgba(22,163,74,0.4)] flex items-center justify-center">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 2L3 7v8l7 3 7-3V7L10 2z" stroke="#16a34a" strokeWidth="1.2" strokeLinejoin="round" />
          <path d="M7 10l2 2 4-4" stroke="#16a34a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div>
        <div className="font-display text-lg font-700 tracking-wide text-[#4ade80] uppercase">No SIF Precursor Detected</div>
        <div className="text-[13px] text-[#64748b] mt-1 max-w-xs leading-relaxed">
          No critical SIF indicators were identified in this report. Safety review is still recommended. Not all incidents are SIF precursors.
        </div>
      </div>
      <div className="text-[11px] text-[#374151] font-mono">
        SIF-SHIELD does not determine that a situation is 100% safe. Human review is always required.
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

type Phase = "input" | "loading" | "result";

export default function ReportAnalysis({ initialReport = "", onSimilar }: { initialReport?: string; onSimilar: () => void }) {
  const [phase, setPhase] = useState<Phase>("input");
  const [reportText, setReportText] = useState("");
  const [activeScenario, setActiveScenario] = useState<Scenario | null>(null);
  const [resultScenario, setResultScenario] = useState<Scenario | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");
  const [apiDone, setApiDone] = useState(false);
  const [loaderDone, setLoaderDone] = useState(false);

  const loadDemo = (key: string) => {
    const sc = SCENARIOS[key];
    setActiveScenario(sc);
    setReportText(sc.report);
    setError("");
  };

  const analyse = async () => {
    const report = reportText.trim();
    if (!report) {
      setError("Please enter a valid safety report.");
      return;
    }

    setError("");
    setResultScenario(null);
    setAnalysisResult(null);
    setApiDone(false);
    setLoaderDone(false);
    setPhase("loading");

    try {
      const result = await analyzeReport(report);
      setAnalysisResult(result);
      setResultScenario(resultToScenario(result, report));
      setApiDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to connect to the SIF-SHIELD analysis engine.");
      setPhase("input");
    }
  };

  const onAnalysisDone = () => setLoaderDone(true);

  useEffect(() => {
    if (initialReport) {
      setReportText(initialReport);
      setActiveScenario(null);
      setPhase("input");
    }
  }, [initialReport]);

  useEffect(() => {
    if (phase === "loading" && apiDone && loaderDone && resultScenario) {
      setPhase("result");
    }
  }, [apiDone, loaderDone, phase, resultScenario]);

  const highlights = resultScenario
    ? resultScenario.evidence
        .map((e, i) => ({ phrase: e.replace(/"/g, ""), type: i === 0 ? "control" : i === 1 ? "hazard" : "evidence" }))
        .filter((h) => h.phrase && resultScenario.report.toLowerCase().includes(h.phrase.toLowerCase()))
    : [];

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-[#1e2d3d] flex-shrink-0">
        <div className="flex items-center gap-3">
          {resultScenario && phase === "result" && (
            <div className="w-2 h-2 rounded-full bg-[#dc2626] pulse-critical" />
          )}
          <span className="font-display text-lg font-700 tracking-wide text-[#dce6f0] uppercase">
            Report Analysis — SIF Decision
          </span>
        </div>
        <div className="flex items-center gap-3">
          {phase === "result" && resultScenario && analysisResult && (
            <span className={`status-badge ${analysisResult.sif_precursor ? "bg-[rgba(220,38,38,0.15)] border border-[rgba(220,38,38,0.4)] text-[#f87171]" : "bg-[rgba(22,163,74,0.12)] border border-[rgba(22,163,74,0.35)] text-[#4ade80]"}`}>
              {analysisResult.sif_precursor ? "SIF Precursor Detected" : "No SIF Precursor Detected"}
            </span>
          )}
          {phase !== "input" && (
            <button
              onClick={() => { setPhase("input"); setResultScenario(null); setAnalysisResult(null); setActiveScenario(null); setReportText(""); setError(""); }}
              className="font-mono text-[10px] tracking-wide text-[#64748b] border border-[#1e2d3d] px-3 py-1.5 rounded-sm hover:border-[#2d3d50] transition-colors"
            >
              ← New Report
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-hidden grid grid-cols-[1fr_400px]">
        {/* LEFT — Report input / annotated text */}
        <div className="overflow-auto p-6 border-r border-[#1e2d3d] flex flex-col gap-5">
          {phase === "input" && (
            <>
              <div>
                <div className="font-mono text-[10px] tracking-widest text-[#64748b] uppercase mb-1">Analyse Safety Report</div>
                <p className="text-[#64748b] text-sm">Paste or type a safety report below. SIF-SHIELD will extract evidence, identify the hazard, detect the control gap, and screen for SIF precursors.</p>
              </div>

              {/* Demo scenario buttons */}
              <div className="flex gap-2">
                {Object.values(SCENARIOS).map((sc) => (
                  <button
                    key={sc.id}
                    onClick={() => loadDemo(sc.id)}
                    className={`font-mono text-[10px] tracking-wide px-3 py-2 rounded-sm border transition-all ${
                      activeScenario?.id === sc.id
                        ? "bg-[rgba(37,99,235,0.15)] border-[rgba(37,99,235,0.4)] text-[#93c5fd]"
                        : "border-[#1e2d3d] text-[#64748b] hover:border-[#2d3d50] hover:text-[#94a3b8]"
                    }`}
                  >
                    {sc.label}
                  </button>
                ))}
              </div>

              {error && (
                <div className="p-3 rounded-sm border border-[rgba(220,38,38,0.35)] bg-[rgba(220,38,38,0.08)] text-[12px] text-[#f87171]">
                  {error.includes("connect") || error.includes("fetch") || error.includes("Failed")
                    ? "Unable to connect to SIF-SHIELD analysis engine. Please make sure the FastAPI backend is running."
                    : error}
                </div>
              )}

              {/* Text area */}
              <div className="flex flex-col gap-2 flex-1">
                <textarea
                  value={reportText}
                  onChange={(e) => { setReportText(e.target.value); setActiveScenario(null); }}
                  placeholder="Paste safety report here — near miss, unsafe act, unsafe condition, incident..."
                  className="flex-1 w-full panel-inset p-4 text-[13.5px] text-[#94a3b8] leading-relaxed resize-none focus:outline-none focus:border-[#2563eb] border border-[#1e2d3d] rounded-sm bg-[#0d1520] placeholder-[#374151] min-h-[180px]"
                />
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-[#374151]">
                    Supported: Near Miss · Unsafe Act · Unsafe Condition · Incident · Corrective Action
                  </span>
                  <button
                    onClick={analyse}
                    disabled={!reportText.trim()}
                    className="font-display text-sm font-700 tracking-widest px-5 py-2.5 bg-[#2563eb] text-white rounded-sm uppercase hover:bg-[#1d4ed8] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Analyse Report →
                  </button>
                </div>
              </div>
            </>
          )}

          {phase === "loading" && <AnalysisLoader onDone={onAnalysisDone} />}

          {phase === "result" && resultScenario && (
            <>
              {/* Annotated report */}
              <div className="panel p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-mono text-[10px] tracking-widest text-[#64748b] uppercase">Original Safety Report</div>
                  <div className="demo-tag">AI-Highlighted Evidence</div>
                </div>
                <AnnotatedText
                  text={resultScenario.report}
                  highlights={highlights}
                />
                <div className="mt-4 p-3 panel-inset">
                  <div className="font-mono text-[10px] tracking-widest text-[#64748b] uppercase mb-2">Evidence Classification</div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
                    {[
                      { cls: "highlight-hazard", label: "Hazard / Activity" },
                      { cls: "highlight-control", label: "Missing Critical Control" },
                      { cls: "highlight-evidence", label: "SIF Evidence" },
                    ].map(({ cls, label }) => (
                      <div key={label} className="flex items-center gap-2">
                        <span className={cls} style={{ fontSize: "11px" }}>sample</span>
                        <span className="text-[11px] text-[#64748b]">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Control gap */}
              <ControlGapPanel scenario={resultScenario} />

              {/* Why AI */}
              <WhyAI scenario={resultScenario} />

              {/* Historical */}
              <HistoricalSimilarity scenario={resultScenario} onSimilar={onSimilar} />

              {/* Recurrence */}
              <RecurrenceChart scenario={resultScenario} />

              {/* Intervention */}
              <InterventionPanel scenario={resultScenario} />

              {/* Human validation */}
              <HumanValidation />
            </>
          )}
        </div>

        {/* RIGHT — SIF intelligence panel */}
        <div className="overflow-auto p-5 flex flex-col gap-5">
          {phase === "input" && (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center p-6">
              <div className="w-16 h-16 rounded-full border border-[#1e2d3d] flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <path d="M14 2L3 8v10c0 5.9 4.7 11.4 11 12.8C20.3 29.4 25 23.9 25 18V8L14 2z" stroke="#2563eb" strokeWidth="1.2" strokeLinejoin="round" />
                  <circle cx="14" cy="15" r="4" stroke="#2563eb" strokeWidth="1" opacity="0.5" />
                  <path d="M14 11v2.5M14 16.5V17" stroke="#06b6d4" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <div className="font-display text-lg font-700 tracking-wide text-[#dce6f0] uppercase">SIF Intelligence</div>
                <div className="text-[12px] text-[#4b5563] mt-1 leading-relaxed">
                  Submit a report to see SIF precursor detection, control gap analysis, evidence chain, historical similarity, and recommended intervention.
                </div>
              </div>
              <div className="w-full text-left mt-4 p-4 panel-inset">
                <div className="font-mono text-[10px] tracking-widest text-[#374151] uppercase mb-2">This screen answers:</div>
                {[
                  { q: "WHAT?", a: "SIF precursor detected." },
                  { q: "WHY?", a: "Evidence + hazard + control gap." },
                  { q: "SO WHAT?", a: "Potential severe consequence." },
                  { q: "NOW WHAT?", a: "Recommended intervention." },
                  { q: "HAPPENED BEFORE?", a: "Historical similarity." },
                  { q: "GETTING WORSE?", a: "Emerging-risk analysis." },
                ].map(({ q, a }) => (
                  <div key={q} className="flex items-start gap-3 mb-1.5">
                    <span className="font-mono text-[10px] tracking-widest text-[#2563eb] w-28 flex-shrink-0">{q}</span>
                    <span className="text-[11px] text-[#4b5563]">{a}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {phase === "loading" && (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center">
              <div className="font-mono text-[10px] tracking-widest text-[#374151] uppercase">AI Engine</div>
              <div className="w-12 h-12 rounded-full border border-[#1e2d3d] flex items-center justify-center">
                <div className="w-4 h-4 rounded-full border-2 border-[#2563eb] border-t-transparent animate-spin" />
              </div>
              <div className="font-mono text-[11px] text-[#374151]">Processing...</div>
            </div>
          )}

          {phase === "result" && resultScenario && analysisResult && (
            <>
              {analysisResult.sif_precursor ? (
                <div className="bg-[rgba(220,38,38,0.08)] border border-[rgba(220,38,38,0.3)] rounded-sm p-5 text-center">
                  <div className="w-10 h-10 rounded-full border-2 border-[#dc2626] mx-auto mb-3 flex items-center justify-center pulse-critical">
                    <div className="w-3 h-3 rounded-full bg-[#dc2626]" />
                  </div>
                  <div className="font-display text-lg font-700 tracking-widest text-[#f87171] uppercase mb-0.5">SIF Precursor Detected</div>
                  <div className="font-mono text-[10px] text-[#64748b]">Potential Serious Injury or Fatality precursor</div>
                </div>
              ) : <NoSIFState />}

              <RiskBreakdown scenario={resultScenario} result={analysisResult} />
              <SIFChainClickable scenario={resultScenario} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
