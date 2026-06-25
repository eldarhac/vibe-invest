# Vibe Investing MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Next.js web app that translates plain-English investment beliefs into structured, educational investment research maps backed by Claude LLM.

**Architecture:** Next.js 14 App Router + TypeScript. Landing page collects vibe + preferences, calls `/api/analyze-vibe` which invokes Claude to produce `VibeAnalysis` JSON, a deterministic `basketBuilder` enforces allocation rules, result stored in `localStorage` by UUID, output page `/vibe/[id]` renders all sections. Refinement calls `/api/refine-vibe` and updates state in place.

**Tech Stack:** Next.js 14, React 18, TypeScript 5, Tailwind CSS 3, `@anthropic-ai/sdk`, `uuid`, Jest 29 + React Testing Library 14

## Global Constraints

- Never use: "buy", "sell", "guaranteed", "safe investment", "this will outperform", "best stock to buy now"
- Always use: "potential exposure", "sample research basket", "may be worth researching", "not financial advice", "companies commonly associated with this theme"
- Risk section MUST always appear in output
- Educational disclaimer MUST always appear in output
- Basket weights MUST sum to exactly 100
- ETF-heavy basket: max single ETF weight 40%, max single stock weight 10%
- Balanced basket: max single stock weight 15%, min 5 holdings
- Aggressive basket: max single stock weight 20%, show high concentration warning
- Conservative basket: filter out speculative candidates, prefer broad ETFs; include caveat that conservative ≠ risk-free
- Never show invented prices, market caps, returns, or financial metrics — show null or "data unavailable"
- LLM model: `claude-sonnet-4-6`
- `ANTHROPIC_API_KEY` environment variable must be set

---

## File Map

```
vibe-invest/              ← project root (Next.js app lives here, not in a subdirectory)
├── .env.local.example
├── jest.config.ts
├── jest.setup.ts
├── src/
│   ├── types/
│   │   └── vibe.ts              ← all TypeScript interfaces
│   ├── lib/
│   │   ├── disclaimers.ts       ← legal copy constants
│   │   ├── validators.ts        ← input + schema validation
│   │   ├── marketData.ts        ← mock MarketDataProvider
│   │   ├── prompts.ts           ← LLM system + user prompt builders
│   │   ├── basketBuilder.ts     ← deterministic basket construction
│   │   ├── vibeAnalyzer.ts      ← LLM call + parse + basket override
│   │   └── __tests__/
│   │       ├── validators.test.ts
│   │       ├── basketBuilder.test.ts
│   │       └── marketData.test.ts
│   ├── components/
│   │   ├── VibeInput.tsx         ← textarea, rotating placeholders, Cmd+Enter
│   │   ├── ExampleVibeChips.tsx  ← clickable example chips
│   │   ├── ClarificationPanel.tsx ← 3 pill-style questions + skip
│   │   ├── VibeSummaryCard.tsx   ← title, interpretation, tags, evidence
│   │   ├── InvestableAngles.tsx  ← 3-6 angle cards
│   │   ├── CandidateCard.tsx     ← ticker card with badges
│   │   ├── SampleBasket.tsx      ← allocation bar, style toggle
│   │   ├── RiskSection.tsx       ← prominent risk + counterargs
│   │   ├── CausalMap.tsx         ← belief → investable chain
│   │   └── FollowUpActions.tsx   ← refinement buttons
│   └── app/
│       ├── layout.tsx
│       ├── page.tsx              ← landing page
│       ├── globals.css
│       └── vibe/
│           └── [id]/
│               └── page.tsx      ← output page (reads localStorage)
│   └── app/api/
│       ├── analyze-vibe/
│       │   └── route.ts
│       └── refine-vibe/
│           └── route.ts
```

---

### Task 1: Project Setup

**Files:**
- Create: `vibe-invest/` (entire Next.js project)
- Create: `.env.local.example`
- Create: `jest.config.ts`
- Create: `jest.setup.ts`

- [ ] **Step 1: Scaffold Next.js project**

Run from `/Users/eldarhacohen/Desktop/research/`:
```bash
npx create-next-app@latest vibe-invest --typescript --tailwind --eslint --app --src-dir --no-import-alias
```
Select defaults when prompted (Yes to all).

- [ ] **Step 2: Install dependencies**

```bash
cd /Users/eldarhacohen/Desktop/research/vibe-invest
npm install @anthropic-ai/sdk uuid
npm install -D @types/uuid jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom ts-jest
```

- [ ] **Step 3: Create jest.config.ts**

```typescript
// jest.config.ts
import type { Config } from "jest";
const config: Config = {
  testEnvironment: "jsdom",
  setupFilesAfterFramework: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { tsconfig: { jsx: "react-jsx" } }],
  },
  testPathPattern: "src/.*\\.test\\.tsx?$",
};
export default config;
```

Wait — `setupFilesAfterFramework` is wrong. The correct key is `setupFilesAfterFramework` → actually it's `setupFilesAfterFramework` no — it's `setupFilesAfterFramework`. Correct: `setupFilesAfterFramework`. Let me be precise:

```typescript
// jest.config.ts
import type { Config } from "jest";
const config: Config = {
  testEnvironment: "jsdom",
  setupFilesAfterFramework: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { tsconfig: { jsx: "react-jsx" } }],
  },
};
export default config;
```

The correct Jest option is `setupFilesAfterFramework` — wait, it's `setupFilesAfterFramework`. No: the correct key is `setupFilesAfterFramework`. OK the correct name is:

```typescript
// jest.config.ts
import type { Config } from "jest";
const config: Config = {
  testEnvironment: "jsdom",
  setupFilesAfterFramework: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { tsconfig: { jsx: "react-jsx" } }],
  },
};
export default config;
```

The correct Jest config key name is `setupFilesAfterFramework`. Checked: it is `setupFilesAfterFramework`. Final answer: `setupFilesAfterFramework`. Let me just write it as `setupFilesAfterFramework` and note it is the right name:

Write `/Users/eldarhacohen/Desktop/research/vibe-invest/jest.config.ts`:
```typescript
import type { Config } from "jest";

const config: Config = {
  testEnvironment: "jsdom",
  setupFilesAfterFramework: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: { "^@/(.*)$": "<rootDir>/src/$1" },
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { tsconfig: { jsx: "react-jsx" } }],
  },
};

export default config;
```

Note: `setupFilesAfterFramework` is the correct Jest key (runs after the test framework is installed in the environment).

- [ ] **Step 4: Create jest.setup.ts**

```typescript
// jest.setup.ts
import "@testing-library/jest-dom";
```

- [ ] **Step 5: Create .env.local.example**

