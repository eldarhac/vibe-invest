"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import type { VibeAnalysis } from "@/types/vibe";
import VibeSummaryCard from "@/components/VibeSummaryCard";
import InvestableAngles from "@/components/InvestableAngles";
import CandidateCard from "@/components/CandidateCard";
import SampleBasket from "@/components/SampleBasket";
import RiskSection from "@/components/RiskSection";
import CausalMap from "@/components/CausalMap";
import FollowUpActions from "@/components/FollowUpActions";
import { HOW_THIS_WAS_BUILT } from "@/lib/disclaimers";

type StoredVibe = { vibe: string; analysis: VibeAnalysis };

function SkeletonCard() {
  return (
    <div className="card animate-pulse">
      <div className="h-4 bg-slate-200 rounded w-1/4 mb-4" />
      <div className="h-6 bg-slate-200 rounded w-3/4 mb-3" />
      <div className="h-4 bg-slate-200 rounded w-full mb-2" />
      <div className="h-4 bg-slate-200 rounded w-5/6" />
    </div>
  );
}

export default function VibePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [stored, setStored] = useState<StoredVibe | null>(null);
  const [analysis, setAnalysis] = useState<VibeAnalysis | null>(null);
  const [refining, setRefining] = useState(false);
  const [refineError, setRefineError] = useState<string | null>(null);
  const [showAllCandidates, setShowAllCandidates] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(`vibe-${id}`);
    if (!raw) {
      setNotFound(true);
      return;
    }
    try {
      const parsed = JSON.parse(raw) as StoredVibe;
      setStored(parsed);
      setAnalysis(parsed.analysis);
    } catch {
      setNotFound(true);
    }
  }, [id]);

  const handleRefine = useCallback(
    async (instruction: string) => {
      if (!stored || !analysis) return;
      setRefining(true);
      setRefineError(null);

      try {
        const response = await fetch("/api/refine-vibe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            originalVibe: stored.vibe,
            currentAnalysis: analysis,
            refinementInstruction: instruction,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error ?? "Refinement failed.");
        }

        const { analysis: refined }: { analysis: VibeAnalysis } = await response.json();
        setAnalysis(refined);
        localStorage.setItem(
          `vibe-${id}`,
          JSON.stringify({ vibe: stored.vibe, analysis: refined })
        );
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (err) {
        setRefineError(err instanceof Error ? err.message : "Refinement failed.");
      } finally {
        setRefining(false);
      }
    },
    [stored, analysis, id]
  );

  if (notFound) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <p className="text-2xl font-bold text-slate-900">Research map not found</p>
        <p className="text-slate-500">
          This link may have expired or was opened in a different browser.
        </p>
        <button onClick={() => router.push("/")} className="btn-primary">
          Start a new vibe
        </button>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  const visibleCandidates = showAllCandidates
    ? analysis.candidates
    : analysis.candidates.slice(0, 8);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {refining && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />
            <p className="font-semibold text-slate-800">Refining your research map&hellip;</p>
          </div>
        </div>
      )}

      {refineError && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-sm text-rose-700">
          {refineError}
        </div>
      )}

      <VibeSummaryCard analysis={analysis} originalVibe={stored?.vibe ?? ""} />

      <CausalMap nodes={analysis.causalMap} />

      <InvestableAngles angles={analysis.angles} />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Candidate Investments</h2>
          <span className="text-sm text-slate-400">
            {analysis.candidates.length} candidates &middot; {visibleCandidates.length} shown
          </span>
        </div>
        <p className="text-xs text-slate-400">
          Companies commonly associated with this theme. Not a recommendation to invest.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {visibleCandidates.map((c) => (
            <CandidateCard key={c.ticker} candidate={c} />
          ))}
        </div>
        {!showAllCandidates && analysis.candidates.length > 8 && (
          <button
            onClick={() => setShowAllCandidates(true)}
            className="btn-secondary w-full justify-center"
          >
            Show {analysis.candidates.length - 8} more candidates
          </button>
        )}
      </div>

      <SampleBasket baskets={analysis.sampleBaskets} />

      <RiskSection
        risks={analysis.risks}
        counterarguments={analysis.counterarguments}
      />

      <FollowUpActions
        suggestions={analysis.followUpSuggestions}
        onRefine={handleRefine}
        loading={refining}
      />

      <div className="card bg-slate-50 space-y-3">
        <h3 className="font-semibold text-slate-700">How this research map was built</h3>
        <ul className="space-y-1">
          {HOW_THIS_WAS_BUILT.map((line) => (
            <li key={line} className="text-sm text-slate-500 flex items-start gap-2">
              <span className="text-slate-300 flex-shrink-0 mt-0.5">&middot;</span>
              {line}
            </li>
          ))}
        </ul>
      </div>

      <div className="card space-y-2">
        <h3 className="font-semibold text-slate-700">Disclaimers</h3>
        {analysis.disclaimers.map((d) => (
          <p key={d} className="text-xs text-slate-500">
            {d}
          </p>
        ))}
      </div>

      <div className="text-center">
        <button onClick={() => router.push("/")} className="btn-secondary">
          &larr; Explore a new vibe
        </button>
      </div>
    </div>
  );
}
