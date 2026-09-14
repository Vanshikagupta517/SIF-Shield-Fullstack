import { useState, type ReactNode } from "react";
import CommandCentre from "./views/CommandCentre";
import ReportAnalysis from "./views/ReportAnalysis";
import SimilarRisks from "./views/SimilarRisks";
import EmergingRisk from "./views/EmergingRisk";
import RiskLandscape from "./views/RiskLandscape";
import ReportUpload from "./views/ReportUpload";
import ExecutiveDashboard from "./views/ExecutiveDashboard";
import ModelIntelligence from "./views/ModelIntelligence";
import KnowledgeGraph from "./views/KnowledgeGraph";
import ControlGaps from "./views/ControlGaps";
import FutureScale from "./views/FutureScale";

type View =
  | "command-centre"
  | "report-analysis"
  | "similar-risks"
  | "emerging-risk"
  | "risk-landscape"
  | "report-upload"
  | "executive"
  | "model-intelligence"
  | "knowledge-graph"
  | "control-gaps"
  | "future-scale";

interface NavItem {
  id: View;
  label: string;
  icon: ReactNode;
  group?: string;
}

const NAV: NavItem[] = [
  {
    id: "command-centre",
    label: "Command Centre",
    group: "Operations",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <rect x="1" y="1" width="5" height="5" rx="0.5" stroke="currentColor" strokeWidth="1.1" />
        <rect x="8" y="1" width="5" height="5" rx="0.5" stroke="currentColor" strokeWidth="1.1" />
        <rect x="1" y="8" width="5" height="5" rx="0.5" stroke="currentColor" strokeWidth="1.1" />
        <rect x="8" y="8" width="5" height="5" rx="0.5" stroke="currentColor" strokeWidth="1.1" />
      </svg>
    ),
  },
  {
    id: "report-analysis",
    label: "Report Analysis",
    group: "Operations",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M2 2h10v10H2z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
        <path d="M4.5 7l2 2 3-3.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "control-gaps",
    label: "Control Gaps",
    group: "Operations",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.1" />
        <path d="M5 7h4M7 5v4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "similar-risks",
    label: "Historical Patterns",
    group: "Intelligence",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="4.5" cy="4.5" r="3" stroke="currentColor" strokeWidth="1.1" />
        <circle cx="9.5" cy="9.5" r="3" stroke="currentColor" strokeWidth="1.1" />
        <path d="M7 7l0.5 0.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "emerging-risk",
    label: "Emerging Risks",
    group: "Intelligence",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M2 10l3-4 3 2 4-6" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10 3h2v2" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "risk-landscape",
    label: "Risk Landscape",
    group: "Intelligence",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        {[0, 5, 10].flatMap((x) => [0, 5, 10].map((y) => (
          <rect key={`${x}-${y}`} x={1 + x} y={1 + y} width="3" height="3" rx="0.3" fill="currentColor" opacity={(x + y) % 10 === 0 ? 1 : 0.4} />
        )))}
      </svg>
    ),
  },
  {
    id: "knowledge-graph",
    label: "Knowledge Graph",
    group: "Intelligence",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="3" r="1.5" stroke="currentColor" strokeWidth="1.1" />
        <circle cx="3" cy="10" r="1.5" stroke="currentColor" strokeWidth="1.1" />
        <circle cx="11" cy="10" r="1.5" stroke="currentColor" strokeWidth="1.1" />
        <path d="M7 4.5L3 8.5M7 4.5L11 8.5M3 8.5L11 8.5" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
      </svg>
    ),
  },
  {
    id: "executive",
    label: "Executive View",
    group: "Reporting",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M2 10l2.5-4 2 2 3-5 2.5 3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 12h10" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "model-intelligence",
    label: "Model Intelligence",
    group: "Reporting",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.1" />
        <circle cx="7" cy="7" r="2" stroke="currentColor" strokeWidth="1.1" opacity="0.6" />
        <circle cx="7" cy="7" r="0.8" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: "future-scale",
    label: "Future Scale",
    group: "Reporting",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M7 2v2M7 10v2M2 7h2M10 7h2" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" opacity="0.5" />
        <circle cx="7" cy="7" r="3" stroke="currentColor" strokeWidth="1.1" />
      </svg>
    ),
  },
];

function SIFShieldLogo() {
  return (
    <svg width="26" height="28" viewBox="0 0 26 28" fill="none">
      <path d="M13 1L2 5.5v9C2 21 7 27 13 28.5 19 27 24 21 24 14.5v-9L13 1z" fill="#111827" stroke="#2563eb" strokeWidth="1.1" />
      <circle cx="13" cy="13" r="4.5" stroke="#2563eb" strokeWidth="0.8" opacity="0.4" />
      <circle cx="13" cy="13" r="1.8" fill="#2563eb" />
      <path d="M13 8.5v1.5M13 16v1.5M8.5 13H10M16 13h1.5" stroke="#06b6d4" strokeWidth="0.9" strokeLinecap="round" opacity="0.65" />
    </svg>
  );
}

