// src/lib/__tests__/basketBuilder.test.ts
import { buildBasket } from "../basketBuilder";
import { validateBasketWeights } from "../validators";
import type { InvestmentCandidate } from "@/types/vibe";

const makeCandidates = (overrides: Partial<InvestmentCandidate>[] = []): InvestmentCandidate[] => {
  const defaults: InvestmentCandidate[] = [
    { ticker: "GRID", name: "Grid ETF", type: "etf", category: "Grid", exposureType: "diversified", whyItFits: "", mainRisk: "", roleInBasket: "Core ETF", confidence: "high" },
    { ticker: "EQIX", name: "Equinix", type: "reit", category: "Data Centers", exposureType: "direct", whyItFits: "", mainRisk: "", roleInBasket: "Infrastructure", confidence: "high" },
    { ticker: "VRT", name: "Vertiv", type: "stock", category: "Cooling", exposureType: "direct", whyItFits: "", mainRisk: "", roleInBasket: "Direct exposure", confidence: "high" },
    { ticker: "ETN", name: "Eaton", type: "stock", category: "Grid Equipment", exposureType: "direct", whyItFits: "", mainRisk: "", roleInBasket: "Grid play", confidence: "medium" },
    { ticker: "NVDA", name: "NVIDIA", type: "stock", category: "AI Chips", exposureType: "direct", whyItFits: "", mainRisk: "", roleInBasket: "Growth", confidence: "high" },
    { ticker: "NEE", name: "NextEra", type: "stock", category: "Utilities", exposureType: "indirect", whyItFits: "", mainRisk: "", roleInBasket: "Defensive utility", confidence: "medium" },
    { ticker: "URA", name: "Uranium ETF", type: "etf", category: "Nuclear", exposureType: "speculative", whyItFits: "", mainRisk: "", roleInBasket: "Speculative thematic", confidence: "low" },
    { ticker: "AMD", name: "AMD", type: "stock", category: "AI Chips", exposureType: "direct", whyItFits: "", mainRisk: "", roleInBasket: "Growth", confidence: "medium" },
  ];
  return defaults.map((d, i) => ({ ...d, ...(overrides[i] ?? {}) }));
};

describe("buildBasket — weight validation", () => {
  const styles = ["conservative", "balanced", "aggressive", "etf-heavy", "stock-heavy"] as const;

  for (const style of styles) {
    it(`${style} basket weights sum to 100`, () => {
      const basket = buildBasket(makeCandidates(), style, "test");
      expect(validateBasketWeights(basket)).toBe(true);
    });
  }
});

describe("buildBasket — conservative", () => {
  it("excludes speculative candidates", () => {
    const basket = buildBasket(makeCandidates(), "conservative", "test");
    const tickers = basket.holdings.map((h) => h.ticker);
    expect(tickers).not.toContain("URA");
  });

  it("includes diversification note mentioning conservative", () => {
    const basket = buildBasket(makeCandidates(), "conservative", "test");
    expect(basket.diversificationNotes.toLowerCase()).toContain("conservative");
  });

  it("includes caveat that conservative is not risk-free", () => {
    const basket = buildBasket(makeCandidates(), "conservative", "test");
    const risks = basket.majorRisks.join(" ").toLowerCase();
    expect(risks).toMatch(/risk.free|risk free|not mean risk/);
  });
});

describe("buildBasket — aggressive", () => {
  it("includes speculative candidates", () => {
    const basket = buildBasket(makeCandidates(), "aggressive", "test");
    const tickers = basket.holdings.map((h) => h.ticker);
    expect(tickers).toContain("URA");
  });

  it("includes high concentration warning in risks", () => {
    const basket = buildBasket(makeCandidates(), "aggressive", "test");
    const risks = basket.majorRisks.join(" ").toLowerCase();
    expect(risks).toMatch(/concentration|drawdown/);
  });
});

describe("buildBasket — etf-heavy", () => {
  it("no single stock exceeds 10%", () => {
    const basket = buildBasket(makeCandidates(), "etf-heavy", "test");
    const stocks = basket.holdings.filter((h) => {
      const candidates = makeCandidates();
      const match = candidates.find((c) => c.ticker === h.ticker);
      return match && match.type !== "etf" && match.type !== "fund";
    });
    for (const stock of stocks) {
      expect(stock.weight).toBeLessThanOrEqual(10.1);
    }
  });
});

describe("buildBasket — balanced", () => {
  it("has at least 4 holdings when candidates available", () => {
    const basket = buildBasket(makeCandidates(), "balanced", "test");
    expect(basket.holdings.length).toBeGreaterThanOrEqual(4);
  });
});

describe("buildBasket — empty candidates", () => {
  it("returns empty holdings gracefully", () => {
    const basket = buildBasket([], "balanced", "test");
    expect(basket.holdings).toEqual([]);
  });
});
