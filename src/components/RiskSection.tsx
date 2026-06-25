import type { RiskItem } from "@/types/vibe";

interface RiskSectionProps {
  risks: RiskItem[];
  counterarguments: string[];
}

const SEVERITY_CONFIG = {
  high: { border: "border-rose-200 bg-rose-50", icon: "🔴", label: "High" },
  medium: { border: "border-amber-200 bg-amber-50", icon: "🟡", label: "Medium" },
  low: { border: "border-slate-200 bg-slate-50", icon: "⚪", label: "Low" },
};

export default function RiskSection({ risks, counterarguments }: RiskSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-xl">⚠️</span>
        <h2 className="text-xl font-bold text-slate-900">Risks to Think About</h2>
      </div>
      <p className="text-sm text-slate-500">
        What could challenge or break this investment thesis.
      </p>

      <div className="space-y-3">
        {risks.map((risk) => {
          const config = SEVERITY_CONFIG[risk.severity] ?? SEVERITY_CONFIG.medium;
          return (
            <div
              key={risk.title}
              className={`rounded-xl border p-4 ${config.border}`}
            >
              <div className="flex items-start gap-2">
                <span className="text-sm mt-0.5">{config.icon}</span>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{risk.title}</p>
                  <p className="text-sm text-slate-600 mt-1">{risk.explanation}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {counterarguments.length > 0 && (
        <div className="card mt-4">
          <h3 className="font-semibold text-slate-800 mb-3">What could disprove this thesis?</h3>
          <ul className="space-y-2">
            {counterarguments.map((arg) => (
              <li key={arg} className="flex items-start gap-2 text-sm text-slate-600">
                <span className="text-slate-400 flex-shrink-0 mt-0.5">→</span>
                {arg}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
