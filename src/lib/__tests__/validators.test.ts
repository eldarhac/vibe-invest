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
