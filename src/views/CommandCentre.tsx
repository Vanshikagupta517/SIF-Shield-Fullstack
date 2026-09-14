import { useState } from "react";

const KPI_CARDS = [
  { label: "SIF Precursors", value: "7", sub: "Active · 6-month period", delta: "+2 today", color: "critical" },
  { label: "Critical Alerts", value: "3", sub: "Unresolved", delta: "Immediate action required", color: "critical" },
  { label: "Open Control Gaps", value: "14", sub: "Unverified", delta: "+5 this week", color: "high" },
  { label: "Emerging Risks", value: "2", sub: "Detected", delta: "Trending upward", color: "medium" },
];

const PIPELINE = [
  { label: "Reports Processed", count: "1,284", icon: "📄", color: "#64748b", next: "→" },
  { label: "SIF-Flagged", count: "87", icon: "⚠", color: "#dc2626", next: "→" },
  { label: "Control Gaps", count: "31", icon: "✕", color: "#ea580c", next: "→" },
  { label: "Recurring", count: "9", icon: "↺", color: "#d97706", next: "→" },
  { label: "Emerging Risks", count: "3", icon: "↑", color: "#d97706", next: null },
];

const QUEUE = [
  { score: 94, color: "critical", hazard: "Confined Space", gap: "Atmospheric Testing", location: "Maintenance Area", activity: "Maintenance", time: "14:32", status: "OPEN", id: "SIF-2024-031" },
  { score: 88, color: "critical", hazard: "Electrical / LOTO", gap: "Isolation Verification", location: "Process Unit 3", activity: "Maintenance", time: "13:51", status: "OPEN", id: "SIF-2024-032" },
  { score: 82, color: "high", hazard: "Electrical Isolation", gap: "Isolation Verification", location: "Process Unit 3", activity: "Maintenance", time: "13:15", status: "OPEN", id: "SIF-2024-030" },
  { score: 78, color: "high", hazard: "Working at Height", gap: "Fall Arrest System", location: "Flare Stack", activity: "Inspection", time: "11:48", status: "ASSIGNED", id: "SIF-2024-029" },
  { score: 65, color: "medium", hazard: "Vehicle Safety", gap: "Permit to Drive", location: "Field Road B-7", activity: "Transport", time: "10:20", status: "OPEN", id: "SIF-2024-028" },
  { score: 44, color: "low", hazard: "Line of Fire", gap: "Exclusion Zone", location: "Drill Site 12", activity: "Drilling", time: "08:30", status: "CLOSED", id: "SIF-2024-026" },
];

const colorMap: Record<string, { dot: string; badge: string; badgeBg: string; row: string }> = {
  critical: { dot: "bg-[#dc2626]", badge: "text-[#f87171]", badgeBg: "bg-[rgba(220,38,38,0.12)] border border-[rgba(220,38,38,0.3)]", row: "hover:bg-[rgba(220,38,38,0.04)]" },
  high: { dot: "bg-[#ea580c]", badge: "text-[#fb923c]", badgeBg: "bg-[rgba(234,88,12,0.12)] border border-[rgba(234,88,12,0.3)]", row: "hover:bg-[rgba(234,88,12,0.04)]" },
  medium: { dot: "bg-[#d97706]", badge: "text-[#fbbf24]", badgeBg: "bg-[rgba(217,119,6,0.12)] border border-[rgba(217,119,6,0.3)]", row: "hover:bg-[rgba(217,119,6,0.04)]" },
  low: { dot: "bg-[#16a34a]", badge: "text-[#4ade80]", badgeBg: "bg-[rgba(22,163,74,0.12)] border border-[rgba(22,163,74,0.3)]", row: "hover:bg-[rgba(22,163,74,0.04)]" },
};

const kpiColor: Record<string, string> = {
  critical: "text-[#f87171]",
  high: "text-[#fb923c]",
  medium: "text-[#fbbf24]",
};

const HERO_CHAIN = [
  "Report", "Evidence", "Control Gap", "SIF Precursor", "Action", "Historical Pattern", "Emerging Risk", "Early Warning",
];