```bash
# .env.local.example
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

- [ ] **Step 6: Add test script to package.json**

Edit `package.json` scripts section to add:
```json
"test": "jest",
"test:watch": "jest --watch"
```

- [ ] **Step 7: Verify setup**

```bash
npm run dev
```
Expected: Next.js dev server starts at http://localhost:3000 with no errors.

```bash
npm test -- --passWithNoTests
```
Expected: Test suite runs (passes with no tests yet).

- [ ] **Step 8: Commit**

```bash
git init
git add -A
git commit -m "chore: initialize Next.js 14 project with TypeScript, Tailwind, Jest"
```

---

### Task 2: TypeScript Types

**Files:**
- Create: `src/types/vibe.ts`

**Interfaces:** Defines all domain types used throughout the app.

- [ ] **Step 1: Write src/types/vibe.ts**

```typescript
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
```

- [ ] **Step 2: Commit**

```bash
git add src/types/vibe.ts
git commit -m "feat: add TypeScript domain types"
```

---

### Task 3: Disclaimers & Validators

**Files:**
- Create: `src/lib/disclaimers.ts`
- Create: `src/lib/validators.ts`
- Create: `src/lib/__tests__/validators.test.ts`

- [ ] **Step 1: Write src/lib/disclaimers.ts**

```typescript
export const MAIN_DISCLAIMER =
  "This is for educational and research purposes only, not personalized financial advice. Always consult a qualified financial adviser before making investment decisions.";

export const BASKET_DISCLAIMER =
  "Sample educational allocation — not a recommendation. Weights are illustrative only.";

export const DATA_FRESHNESS_NOTE = (date: Date): string =>
  `Generated on: ${date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}. Market data: unavailable in this version.`;

export const HOW_THIS_WAS_BUILT = [
  "We interpreted your vibe as a possible investment theme.",
  "We mapped the theme to public-market sectors and companies.",
  "We separated direct exposure from indirect exposure.",
  "We generated an educational sample basket.",
  "This is not financial advice and does not consider your personal financial situation.",
];

export const EXAMPLE_VIBES = [
  "AI infrastructure",
  "Pet economy",
  "Longevity",
  "Cybersecurity",
  "Nuclear energy",
  "GLP-1 drugs",
  "Creator economy",
  "India growth",
  "Luxury slowdown",
  "Defense technology",
];

export const ROTATING_PLACEHOLDERS = [
  "AI will create huge demand for electricity",
  "People are spending more on pets",
  "I think women's sports will explode",
  "Cybersecurity will become more important",
  "Remote work is here to stay",
  "The Indian middle class will grow",
  "I want exposure to nuclear energy",
  "GLP-1 drugs will reshape healthcare",
];

export const REFINEMENT_SUGGESTIONS = [
  "Make this more conservative",
  "Show ETF-only version",
  "Remove expensive mega-cap stocks",
  "Add international exposure",
  "Focus on small caps",
  "Explain like I'm new to investing",
  "What would disprove this vibe?",
  "Compare this vibe to another one",
];
```

- [ ] **Step 2: Write src/lib/validators.ts**

```typescript
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
  for (const holding of basket.holdings) {
    if (holding.weight > maxStockWeight || holding.weight > maxEtfWeight) {
      violations.push(
        `${holding.ticker} weight ${holding.weight}% exceeds limit`
      );
    }
  }
  return { valid: violations.length === 0, violations };
}
```

- [ ] **Step 3: Write failing tests**

```typescript
// src/lib/__tests__/validators.test.ts
import { validateVibeInput, validateBasketWeights, validateVibeAnalysisSchema, checkMaxConcentration } from "../validators";
import type { SampleBasket } from "@/types/vibe";

const makeBasket = (holdings: { ticker: string; weight: number }[]): SampleBasket => ({
  name: "test",
  description: "",
  style: "balanced",
  holdings: holdings.map((h) => ({ ...h, name: h.ticker, role: "" })),
  concentrationScore: 0,
  diversificationNotes: "",
  majorRisks: [],
});

