"use client";

import { useState } from "react";
import type { VibeInput } from "@/types/vibe";

interface ClarificationPanelProps {
  vibe: string;
  onSubmit: (preferences: VibeInput["userPreferences"]) => void;
  loading?: boolean;
}

type Preferences = NonNullable<VibeInput["userPreferences"]>;

const QUESTIONS = [
  {
    key: "exposurePreference" as keyof Preferences,
    label: "What kind of exposure do you prefer?",
    options: [
      { value: "etfs", label: "ETFs only" },
      { value: "stocks", label: "Stocks only" },
      { value: "mixed", label: "Mix of both" },
      { value: "unsure", label: "Not sure" },
    ],
  },
  {
    key: "concentration" as keyof Preferences,
    label: "How concentrated should this be?",
    options: [
      { value: "broad", label: "Broad and diversified" },
      { value: "balanced", label: "Balanced" },
      { value: "focused", label: "High-conviction / focused" },
    ],
  },
  {
    key: "geography" as keyof Preferences,
    label: "Which region?",
    options: [
      { value: "us", label: "US only" },
      { value: "global", label: "Global" },
      { value: "developed", label: "Developed markets" },
      { value: "emerging", label: "Emerging markets" },
      { value: "unsure", label: "No preference" },
    ],
  },
] as const;

export default function ClarificationPanel({
  vibe,
  onSubmit,
  loading = false,
}: ClarificationPanelProps) {
  const [prefs, setPrefs] = useState<Preferences>({});

  const setVal = (key: keyof Preferences, value: string) => {
    setPrefs((p) => ({ ...p, [key]: value }));
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <p className="text-sm text-slate-500 font-medium">
          Your vibe: <span className="text-slate-800 font-semibold">&ldquo;{vibe}&rdquo;</span>
        </p>
        <p className="text-slate-600 mt-1">
          Shape this research map with a few quick choices — or skip to generate now.
        </p>
      </div>

      <div className="space-y-5">
        {QUESTIONS.map((q) => (
          <div key={q.key} className="card">
            <p className="font-medium text-slate-800 mb-3">{q.label}</p>
            <div className="flex flex-wrap gap-2">
              {q.options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setVal(q.key, opt.value)}
                  disabled={loading}
                  className={`pill-option ${
                    prefs[q.key] === opt.value
                      ? "pill-option-active"
                      : "pill-option-inactive"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 justify-center">
        <button
          onClick={() => onSubmit(prefs)}
          disabled={loading}
          className="btn-primary min-w-[200px]"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Building your research map…
            </span>
          ) : (
            "Generate research map"
          )}
        </button>
        <button
          onClick={() => onSubmit(undefined)}
          disabled={loading}
          className="btn-secondary"
        >
          Skip and generate
        </button>
      </div>
    </div>
  );
}
