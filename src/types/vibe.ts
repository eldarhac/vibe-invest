export type ExposurePreference = "etfs" | "stocks" | "mixed" | "unsure";
export type RiskLevel = "low" | "medium" | "high";
export type Geography = "us" | "global" | "developed" | "emerging" | "unsure";
export type Concentration = "broad" | "balanced" | "focused";
export type TimeHorizon = "short" | "medium" | "long" | "unsure";

export type VibeInput = {
  rawText: string;
  userPreferences?: {
    exposurePreference?: ExposurePreference;
    riskLevel?: RiskLevel;
    geography?: Geography;
    concentration?: Concentration;
    timeHorizon?: TimeHorizon;
  };
};

export type EvidenceLevel = "low" | "medium" | "medium-high" | "high";

export type InvestableAngle = {
  name: string;
  description: string;
  directness: "direct" | "indirect" | "speculative";
  whyConnected: string;
  whatCouldGoWrong: string;
  exampleTickers: string[];
};

export type ExposureType = "direct" | "indirect" | "diversified" | "speculative";
export type InvestmentType = "stock" | "etf" | "reit" | "fund";

export type InvestmentCandidate = {
  ticker: string;
  name: string;
  type: InvestmentType;
  category: string;
  exposureType: ExposureType;
  whyItFits: string;
  mainRisk: string;
  roleInBasket: string;
  region?: string | null;
  marketCapOrAum?: string | null;
  confidence?: "low" | "medium" | "high";
};

export type BasketStyle = "conservative" | "balanced" | "aggressive" | "etf-heavy" | "stock-heavy";

export type BasketHolding = {
  ticker: string;
  name: string;
  weight: number;
  role: string;
};

export type SampleBasket = {
  name: string;
  description: string;
  style: BasketStyle;
  holdings: BasketHolding[];
  concentrationScore: number;
  diversificationNotes: string;
  majorRisks: string[];
};

export type RiskSeverity = "low" | "medium" | "high";

export type RiskItem = {
  title: string;
  explanation: string;
  severity: RiskSeverity;
};

export type CausalMapNode = {
  step: number;
  title: string;
  description: string;
};

export type VibeAnalysis = {
  title: string;
  plainEnglishInterpretation: string;
  tags: string[];
  evidenceLevel: EvidenceLevel;
  investabilityScore: number;
  themePurityScore: number;
  angles: InvestableAngle[];
  candidates: InvestmentCandidate[];
  sampleBaskets: SampleBasket[];
  risks: RiskItem[];
  counterarguments: string[];
  causalMap: CausalMapNode[];
  followUpSuggestions: string[];
  disclaimers: string[];
};

export type RefinementRequest = {
  originalVibe: string;
  currentAnalysis: VibeAnalysis;
  refinementInstruction: string;
};

export type MarketData = {
  ticker: string;
  name: string;
  price?: number;
  marketCap?: number;
  aum?: number;
  expenseRatio?: number;
  oneYearReturn?: number;
  sector?: string;
  region?: string;
  lastUpdated?: string;
};

export interface MarketDataProvider {
  getTickerData(ticker: string): Promise<MarketData | null>;
  searchTickers(query: string): Promise<MarketData[]>;
}
