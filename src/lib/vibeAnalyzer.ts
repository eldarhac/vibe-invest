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
