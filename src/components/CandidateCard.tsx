"use client";

import { useState } from "react";
import type { InvestmentCandidate } from "@/types/vibe";

interface CandidateCardProps {
  candidate: InvestmentCandidate;
  inBasket?: boolean;
  onToggleBasket?: (ticker: string) => void;
}

const EXPOSURE_CONFIG = {
  direct: { color: "bg-emerald-100 text-emerald-700", label: "Direct" },
  indirect: { color: "bg-amber-100 text-amber-700", label: "Indirect" },
  diversified: { color: "bg-blue-100 text-blue-700", label: "Diversified" },
  speculative: { color: "bg-rose-100 text-rose-700", label: "Speculative" },
};

const TYPE_CONFIG = {
  stock: { color: "bg-slate-100 text-slate-700", label: "Stock" },
  etf: { color: "bg-indigo-100 text-indigo-700", label: "ETF" },
  reit: { color: "bg-violet-100 text-violet-700", label: "REIT" },
  fund: { color: "bg-indigo-100 text-indigo-700", label: "Fund" },
};

const CONFIDENCE_CONFIG = {
  high: { color: "bg-emerald-100 text-emerald-700", label: "High fit" },
  medium: { color: "bg-amber-100 text-amber-700", label: "Medium fit" },
  low: { color: "bg-slate-100 text-slate-600", label: "Lower fit" },
};

export default function CandidateCard({
  candidate,
  inBasket = false,
  onToggleBasket,
}: CandidateCardProps) {
  const [expanded, setExpanded] = useState(false);
  const exposure = EXPOSURE_CONFIG[candidate.exposureType] ?? EXPOSURE_CONFIG.indirect;
  const type = TYPE_CONFIG[candidate.type] ?? TYPE_CONFIG.stock;
  const confidence = candidate.confidence
    ? CONFIDENCE_CONFIG[candidate.confidence]
    : CONFIDENCE_CONFIG.medium;

  return (
    <div
      className={`card transition-all ${inBasket ? "ring-2 ring-indigo-200" : ""}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="font-mono font-bold text-lg text-slate-900">
              {candidate.ticker}
            </span>
            <span className={`badge ${type.color}`}>{type.label}</span>
            <span className={`badge ${exposure.color}`}>{exposure.label}</span>
            {candidate.confidence && (
              <span className={`badge ${confidence.color}`}>{confidence.label}</span>
            )}
          </div>
          <p className="text-sm font-medium text-slate-700 truncate">{candidate.name}</p>
          <p className="text-xs text-slate-400">{candidate.category}</p>
        </div>
        {onToggleBasket && (
          <button
            onClick={() => onToggleBasket(candidate.ticker)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              inBasket
                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {inBasket ? "In basket" : "Add"}
          </button>
        )}
      </div>

      <div className="mt-3 space-y-2">
        <div className="bg-slate-50 rounded-xl p-3">
          <p className="text-xs font-medium text-slate-500 mb-1">Why it may fit this vibe</p>
          <p className="text-sm text-slate-700">{candidate.whyItFits}</p>
        </div>

        <div className="bg-amber-50 rounded-xl p-3">
          <p className="text-xs font-medium text-amber-600 mb-1">Main risk</p>
          <p className="text-sm text-slate-700">{candidate.mainRisk}</p>
        </div>
      </div>

      {expanded && (
        <div className="mt-3 space-y-2 pt-3 border-t border-slate-100">
          <div>
            <p className="text-xs font-medium text-slate-500 mb-1">Role in sample basket</p>
            <p className="text-sm text-slate-700">{candidate.roleInBasket}</p>
          </div>
          {candidate.region && (
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1">Region</p>
              <p className="text-sm text-slate-700">{candidate.region}</p>
            </div>
          )}
          <div className="bg-slate-50 rounded-xl p-3">
            <p className="text-xs text-slate-500">
              <strong>Why this appears:</strong> This {candidate.type} is included because it has
              potential exposure to the theme through its {candidate.category.toLowerCase()} focus.
              This is not a recommendation to research or invest in any specific security.
            </p>
          </div>
        </div>
      )}

      <button
        onClick={() => setExpanded((e) => !e)}
        className="mt-3 text-xs text-indigo-500 hover:text-indigo-700 font-medium transition-colors"
      >
        {expanded ? "Show less" : "Show more details"}
      </button>
    </div>
  );
}
