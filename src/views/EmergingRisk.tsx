import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

const TREND_DATA = [
  { month: "Apr", electrical: 4, confined: 3, height: 2 },
  { month: "May", electrical: 6, confined: 5, height: 3 },
  { month: "Jun", electrical: 9, confined: 4, height: 4 },
  { month: "Jul", electrical: 11, confined: 6, height: 3 },
  { month: "Aug", electrical: 14, confined: 7, height: 5 },
  { month: "Sep", electrical: 17, confined: 5, height: 4 },
];

const EMERGING = [
  {
    hazard: "Electrical Safety",
    trend: "INCREASING",
    change: "+325%",
    evidence: "17 reports in latest period",
    confidence: "Model-dependent",
    severity: "HIGH",
    color: "#ea580c",
    colorMuted: "rgba(234,88,12,0.1)",
    colorBorder: "rgba(234,88,12,0.3)",
  },
  {
    hazard: "Confined Space Entry",
    trend: "STABLE-HIGH",
    change: "+67%",
    evidence: "5 reports in latest period",
    confidence: "Model-dependent",
    severity: "CRITICAL",
    color: "#dc2626",
    colorMuted: "rgba(220,38,38,0.1)",
    colorBorder: "rgba(220,38,38,0.3)",
  },
  {
    hazard: "Working at Height",
    trend: "INCREASING",
    change: "+100%",
    evidence: "4 reports in latest period",
    confidence: "Model-dependent",
    severity: "MEDIUM",
    color: "#d97706",
    colorMuted: "rgba(217,119,6,0.1)",
    colorBorder: "rgba(217,119,6,0.3)",
  },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="panel p-3 text-[11px]">
      <div className="font-mono text-[#64748b] mb-2 uppercase tracking-widest">{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span style={{ color: p.color }}>{p.name}: {p.value} reports</span>
        </div>
      ))}
    </div>
  );
};

export default function EmergingRisk() {
  return (
    <div className="h-full flex flex-col gap-5 p-6 overflow-auto">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <div className="font-mono text-[10px] tracking-widest text-[#64748b] uppercase mb-1">Emerging Risk Engine</div>
          <h1 className="font-display text-3xl font-700 tracking-wide text-[#dce6f0] uppercase">
            Emerging Risk Intelligence
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <span className="font-display text-sm text-[#64748b]">From Reactive Safety</span>
            <svg width="20" height="12" viewBox="0 0 20 12" fill="none">
              <path d="M2 6h14M13 2l4 4-4 4" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span className="font-display text-sm text-[#93c5fd] font-600">Predictive Safety</span>
          </div>
        </div>
        <div className="demo-tag">DEMO DATA</div>
      </div>

      {/* Trend chart */}
      <div className="panel p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="font-mono text-[10px] tracking-widest text-[#64748b] uppercase mb-1">
              SIF Precursor Frequency — 6-Month Trend
            </div>
            <div className="flex items-center gap-5">
              {[
                { color: "#ea580c", label: "Electrical" },
                { color: "#dc2626", label: "Confined Space" },
                { color: "#d97706", label: "Height" },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <div className="w-3 h-0.5 rounded-full" style={{ background: color }} />
                  <span className="font-mono text-[11px] text-[#64748b]">{label}</span>
                </div>
              ))}
            </div>
          </div>
          <span className="font-mono text-[10px] text-[#374151]">Reports per month</span>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={TREND_DATA} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="elec" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ea580c" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#ea580c" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="conf" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#dc2626" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#1e2d3d" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#64748b", fontSize: 11, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="electrical" name="Electrical" stroke="#ea580c" fill="url(#elec)" strokeWidth={2} dot={{ fill: "#ea580c", r: 3 }} />
            <Area type="monotone" dataKey="confined" name="Confined Space" stroke="#dc2626" fill="url(#conf)" strokeWidth={2} dot={{ fill: "#dc2626", r: 3 }} />
            <Line type="monotone" dataKey="height" name="Height" stroke="#d97706" strokeWidth={2} dot={{ fill: "#d97706", r: 3 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Emerging risk alerts */}
      <div className="font-mono text-[10px] tracking-widest text-[#64748b] uppercase">
        ⚠ Automatically Surfaced Emerging Risks
      </div>
      <div className="grid grid-cols-3 gap-4">
        {EMERGING.map((r) => (
          <div key={r.hazard} className="panel p-5 flex flex-col gap-3 border-t-2" style={{ borderTopColor: r.color }}>
            <div>
              <div className="font-mono text-[10px] tracking-widest text-[#64748b] uppercase mb-1">Hazard Category</div>
              <div className="font-display text-lg font-700 text-[#dce6f0] uppercase">{r.hazard}</div>
            </div>

            <div className="flex items-center gap-3">
              <span className="status-badge" style={{ background: r.colorMuted, border: `1px solid ${r.colorBorder}`, color: r.color }}>
                {r.trend}
              </span>
              <span className="font-mono text-lg font-700" style={{ color: r.color }}>{r.change}</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Evidence", value: r.evidence },
                { label: "Severity", value: r.severity },
                { label: "Confidence", value: r.confidence },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div className="font-mono text-[9px] tracking-widest text-[#4b5563] uppercase">{label}</div>
                  <div className="font-mono text-[11px] text-[#94a3b8]">{value}</div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-[#1e2d3d]">
              <button className="font-mono text-[10px] tracking-wide text-[#64748b] hover:text-[#94a3b8] transition-colors">
                View contributing reports →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Early warning */}
      <div className="bg-[rgba(220,38,38,0.06)] border border-[rgba(220,38,38,0.2)] rounded-sm p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-2 h-2 rounded-full bg-[#dc2626] pulse-critical" />
          <span className="font-display text-xl font-700 tracking-widest text-[#f87171] uppercase">
            Early Warning
          </span>
        </div>
        <p className="text-[14px] text-[#94a3b8] leading-relaxed mb-1">
          Recurring control failure detected in electrical safety category. Frequency of precursor reports has increased significantly in the 6-month trend.
        </p>
        <p className="font-mono text-[11px] text-[#64748b]">
          Not a guaranteed prediction. Analysis based on uploaded report frequency — not operational incident probability.
          Clearly labelled as prototype analysis on demo data.
        </p>
      </div>
    </div>
  );
}
