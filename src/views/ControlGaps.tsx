import { useState } from "react";

const GAPS = [
  { id: "CG-031", control: "Atmospheric Testing", hazard: "Confined Space", status: "NOT VERIFIED", severity: "CRITICAL", location: "Maintenance Area", dept: "Maintenance", reports: 4, evidence: '"No gas testing performed before entry"', color: "critical" },
  { id: "CG-030", control: "Isolation / LOTO", hazard: "Electrical", status: "NOT VERIFIED", severity: "CRITICAL", location: "Process Unit 3", dept: "Maintenance", reports: 6, evidence: '"LOTO procedure was not completed"', color: "critical" },
  { id: "CG-029", control: "Fall Arrest System", hazard: "Working at Height", status: "PARTIALLY VERIFIED", severity: "HIGH", location: "Flare Stack", dept: "Projects", reports: 2, evidence: '"Anchor point had not been inspected"', color: "high" },
  { id: "CG-028", control: "Permit to Drive", hazard: "Vehicle Safety", status: "NOT VERIFIED", severity: "HIGH", location: "Field Road B-7", dept: "Logistics", reports: 1, evidence: '"Driver authorization not confirmed"', color: "high" },
  { id: "CG-027", control: "Pressure Test Certification", hazard: "Pressure Vessel", status: "EXPIRED", severity: "HIGH", location: "Crude Unit", dept: "Operations", reports: 3, evidence: '"Pressure test certificate had expired"', color: "high" },
  { id: "CG-025", control: "Exclusion Zone", hazard: "Line of Fire", status: "NOT ESTABLISHED", severity: "MEDIUM", location: "Drill Site 12", dept: "Drilling", reports: 1, evidence: '"No exclusion zone was marked"', color: "medium" },
];

const colorMap: Record<string, { badge: string; badgeBg: string; bar: string }> = {
  critical: { badge: "text-[#f87171]", badgeBg: "bg-[rgba(220,38,38,0.1)] border-[rgba(220,38,38,0.3)]", bar: "#dc2626" },
  high: { badge: "text-[#fb923c]", badgeBg: "bg-[rgba(234,88,12,0.1)] border-[rgba(234,88,12,0.3)]", bar: "#ea580c" },
  medium: { badge: "text-[#fbbf24]", badgeBg: "bg-[rgba(217,119,6,0.1)] border-[rgba(217,119,6,0.3)]", bar: "#d97706" },
};

export default function ControlGaps() {
  const [selected, setSelected] = useState(GAPS[0]);

  return (
    <div className="h-full flex flex-col gap-5 p-6 overflow-auto">
      <div className="flex items-end justify-between">
        <div>
          <div className="font-mono text-[10px] tracking-widest text-[#64748b] uppercase mb-1">Critical Control Analysis</div>
          <h1 className="font-display text-3xl font-700 tracking-wide text-[#dce6f0] uppercase">Control Gaps</h1>
          <p className="text-[#64748b] text-sm mt-1">
            We do not just detect the hazard — we detect the control gap behind the hazard.
          </p>
        </div>
        <div className="demo-tag">ILLUSTRATIVE PROTOTYPE DATA</div>
      </div>

      {/* USP callout */}
      <div className="panel-inset p-4 border-l-2 border-l-[#dc2626]">
        <div className="font-mono text-[10px] tracking-widest text-[#64748b] uppercase mb-1">Core SIF-SHIELD Differentiator</div>
        <p className="text-[13px] text-[#94a3b8]">
          A critical control is a specific measure whose absence or failure can directly cause a Serious Injury or Fatality.
          SIF-SHIELD identifies which critical control is missing — not just what hazard is present.
        </p>
      </div>

      <div className="flex gap-5 flex-1 min-h-0">
        {/* Gap list */}
        <div className="flex-1 flex flex-col gap-2 overflow-auto">
          <div className="font-mono text-[10px] tracking-widest text-[#64748b] uppercase mb-1">Open Control Gaps</div>
          {GAPS.map((gap) => {
            const c = colorMap[gap.color];
            const isSelected = selected.id === gap.id;
            return (
              <div
                key={gap.id}
                onClick={() => setSelected(gap)}
                className={`panel p-4 cursor-pointer transition-all ${isSelected ? "border-[#2563eb]" : "hover:border-[#2d3d50]"}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`status-badge border ${c.badgeBg} ${c.badge}`}>{gap.severity}</span>
                      <span className="font-mono text-[10px] text-[#374151]">{gap.id}</span>
                    </div>
                    <div className="font-display text-base font-700 text-[#dce6f0]">{gap.control}</div>
                    <div className="font-mono text-[11px] text-[#64748b]">{gap.hazard} · {gap.dept}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-[11px]" style={{ color: colorMap[gap.color].bar }}>{gap.status}</div>
                    <div className="font-mono text-[10px] text-[#374151]">{gap.reports} report{gap.reports > 1 ? "s" : ""}</div>
                  </div>
                </div>
                <div className="font-mono text-[11px] text-[#67e8f9] truncate">{gap.evidence}</div>
              </div>
            );
          })}
        </div>

        {/* Detail panel */}
        <div className="w-72 flex flex-col gap-4 flex-shrink-0">
          <div className="panel p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-[#dc2626] pulse-critical" />
              <span className="font-mono text-[10px] tracking-widest text-[#dc2626] uppercase">Control Gap Detected</span>
            </div>

            {[
              { label: "Hazard", value: selected.hazard, color: "#ea580c" },
              { label: "Required Control", value: selected.control, color: "#d97706" },
              { label: "Evidence", value: selected.evidence, color: "#06b6d4", mono: true },
              { label: "Status", value: `✕ ${selected.status}`, color: "#dc2626", bold: true },
              { label: "Severity", value: selected.severity, color: "#dc2626" },
              { label: "Location", value: `${selected.location} · ${selected.dept}`, color: "#94a3b8" },
              { label: "Reports Containing Gap", value: `${selected.reports} report${selected.reports > 1 ? "s" : ""}`, color: "#64748b" },
            ].map((item) => (
              <div key={item.label} className="mb-3">
                <div className="font-mono text-[9px] tracking-widest text-[#64748b] uppercase mb-0.5">{item.label}</div>
                <div
                  className={`${item.mono ? "font-mono text-[11px]" : "text-[13px]"} ${item.bold ? "font-display font-700 text-base" : "font-500"} leading-snug`}
                  style={{ color: item.color }}
                >
                  {item.value}
                </div>
              </div>
            ))}

            <div className="pt-3 border-t border-[#1e2d3d]">
              <div className="font-mono text-[9px] tracking-widest text-[#64748b] uppercase mb-2">Recommended Action</div>
              <div className="text-[12px] text-[#dce6f0] leading-relaxed mb-3">
                Verify {selected.control.toLowerCase()} before resuming activity. Do not proceed until critical control is confirmed.
              </div>
              <div className="flex flex-col gap-2">
                <button className="font-display text-[11px] font-700 tracking-wide px-3 py-2 bg-[#dc2626] text-white rounded-sm uppercase hover:bg-[#b91c1c] transition-colors">
                  Assign Corrective Action
                </button>
                <button className="font-display text-[11px] font-700 tracking-wide px-3 py-2 border border-[rgba(22,163,74,0.4)] text-[#4ade80] rounded-sm uppercase hover:bg-[rgba(22,163,74,0.1)] transition-colors">
                  Mark Control Verified
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
