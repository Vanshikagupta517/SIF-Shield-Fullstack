const SIMILAR = [
  {
    similarity: 92,
    hazard: "Confined-space maintenance",
    controlFailure: "Atmospheric testing not performed before entry",
    intervention: "Mandatory pre-entry gas testing + rescue standby protocol",
    date: "Mar 2023",
    location: "Duliajan Field",
    outcome: "Near Miss — No injury",
  },
  {
    similarity: 84,
    hazard: "Tank inspection — confined space",
    controlFailure: "Permit verification incomplete",
    intervention: "Full PTW system re-audit · Supervisor sign-off mandatory",
    date: "Sep 2022",
    location: "Digboi Refinery",
    outcome: "Near Miss — Worker evacuated",
  },
  {
    similarity: 71,
    hazard: "Vessel cleaning activity",
    controlFailure: "Gas-free certificate not obtained",
    intervention: "Gas-free certification made mandatory · Contractor briefing",
    date: "Jan 2022",
    location: "Moran Asset",
    outcome: "Unsafe Act — Stopped before entry",
  },
  {
    similarity: 63,
    hazard: "Drain inspection",
    controlFailure: "H2S monitor absent",
    intervention: "Atmospheric monitoring equipment audit · PPE checklist revised",
    date: "Nov 2021",
    location: "Jorhat Pipeline",
    outcome: "Near Miss — Minor exposure",
  },
];

export default function SimilarRisks() {
  return (
    <div className="h-full flex flex-col gap-5 p-6 overflow-auto">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <div className="font-mono text-[10px] tracking-widest text-[#64748b] uppercase mb-1">Historical Intelligence</div>
          <h1 className="font-display text-3xl font-700 tracking-wide text-[#dce6f0] uppercase">
            Find Similar Risks
          </h1>
          <p className="text-[#64748b] text-sm mt-1">
            Searching for reports matching: <span className="text-[#67e8f9]">Confined Space · Atmospheric Testing · Permit-to-Work</span>
          </p>
        </div>
        <div className="demo-tag">DEMO DATA</div>
      </div>

      {/* Context card */}
      <div className="bg-[rgba(6,182,212,0.06)] border border-[rgba(6,182,212,0.2)] rounded-sm p-4 flex items-center gap-4">
        <div className="w-10 h-10 rounded-sm bg-[rgba(6,182,212,0.15)] flex items-center justify-center flex-shrink-0">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 2L3 7v9h4v-5h4v5h4V7L9 2z" stroke="#06b6d4" strokeWidth="1.2" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <div className="font-mono text-[10px] tracking-widest text-[#64748b] uppercase mb-1">Similarity Search — Current Report</div>
          <span className="text-[13px] text-[#94a3b8]">SIF-2024-031 · Confined Space · Risk 94 · CRITICAL</span>
        </div>
        <div className="ml-auto font-mono text-[11px] text-[#67e8f9]">4 matches found</div>
      </div>

      {/* Results */}
      <div className="flex flex-col gap-4">
        <div className="font-mono text-[10px] tracking-widest text-[#64748b] uppercase">Similar Historical Reports</div>
        {SIMILAR.map((r, i) => (
          <div key={i} className="panel p-5 hover:border-[#2d3d50] transition-all cursor-pointer">
            <div className="flex items-start gap-5">
              {/* Similarity badge */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{
                  background: `conic-gradient(#06b6d4 ${r.similarity * 3.6}deg, #1e2d3d 0deg)`,
                }}>
                  <div className="w-11 h-11 rounded-full bg-[#111827] flex items-center justify-center">
                    <span className="font-display text-lg font-700 text-[#67e8f9]">{r.similarity}%</span>
                  </div>
                </div>
                <div className="font-mono text-[9px] text-[#64748b] mt-1 tracking-widest">SIMILAR</div>
              </div>

              {/* Details */}
              <div className="flex-1 grid grid-cols-3 gap-x-6 gap-y-3">
                <div>
                  <div className="font-mono text-[10px] tracking-widest text-[#64748b] uppercase mb-1">Hazard</div>
                  <div className="text-[13px] text-[#dce6f0] font-500">{r.hazard}</div>
                </div>
                <div className="col-span-2">
                  <div className="font-mono text-[10px] tracking-widest text-[#64748b] uppercase mb-1">Control Failure</div>
                  <div className="text-[13px] text-[#fb923c]">{r.controlFailure}</div>
                </div>
                <div className="col-span-2">
                  <div className="font-mono text-[10px] tracking-widest text-[#64748b] uppercase mb-1">Previous Intervention</div>
                  <div className="text-[12px] text-[#94a3b8]">{r.intervention}</div>
                </div>
                <div>
                  <div className="font-mono text-[10px] tracking-widest text-[#64748b] uppercase mb-1">Outcome</div>
                  <div className="text-[12px] text-[#4ade80]">{r.outcome}</div>
                </div>
                <div>
                  <div className="font-mono text-[10px] tracking-widest text-[#64748b] uppercase mb-1">Date</div>
                  <div className="font-mono text-[12px] text-[#64748b]">{r.date}</div>
                </div>
                <div>
                  <div className="font-mono text-[10px] tracking-widest text-[#64748b] uppercase mb-1">Location</div>
                  <div className="text-[12px] text-[#94a3b8]">{r.location}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Organizational learning */}
      <div className="panel p-5 border-l-2 border-l-[#d97706]">
        <div className="font-mono text-[10px] tracking-widest text-[#d97706] uppercase mb-2">Organizational Learning</div>
        <p className="text-[13px] text-[#94a3b8] leading-relaxed">
          Similar confined-space control failures have appeared across multiple reports in the historical dataset.
          The recurring pattern suggests a systemic gap in atmospheric-testing verification procedures.
          Organizational learning: mandatory pre-entry gas testing protocols have been effective in previous interventions.
        </p>
        <div className="mt-3 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#d97706]" />
          <span className="font-mono text-[11px] text-[#d97706]">
            Recurring control failure pattern detected across similar reports — sample data, not OIL operational statistics
          </span>
        </div>
      </div>
    </div>
  );
}
