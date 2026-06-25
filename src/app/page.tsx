"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import VibeInput from "@/components/VibeInput";
import ClarificationPanel from "@/components/ClarificationPanel";
import type { VibeInput as VibeInputType, VibeAnalysis } from "@/types/vibe";

type Stage = "input" | "clarify" | "loading" | "error";

export default function LandingPage() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("input");
  const [vibe, setVibe] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleVibeSubmit = useCallback((rawVibe: string) => {
    setVibe(rawVibe);
    setStage("clarify");
  }, []);

  const handlePreferencesSubmit = useCallback(
    async (preferences: VibeInputType["userPreferences"]) => {
      setStage("loading");
      setError(null);

      try {
        const response = await fetch("/api/analyze-vibe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rawText: vibe, userPreferences: preferences }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error ?? "Something went wrong.");
        }

        const { analysis }: { analysis: VibeAnalysis } = await response.json();
        const id = crypto.randomUUID();
        localStorage.setItem(`vibe-${id}`, JSON.stringify({ vibe, analysis }));
        router.push(`/vibe/${id}`);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
        setStage("error");
      }
    },
    [vibe, router]
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-16 space-y-12">
      {(stage === "input" || stage === "error") && (
        <>
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h1 className="text-5xl font-bold text-slate-900 tracking-tight leading-tight">
              Invest in what you{" "}
              <span className="text-indigo-600">believe</span> is happening.
            </h1>
            <p className="text-xl text-slate-500">
              Describe a trend, cultural shift, technology, behavior, or &ldquo;vibe&rdquo; — and get a
              clear investment research map in seconds.
            </p>
            <p className="text-sm text-slate-400">
              Educational research only · Not financial advice
            </p>
          </div>

          {error && (
            <div className="max-w-2xl mx-auto bg-rose-50 border border-rose-200 rounded-xl p-4 text-sm text-rose-700">
              {error}
            </div>
          )}

          <VibeInput onSubmit={handleVibeSubmit} />
        </>
      )}

      {stage === "clarify" && (
        <ClarificationPanel
          vibe={vibe}
          onSubmit={handlePreferencesSubmit}
          loading={false}
        />
      )}

      {stage === "loading" && (
        <div className="text-center space-y-6 py-16">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />
          <div>
            <p className="text-xl font-semibold text-slate-800">Building your research map…</p>
            <p className="text-slate-500 mt-2">
              Analyzing the vibe, identifying investable angles, and structuring the output.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
