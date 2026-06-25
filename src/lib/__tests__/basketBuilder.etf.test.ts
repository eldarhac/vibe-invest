import { buildBasket } from "../basketBuilder";
import type { InvestmentCandidate } from "@/types/vibe";

const mixedCandidates: InvestmentCandidate[] = [
  { ticker: "GRID", name: "Grid ETF", type: "etf", category: "Grid", exposureType: "diversified", whyItFits: "", mainRisk: "", roleInBasket: "ETF core", confidence: "high" },
  { ticker: "CIBR", name: "Cyber ETF", type: "etf", category: "Cybersecurity", exposureType: "diversified", whyItFits: "", mainRisk: "", roleInBasket: "ETF thematic", confidence: "high" },
  { ticker: "NVDA", name: "NVIDIA", type: "stock", category: "AI Chips", exposureType: "direct", whyItFits: "", mainRisk: "", roleInBasket: "High conviction", confidence: "high" },
  { ticker: "VRT", name: "Vertiv", type: "stock", category: "Cooling", exposureType: "direct", whyItFits: "", mainRisk: "", roleInBasket: "Direct play", confidence: "medium" },
];

const etfOnlyCandidates = mixedCandidates.filter(c => c.type === "etf" || c.type === "fund");

describe("ETF-only basket", () => {
  it("contains only ETFs when filtered to ETF-only candidates", () => {
    const basket = buildBasket(etfOnlyCandidates, "etf-heavy", "ETF only");
    const nonEtf = basket.holdings.filter((h) => {
      const match = etfOnlyCandidates.find((c) => c.ticker === h.ticker);
      return match && match.type !== "etf" && match.type !== "fund";
    });
    expect(nonEtf).toHaveLength(0);
  });

  it("weights still sum to 100", () => {
    const basket = buildBasket(etfOnlyCandidates, "etf-heavy", "ETF only");
    const total = basket.holdings.reduce((s, h) => s + h.weight, 0);
    expect(Math.abs(total - 100)).toBeLessThan(0.5);
  });
});
