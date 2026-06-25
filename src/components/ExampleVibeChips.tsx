"use client";

import { EXAMPLE_VIBES } from "@/lib/disclaimers";

interface ExampleVibeChipsProps {
  onSelect: (vibe: string) => void;
}

export default function ExampleVibeChips({ onSelect }: ExampleVibeChipsProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {EXAMPLE_VIBES.map((vibe) => (
        <button
          key={vibe}
          onClick={() => onSelect(vibe)}
          className="px-3 py-1.5 bg-white border border-slate-200 rounded-full text-sm text-slate-600 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
        >
          {vibe}
        </button>
      ))}
    </div>
  );
}