// Demo mode: 3 preloaded scenarios
const DEMO_SCENARIOS = [
  { id: "confined", label: "DEMO 01", sublabel: "Confined Space", view: "report-analysis" as View },
  { id: "height", label: "DEMO 02", sublabel: "Working at Height", view: "report-analysis" as View },
  { id: "electrical", label: "DEMO 03", sublabel: "Electrical / LOTO", view: "report-analysis" as View },
];

export default function App() {
  const [view, setView] = useState<View>("command-centre");
  const [demoMode, setDemoMode] = useState(false);
  const [demoScenario, setDemoScenario] = useState<string | null>(null);
  const [initialReport, setInitialReport] = useState("");

  const groups = Array.from(new Set(NAV.map((n) => n.group)));

  const navigate = (v: View) => {
    setView(v);
  };

  const renderView = () => {
    switch (view) {
      case "command-centre":
        return <CommandCentre onSelectReport={() => navigate("report-analysis")} />;
      case "report-analysis":
        return <ReportAnalysis initialReport={initialReport} onSimilar={() => navigate("similar-risks")} />;
      case "similar-risks":
        return <SimilarRisks />;
      case "emerging-risk":
        return <EmergingRisk />;
      case "risk-landscape":
        return <RiskLandscape />;
      case "report-upload":
        return <ReportUpload onAnalyse={(report) => { setInitialReport(report); navigate("report-analysis"); }} />;
      case "executive":
        return <ExecutiveDashboard />;
      case "model-intelligence":
        return <ModelIntelligence />;
      case "knowledge-graph":
        return <KnowledgeGraph />;
      case "control-gaps":
        return <ControlGaps />;
      case "future-scale":
        return <FutureScale />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0f16]">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-2.5 border-b border-[#1e2d3d] flex-shrink-0">
        <div className="flex items-center gap-3">
          <SIFShieldLogo />
          <div>
            <div className="font-display text-lg font-800 tracking-widest text-[#dce6f0] uppercase leading-none">SIF-SHIELD</div>
            <div className="font-mono text-[9px] tracking-widest text-[#2563eb] uppercase leading-tight">
              SIF Early-Warning Intelligence Platform
            </div>
          </div>
          <div className="h-6 w-px bg-[#1e2d3d] mx-1" />
          <div className="font-mono text-[10px] text-[#374151]">Oil India Limited · HSE Division</div>
        </div>

        <div className="flex items-center gap-4">
          <div className="font-mono text-[9px] tracking-widest text-[#2d3d50] uppercase hidden lg:block">
            FROM NEAR-MISS REPORTS TO NEAR-MISS PREVENTION
          </div>

          {/* Demo mode */}
          {demoMode ? (
            <div className="flex items-center gap-2">
              {DEMO_SCENARIOS.map((sc) => (
                <button
                  key={sc.id}
                  onClick={() => {
                    setDemoScenario(sc.id);
                    setView(sc.view);
                  }}
                  className={`flex flex-col items-center px-3 py-1.5 rounded-sm border transition-all ${
                    demoScenario === sc.id
                      ? "bg-[rgba(217,119,6,0.2)] border-[rgba(217,119,6,0.5)] text-[#fbbf24]"
                      : "border-[#1e2d3d] text-[#64748b] hover:border-[#d97706] hover:text-[#fbbf24]"
                  }`}
                >
                  <span className="font-mono text-[9px] tracking-widest font-700">{sc.label}</span>
                  <span className="font-mono text-[9px] text-[#64748b]">{sc.sublabel}</span>
                </button>
              ))}
              <button
                onClick={() => { setDemoMode(false); setDemoScenario(null); }}
                className="font-mono text-[10px] tracking-wide px-3 py-1.5 border border-[rgba(217,119,6,0.4)] text-[#fbbf24] rounded-sm hover:bg-[rgba(217,119,6,0.1)] transition-colors"
              >
                Exit Demo
              </button>
            </div>
          ) : (
            <button
              onClick={() => { setDemoMode(true); setView("report-analysis"); }}
              className="font-mono text-[10px] tracking-widest px-3 py-1.5 border border-[#1e2d3d] text-[#64748b] rounded-sm hover:border-[#d97706] hover:text-[#fbbf24] transition-all uppercase"
            >
              SIH Demo Mode
            </button>
          )}

          <div className="flex items-center gap-2 font-mono text-[10px] text-[#374151]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a] pulse-critical inline-block" />
            AI Engine Online
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-52 border-r border-[#1e2d3d] flex-shrink-0 flex flex-col bg-[#0a0f16] overflow-y-auto">
          <div className="flex-1 py-4 px-2">
            {groups.map((group) => (
              <div key={group} className="mb-5">
                <div className="font-mono text-[9px] tracking-widest text-[#2d3d50] uppercase px-3 mb-1.5">
                  {group}
                </div>
                {NAV.filter((n) => n.group === group).map((item) => (
                  <div
                    key={item.id}
                    className={`nav-item ${view === item.id ? "active" : ""}`}
                    onClick={() => navigate(item.id)}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="px-4 py-4 border-t border-[#1e2d3d]">
            <div className="font-mono text-[9px] leading-relaxed text-[#2d3d50]">
              Detect precursors.<br />
              Close control gaps.<br />
              Prevent SIF.
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-hidden">
          {renderView()}
        </div>
      </div>
    </div>
  );
}
