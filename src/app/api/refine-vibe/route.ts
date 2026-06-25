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
