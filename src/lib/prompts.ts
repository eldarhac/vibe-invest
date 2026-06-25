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
