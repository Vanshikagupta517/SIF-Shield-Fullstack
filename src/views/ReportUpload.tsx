import { useRef, useState } from "react";

const REPORT_TYPES = [
  "Unsafe Act",
  "Unsafe Condition",
  "Near Miss",
  "Incident",
  "Corrective Action",
  "TXT Report",
];

export default function ReportUpload({ onAnalyse }: { onAnalyse: (report: string) => void }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const readFile = (file: File) => {
    setError("");
    if (!file.name.toLowerCase().endsWith(".txt")) {
      setError("Live file intake currently supports TXT files. For PDF/DOCX, paste the report into Analyse Safety Report.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || "").trim();
      if (text.length < 10) {
        setError("The selected report is empty or too short.");
        return;
      }
      onAnalyse(text);
    };
    reader.onerror = () => setError("Unable to read this report file.");
    reader.readAsText(file);
  };

  return (
    <div className="h-full flex flex-col gap-5 p-6 overflow-auto">
      <div className="flex items-end justify-between">
        <div>
          <div className="font-mono text-[10px] tracking-widest text-[#64748b] uppercase mb-1">Report Intake</div>
          <h1 className="font-display text-3xl font-700 tracking-wide text-[#dce6f0] uppercase">Analyse Safety Report</h1>
          <p className="text-[#64748b] text-sm mt-1">Submit a safety report for SIF precursor detection and control gap analysis.</p>
        </div>
      </div>

      <div className="flex gap-5">
        <div
          className={`flex-1 panel flex flex-col items-center justify-center gap-5 p-12 border-2 border-dashed cursor-pointer transition-all ${
            isDragOver ? "border-[#2563eb] bg-[rgba(37,99,235,0.05)]" : "border-[#1e2d3d] hover:border-[#2d3d50]"
          }`}
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragOver(false); const file = e.dataTransfer.files[0]; if (file) readFile(file); }}
          onClick={() => inputRef.current?.click()}
        >
          <input ref={inputRef} type="file" accept=".txt,text/plain" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) readFile(file); e.currentTarget.value = ""; }} />
          <div className="w-16 h-16 rounded-full border border-[#1e2d3d] flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M14 4v14M8 10l6-6 6 6" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M5 22h18" stroke="#1e2d3d" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <div className="text-center">
            <div className="font-display text-lg font-600 text-[#dce6f0] uppercase mb-1">Drop Safety Report Here</div>
            <div className="text-[13px] text-[#64748b]">or click to select — TXT supported for live file intake</div>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {REPORT_TYPES.map((t) => (
              <span key={t} className="font-mono text-[10px] px-2 py-1 bg-[#0d1520] border border-[#1e2d3d] text-[#64748b] rounded-sm">{t}</span>
            ))}
          </div>
          {error && <div className="max-w-md text-center text-[11px] text-[#f87171]">{error}</div>}
        </div>

        <div className="w-72 flex flex-col gap-4">
          <div className="panel p-5">
            <div className="font-mono text-[10px] tracking-widest text-[#64748b] uppercase mb-3">Live Analysis</div>
            <p className="text-[12px] text-[#64748b] mb-4 leading-relaxed">
              File intake sends the report to the same FastAPI analysis workflow used by the main Report Analysis screen.
            </p>
            <div className="panel-inset p-3">
              <div className="font-mono text-[10px] text-[#4b5563] uppercase">Pipeline</div>
              <div className="font-display text-sm font-700 mt-1 text-[#93c5fd]">Report → AI → Risk → Action</div>
            </div>
            <div className="demo-tag mt-3 inline-block">BACKEND CONNECTED WORKFLOW</div>
          </div>
        </div>
      </div>
    </div>
  );
}