export default function CommandCentre({ onSelectReport }: { onSelectReport: () => void }) {
  const [filter, setFilter] = useState("ALL");
  const filtered = filter === "ALL" ? QUEUE : QUEUE.filter((r) => r.color === filter.toLowerCase());

  return (
    <div className="h-full flex flex-col gap-4 p-6 overflow-auto">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="font-display text-3xl font-800 tracking-widest text-[#dce6f0] uppercase">SIF-SHIELD</span>
            <div className="h-6 w-px bg-[#1e2d3d]" />
            <span className="font-mono text-[10px] tracking-widest text-[#64748b] uppercase">SIF Early-Warning Intelligence</span>
          </div>
          <p className="text-[#64748b] text-sm">Safety Intelligence Command Centre — Oil India Limited · HSE Division</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="demo-tag">ILLUSTRATIVE PROTOTYPE DATA</div>
          <div className="flex items-center gap-2 font-mono text-[11px] text-[#64748b]">
            <span className="w-2 h-2 rounded-full bg-[#16a34a] pulse-critical inline-block" />
            AI ENGINE ONLINE
          </div>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-3">
        {KPI_CARDS.map((k) => (
          <div key={k.label} onClick={onSelectReport} className="panel p-4 flex flex-col gap-1 cursor-pointer hover:border-[#2d3d50] transition-colors">
            <div className="font-mono text-[10px] tracking-widest text-[#64748b] uppercase">{k.label}</div>
            <div className={`font-display text-4xl font-800 tracking-wide ${kpiColor[k.color] ?? "text-[#dce6f0]"}`}>
              {k.value}
            </div>
            <div className="text-[12px] text-[#94a3b8]">{k.sub}</div>
            <div className="font-mono text-[10px] text-[#64748b] mt-1">{k.delta}</div>
          </div>
        ))}
      </div>

      {/* Safety Intelligence Pipeline */}
      <div className="panel p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="font-mono text-[10px] tracking-widest text-[#64748b] uppercase mb-0.5">Safety Intelligence Pipeline</div>
            <div className="text-[#4b5563] text-[12px]">From raw reports to emerging risk signals</div>
          </div>
          <div className="demo-tag">Illustrative prototype data · Not OIL statistics</div>
        </div>
        <div className="flex items-center gap-0 flex-wrap">
          {PIPELINE.map((stage, i) => (
            <div key={stage.label} className="flex items-center">
              <div className="flex flex-col items-center px-5 py-3 rounded-sm" style={{ background: `${stage.color}10`, border: `1px solid ${stage.color}30` }}>
                <div className="font-display text-2xl font-800 leading-none" style={{ color: stage.color }}>
                  {stage.count}
                </div>
                <div className="font-mono text-[10px] tracking-widest text-[#64748b] uppercase mt-1">{stage.label}</div>
              </div>
              {stage.next && (
                <div className="px-2 flex flex-col items-center">
                  <svg width="20" height="12" viewBox="0 0 20 12" fill="none">
                    <path d="M2 6h14M13 2l4 4-4 4" stroke="#374151" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-3 text-[11px] text-[#374151] font-mono">
          We do not just detect the hazard — we detect the control gap behind the hazard. We do not treat reports as isolated events — we connect them to organizational memory.
        </div>
      </div>

      {/* Priority Queue */}
      <div className="panel flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e2d3d]">
          <div>
            <div className="font-display text-xl font-700 tracking-wide text-[#dce6f0] uppercase">Priority Safety Queue</div>
            <div className="font-mono text-[11px] text-[#64748b] mt-0.5">Ranked by SIF risk score · Click to open report analysis</div>
          </div>
          <div className="flex gap-2">
            {["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`font-mono text-[10px] tracking-widest px-3 py-1 rounded-sm border transition-all ${
                  filter === f
                    ? "bg-[rgba(37,99,235,0.15)] border-[rgba(37,99,235,0.4)] text-[#93c5fd]"
                    : "border-[#1e2d3d] text-[#64748b] hover:border-[#2d3d50]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-[80px_1fr_1fr_1fr_1fr_80px_100px] gap-4 px-5 py-2 border-b border-[#1e2d3d]">
          {["RISK", "HAZARD", "CONTROL GAP", "LOCATION", "ACTIVITY", "TIME", "STATUS"].map((h) => (
            <div key={h} className="font-mono text-[10px] tracking-widest text-[#64748b] uppercase">{h}</div>
          ))}
        </div>

        <div className="flex-1 overflow-auto">
          {filtered.map((row) => {
            const c = colorMap[row.color];
            return (
              <div
                key={row.id}
                onClick={onSelectReport}
                className={`grid grid-cols-[80px_1fr_1fr_1fr_1fr_80px_100px] gap-4 px-5 py-3 border-b border-[#1e2d3d] cursor-pointer transition-all ${c.row}`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${c.dot} flex-shrink-0 ${row.color === "critical" ? "pulse-critical" : ""}`} />
                  <span className={`font-display text-xl font-700 ${c.badge}`}>{row.score}</span>
                </div>
                <div>
                  <div className="text-[13px] text-[#dce6f0] font-500">{row.hazard}</div>
                  <div className="font-mono text-[10px] text-[#64748b]">{row.id}</div>
                </div>
                <div className={`text-[12px] font-500 ${c.badge}`}>{row.gap}</div>
                <div className="text-[12px] text-[#94a3b8]">{row.location}</div>
                <div className="text-[12px] text-[#94a3b8]">{row.activity}</div>
                <div className="font-mono text-[12px] text-[#64748b]">{row.time}</div>
                <span className={`status-badge ${c.badgeBg} ${c.badge}`}>{row.status}</span>
              </div>
            );
          })}
        </div>
        <div className="px-5 py-3 border-t border-[#1e2d3d] flex items-center justify-between">
          <span className="font-mono text-[11px] text-[#64748b]">{filtered.length} alerts · Click any row to open report analysis</span>
          <span className="font-mono text-[10px] text-[#374151]">Updated 14:37:02 IST</span>
        </div>
      </div>

      {/* From One Report hero */}
      <div className="panel p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="font-display text-2xl font-800 tracking-wide text-[#dce6f0] uppercase">
              From One Report to Organizational Intelligence
            </div>
            <div className="text-[#64748b] text-sm mt-1">
              Every safety report enters a structured detection pipeline
            </div>
          </div>
        </div>
        <div className="flex items-center gap-0 flex-wrap">
          {HERO_CHAIN.map((node, i) => {
            const isHigh = ["SIF Precursor", "Early Warning"].includes(node);
            const isMed = ["Control Gap", "Emerging Risk"].includes(node);
            return (
              <div key={node} className="flex items-center">
                <div
                  className="px-3 py-2 rounded-sm text-center"
                  style={{
                    background: isHigh ? "rgba(220,38,38,0.1)" : isMed ? "rgba(234,88,12,0.08)" : "rgba(255,255,255,0.03)",
                    border: isHigh ? "1px solid rgba(220,38,38,0.3)" : isMed ? "1px solid rgba(234,88,12,0.2)" : "1px solid #1e2d3d",
                  }}
                >
                  <div
                    className="font-mono text-[10px] tracking-widest uppercase"
                    style={{ color: isHigh ? "#f87171" : isMed ? "#fb923c" : "#64748b" }}
                  >
                    {node}
                  </div>
                </div>
                {i < HERO_CHAIN.length - 1 && (
                  <div className="px-1.5">
                    <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                      <path d="M1 5h10M8 2l3 3-3 3" stroke="#1e2d3d" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-5 flex items-center justify-between">
          <div className="font-mono text-[11px] text-[#374151]">
            SIF-SHIELD · "Don't wait for the incident to discover the warning."
          </div>
          <button
            onClick={onSelectReport}
            className="font-display text-sm font-700 tracking-widest px-4 py-2 bg-[#2563eb] text-white rounded-sm uppercase hover:bg-[#1d4ed8] transition-colors"
          >
            Analyse a Report →
          </button>
        </div>
      </div>
    </div>
  );
}
