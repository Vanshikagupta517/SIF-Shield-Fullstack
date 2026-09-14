import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const TREND = [
  { month: "Apr", precursors: 8 },
  { month: "May", precursors: 11 },
  { month: "Jun", precursors: 9 },
  { month: "Jul", precursors: 13 },
  { month: "Aug", precursors: 16 },
  { month: "Sep", precursors: 14 },
];

const TOP_HAZARDS = [
  { hazard: "Electrical", count: 23, color: "#ea580c" },
  { hazard: "Confined Space", count: 18, color: "#dc2626" },
  { hazard: "Height", count: 12, color: "#d97706" },
  { hazard: "Vehicle", count: 9, color: "#d97706" },
  { hazard: "Pressure", count: 7, color: "#ea580c" },
];

const DEPT_DATA = [
  { dept: "Maintenance", score: 82 },
  { dept: "Drilling", score: 71 },
  { dept: "Projects", score: 64 },
  { dept: "Operations", score: 48 },
  { dept: "Logistics", score: 22 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="panel p-3 text-[11px]">
      <div className="font-mono text-[#64748b] mb-1">{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} style={{ color: p.color ?? "#94a3b8" }}>{p.name}: {p.value}</div>
      ))}
    </div>
  );
};

export default function ExecutiveDashboard() {
  return (
    <div className="h-full flex flex-col gap-5 p-6 overflow-auto">
      <div className="flex items-end justify-between">
        <div>
          <div className="font-mono text-[10px] tracking-widest text-[#64748b] uppercase mb-1">Management View</div>
          <h1 className="font-display text-3xl font-700 tracking-wide text-[#dce6f0] uppercase">
            Executive Safety Intelligence
          </h1>
          <p className="text-[#64748b] text-sm mt-1">Where should management intervene?</p>
        </div>
        <div className="demo-tag">DEMO DATA</div>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "SIF Precursors — 6 Mo", value: "71", trend: "↑ 8 vs prev period", color: "#f87171" },
          { label: "Critical Unresolved", value: "3", trend: "Immediate intervention", color: "#f87171" },
          { label: "Corrective Actions Closed", value: "68%", trend: "↑ 4% vs target", color: "#4ade80" },
          { label: "High-Risk Sites", value: "2", trend: "Duliajan · Moran", color: "#fb923c" },
        ].map((k) => (
          <div key={k.label} className="panel p-4">
            <div className="font-mono text-[10px] tracking-widest text-[#64748b] uppercase mb-1">{k.label}</div>
            <div className="font-display text-4xl font-800" style={{ color: k.color }}>{k.value}</div>
            <div className="font-mono text-[11px] text-[#64748b] mt-1">{k.trend}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-3 gap-4">
        {/* Trend */}
        <div className="panel p-5 col-span-1">
          <div className="font-mono text-[10px] tracking-widest text-[#64748b] uppercase mb-4">Overall SIF Precursor Trend</div>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={TREND}>
              <CartesianGrid stroke="#1e2d3d" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="precursors" name="SIF Precursors" stroke="#dc2626" strokeWidth={2} dot={{ fill: "#dc2626", r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top hazards */}
        <div className="panel p-5 col-span-1">
          <div className="font-mono text-[10px] tracking-widest text-[#64748b] uppercase mb-4">Top Recurring Hazards</div>
          <div className="flex flex-col gap-2.5">
            {TOP_HAZARDS.map((h) => (
              <div key={h.hazard}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[12px] text-[#94a3b8]">{h.hazard}</span>
                  <span className="font-mono text-[11px]" style={{ color: h.color }}>{h.count} reports</span>
                </div>
                <div className="h-1.5 bg-[#1e2d3d] rounded-sm overflow-hidden">
                  <div
                    className="h-full rounded-sm"
                    style={{ width: `${(h.count / 23) * 100}%`, background: h.color, opacity: 0.8 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dept comparison */}
        <div className="panel p-5 col-span-1">
          <div className="font-mono text-[10px] tracking-widest text-[#64748b] uppercase mb-4">Department SIF Risk Score</div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={DEPT_DATA} layout="vertical" margin={{ left: 0, right: 10 }}>
              <CartesianGrid stroke="#1e2d3d" strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tick={{ fill: "#64748b", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <YAxis type="category" dataKey="dept" tick={{ fill: "#94a3b8", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} width={70} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="score" name="Risk Score" fill="#ea580c" radius={[0, 2, 2, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Emerging risks + corrective action closure */}
      <div className="grid grid-cols-2 gap-4">
        <div className="panel p-5">
          <div className="font-mono text-[10px] tracking-widest text-[#64748b] uppercase mb-3">Emerging Risks</div>
          {[
            { hazard: "Electrical Safety", trend: "↑ +325%", desc: "Increasing precursor frequency", severity: "#ea580c" },
            { hazard: "Confined Space Entry", trend: "↑ Stable-High", desc: "Persistent control failures", severity: "#dc2626" },
          ].map((r) => (
            <div key={r.hazard} className="flex items-center gap-4 mb-3 pb-3 border-b border-[#1e2d3d] last:border-0 last:mb-0 last:pb-0">
              <div className="w-2 h-10 rounded-sm flex-shrink-0" style={{ background: r.severity }} />
              <div>
                <div className="text-[13px] text-[#dce6f0] font-500">{r.hazard}</div>
                <div className="text-[11px] text-[#64748b]">{r.desc}</div>
              </div>
              <div className="ml-auto font-mono text-[12px]" style={{ color: r.severity }}>{r.trend}</div>
            </div>
          ))}
        </div>

        <div className="panel p-5">
          <div className="font-mono text-[10px] tracking-widest text-[#64748b] uppercase mb-3">Corrective Action Closure</div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{
              background: `conic-gradient(#16a34a 245deg, #1e2d3d 0deg)`,
            }}>
              <div className="w-14 h-14 rounded-full bg-[#111827] flex items-center justify-center">
                <span className="font-display text-xl font-700 text-[#4ade80]">68%</span>
              </div>
            </div>
            <div>
              <div className="text-[13px] text-[#4ade80] font-500">68 / 100 actions closed</div>
              <div className="font-mono text-[11px] text-[#64748b] mt-1">Target: 80%</div>
              <div className="font-mono text-[11px] text-[#64748b]">32 overdue</div>
            </div>
          </div>
          <div className="text-[12px] text-[#64748b]">
            Corrective-action closure rate is below target. Maintenance department has the highest backlog.
          </div>
        </div>
      </div>
    </div>
  );
}
