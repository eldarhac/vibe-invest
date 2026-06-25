import type { InvestableAngle } from "@/types/vibe";

interface InvestableAnglesProps {
  angles: InvestableAngle[];
}

const DIRECTNESS_CONFIG = {
  direct: { color: "bg-emerald-100 text-emerald-700", label: "Direct" },
  indirect: { color: "bg-amber-100 text-amber-700", label: "Indirect" },
  speculative: { color: "bg-rose-100 text-rose-700", label: "Speculative" },
};

export default function InvestableAngles({ angles }: InvestableAnglesProps) {
  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold text-slate-900">Investable Angles</h2>
      <p className="text-sm text-slate-500">
        Different ways to gain exposure to this theme, from direct to indirect.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {angles.map((angle) => {
          const config = DIRECTNESS_CONFIG[angle.directness] ?? DIRECTNESS_CONFIG.indirect;
          return (
            <div key={angle.name} className="card space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-slate-900">{angle.name}</h3>
                <span className={`badge flex-shrink-0 ${config.color}`}>{config.label}</span>
              </div>
              <p className="text-sm text-slate-600">{angle.description}</p>
              <div className="space-y-1.5">
                <div>
                  <p className="text-xs font-medium text-slate-500">Why it connects</p>
                  <p className="text-sm text-slate-700">{angle.whyConnected}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">What could go wrong</p>
                  <p className="text-sm text-slate-700">{angle.whatCouldGoWrong}</p>
                </div>
              </div>
              {angle.exampleTickers.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1 border-t border-slate-100">
                  {angle.exampleTickers.map((t) => (
                    <span key={t} className="badge bg-slate-100 text-slate-700 font-mono text-xs">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
