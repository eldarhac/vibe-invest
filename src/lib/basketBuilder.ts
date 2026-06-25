import type { InvestmentCandidate, SampleBasket, BasketHolding, BasketStyle } from "@/types/vibe";

const MAX_HOLDINGS: Record<BasketStyle, number> = {
  conservative: 8,
  balanced: 10,
  aggressive: 12,
  "etf-heavy": 8,
  "stock-heavy": 10,
};

const MAX_STOCK_WEIGHT: Record<BasketStyle, number> = {
  conservative: 15,
  balanced: 15,
  aggressive: 20,
  "etf-heavy": 10,
  "stock-heavy": 20,
};

const MAX_ETF_WEIGHT: Record<BasketStyle, number> = {
  conservative: 40,
  balanced: 30,
  aggressive: 25,
  "etf-heavy": 40,
  "stock-heavy": 25,
};

function filterCandidates(
  candidates: InvestmentCandidate[],
  style: BasketStyle
): InvestmentCandidate[] {
  if (style === "conservative") {
    return candidates.filter((c) => c.exposureType !== "speculative");
  }
  if (style === "etf-heavy") {
    const etfs = candidates.filter((c) => c.type === "etf" || c.type === "fund");
    const stocks = candidates.filter((c) => c.type !== "etf" && c.type !== "fund");
    return [...etfs, ...stocks];
  }
  if (style === "stock-heavy") {
    const stocks = candidates.filter((c) => c.type !== "etf" && c.type !== "fund");
    const etfs = candidates.filter((c) => c.type === "etf" || c.type === "fund");
    return [...stocks, ...etfs];
  }
  return candidates;
}

function sortByDirectness(candidates: InvestmentCandidate[]): InvestmentCandidate[] {
  const score: Record<string, number> = { direct: 0, diversified: 1, indirect: 2, speculative: 3 };
  return [...candidates].sort(
    (a, b) => (score[a.exposureType] ?? 3) - (score[b.exposureType] ?? 3)
  );
}

function assignRawWeights(
  candidates: InvestmentCandidate[],
  style: BasketStyle
): { candidate: InvestmentCandidate; weight: number }[] {
  return candidates.map((c) => {
    const isEtf = c.type === "etf" || c.type === "fund";
    let base: number;

    if (isEtf) {
      base = style === "etf-heavy" ? 20 : style === "stock-heavy" ? 10 : 15;
      base = Math.min(base, MAX_ETF_WEIGHT[style]);
    } else {
      base = style === "stock-heavy" ? 15 : style === "etf-heavy" ? 6 : 10;
      if (c.exposureType === "direct") base = Math.round(base * 1.3);
      base = Math.min(base, MAX_STOCK_WEIGHT[style]);
    }

    return { candidate: c, weight: base };
  });
}

function normalizeWeights(
  weighted: { candidate: InvestmentCandidate; weight: number }[]
): BasketHolding[] {
  if (weighted.length === 0) return [];
  const total = weighted.reduce((s, w) => s + w.weight, 0);
  if (total === 0) return [];

  const holdings: BasketHolding[] = weighted.map((w) => ({
    ticker: w.candidate.ticker,
    name: w.candidate.name,
    weight: Math.round((w.weight / total) * 1000) / 10,
    role: w.candidate.roleInBasket,
  }));

  const sum = holdings.reduce((s, h) => s + h.weight, 0);
  const diff = Math.round((100 - sum) * 10) / 10;
  if (Math.abs(diff) > 0.001 && holdings.length > 0) {
    holdings[0].weight = Math.round((holdings[0].weight + diff) * 10) / 10;
  }

  return holdings;
}

function concentrationScore(holdings: BasketHolding[]): number {
  if (holdings.length === 0) return 0;
  return Math.round(Math.max(...holdings.map((h) => h.weight)));
}

function diversificationNotes(style: BasketStyle, count: number): string {
  switch (style) {
    case "conservative":
      return `This conservative sample includes ${count} positions emphasizing ETFs and broad diversification. Note: conservative does not mean risk-free.`;
    case "aggressive":
      return `This growth-oriented sample includes ${count} positions with higher concentration in direct-exposure stocks.`;
    case "etf-heavy":
      return `This ETF-focused sample includes ${count} positions, heavily weighted toward diversified fund exposure.`;
    case "stock-heavy":
      return `This stock-focused sample includes ${count} positions, weighted toward individual company exposure.`;
    default:
      return `This balanced sample includes ${count} positions across the theme.`;
  }
}

function majorRisks(style: BasketStyle): string[] {
  const common = [
    "Sample weights are illustrative only — not personalized recommendations.",
    "All equities carry market risk. Themes can underperform even when the trend is correct.",
    "Theme risk: if the underlying trend does not materialize, all holdings may underperform.",
  ];
  if (style === "aggressive") {
    return [
      ...common,
      "High concentration risk: aggressive baskets can experience larger drawdowns than diversified portfolios.",
    ];
  }
  if (style === "conservative") {
    return [
      ...common,
      "Conservative does not mean risk-free. All equity positions carry market and sector risk.",
    ];
  }
  return common;
}

function basketName(style: BasketStyle): string {
  const names: Record<BasketStyle, string> = {
    conservative: "Conservative Sample Basket",
    balanced: "Balanced Sample Basket",
    aggressive: "Growth-Oriented Sample Basket",
    "etf-heavy": "ETF-Focused Sample Basket",
    "stock-heavy": "Stock-Focused Sample Basket",
  };
  return names[style];
}

export function buildBasket(
  candidates: InvestmentCandidate[],
  style: BasketStyle,
  description: string
): SampleBasket {
  if (candidates.length === 0) {
    return {
      name: basketName(style),
      description,
      style,
      holdings: [],
      concentrationScore: 0,
      diversificationNotes: "No candidates available for this basket.",
      majorRisks: majorRisks(style),
    };
  }

  const filtered = filterCandidates(candidates, style);
  const sorted = sortByDirectness(filtered);
  const selected = sorted.slice(0, MAX_HOLDINGS[style]);
  const weighted = assignRawWeights(selected, style);
  const holdings = normalizeWeights(weighted);

  return {
    name: basketName(style),
    description,
    style,
    holdings,
    concentrationScore: concentrationScore(holdings),
    diversificationNotes: diversificationNotes(style, holdings.length),
    majorRisks: majorRisks(style),
  };
}
