import type { VibeAnalysis, SampleBasket } from "@/types/vibe";

export function validateVibeInput(raw: string): { valid: boolean; error?: string } {
  if (!raw || raw.trim().length === 0) {
    return { valid: false, error: "Please enter a vibe to explore." };
  }
  if (raw.trim().length > 2000) {
    return { valid: false, error: "Please keep your vibe under 2000 characters." };
  }
  return { valid: true };
}

export function validateBasketWeights(basket: SampleBasket): boolean {
  if (basket.holdings.length === 0) return false;
  const total = basket.holdings.reduce((sum, h) => sum + h.weight, 0);
  return Math.abs(total - 100) < 0.5;
}

export function validateVibeAnalysisSchema(data: unknown): data is VibeAnalysis {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;
  return (
    typeof d.title === "string" &&
    typeof d.plainEnglishInterpretation === "string" &&
    Array.isArray(d.tags) &&
    Array.isArray(d.angles) &&
    Array.isArray(d.candidates) &&
    Array.isArray(d.sampleBaskets) &&
    Array.isArray(d.risks) &&
    Array.isArray(d.disclaimers)
  );
}

export function checkMaxConcentration(
  basket: SampleBasket,
  maxStockWeight: number,
  maxEtfWeight: number
): { valid: boolean; violations: string[] } {
  const violations: string[] = [];
  const maxWeight = Math.max(maxStockWeight, maxEtfWeight);
  for (const holding of basket.holdings) {
    if (holding.weight > maxWeight) {
      violations.push(
        `${holding.ticker} weight ${holding.weight}% exceeds limit`
      );
    }
  }
  return { valid: violations.length === 0, violations };
}
