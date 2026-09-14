import { useState } from "react";

const DEPARTMENTS = ["Maintenance", "Operations", "Projects", "Drilling", "Logistics"];
const HAZARDS = ["Electrical", "Confined Space", "Height", "Vehicle", "Pressure", "Fire/Explosion"];

type Level = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "—";

const DATA: Record<string, Record<string, Level>> = {
  Maintenance: { Electrical: "HIGH", "Confined Space": "CRITICAL", Height: "MEDIUM", Vehicle: "HIGH", Pressure: "HIGH", "Fire/Explosion": "MEDIUM" },
  Operations: { Electrical: "MEDIUM", "Confined Space": "HIGH", Height: "LOW", Vehicle: "MEDIUM", Pressure: "HIGH", "Fire/Explosion": "HIGH" },
  Projects: { Electrical: "HIGH", "Confined Space": "HIGH", Height: "HIGH", Vehicle: "MEDIUM", Pressure: "MEDIUM", "Fire/Explosion": "MEDIUM" },
  Drilling: { Electrical: "MEDIUM", "Confined Space": "MEDIUM", Height: "HIGH", Vehicle: "HIGH", Pressure: "CRITICAL", "Fire/Explosion": "HIGH" },
  Logistics: { Electrical: "LOW", "Confined Space": "LOW", Height: "MEDIUM", Vehicle: "HIGH", Pressure: "LOW", "Fire/Explosion": "LOW" },
};

const LEVEL_STYLE: Record<Level, { bg: string; text: string; label: string }> = {
  CRITICAL: { bg: "#dc2626", text: "#fff", label: "CRITICAL" },
  HIGH: { bg: "#ea580c", text: "#fff", label: "HIGH" },
  MEDIUM: { bg: "#d97706", text: "#fff", label: "MED" },
  LOW: { bg: "rgba(22,163,74,0.35)", text: "#4ade80", label: "LOW" },
  "—": { bg: "#1e2d3d", text: "#374151", label: "—" },
};

