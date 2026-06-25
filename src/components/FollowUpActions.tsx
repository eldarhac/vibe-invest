"use client";

interface FollowUpActionsProps {
  suggestions: string[];
  onRefine: (instruction: string) => void;
  loading?: boolean;
}

export default function FollowUpActions({
  suggestions,
  onRefine,
  loading = false,
}: FollowUpActionsProps) {
  const displaySuggestions =
    suggestions.length > 0
      ? suggestions
      : [
          "Make this more conservative",
          "Show ETF-only version",
          "Explain like I'm new to investing",
          "What would disprove this vibe?",
          "Add international exposure",
          "Focus on small caps",
        ];

  return (
    <div className="card space-y-4">
      <h2 className="text-lg font-bold text-slate-900">Refine This Research Map</h2>
      <p className="text-sm text-slate-500">
        Click any option below to update the analysis.
      </p>
      <div className="flex flex-wrap gap-2">
        {displaySuggestions.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => onRefine(suggestion)}
            disabled={loading}
            className="px-4 py-2 rounded-full border border-slate-200 text-sm text-slate-700 bg-white hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}
