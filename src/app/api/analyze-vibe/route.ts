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
