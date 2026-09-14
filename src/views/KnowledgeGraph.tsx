import { useState } from "react";

interface GraphNode {
  id: string;
  label: string;
  sublabel: string;
  x: number;
  y: number;
  color: string;
  definition: string;
  evidence?: string;
  risk?: string;
}

const NODES: GraphNode[] = [
  { id: "evidence", label: "Evidence", sublabel: '"No atmospheric testing..."', x: 50, y: 10, color: "#06b6d4", definition: "Text evidence extracted from the safety report by NLP. Grounded in actual words of the safety officer.", evidence: '"without completing atmospheric testing"', risk: "High" },
  { id: "hazard", label: "Hazard", sublabel: "Confined Space", x: 50, y: 28, color: "#ea580c", definition: "The physical or operational condition that presents a risk of serious injury or fatality.", evidence: '"entered a vessel for inspection"', risk: "Critical" },
  { id: "control", label: "Critical Control", sublabel: "Atmospheric Testing", x: 50, y: 46, color: "#dc2626", definition: "A control measure whose absence or failure could directly lead to a serious injury or fatality event.", evidence: "Control not verified before entry", risk: "Critical" },
  { id: "precursor", label: "SIF Precursor", sublabel: "Unverified hazardous atmosphere", x: 50, y: 64, color: "#dc2626", definition: "A condition where a critical control has failed and the potential consequence is a Serious Injury or Fatality.", evidence: "Atmospheric testing not completed + confined space entry", risk: "Critical" },
  { id: "consequence", label: "Consequence", sublabel: "Toxic exposure / Fatality", x: 50, y: 80, color: "#b91c1c", definition: "The potential outcome if the SIF precursor leads to a loss-of-control event. Not a guaranteed prediction.", evidence: "Confined space without gas testing — known fatality mechanism", risk: "Critical" },
  { id: "intervention", label: "Intervention", sublabel: "Stop · Verify · Confirm", x: 50, y: 95, color: "#16a34a", definition: "Recommended safety officer action based on SIF-SHIELD knowledge base. Decision-support — not autonomous action.", evidence: "5 actions generated from confined-space critical control ruleset", risk: "Managed" },
  // Side nodes
  { id: "history", label: "Historical Reports", sublabel: "4 similar reports", x: 85, y: 46, color: "#2563eb", definition: "Previous reports with similar hazard-control gap patterns found in the organizational report archive.", evidence: "92%, 87%, 84% similarity matches", risk: "Reference" },
  { id: "pattern", label: "Recurring Pattern", sublabel: "Atmospheric Testing trend", x: 85, y: 64, color: "#d97706", definition: "A control failure that appears in multiple reports over time, indicating a systemic issue rather than an isolated event.", evidence: "3 → 5 → 7 → 10 → 13 → 16 reports (6 months)", risk: "High" },
  { id: "emerging", label: "Emerging Risk", sublabel: "↑ Increasing recurrence", x: 85, y: 80, color: "#ea580c", definition: "A systemic risk signal derived from recurring control failure patterns across historical reports.", evidence: "Atmospheric testing failure recurring in confined-space reports", risk: "Critical" },
];

const EDGES = [
  { from: "evidence", to: "hazard" },
  { from: "hazard", to: "control" },
  { from: "control", to: "precursor" },
  { from: "precursor", to: "consequence" },
  { from: "consequence", to: "intervention" },
  { from: "history", to: "pattern" },
  { from: "pattern", to: "emerging" },
  { from: "control", to: "history" },
  { from: "precursor", to: "emerging" },
];

