interface ChainNode {
  label: string;
  value: string;
  color?: "critical" | "high" | "medium" | "ai" | "default";
}

interface SIFChainProps {
  nodes: ChainNode[];
  compact?: boolean;
}

const colorMap = {
  critical: { border: "border-l-[#dc2626]", text: "text-[#f87171]", bg: "bg-[rgba(220,38,38,0.08)]", dot: "#dc2626" },
  high: { border: "border-l-[#ea580c]", text: "text-[#fb923c]", bg: "bg-[rgba(234,88,12,0.08)]", dot: "#ea580c" },
  medium: { border: "border-l-[#d97706]", text: "text-[#fbbf24]", bg: "bg-[rgba(217,119,6,0.08)]", dot: "#d97706" },
  ai: { border: "border-l-[#06b6d4]", text: "text-[#67e8f9]", bg: "bg-[rgba(6,182,212,0.08)]", dot: "#06b6d4" },
  default: { border: "border-l-[#2563eb]", text: "text-[#93c5fd]", bg: "bg-[rgba(37,99,235,0.08)]", dot: "#2563eb" },
};

export default function SIFChain({ nodes, compact = false }: SIFChainProps) {
  return (
    <div className="flex flex-col">
      {nodes.map((node, i) => {
        const c = colorMap[node.color ?? "default"];
        return (
          <div key={i} className="flex flex-col">
            <div className={`${c.bg} border-l-2 ${c.border} pl-3 py-2 ${compact ? "pr-3" : "pr-4"}`}>
              <div className="font-mono text-[10px] font-600 tracking-widest text-[#64748b] uppercase mb-0.5">
                {node.label}
              </div>
              <div className={`font-display font-600 ${compact ? "text-sm" : "text-base"} ${c.text} leading-tight`}>
                {node.value}
              </div>
            </div>
            {i < nodes.length - 1 && (
              <div className="flex items-center gap-2 py-0.5 pl-4">
                <div className="w-px h-4 bg-[#1e2d3d]" />
                <svg width="10" height="10" viewBox="0 0 10 10">
                  <polygon points="5,10 0,0 10,0" fill="#dc2626" opacity="0.6" />
                </svg>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