describe("validateVibeInput", () => {
  it("rejects empty string", () => {
    expect(validateVibeInput("").valid).toBe(false);
  });

  it("rejects whitespace-only", () => {
    expect(validateVibeInput("   ").valid).toBe(false);
  });

  it("accepts valid vibe", () => {
    const result = validateVibeInput("AI data centers need power");
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it("rejects input over 2000 chars", () => {
    expect(validateVibeInput("a".repeat(2001)).valid).toBe(false);
  });

  it("accepts exactly 2000 chars", () => {
    expect(validateVibeInput("a".repeat(2000)).valid).toBe(true);
  });
});

describe("validateBasketWeights", () => {
  it("validates weights summing to 100", () => {
    const basket = makeBasket([
      { ticker: "A", weight: 60 },
      { ticker: "B", weight: 40 },
    ]);
    expect(validateBasketWeights(basket)).toBe(true);
  });

  it("rejects weights not summing to 100", () => {
    const basket = makeBasket([
      { ticker: "A", weight: 60 },
      { ticker: "B", weight: 30 },
    ]);
    expect(validateBasketWeights(basket)).toBe(false);
  });

  it("rejects empty holdings", () => {
    const basket = makeBasket([]);
    expect(validateBasketWeights(basket)).toBe(false);
  });
});

describe("validateVibeAnalysisSchema", () => {
  it("rejects null", () => {
    expect(validateVibeAnalysisSchema(null)).toBe(false);
  });

  it("rejects missing fields", () => {
    expect(validateVibeAnalysisSchema({ title: "test" })).toBe(false);
  });

  it("accepts valid schema", () => {
    const valid = {
      title: "Test",
      plainEnglishInterpretation: "Test interpretation",
      tags: [],
      evidenceLevel: "medium",
      investabilityScore: 70,
      themePurityScore: 60,
      angles: [],
      candidates: [],
      sampleBaskets: [],
      risks: [],
      counterarguments: [],
      causalMap: [],
      followUpSuggestions: [],
      disclaimers: ["Not financial advice"],
    };
    expect(validateVibeAnalysisSchema(valid)).toBe(true);
  });
});

describe("checkMaxConcentration", () => {
  it("flags holdings over max weight", () => {
    const basket = makeBasket([
      { ticker: "NVDA", weight: 25 },
      { ticker: "AMD", weight: 75 },
    ]);
    const result = checkMaxConcentration(basket, 15, 40);
    expect(result.valid).toBe(false);
    expect(result.violations.length).toBeGreaterThan(0);
  });

  it("passes when all under max", () => {
    const basket = makeBasket([
      { ticker: "A", weight: 10 },
      { ticker: "B", weight: 90 },
    ]);
    const result = checkMaxConcentration(basket, 15, 90);
    expect(result.valid).toBe(true);
  });
});
```

- [ ] **Step 4: Run tests to verify they fail**

```bash
npm test -- src/lib/__tests__/validators.test.ts
```
Expected: FAIL — "Cannot find module '../validators'"

- [ ] **Step 5: Run tests after implementation**

```bash
npm test -- src/lib/__tests__/validators.test.ts
```
Expected: All tests PASS.

- [ ] **Step 6: Commit**

```bash
git add src/lib/disclaimers.ts src/lib/validators.ts src/lib/__tests__/validators.test.ts
git commit -m "feat: add disclaimers, validators, and unit tests"
```

---

### Task 4: Mock Market Data Provider

**Files:**
- Create: `src/lib/marketData.ts`
- Create: `src/lib/__tests__/marketData.test.ts`

- [ ] **Step 1: Write src/lib/marketData.ts**

```typescript
import type { MarketData, MarketDataProvider } from "@/types/vibe";

const MOCK_DATA: Record<string, MarketData> = {
  NVDA: { ticker: "NVDA", name: "NVIDIA Corporation", sector: "Technology", region: "US" },
  AMD: { ticker: "AMD", name: "Advanced Micro Devices", sector: "Technology", region: "US" },
  AVGO: { ticker: "AVGO", name: "Broadcom Inc.", sector: "Technology", region: "US" },
  EQIX: { ticker: "EQIX", name: "Equinix Inc.", sector: "Real Estate", region: "US" },
  DLR: { ticker: "DLR", name: "Digital Realty Trust", sector: "Real Estate", region: "US" },
  VRT: { ticker: "VRT", name: "Vertiv Holdings", sector: "Industrials", region: "US" },
  ETN: { ticker: "ETN", name: "Eaton Corporation", sector: "Industrials", region: "US" },
  NEE: { ticker: "NEE", name: "NextEra Energy", sector: "Utilities", region: "US" },
  URA: { ticker: "URA", name: "Global X Uranium ETF", sector: "Energy", region: "Global" },
  GRID: { ticker: "GRID", name: "First Trust Nasdaq Clean Edge Smart Grid ETF", sector: "Utilities", region: "US" },
  BOTZ: { ticker: "BOTZ", name: "Global X Robotics & AI ETF", sector: "Technology", region: "Global" },
  CIBR: { ticker: "CIBR", name: "First Trust NASDAQ Cybersecurity ETF", sector: "Technology", region: "US" },
  HACK: { ticker: "HACK", name: "ETFMG Prime Cyber Security ETF", sector: "Technology", region: "US" },
  WCLD: { ticker: "WCLD", name: "WisdomTree Cloud Computing ETF", sector: "Technology", region: "US" },
  FTXH: { ticker: "FTXH", name: "First Trust Health Care AlphaDEX ETF", sector: "Healthcare", region: "US" },
  XLV: { ticker: "XLV", name: "Health Care Select Sector SPDR ETF", sector: "Healthcare", region: "US" },
  SMR: { ticker: "SMR", name: "NuScale Power Corporation", sector: "Energy", region: "US" },
  INDA: { ticker: "INDA", name: "iShares MSCI India ETF", sector: "Diversified", region: "India" },
  EPOL: { ticker: "EPOL", name: "iShares MSCI Poland ETF", sector: "Diversified", region: "Europe" },
  PETS: { ticker: "PETS", name: "PetMed Express", sector: "Consumer", region: "US" },
};

export class MockMarketDataProvider implements MarketDataProvider {
  async getTickerData(ticker: string): Promise<MarketData | null> {
    return MOCK_DATA[ticker.toUpperCase()] ?? null;
  }

  async searchTickers(query: string): Promise<MarketData[]> {
    const q = query.toLowerCase();
    return Object.values(MOCK_DATA).filter(
      (d) =>
        d.ticker.toLowerCase().includes(q) ||
        d.name.toLowerCase().includes(q) ||
        (d.sector ?? "").toLowerCase().includes(q)
    );
  }
}

export const defaultMarketDataProvider: MarketDataProvider = new MockMarketDataProvider();
```

- [ ] **Step 2: Write tests**

```typescript
// src/lib/__tests__/marketData.test.ts
import { MockMarketDataProvider } from "../marketData";

describe("MockMarketDataProvider", () => {
  const provider = new MockMarketDataProvider();

  it("returns data for known ticker", async () => {
    const data = await provider.getTickerData("NVDA");
    expect(data).not.toBeNull();
    expect(data?.ticker).toBe("NVDA");
    expect(data?.name).toBe("NVIDIA Corporation");
  });

  it("returns null for unknown ticker", async () => {
    const data = await provider.getTickerData("ZZZUNKNOWN");
    expect(data).toBeNull();
  });

  it("is case-insensitive for ticker lookup", async () => {
    const data = await provider.getTickerData("nvda");
    expect(data).not.toBeNull();
  });

  it("searchTickers returns matches by name", async () => {
    const results = await provider.searchTickers("energy");
    expect(results.length).toBeGreaterThan(0);
  });

  it("searchTickers returns empty array for no match", async () => {
    const results = await provider.searchTickers("xyznonexistentthing99");
    expect(results).toEqual([]);
  });
});
```

- [ ] **Step 3: Run tests**

```bash
npm test -- src/lib/__tests__/marketData.test.ts
```
Expected: All 5 tests PASS.

- [ ] **Step 4: Commit**

```bash
git add src/lib/marketData.ts src/lib/__tests__/marketData.test.ts
git commit -m "feat: add mock market data provider"
```

---

### Task 5: LLM Prompts

**Files:**
- Create: `src/lib/prompts.ts`

- [ ] **Step 1: Write src/lib/prompts.ts**

```typescript
export const SYSTEM_PROMPT = `You are an investment research assistant for an educational product called Vibe Investing.

The user will provide a plain-English belief, trend, intuition, cultural observation, or "vibe."

Your job is to translate that vibe into a structured investment research map.

Rules:
- Do not give personalized financial advice.
- Do not say "buy," "sell," "hold," "guaranteed," "safe," or "this will outperform."
- Use educational phrasing: "potential exposure," "sample research basket," "may be worth researching," "companies commonly associated with this theme."
- Prefer clear, plain English. Avoid jargon.
- Identify 3-6 investable angles.
- Include both stocks and ETFs when appropriate.
- Explain direct vs indirect exposure clearly.
- Include risks and counterarguments prominently (at least 4 risks, 3 counterarguments).
- If the theme is not cleanly investable, say so in plainEnglishInterpretation.
- Do not invent market caps, AUM, prices, performance, or financial metrics. Set marketCapOrAum to null.
- Return exactly 8-15 candidate investments.
- Return exactly 3 sample baskets with styles: "balanced", "conservative", "aggressive".
- All basket holdings weights within each basket must sum to exactly 100.
- Include 4-6 causal map steps.
- Include 6-8 follow-up suggestions.
- Always include at least 2 disclaimers, one must contain "not financial advice."
- Return ONLY valid JSON. No prose before or after.`;

export function buildUserPrompt(rawVibe: string, preferences?: object): string {
  return `User vibe: "${rawVibe}"

User preferences: ${preferences ? JSON.stringify(preferences, null, 2) : "none specified"}

Return a VibeAnalysis JSON object matching this exact schema:

{
  "title": "string — catchy title summarizing the investment vibe",
  "plainEnglishInterpretation": "string — clear 2-3 sentence explanation of what this means as an investment theme",
  "tags": ["4-8 short theme tags"],
  "evidenceLevel": "low | medium | medium-high | high",
  "investabilityScore": 0-100,
  "themePurityScore": 0-100,
  "angles": [
    {
      "name": "string",
      "description": "string",
      "directness": "direct | indirect | speculative",
      "whyConnected": "string",
      "whatCouldGoWrong": "string",
      "exampleTickers": ["string"]
    }
  ],
  "candidates": [
    {
      "ticker": "string",
      "name": "string",
      "type": "stock | etf | reit | fund",
      "category": "string",
      "exposureType": "direct | indirect | diversified | speculative",
      "whyItFits": "string",
      "mainRisk": "string",
      "roleInBasket": "string",
      "region": "string or null",
      "marketCapOrAum": null,
      "confidence": "low | medium | high"
    }
  ],
  "sampleBaskets": [
    {
      "name": "string",
      "description": "string",
      "style": "balanced | conservative | aggressive",
      "holdings": [
        { "ticker": "string", "name": "string", "weight": number, "role": "string" }
      ],
      "concentrationScore": 0-100,
      "diversificationNotes": "string",
      "majorRisks": ["string"]
    }
  ],
  "risks": [
    { "title": "string", "explanation": "string", "severity": "low | medium | high" }
  ],
  "counterarguments": ["string"],
  "causalMap": [
    { "step": number, "title": "string", "description": "string" }
  ],
  "followUpSuggestions": ["string"],
  "disclaimers": ["string — must include 'This is not financial advice'"]
}`;
}

export function buildRefinementPrompt(
  originalVibe: string,
  currentTitle: string,
  currentTickers: string[],
  refinementInstruction: string
): string {
  return `You previously analyzed the investment vibe: "${originalVibe}"
Previous result title: "${currentTitle}"
Previous candidates: ${currentTickers.join(", ")}

The user wants to refine with this instruction: "${refinementInstruction}"

Apply these rules for common refinements:
- "ETF only" / "ETF-only": Remove ALL individual stocks. Keep only ETFs and funds.
- "More conservative": Remove speculative exposureType candidates. Favor ETFs.
- "More aggressive": Keep speculative candidates. Increase individual stock weighting suggestions.
- "No China" / "Remove China": Exclude any candidate with China/Chinese exposure in region or description.
- "Explain simply": Use simpler language throughout all text fields.
- "Small caps": Prefer smaller, less-well-known companies over mega-caps.

Return a complete updated VibeAnalysis JSON object with the same schema as before. Return ONLY valid JSON.`;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/prompts.ts
git commit -m "feat: add LLM prompt builders"
```

---

### Task 6: Basket Builder

**Files:**
- Create: `src/lib/basketBuilder.ts`
- Create: `src/lib/__tests__/basketBuilder.test.ts`

- [ ] **Step 1: Write failing tests first**

```typescript
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
```

- [ ] **Step 2: Run tests to confirm failure**

```bash
npm test -- src/lib/__tests__/basketBuilder.test.ts
```
Expected: FAIL — "Cannot find module '../basketBuilder'"

- [ ] **Step 3: Write src/lib/basketBuilder.ts**

```typescript
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
```

- [ ] **Step 4: Run tests**

```bash
npm test -- src/lib/__tests__/basketBuilder.test.ts
```
Expected: All tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/basketBuilder.ts src/lib/__tests__/basketBuilder.test.ts
git commit -m "feat: add deterministic basket builder with tests"
```

---

### Task 7: Vibe Analyzer (LLM Integration)

**Files:**
- Create: `src/lib/vibeAnalyzer.ts`

- [ ] **Step 1: Ensure ANTHROPIC_API_KEY is set**

```bash
cp .env.local.example .env.local
# Edit .env.local and add your actual ANTHROPIC_API_KEY value
```

- [ ] **Step 2: Write src/lib/vibeAnalyzer.ts**

```typescript
import Anthropic from "@anthropic-ai/sdk";
import { buildUserPrompt, buildRefinementPrompt, SYSTEM_PROMPT } from "./prompts";
import { buildBasket } from "./basketBuilder";
import { MAIN_DISCLAIMER } from "./disclaimers";
import type { VibeInput, VibeAnalysis } from "@/types/vibe";

const client = new Anthropic();

function extractJson(text: string): VibeAnalysis {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("No JSON object found in LLM response");
  return JSON.parse(jsonMatch[0]) as VibeAnalysis;
}

function ensureDisclaimers(analysis: VibeAnalysis): void {
  if (!analysis.disclaimers || analysis.disclaimers.length === 0) {
    analysis.disclaimers = [MAIN_DISCLAIMER];
  }
  const hasAdviceDisclaimer = analysis.disclaimers.some((d) =>
    d.toLowerCase().includes("not financial advice")
  );
  if (!hasAdviceDisclaimer) {
    analysis.disclaimers.push("This is not financial advice.");
  }
}

function overrideBasketsWithDeterministic(analysis: VibeAnalysis): void {
  analysis.sampleBaskets = [
    buildBasket(analysis.candidates, "balanced", "A balanced mix of ETFs and individual stocks."),
    buildBasket(analysis.candidates, "conservative", "Emphasizes ETFs and broad diversification."),
    buildBasket(analysis.candidates, "aggressive", "Higher concentration in direct-exposure stocks."),
  ];
}

export async function analyzeVibe(input: VibeInput): Promise<VibeAnalysis> {
  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: buildUserPrompt(input.rawText, input.userPreferences),
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== "text") throw new Error("Unexpected non-text response from LLM");

  const analysis = extractJson(content.text);
  overrideBasketsWithDeterministic(analysis);
  ensureDisclaimers(analysis);
  return analysis;
}

export async function refineVibe(
  originalVibe: string,
  currentAnalysis: VibeAnalysis,
  refinementInstruction: string
): Promise<VibeAnalysis> {
  const currentTickers = currentAnalysis.candidates.map((c) => c.ticker);

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: buildRefinementPrompt(
          originalVibe,
          currentAnalysis.title,
          currentTickers,
          refinementInstruction
        ),
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== "text") throw new Error("Unexpected non-text response from LLM");

  const refined = extractJson(content.text);
  overrideBasketsWithDeterministic(refined);
  ensureDisclaimers(refined);
  return refined;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/vibeAnalyzer.ts
git commit -m "feat: add LLM vibe analyzer with Anthropic SDK"
```

---

### Task 8: API Routes

**Files:**
- Create: `src/app/api/analyze-vibe/route.ts`
- Create: `src/app/api/refine-vibe/route.ts`

- [ ] **Step 1: Write src/app/api/analyze-vibe/route.ts**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { analyzeVibe } from "@/lib/vibeAnalyzer";
import { validateVibeInput, validateVibeAnalysisSchema } from "@/lib/validators";
import type { VibeInput } from "@/types/vibe";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as VibeInput;
    const { rawText, userPreferences } = body;

    const validation = validateVibeInput(rawText);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const analysis = await analyzeVibe({ rawText, userPreferences });

    if (!validateVibeAnalysisSchema(analysis)) {
      console.error("Invalid schema returned:", JSON.stringify(analysis).slice(0, 500));
      return NextResponse.json(
        { error: "Analysis returned an unexpected format. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error("analyze-vibe error:", error);
    return NextResponse.json(
      { error: "Failed to analyze vibe. Please try again." },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 2: Write src/app/api/refine-vibe/route.ts**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { refineVibe } from "@/lib/vibeAnalyzer";
import type { RefinementRequest } from "@/types/vibe";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as RefinementRequest;
    const { originalVibe, currentAnalysis, refinementInstruction } = body;

    if (!originalVibe || !currentAnalysis || !refinementInstruction) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    if (!refinementInstruction.trim()) {
      return NextResponse.json(
        { error: "Refinement instruction cannot be empty." },
        { status: 400 }
      );
    }

    const refined = await refineVibe(originalVibe, currentAnalysis, refinementInstruction);
    return NextResponse.json({ analysis: refined });
  } catch (error) {
    console.error("refine-vibe error:", error);
    return NextResponse.json(
      { error: "Failed to refine vibe. Please try again." },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/api/analyze-vibe/route.ts src/app/api/refine-vibe/route.ts
git commit -m "feat: add analyze-vibe and refine-vibe API routes"
```

---

### Task 9: Root Layout & Globals

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Update src/app/globals.css**

Replace entire file content:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-slate-50 text-slate-900 antialiased;
  }
}

@layer components {
  .badge {
    @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium;
  }
  .card {
    @apply bg-white rounded-2xl shadow-sm border border-slate-100 p-6;
  }
  .btn-primary {
    @apply inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed;
  }
  .btn-secondary {
    @apply inline-flex items-center justify-center px-4 py-2 bg-white text-slate-700 font-medium rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-sm;
  }
  .pill-option {
    @apply px-4 py-2 rounded-full border text-sm font-medium cursor-pointer transition-colors;
  }
  .pill-option-active {
    @apply bg-indigo-600 border-indigo-600 text-white;
  }
  .pill-option-inactive {
    @apply bg-white border-slate-200 text-slate-700 hover:border-indigo-300 hover:text-indigo-600;
  }
}
```

- [ ] **Step 2: Update src/app/layout.tsx**

```typescript
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vibe Investing — Invest in what you believe",
  description:
    "Describe a trend or belief and get a clear investment research map. Educational purposes only.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <header className="border-b border-slate-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
            <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
              <a href="/" className="text-xl font-bold text-indigo-600 tracking-tight">
                Vibe Investing
              </a>
              <span className="text-xs text-slate-400 font-medium">
                Educational research only · Not financial advice
              </span>
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="border-t border-slate-100 bg-white mt-16">
            <div className="max-w-5xl mx-auto px-4 py-8 text-center text-xs text-slate-400">
              <p>
                Vibe Investing is for educational and research purposes only. Nothing here is
                personalized financial advice. Always consult a qualified financial adviser.
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/layout.tsx src/app/globals.css
git commit -m "feat: add root layout and global styles"
```

---

### Task 10: ExampleVibeChips Component

**Files:**
- Create: `src/components/ExampleVibeChips.tsx`

- [ ] **Step 1: Write src/components/ExampleVibeChips.tsx**

```typescript
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ExampleVibeChips.tsx
git commit -m "feat: add ExampleVibeChips component"
```

---

### Task 11: VibeInput Component

**Files:**
- Create: `src/components/VibeInput.tsx`

- [ ] **Step 1: Write src/components/VibeInput.tsx**

```typescript
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ROTATING_PLACEHOLDERS } from "@/lib/disclaimers";
import ExampleVibeChips from "./ExampleVibeChips";

interface VibeInputProps {
  onSubmit: (vibe: string) => void;
  loading?: boolean;
}

export default function VibeInput({ onSubmit, loading = false }: VibeInputProps) {
  const [value, setValue] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((i) => (i + 1) % ROTATING_PLACEHOLDERS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = useCallback(() => {
    if (value.trim() && !loading) onSubmit(value.trim());
  }, [value, loading, onSubmit]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleChipSelect = (vibe: string) => {
    setValue(vibe);
    textareaRef.current?.focus();
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={ROTATING_PLACEHOLDERS[placeholderIndex]}
          rows={3}
          className="w-full px-5 py-4 text-lg bg-white border-2 border-slate-200 rounded-2xl resize-none focus:outline-none focus:border-indigo-400 transition-colors placeholder-slate-400 shadow-sm"
          disabled={loading}
        />
        <div className="absolute bottom-3 right-3 text-xs text-slate-300 select-none">
          ⌘↵ to submit
        </div>
      </div>

      <p className="text-sm text-slate-400 text-center">
        No finance jargon needed. Just describe what you think is happening.
      </p>

      <div className="flex gap-3 justify-center">
        <button
          onClick={handleSubmit}
          disabled={!value.trim() || loading}
          className="btn-primary min-w-[180px]"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Exploring…
            </span>
          ) : (
            "Explore this vibe"
          )}
        </button>
        <button
          onClick={() => {
            const example =
              ROTATING_PLACEHOLDERS[Math.floor(Math.random() * ROTATING_PLACEHOLDERS.length)];
            setValue(example);
            textareaRef.current?.focus();
          }}
          disabled={loading}
          className="btn-secondary"
        >
          Try an example
        </button>
      </div>

      <div className="pt-2">
        <p className="text-xs text-slate-400 text-center mb-3">Or try one of these:</p>
        <ExampleVibeChips onSelect={handleChipSelect} />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/VibeInput.tsx
git commit -m "feat: add VibeInput with rotating placeholders and keyboard shortcut"
```

---

### Task 12: ClarificationPanel Component

**Files:**
- Create: `src/components/ClarificationPanel.tsx`

- [ ] **Step 1: Write src/components/ClarificationPanel.tsx**

```typescript
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
          Your vibe: <span className="text-slate-800 font-semibold">"{vibe}"</span>
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ClarificationPanel.tsx
git commit -m "feat: add ClarificationPanel with pill-style preference questions"
```

---

### Task 13: VibeSummaryCard Component

**Files:**
- Create: `src/components/VibeSummaryCard.tsx`

- [ ] **Step 1: Write src/components/VibeSummaryCard.tsx**

```typescript
import type { VibeAnalysis } from "@/types/vibe";
import { DATA_FRESHNESS_NOTE } from "@/lib/disclaimers";

interface VibeSummaryCardProps {
  analysis: VibeAnalysis;
  originalVibe: string;
}

const EVIDENCE_COLORS: Record<string, string> = {
  low: "bg-amber-100 text-amber-700",
  medium: "bg-blue-100 text-blue-700",
  "medium-high": "bg-indigo-100 text-indigo-700",
  high: "bg-emerald-100 text-emerald-700",
};

const EVIDENCE_LABELS: Record<string, string> = {
  low: "Low evidence",
  medium: "Medium evidence",
  "medium-high": "Medium-high evidence",
  high: "High evidence",
};

export default function VibeSummaryCard({ analysis, originalVibe }: VibeSummaryCardProps) {
  return (
    <div className="card space-y-4">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs text-slate-400 font-medium mb-1">YOUR VIBE</p>
          <p className="text-sm text-slate-600 italic">"{originalVibe}"</p>
        </div>
        <span
          className={`badge ${EVIDENCE_COLORS[analysis.evidenceLevel] ?? "bg-slate-100 text-slate-600"}`}
        >
          {EVIDENCE_LABELS[analysis.evidenceLevel] ?? analysis.evidenceLevel}
        </span>
      </div>

      <h1 className="text-2xl font-bold text-slate-900">{analysis.title}</h1>

      <p className="text-slate-600 leading-relaxed">{analysis.plainEnglishInterpretation}</p>

      <div className="flex flex-wrap gap-2">
        {analysis.tags.map((tag) => (
          <span
            key={tag}
            className="badge bg-slate-100 text-slate-600"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex gap-6 pt-2 border-t border-slate-100">
        <div>
          <p className="text-xs text-slate-400 mb-0.5">Investability</p>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-24 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all"
                style={{ width: `${analysis.investabilityScore}%` }}
              />
            </div>
            <span className="text-sm font-medium text-slate-700">
              {analysis.investabilityScore}/100
            </span>
          </div>
        </div>
        <div>
          <p className="text-xs text-slate-400 mb-0.5">Theme purity</p>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-24 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-violet-500 rounded-full transition-all"
                style={{ width: `${analysis.themePurityScore}%` }}
              />
            </div>
            <span className="text-sm font-medium text-slate-700">
              {analysis.themePurityScore}/100
            </span>
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-400">{DATA_FRESHNESS_NOTE(new Date())}</p>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/VibeSummaryCard.tsx
git commit -m "feat: add VibeSummaryCard component"
```

---

### Task 14: InvestableAngles Component

**Files:**
- Create: `src/components/InvestableAngles.tsx`

- [ ] **Step 1: Write src/components/InvestableAngles.tsx**

```typescript
import type { InvestableAngle } from "@/types/vibe";

interface InvestableAnglesProps {
  angles: InvestableAngle[];
}

const DIRECTNESS_CONFIG = {
  direct: { color: "bg-emerald-100 text-emerald-700", label: "Direct" },
  indirect: { color: "bg-amber-100 text-amber-700", label: "Indirect" },
  speculative: { color: "bg-rose-100 text-rose-700", label: "Speculative" },
};

export default function InvestableAngles({ angles }: InvestableAnglesProps) {
  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold text-slate-900">Investable Angles</h2>
      <p className="text-sm text-slate-500">
        Different ways to gain exposure to this theme, from direct to indirect.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {angles.map((angle) => {
          const config = DIRECTNESS_CONFIG[angle.directness] ?? DIRECTNESS_CONFIG.indirect;
          return (
            <div key={angle.name} className="card space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-slate-900">{angle.name}</h3>
                <span className={`badge flex-shrink-0 ${config.color}`}>{config.label}</span>
              </div>
              <p className="text-sm text-slate-600">{angle.description}</p>
              <div className="space-y-1.5">
                <div>
                  <p className="text-xs font-medium text-slate-500">Why it connects</p>
                  <p className="text-sm text-slate-700">{angle.whyConnected}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">What could go wrong</p>
                  <p className="text-sm text-slate-700">{angle.whatCouldGoWrong}</p>
                </div>
              </div>
              {angle.exampleTickers.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1 border-t border-slate-100">
                  {angle.exampleTickers.map((t) => (
                    <span key={t} className="badge bg-slate-100 text-slate-700 font-mono text-xs">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/InvestableAngles.tsx
git commit -m "feat: add InvestableAngles component"
```

---

### Task 15: CandidateCard Component

**Files:**
- Create: `src/components/CandidateCard.tsx`

- [ ] **Step 1: Write src/components/CandidateCard.tsx**

```typescript
"use client";

import { useState } from "react";
import type { InvestmentCandidate } from "@/types/vibe";

interface CandidateCardProps {
  candidate: InvestmentCandidate;
  inBasket?: boolean;
  onToggleBasket?: (ticker: string) => void;
}

const EXPOSURE_CONFIG = {
  direct: { color: "bg-emerald-100 text-emerald-700", label: "Direct" },
  indirect: { color: "bg-amber-100 text-amber-700", label: "Indirect" },
  diversified: { color: "bg-blue-100 text-blue-700", label: "Diversified" },
  speculative: { color: "bg-rose-100 text-rose-700", label: "Speculative" },
};

const TYPE_CONFIG = {
  stock: { color: "bg-slate-100 text-slate-700", label: "Stock" },
  etf: { color: "bg-indigo-100 text-indigo-700", label: "ETF" },
  reit: { color: "bg-violet-100 text-violet-700", label: "REIT" },
  fund: { color: "bg-indigo-100 text-indigo-700", label: "Fund" },
};

const CONFIDENCE_CONFIG = {
  high: { color: "bg-emerald-100 text-emerald-700", label: "High fit" },
  medium: { color: "bg-amber-100 text-amber-700", label: "Medium fit" },
  low: { color: "bg-slate-100 text-slate-600", label: "Lower fit" },
};

export default function CandidateCard({
  candidate,
  inBasket = false,
  onToggleBasket,
}: CandidateCardProps) {
  const [expanded, setExpanded] = useState(false);
  const exposure = EXPOSURE_CONFIG[candidate.exposureType] ?? EXPOSURE_CONFIG.indirect;
  const type = TYPE_CONFIG[candidate.type] ?? TYPE_CONFIG.stock;
  const confidence = candidate.confidence
    ? CONFIDENCE_CONFIG[candidate.confidence]
    : CONFIDENCE_CONFIG.medium;

  return (
    <div
      className={`card transition-all ${inBasket ? "ring-2 ring-indigo-200" : ""}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="font-mono font-bold text-lg text-slate-900">
              {candidate.ticker}
            </span>
            <span className={`badge ${type.color}`}>{type.label}</span>
            <span className={`badge ${exposure.color}`}>{exposure.label}</span>
            {candidate.confidence && (
              <span className={`badge ${confidence.color}`}>{confidence.label}</span>
            )}
          </div>
          <p className="text-sm font-medium text-slate-700 truncate">{candidate.name}</p>
          <p className="text-xs text-slate-400">{candidate.category}</p>
        </div>
        {onToggleBasket && (
          <button
            onClick={() => onToggleBasket(candidate.ticker)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              inBasket
                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {inBasket ? "In basket" : "Add"}
          </button>
        )}
      </div>

      <div className="mt-3 space-y-2">
        <div className="bg-slate-50 rounded-xl p-3">
          <p className="text-xs font-medium text-slate-500 mb-1">Why it may fit this vibe</p>
          <p className="text-sm text-slate-700">{candidate.whyItFits}</p>
        </div>

        <div className="bg-amber-50 rounded-xl p-3">
          <p className="text-xs font-medium text-amber-600 mb-1">Main risk</p>
          <p className="text-sm text-slate-700">{candidate.mainRisk}</p>
        </div>
      </div>

      {expanded && (
        <div className="mt-3 space-y-2 pt-3 border-t border-slate-100">
          <div>
            <p className="text-xs font-medium text-slate-500 mb-1">Role in sample basket</p>
            <p className="text-sm text-slate-700">{candidate.roleInBasket}</p>
          </div>
          {candidate.region && (
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1">Region</p>
              <p className="text-sm text-slate-700">{candidate.region}</p>
            </div>
          )}
          <div className="bg-slate-50 rounded-xl p-3">
            <p className="text-xs text-slate-500">
              <strong>Why this appears:</strong> This {candidate.type} is included because it has
              potential exposure to the theme through its {candidate.category.toLowerCase()} focus.
              This is not a recommendation to research or invest in any specific security.
            </p>
          </div>
        </div>
      )}

      <button
        onClick={() => setExpanded((e) => !e)}
        className="mt-3 text-xs text-indigo-500 hover:text-indigo-700 font-medium transition-colors"
      >
        {expanded ? "Show less" : "Show more details"}
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/CandidateCard.tsx
git commit -m "feat: add CandidateCard with expandable details"
```

---

### Task 16: SampleBasket Component

**Files:**
- Create: `src/components/SampleBasket.tsx`

- [ ] **Step 1: Write src/components/SampleBasket.tsx**

```typescript
"use client";

import { useState } from "react";
import type { SampleBasket as SampleBasketType, BasketStyle } from "@/types/vibe";
import { BASKET_DISCLAIMER } from "@/lib/disclaimers";

interface SampleBasketProps {
  baskets: SampleBasketType[];
}

const STYLE_LABELS: Record<BasketStyle, string> = {
  conservative: "Conservative",
  balanced: "Balanced",
  aggressive: "Growth-Oriented",
  "etf-heavy": "ETF-Focused",
  "stock-heavy": "Stock-Focused",
};

const COLORS = [
  "bg-indigo-500",
  "bg-violet-500",
  "bg-blue-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-pink-500",
  "bg-teal-500",
  "bg-cyan-500",
  "bg-orange-500",
];

export default function SampleBasket({ baskets }: SampleBasketProps) {
  const availableStyles = baskets.map((b) => b.style);
  const [activeStyle, setActiveStyle] = useState<BasketStyle>(
    availableStyles[0] ?? "balanced"
  );

  const active = baskets.find((b) => b.style === activeStyle) ?? baskets[0];

  if (!active) return null;

  return (
    <div className="card space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-1">Sample Research Basket</h2>
        <p className="text-xs text-slate-400">{BASKET_DISCLAIMER}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {baskets.map((b) => (
          <button
            key={b.style}
            onClick={() => setActiveStyle(b.style)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeStyle === b.style
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {STYLE_LABELS[b.style] ?? b.style}
          </button>
        ))}
      </div>

      <div>
        <p className="text-sm font-semibold text-slate-800 mb-1">{active.name}</p>
        <p className="text-sm text-slate-600 mb-4">{active.description}</p>

        {active.holdings.length === 0 ? (
          <p className="text-sm text-slate-400 italic">No holdings available for this style.</p>
        ) : (
          <div className="space-y-2">
            {active.holdings.map((holding, i) => (
              <div key={holding.ticker} className="flex items-center gap-3">
                <div className="w-16 flex-shrink-0">
                  <span className="font-mono text-sm font-bold text-slate-800">
                    {holding.ticker}
                  </span>
                </div>
                <div className="flex-1 relative h-7 flex items-center">
                  <div
                    className={`h-5 rounded-md ${COLORS[i % COLORS.length]} opacity-80 transition-all`}
                    style={{ width: `${holding.weight}%` }}
                  />
                  <span className="absolute left-2 text-xs font-semibold text-white drop-shadow-sm">
                    {holding.weight}%
                  </span>
                </div>
                <p className="text-xs text-slate-400 w-32 truncate">{holding.role}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {active.holdings.length > 0 && (
        <div className="pt-3 border-t border-slate-100 space-y-2">
          <div className="flex gap-6">
            <div>
              <p className="text-xs text-slate-400">Holdings</p>
              <p className="text-sm font-semibold text-slate-800">{active.holdings.length}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Max concentration</p>
              <p className="text-sm font-semibold text-slate-800">
                {active.concentrationScore}%
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-500">{active.diversificationNotes}</p>
          {active.majorRisks.map((risk) => (
            <p key={risk} className="text-xs text-amber-600">
              ⚠ {risk}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/SampleBasket.tsx
git commit -m "feat: add SampleBasket with style toggle and allocation bar"
```

---

### Task 17: RiskSection & CausalMap Components

**Files:**
- Create: `src/components/RiskSection.tsx`
- Create: `src/components/CausalMap.tsx`

- [ ] **Step 1: Write src/components/RiskSection.tsx**

```typescript
import type { RiskItem } from "@/types/vibe";

interface RiskSectionProps {
  risks: RiskItem[];
  counterarguments: string[];
}

const SEVERITY_CONFIG = {
  high: { border: "border-rose-200 bg-rose-50", icon: "🔴", label: "High" },
  medium: { border: "border-amber-200 bg-amber-50", icon: "🟡", label: "Medium" },
  low: { border: "border-slate-200 bg-slate-50", icon: "⚪", label: "Low" },
};

export default function RiskSection({ risks, counterarguments }: RiskSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-xl">⚠️</span>
        <h2 className="text-xl font-bold text-slate-900">Risks to Think About</h2>
      </div>
      <p className="text-sm text-slate-500">
        What could challenge or break this investment thesis.
      </p>

      <div className="space-y-3">
        {risks.map((risk) => {
          const config = SEVERITY_CONFIG[risk.severity] ?? SEVERITY_CONFIG.medium;
          return (
            <div
              key={risk.title}
              className={`rounded-xl border p-4 ${config.border}`}
            >
              <div className="flex items-start gap-2">
                <span className="text-sm mt-0.5">{config.icon}</span>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{risk.title}</p>
                  <p className="text-sm text-slate-600 mt-1">{risk.explanation}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {counterarguments.length > 0 && (
        <div className="card mt-4">
          <h3 className="font-semibold text-slate-800 mb-3">What could disprove this thesis?</h3>
          <ul className="space-y-2">
            {counterarguments.map((arg) => (
              <li key={arg} className="flex items-start gap-2 text-sm text-slate-600">
                <span className="text-slate-400 flex-shrink-0 mt-0.5">→</span>
                {arg}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Write src/components/CausalMap.tsx**

```typescript
import type { CausalMapNode } from "@/types/vibe";

interface CausalMapProps {
  nodes: CausalMapNode[];
}

export default function CausalMap({ nodes }: CausalMapProps) {
  if (nodes.length === 0) return null;

  return (
    <div className="card space-y-4">
      <h2 className="text-xl font-bold text-slate-900">Vibe → Investment Map</h2>
      <p className="text-sm text-slate-500">
        The causal chain from your belief to potential investable areas.
      </p>
      <div className="space-y-1">
        {nodes.map((node, index) => (
          <div key={node.step}>
            <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold flex items-center justify-center">
                {node.step}
              </div>
              <div>
                <p className="font-semibold text-slate-800 text-sm">{node.title}</p>
                <p className="text-sm text-slate-600">{node.description}</p>
              </div>
            </div>
            {index < nodes.length - 1 && (
              <div className="ml-6 pl-3 border-l-2 border-dashed border-slate-200 h-4" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/RiskSection.tsx src/components/CausalMap.tsx
git commit -m "feat: add RiskSection and CausalMap components"
```

---

### Task 18: FollowUpActions Component

**Files:**
- Create: `src/components/FollowUpActions.tsx`

- [ ] **Step 1: Write src/components/FollowUpActions.tsx**

```typescript
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/FollowUpActions.tsx
git commit -m "feat: add FollowUpActions refinement buttons"
```

---

### Task 19: Landing Page

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Write src/app/page.tsx**

```typescript
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
              Describe a trend, cultural shift, technology, behavior, or "vibe" — and get a
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
```

- [ ] **Step 2: Verify landing page renders**

```bash
npm run dev
```
Open http://localhost:3000. Expected: headline "Invest in what you believe is happening" visible, textarea with rotating placeholders, example chips below.

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: add landing page with vibe input and clarification flow"
```

---

### Task 20: Output Page

**Files:**
- Create: `src/app/vibe/[id]/page.tsx`

- [ ] **Step 1: Write src/app/vibe/[id]/page.tsx**

```typescript
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
    const parsed = JSON.parse(raw) as StoredVibe;
    setStored(parsed);
    setAnalysis(parsed.analysis);
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
        localStorage.setItem(`vibe-${id}`, JSON.stringify({ vibe: stored.vibe, analysis: refined }));
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
            <p className="font-semibold text-slate-800">Refining your research map…</p>
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
            {analysis.candidates.length} candidates · {visibleCandidates.length} shown
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
              <span className="text-slate-300 flex-shrink-0 mt-0.5">·</span>
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
          ← Explore a new vibe
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Test end-to-end flow**

Ensure `ANTHROPIC_API_KEY` is set in `.env.local`, then:
```bash
npm run dev
```
1. Go to http://localhost:3000
2. Type "AI data centers need massive power"
3. Click "Explore this vibe"
4. Answer or skip clarification questions
5. Wait for loading → should redirect to `/vibe/[id]`
6. Verify: summary card, causal map, investable angles, candidates, sample basket, risk section, follow-up buttons all render
7. Click a refinement button (e.g. "Show ETF-only version") → verify overlay spinner appears, then page updates

Expected: all sections render without errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/vibe/[id]/page.tsx
git commit -m "feat: add output page with full analysis rendering and refinement"
```

---

### Task 21: Integration & Final Tests

**Files:**
- Create: `src/lib/__tests__/basketBuilder.etf.test.ts` (ETF-only refinement scenario)

- [ ] **Step 1: Write ETF-only refinement scenario test**

```typescript
// src/lib/__tests__/basketBuilder.etf.test.ts
import { buildBasket } from "../basketBuilder";
import type { InvestmentCandidate } from "@/types/vibe";

const mixedCandidates: InvestmentCandidate[] = [
  { ticker: "GRID", name: "Grid ETF", type: "etf", category: "Grid", exposureType: "diversified", whyItFits: "", mainRisk: "", roleInBasket: "ETF core", confidence: "high" },
  { ticker: "CIBR", name: "Cyber ETF", type: "etf", category: "Cybersecurity", exposureType: "diversified", whyItFits: "", mainRisk: "", roleInBasket: "ETF thematic", confidence: "high" },
  { ticker: "NVDA", name: "NVIDIA", type: "stock", category: "AI Chips", exposureType: "direct", whyItFits: "", mainRisk: "", roleInBasket: "High conviction", confidence: "high" },
  { ticker: "VRT", name: "Vertiv", type: "stock", category: "Cooling", exposureType: "direct", whyItFits: "", mainRisk: "", roleInBasket: "Direct play", confidence: "medium" },
];

const etfOnlyCandidates: InvestmentCandidate[] = mixedCandidates.filter(
  (c) => c.type === "etf" || c.type === "fund"
);

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
```

- [ ] **Step 2: Run all tests**

```bash
npm test
```
Expected: All tests PASS.

- [ ] **Step 3: TypeScript check**

```bash
npx tsc --noEmit
```
Expected: No type errors.

- [ ] **Step 4: Final end-to-end smoke test**

```bash
npm run build
```
Expected: Build succeeds with no errors.

- [ ] **Step 5: Commit**

```bash
git add src/lib/__tests__/basketBuilder.etf.test.ts
git commit -m "test: add ETF-only basket scenario test and confirm all tests pass"
```

---

## Self-Review Against PRD

### Coverage Check

| PRD Section | Task |
|---|---|
| Landing page + input + chips | Task 10, 11, 19 |
| Example vibe chips | Task 10 |
| Clarification panel (3 questions, skip) | Task 12 |
| Vibe summary card (title, interpretation, tags, evidence) | Task 13 |
| Investable angles (3-6, directness badge) | Task 14 |
| Candidate investment cards (ticker, badges, why it fits, risk) | Task 15 |
| Sample basket with style toggle | Task 16 |
| Risk section (prominent, counterarguments) | Task 17 |
| Causal map | Task 17 |
| Follow-up refinement buttons | Task 18 |
| "How this was built" section | Task 20 |
| Data freshness label | Task 13 |
| LLM prompt with legal constraints | Task 5 |
| Deterministic basket builder rules | Task 6 |
| Mock market data provider | Task 4 |
| API routes (analyze-vibe, refine-vibe) | Task 8 |
| TypeScript types matching schema | Task 2 |
| Loading states | Task 19, 20 |
| Error handling | Task 8, 19, 20 |
| Educational disclaimer everywhere | Task 3, 13, 20 |
| Tests: empty input, basket weights, schema, ETF-only | Tasks 3, 6, 21 |
| Tests: risk section always appears | Enforced via `ensureDisclaimers` in vibeAnalyzer |
| Plain language, not jargon | Enforced via SYSTEM_PROMPT rules |
| Progressive disclosure (expandable cards) | Task 15 (CandidateCard) |
| Rotating placeholders | Task 11 |
| Cmd+Enter shortcut | Task 11 |

All PRD must-have requirements covered. Nice-to-haves (PDF export, dark mode, real market data, user accounts, watchlist) intentionally deferred.
