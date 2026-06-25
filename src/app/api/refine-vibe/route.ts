import { NextRequest, NextResponse } from "next/server";
import { refineVibe } from "@/lib/vibeAnalyzer";
import { validateVibeAnalysisSchema } from "@/lib/validators";
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

    if (refinementInstruction.trim().length > 500) {
      return NextResponse.json(
        { error: "Refinement instruction too long." },
        { status: 400 }
      );
    }

    const refined = await refineVibe(originalVibe, currentAnalysis, refinementInstruction);

    if (!validateVibeAnalysisSchema(refined)) {
      return NextResponse.json(
        { error: "Refinement returned an unexpected format. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ analysis: refined });
  } catch (error) {
    console.error("refine-vibe error:", error);
    return NextResponse.json(
      { error: "Failed to refine vibe. Please try again." },
      { status: 500 }
    );
  }
}
