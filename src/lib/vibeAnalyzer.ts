import OpenAI from "openai";
import { buildUserPrompt, buildRefinementPrompt, SYSTEM_PROMPT } from "./prompts";
import { buildBasket } from "./basketBuilder";
import { MAIN_DISCLAIMER } from "./disclaimers";
import type { VibeInput, VibeAnalysis } from "@/types/vibe";

const client = new OpenAI();

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

const WEB_SEARCH_TOOL = [{ type: "web_search_preview" as const }];

async function callLLM(systemPrompt: string, userPrompt: string): Promise<string> {
  const response = await client.responses.create({
    model: "gpt-4o-mini",
    tools: WEB_SEARCH_TOOL,
    input: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });
  if (!response.output_text) throw new Error("Unexpected empty response from LLM");
  return response.output_text;
}

export async function analyzeVibe(input: VibeInput): Promise<VibeAnalysis> {
  const text = await callLLM(SYSTEM_PROMPT, buildUserPrompt(input.rawText, input.userPreferences));
  const analysis = extractJson(text);
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
  const text = await callLLM(
    SYSTEM_PROMPT,
    buildRefinementPrompt(originalVibe, currentAnalysis.title, currentTickers, refinementInstruction)
  );
  const refined = extractJson(text);
  overrideBasketsWithDeterministic(refined);
  ensureDisclaimers(refined);
  return refined;
}
