"use client";

import { useState } from "react";
import type { SampleBasket as SampleBasketType, BasketStyle } from "@/types/vibe";
import { BASKET_DISCLAIMER } from "@/lib/disclaimers";

interface SampleBasketProps {
  baskets: SampleBasketType[];
}

const STYLE_LABELS: Record<BasketStyle, string> = {
  conservative: "Conservative",
  balanced: "Balanced",
  aggressive: "Growth-Oriented",
  "etf-heavy": "ETF-Focused",
  "stock-heavy": "Stock-Focused",
};

const COLORS = [
  "bg-indigo-500",
  "bg-violet-500",
  "bg-blue-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-pink-500",
  "bg-teal-500",
  "bg-cyan-500",
  "bg-orange-500",
];

export default function SampleBasket({ baskets }: SampleBasketProps) {
  const availableStyles = baskets.map((b) => b.style);
  const [activeStyle, setActiveStyle] = useState<BasketStyle>(
    availableStyles[0] ?? "balanced"
  );

  const active = baskets.find((b) => b.style === activeStyle) ?? baskets[0];

  if (!active) return null;

  return (
    <div className="card space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-1">Sample Research Basket</h2>
        <p className="text-xs text-slate-400">{BASKET_DISCLAIMER}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {baskets.map((b) => (
          <button
            key={b.style}
            onClick={() => setActiveStyle(b.style)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeStyle === b.style
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {STYLE_LABELS[b.style] ?? b.style}
          </button>
        ))}
      </div>

      <div>
        <p className="text-sm font-semibold text-slate-800 mb-1">{active.name}</p>
        <p className="text-sm text-slate-600 mb-4">{active.description}</p>

        {active.holdings.length === 0 ? (
          <p className="text-sm text-slate-400 italic">No holdings available for this style.</p>
        ) : (
          <div className="space-y-2">
            {active.holdings.map((holding, i) => (
              <div key={holding.ticker} className="flex items-center gap-3">
                <div className="w-16 flex-shrink-0">
                  <span className="font-mono text-sm font-bold text-slate-800">
                    {holding.ticker}
                  </span>
                </div>
                <div className="flex-1 relative h-7 flex items-center">
                  <div
                    className={`h-5 rounded-md ${COLORS[i % COLORS.length]} opacity-80 transition-all`}
                    style={{ width: `${holding.weight}%` }}
                  />
                  <span className="absolute left-2 text-xs font-semibold text-white drop-shadow-sm">
                    {holding.weight}%
                  </span>
                </div>
                <p className="text-xs text-slate-400 w-32 truncate">{holding.role}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {active.holdings.length > 0 && (
        <div className="pt-3 border-t border-slate-100 space-y-2">
          <div className="flex gap-6">
            <div>
              <p className="text-xs text-slate-400">Holdings</p>
              <p className="text-sm font-semibold text-slate-800">{active.holdings.length}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Max concentration</p>
              <p className="text-sm font-semibold text-slate-800">
                {active.concentrationScore}%
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-500">{active.diversificationNotes}</p>
          {active.majorRisks.map((risk) => (
            <p key={risk} className="text-xs text-amber-600">
              ⚠ {risk}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
