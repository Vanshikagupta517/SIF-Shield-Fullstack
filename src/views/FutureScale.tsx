const PHASES = [
  { phase: "Phase 1", title: "Multilingual NLP", desc: "Extend SIF precursor detection to Hindi, Assamese, and other regional languages used in OIL operations.", icon: "🌐" },
  { phase: "Phase 2", title: "Voice-to-Report", desc: "Allow field workers to dictate safety observations verbally. Automatic transcription and SIF screening.", icon: "🎤" },
  { phase: "Phase 3", title: "OCR + Safety Vision", desc: "Analyse scanned paper forms, photographs, and permit documents using computer vision.", icon: "📷" },
  { phase: "Phase 4", title: "Domain-Adapted Transformer Models", desc: "Fine-tuned LLMs on oil & gas safety corpora for higher precision SIF detection in specialized contexts.", icon: "🧠" },
  { phase: "Phase 5", title: "Advanced Temporal Risk Forecasting", desc: "Time-series analysis of precursor frequency trends to produce probabilistic emerging-risk forecasts.", icon: "📈" },
  { phase: "Phase 6", title: "IoT / Real-Time Sensor Integration", desc: "Connect gas sensors, personal monitors, and process instruments to provide real-time precursor signals alongside report-based intelligence.", icon: "⚡" },
  { phase: "Phase 7", title: "Enterprise HSE Integration", desc: "API integration with OIL HSE management systems, permit-to-work platforms, and corrective action workflows.", icon: "🔗" },
];

const CURRENT = [
  "SIF Precursor Detection from safety reports",
  "Control-Gap Intelligence — what specific control is missing",
  "Explainable SIF Chain — evidence-linked AI decisions",
  "Historical Similarity — has this happened before?",
  "Emerging-Risk Early Warning — recurring control failures",
];

export default function FutureScale() {
  return (
    <div className="h-full flex flex-col gap-5 p-6 overflow-auto">
      <div className="flex items-end justify-between">
        <div>
          <div className="font-mono text-[10px] tracking-widest text-[#64748b] uppercase mb-1">Roadmap</div>
          <h1 className="font-display text-3xl font-700 tracking-wide text-[#dce6f0] uppercase">Future Scale</h1>
          <p className="text-[#64748b] text-sm mt-1">
            Current prototype capabilities — and the path to enterprise-scale deployment.
          </p>
        </div>
      </div>

      {/* Current scope */}
      <div className="panel p-5 border-l-2 border-l-[#2563eb]">
        <div className="font-mono text-[10px] tracking-widest text-[#2563eb] uppercase mb-3">Current Prototype — Core Capabilities</div>
        <div className="grid grid-cols-1 gap-2">
          {CURRENT.map((cap, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-sm bg-[rgba(37,99,235,0.15)] border border-[rgba(37,99,235,0.3)] flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                  <path d="M1.5 4.5l2 2L7.5 2" stroke="#93c5fd" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="text-[13px] text-[#94a3b8]">{cap}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 font-mono text-[11px] text-[#4b5563]">
          The current prototype is the hero. All future-scope capabilities below are clearly scoped as future development — not current features.
        </div>
      </div>

      {/* Future phases */}
      <div className="font-mono text-[10px] tracking-widest text-[#374151] uppercase">Future Development Phases — Not Current Features</div>
      <div className="grid grid-cols-2 gap-4">
        {PHASES.map((phase) => (
          <div key={phase.phase} className="panel p-5 opacity-60 hover:opacity-80 transition-opacity">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-sm bg-[#0d1520] border border-[#1e2d3d] flex items-center justify-center text-xl flex-shrink-0">
                {phase.icon}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-[10px] tracking-widest text-[#374151] uppercase">{phase.phase}</span>
                </div>
                <div className="font-display text-base font-700 text-[#64748b] mb-1">{phase.title}</div>
                <div className="text-[12px] text-[#4b5563] leading-relaxed">{phase.desc}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="panel-inset p-4 text-center">
        <div className="font-mono text-[10px] tracking-widest text-[#374151] uppercase mb-2">Design Principle</div>
        <p className="text-[12px] text-[#4b5563]">
          Future capabilities are clearly labelled and visually muted. The current prototype focuses exclusively on the five core capabilities
          that demonstrate the SIF-SHIELD intelligence architecture. The future roadmap shows scalability potential without overstating current implementation.
        </p>
      </div>
    </div>
  );
}