export default function RiskLandscape() {
  const [hovered, setHovered] = useState<{ dept: string; hazard: string } | null>(null);

  const hoveredData = hovered ? DATA[hovered.dept]?.[hovered.hazard] : null;

  return (
    <div className="h-full flex flex-col gap-5 p-6 overflow-auto">
      <div className="flex items-end justify-between">
        <div>
          <div className="font-mono text-[10px] tracking-widest text-[#64748b] uppercase mb-1">Risk Visualization</div>
          <h1 className="font-display text-3xl font-700 tracking-wide text-[#dce6f0] uppercase">
            SIF Risk Landscape
          </h1>
          <p className="text-[#64748b] text-sm mt-1">Heatmap of SIF precursor frequency by department and hazard category</p>
        </div>
        <div className="demo-tag">DEMO DATA</div>
      </div>

      <div className="flex gap-5">
        {/* Heatmap */}
        <div className="panel p-5 flex-1">
          <div className="font-mono text-[10px] tracking-widest text-[#64748b] uppercase mb-4">
            Department × Hazard Category
          </div>

          <div className="overflow-auto">
            <table className="w-full border-collapse" style={{ minWidth: "500px" }}>
              <thead>
                <tr>
                  <th className="text-left pb-3 pr-4 font-mono text-[10px] tracking-widest text-[#4b5563] uppercase w-28">
                    Department
                  </th>
                  {HAZARDS.map((h) => (
                    <th key={h} className="pb-3 px-2 font-mono text-[10px] tracking-widest text-[#64748b] uppercase text-center">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DEPARTMENTS.map((dept) => (
                  <tr key={dept}>
                    <td className="pr-4 py-1.5 font-mono text-[11px] text-[#94a3b8] uppercase tracking-wide whitespace-nowrap">
                      {dept}
                    </td>
                    {HAZARDS.map((hazard) => {
                      const level = DATA[dept]?.[hazard] ?? "—";
                      const style = LEVEL_STYLE[level];
                      const isHovered = hovered?.dept === dept && hovered?.hazard === hazard;
                      return (
                        <td key={hazard} className="px-2 py-1.5 text-center">
                          <div
                            className="heatmap-cell mx-auto"
                            style={{
                              background: style.bg,
                              color: style.text,
                              width: "80px",
                              height: "36px",
                              outline: isHovered ? "2px solid #06b6d4" : undefined,
                              fontSize: "10px",
                              letterSpacing: "0.05em",
                              fontWeight: 600,
                            }}
                            onMouseEnter={() => setHovered({ dept, hazard })}
                            onMouseLeave={() => setHovered(null)}
                          >
                            {style.label}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 pt-3 border-t border-[#1e2d3d]">
            <span className="font-mono text-[10px] text-[#4b5563] uppercase tracking-widest">Legend:</span>
            {(["CRITICAL", "HIGH", "MEDIUM", "LOW"] as Level[]).map((l) => (
              <div key={l} className="flex items-center gap-2">
                <div
                  className="w-5 h-4 rounded-sm flex items-center justify-center"
                  style={{ background: LEVEL_STYLE[l].bg }}
                />
                <span className="font-mono text-[10px] text-[#64748b]">{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Detail panel */}
        <div className="w-64 flex flex-col gap-4">
          <div className="panel p-4 flex-1">
            {hoveredData ? (
              <div>
                <div className="font-mono text-[10px] tracking-widest text-[#64748b] uppercase mb-3">Cell Detail</div>
                <div className="mb-3">
                  <div className="font-mono text-[10px] text-[#4b5563] uppercase">Department</div>
                  <div className="text-[14px] text-[#dce6f0] font-500">{hovered!.dept}</div>
                </div>
                <div className="mb-3">
                  <div className="font-mono text-[10px] text-[#4b5563] uppercase">Hazard</div>
                  <div className="text-[14px] text-[#dce6f0] font-500">{hovered!.hazard}</div>
                </div>
                <div className="mb-3">
                  <div className="font-mono text-[10px] text-[#4b5563] uppercase">SIF Risk Level</div>
                  <div
                    className="status-badge inline-block mt-1"
                    style={{
                      background: `${LEVEL_STYLE[hoveredData].bg}22`,
                      border: `1px solid ${LEVEL_STYLE[hoveredData].bg}66`,
                      color: LEVEL_STYLE[hoveredData].bg,
                    }}
                  >
                    {hoveredData}
                  </div>
                </div>
                <div className="text-[11px] text-[#4b5563] mt-4 pt-4 border-t border-[#1e2d3d]">
                  Risk level derived from SIF precursor frequency in historical demo reports. Not validated OIL data.
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center gap-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="7" height="7" rx="1" stroke="#1e2d3d" strokeWidth="1.5" />
                  <rect x="14" y="3" width="7" height="7" rx="1" stroke="#1e2d3d" strokeWidth="1.5" />
                  <rect x="3" y="14" width="7" height="7" rx="1" stroke="#1e2d3d" strokeWidth="1.5" />
                  <rect x="14" y="14" width="7" height="7" rx="1" stroke="#1e2d3d" strokeWidth="1.5" />
                </svg>
                <span className="font-mono text-[11px] text-[#374151]">Hover a cell to see detail</span>
              </div>
            )}
          </div>

          {/* High risk summary */}
          <div className="panel p-4">
            <div className="font-mono text-[10px] tracking-widest text-[#64748b] uppercase mb-3">High-Risk Intersections</div>
            {[
              { dept: "Maintenance", hazard: "Confined Space", level: "CRITICAL" },
              { dept: "Drilling", hazard: "Pressure", level: "CRITICAL" },
              { dept: "Maintenance", hazard: "Electrical", level: "HIGH" },
            ].map((item) => (
              <div key={`${item.dept}-${item.hazard}`} className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-[12px] text-[#dce6f0]">{item.dept}</div>
                  <div className="font-mono text-[10px] text-[#64748b]">{item.hazard}</div>
                </div>
                <span
                  className="status-badge"
                  style={{
                    background: `${LEVEL_STYLE[item.level as Level].bg}22`,
                    border: `1px solid ${LEVEL_STYLE[item.level as Level].bg}66`,
                    color: LEVEL_STYLE[item.level as Level].bg,
                  }}
                >
                  {item.level}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
