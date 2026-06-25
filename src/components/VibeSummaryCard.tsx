import type { VibeAnalysis } from "@/types/vibe";
import { DATA_FRESHNESS_NOTE } from "@/lib/disclaimers";

interface VibeSummaryCardProps {
  analysis: VibeAnalysis;
  originalVibe: string;
}

const EVIDENCE_COLORS: Record<string, string> = {
  low: "bg-amber-100 text-amber-700",
  medium: "bg-blue-100 text-blue-700",
  "medium-high": "bg-indigo-100 text-indigo-700",
  high: "bg-emerald-100 text-emerald-700",
};

const EVIDENCE_LABELS: Record<string, string> = {
  low: "Low evidence",
  medium: "Medium evidence",
  "medium-high": "Medium-high evidence",
  high: "High evidence",
};

export default function VibeSummaryCard({ analysis, originalVibe }: VibeSummaryCardProps) {
  return (
    <div className="card space-y-4">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs text-slate-400 font-medium mb-1">YOUR VIBE</p>
          <p className="text-sm text-slate-600 italic">&ldquo;{originalVibe}&rdquo;</p>
        </div>
        <span
          className={`badge ${EVIDENCE_COLORS[analysis.evidenceLevel] ?? "bg-slate-100 text-slate-600"}`}
        >
          {EVIDENCE_LABELS[analysis.evidenceLevel] ?? analysis.evidenceLevel}
        </span>
      </div>

      <h1 className="text-2xl font-bold text-slate-900">{analysis.title}</h1>

      <p className="text-slate-600 leading-relaxed">{analysis.plainEnglishInterpretation}</p>

      <div className="flex flex-wrap gap-2">
        {analysis.tags.map((tag) => (
          <span
            key={tag}
            className="badge bg-slate-100 text-slate-600"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex gap-6 pt-2 border-t border-slate-100">
        <div>
          <p className="text-xs text-slate-400 mb-0.5">Investability</p>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-24 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all"
                style={{ width: `${analysis.investabilityScore}%` }}
              />
            </div>
            <span className="text-sm font-medium text-slate-700">
              {analysis.investabilityScore}/100
            </span>
          </div>
        </div>
        <div>
          <p className="text-xs text-slate-400 mb-0.5">Theme purity</p>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-24 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-violet-500 rounded-full transition-all"
                style={{ width: `${analysis.themePurityScore}%` }}
              />
            </div>
            <span className="text-sm font-medium text-slate-700">
              {analysis.themePurityScore}/100
            </span>
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-400">{DATA_FRESHNESS_NOTE(new Date())}</p>
    </div>
  );
}