export default function KnowledgeGraph() {
  const [hovered, setHovered] = useState<GraphNode | null>(null);
  const [selected, setSelected] = useState<GraphNode | null>(null);

  const active = selected ?? hovered;

  return (
    <div className="h-full flex flex-col gap-5 p-6 overflow-auto">
      <div className="flex items-end justify-between">
        <div>
          <div className="font-mono text-[10px] tracking-widest text-[#64748b] uppercase mb-1">Knowledge Base</div>
          <h1 className="font-display text-3xl font-700 tracking-wide text-[#dce6f0] uppercase">SIF Knowledge Graph</h1>
          <p className="text-[#64748b] text-sm mt-1">
            The structured safety intelligence behind SIF-SHIELD. Hover or click any node to inspect.
          </p>
        </div>
        <div className="demo-tag">Interactive · Click nodes to explore</div>
      </div>

      <div className="flex gap-5 flex-1 min-h-0">
        {/* Graph SVG */}
        <div className="flex-1 panel relative overflow-hidden" style={{ minHeight: "500px" }}>
          <svg width="100%" height="100%" viewBox="0 0 100 110" preserveAspectRatio="xMidYMid meet" className="p-4">
            {/* Edges */}
            {EDGES.map((edge, i) => {
              const from = NODES.find((n) => n.id === edge.from)!;
              const to = NODES.find((n) => n.id === edge.to)!;
              const isHighlighted = active && (active.id === edge.from || active.id === edge.to);
              return (
                <line
                  key={i}
                  x1={from.x} y1={from.y}
                  x2={to.x} y2={to.y}
                  stroke={isHighlighted ? from.color : "#1e2d3d"}
                  strokeWidth={isHighlighted ? "0.6" : "0.3"}
                  strokeDasharray={edge.from === "control" && edge.to === "history" ? "1 1" : undefined}
                  opacity={isHighlighted ? 0.8 : 0.5}
                  style={{ transition: "all 0.2s" }}
                />
              );
            })}

            {/* Nodes */}
            {NODES.map((node) => {
              const isActive = active?.id === node.id;
              return (
                <g
                  key={node.id}
                  style={{ cursor: "pointer" }}
                  onMouseEnter={() => setHovered(node)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => setSelected(selected?.id === node.id ? null : node)}
                >
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isActive ? "5" : "3.5"}
                    fill={isActive ? node.color : `${node.color}33`}
                    stroke={node.color}
                    strokeWidth={isActive ? "0.8" : "0.5"}
                    style={{ transition: "all 0.2s" }}
                  />
                  <text
                    x={node.x <= 50 ? node.x - 5 : node.x + 5}
                    y={node.y - 0.5}
                    textAnchor={node.x <= 50 ? "end" : "start"}
                    fill={isActive ? node.color : "#64748b"}
                    fontSize="2.8"
                    fontFamily="JetBrains Mono"
                    fontWeight={isActive ? "600" : "400"}
                    style={{ transition: "all 0.2s" }}
                  >
                    {node.label.toUpperCase()}
                  </text>
                  <text
                    x={node.x <= 50 ? node.x - 5 : node.x + 5}
                    y={node.y + 2.5}
                    textAnchor={node.x <= 50 ? "end" : "start"}
                    fill={isActive ? `${node.color}bb` : "#374151"}
                    fontSize="2"
                    fontFamily="JetBrains Mono"
                  >
                    {node.sublabel}
                  </text>
                </g>
              );
            })}

            {/* Chain label */}
            <text x="45" y="4" textAnchor="end" fill="#1e2d3d" fontSize="2" fontFamily="JetBrains Mono">SIF DETECTION CHAIN</text>
            <text x="90" y="42" textAnchor="middle" fill="#1e2d3d" fontSize="2" fontFamily="JetBrains Mono">RECURRENCE</text>
          </svg>
        </div>

        {/* Detail panel */}
        <div className="w-72 flex flex-col gap-4">
          <div className="panel p-5 flex-1">
            {active ? (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full" style={{ background: active.color }} />
                  <span className="font-display text-lg font-700 tracking-wide uppercase" style={{ color: active.color }}>
                    {active.label}
                  </span>
                </div>
                <div className="font-mono text-[11px] text-[#67e8f9] mb-3">{active.sublabel}</div>

                <div className="mb-3">
                  <div className="font-mono text-[9px] tracking-widest text-[#64748b] uppercase mb-1">Definition</div>
                  <div className="text-[12px] text-[#94a3b8] leading-relaxed">{active.definition}</div>
                </div>

                {active.evidence && (
                  <div className="mb-3">
                    <div className="font-mono text-[9px] tracking-widest text-[#64748b] uppercase mb-1">Evidence</div>
                    <div className="font-mono text-[11px] text-[#67e8f9] p-2 panel-inset rounded-sm">{active.evidence}</div>
                  </div>
                )}

                {active.risk && (
                  <div>
                    <div className="font-mono text-[9px] tracking-widest text-[#64748b] uppercase mb-1">Risk Level</div>
                    <span
                      className="status-badge"
                      style={{
                        background: `${active.color}18`,
                        border: `1px solid ${active.color}44`,
                        color: active.color,
                      }}
                    >
                      {active.risk}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center gap-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="#1e2d3d" strokeWidth="1.5" />
                  <path d="M9 9a3 3 0 116 0c0 2-3 3-3 3" stroke="#1e2d3d" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="12" cy="17" r="0.5" fill="#1e2d3d" />
                </svg>
                <div className="font-mono text-[11px] text-[#374151]">
                  Hover or click any node to inspect its definition, evidence, and risk level
                </div>
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="panel p-4">
            <div className="font-mono text-[10px] tracking-widest text-[#64748b] uppercase mb-3">Node Types</div>
            {[
              { color: "#06b6d4", label: "NLP Evidence" },
              { color: "#ea580c", label: "Hazard" },
              { color: "#dc2626", label: "Critical Control / SIF Precursor" },
              { color: "#b91c1c", label: "Consequence" },
              { color: "#16a34a", label: "Intervention" },
              { color: "#2563eb", label: "Historical Reports" },
              { color: "#d97706", label: "Recurring Pattern / Emerging Risk" },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: color, opacity: 0.7 }} />
                <span className="font-mono text-[10px] text-[#64748b]">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
