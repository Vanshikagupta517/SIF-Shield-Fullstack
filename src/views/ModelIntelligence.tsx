const METRICS = [
  { label: "SIF Precursor Recall", value: "91%", note: "Priority metric — missing a precursor is more costly than a false alarm", color: "#dc2626", highlight: true },
  { label: "Precision", value: "84%", note: "Proportion of flagged reports that are genuine SIF precursors", color: "#ea580c" },
  { label: "F1 Score", value: "87%", note: "Harmonic mean of recall and precision", color: "#d97706" },
  { label: "False Positives", value: "16%", note: "Flagged as SIF precursor — not confirmed by safety officer", color: "#64748b" },
  { label: "False Negatives", value: "9%", note: "SIF precursors missed — primary risk to minimise", color: "#64748b" },
  { label: "Human Feedback Applied", value: "342", note: "Officer validations used to improve model", color: "#16a34a" },
];

const CONFUSION = [
  ["", "Predicted SIF", "Predicted Non-SIF"],
  ["Actual SIF", "91 (TP)", "9 (FN)"],
  ["Actual Non-SIF", "16 (FP)", "84 (TN)"],
];

export default function ModelIntelligence() {
  return (
    <div className="h-full flex flex-col gap-5 p-6 overflow-auto">
      <div className="flex items-end justify-between">
        <div>
          <div className="font-mono text-[10px] tracking-widest text-[#64748b] uppercase mb-1">Analyst View</div>
          <h1 className="font-display text-3xl font-700 tracking-wide text-[#dce6f0] uppercase">
            Model Intelligence
          </h1>
          <p className="text-[#64748b] text-sm mt-1">
            Model: <span className="font-mono text-[#67e8f9]">Hybrid SIF-SHIELD v1.0</span>
          </p>
        </div>
        <div className="demo-tag">DEMO METRICS — Not validated OIL production data</div>
      </div>

      {/* Recall highlight */}
      <div className="bg-[rgba(220,38,38,0.06)] border border-[rgba(220,38,38,0.25)] rounded-sm p-5">
        <div className="font-mono text-[10px] tracking-widest text-[#64748b] uppercase mb-1">Priority Metric</div>
        <div className="flex items-center gap-4">
          <div>
            <div className="font-display text-5xl font-800 text-[#f87171]">91%</div>
            <div className="font-display text-lg font-600 text-[#dce6f0] uppercase">SIF Precursor Recall</div>
          </div>
          <div className="flex-1 pl-6 border-l border-[#1e2d3d]">
            <p className="text-[13px] text-[#94a3b8] leading-relaxed">
              Recall is the priority metric for SIF detection. Missing a dangerous precursor (false negative) has a higher consequence than generating a false alarm (false positive). The model is optimized to maximize recall at the cost of some precision.
            </p>
          </div>
        </div>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-3 gap-4">
        {METRICS.map((m) => (
          <div key={m.label} className={`panel p-4 ${m.highlight ? "border-l-2 border-l-[#dc2626]" : ""}`}>
            <div className="font-mono text-[10px] tracking-widest text-[#64748b] uppercase mb-1">{m.label}</div>
            <div className="font-display text-3xl font-700 mb-1" style={{ color: m.color }}>{m.value}</div>
            <div className="text-[11px] text-[#4b5563] leading-relaxed">{m.note}</div>
          </div>
        ))}
      </div>

      {/* Confusion matrix */}
      <div className="panel p-5">
        <div className="font-mono text-[10px] tracking-widest text-[#64748b] uppercase mb-4">Confusion Matrix (per 100 reports)</div>
        <table className="border-collapse">
          {CONFUSION.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => {
                const isHeader = ri === 0 || ci === 0;
                const isTN = cell.includes("TN");
                const isTP = cell.includes("TP");
                const isFN = cell.includes("FN");
                const isFP = cell.includes("FP");
                return (
                  <td
                    key={ci}
                    className={`border border-[#1e2d3d] px-4 py-3 font-mono text-sm ${
                      isHeader ? "text-[#64748b] text-[11px] bg-[#0d1520]" : "text-center"
                    } ${isTP ? "bg-[rgba(22,163,74,0.15)] text-[#4ade80]" : ""} ${
                      isTN ? "bg-[rgba(22,163,74,0.08)] text-[#4ade80]" : ""
                    } ${isFN ? "bg-[rgba(220,38,38,0.2)] text-[#f87171]" : ""} ${
                      isFP ? "bg-[rgba(217,119,6,0.15)] text-[#fbbf24]" : ""
                    }`}
                  >
                    {cell}
                  </td>
                );
              })}
            </tr>
          ))}
        </table>
        <div className="flex gap-4 mt-4 text-[11px] font-mono">
          <span className="text-[#4ade80]">TP = Correctly flagged</span>
          <span className="text-[#fbbf24]">FP = False alarm</span>
          <span className="text-[#f87171]">FN = Missed precursor ← minimise</span>
          <span className="text-[#64748b]">TN = Correctly cleared</span>
        </div>
      </div>

      {/* Human feedback loop */}
      <div className="panel p-5">
        <div className="font-mono text-[10px] tracking-widest text-[#64748b] uppercase mb-4">Human-in-the-Loop Improvement Cycle</div>
        <div className="flex items-center gap-0 flex-wrap">
          {[
            { label: "AI Detection", color: "#06b6d4" },
            { label: "Safety Officer Review", color: "#2563eb" },
            { label: "Human Validation", color: "#16a34a" },
            { label: "Corrected Data", color: "#d97706" },
            { label: "Model Improvement", color: "#ea580c" },
          ].map((step, i, arr) => (
            <div key={step.label} className="flex items-center">
              <div className="px-4 py-2.5 rounded-sm" style={{ background: `${step.color}18`, border: `1px solid ${step.color}44` }}>
                <div className="font-mono text-[9px] tracking-widest text-[#64748b] uppercase">Step {i + 1}</div>
                <div className="font-display text-sm font-600" style={{ color: step.color }}>{step.label}</div>
              </div>
              {i < arr.length - 1 && (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="mx-1 flex-shrink-0">
                  <path d="M5 12h12M14 8l4 4-4 4" stroke="#1e2d3d" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              )}
            </div>
          ))}
        </div>
        <p className="text-[12px] text-[#4b5563] mt-4">
          342 validated examples have been incorporated. Model improvement is continuous and transparent.
          All human feedback is auditable. Demo metrics are illustrative — not production-validated.
        </p>
      </div>
    </div>
  );
}
