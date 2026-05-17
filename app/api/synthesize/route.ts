import { NextRequest, NextResponse } from 'next/server';
import { callGemini, parseJSON } from '@/lib/gemini';
import { SYSTEM_SYNTHESIS, buildSynthesisPrompt } from '@/lib/prompts';
import { SynthesisResult } from '@/lib/types';

interface SynthesisInput {
  name: string;
  age: number;
  occupation: string;
  response: string;
  score: number;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { results } = body as { results: SynthesisInput[] };

    if (!Array.isArray(results) || results.length === 0) {
      return NextResponse.json({ success: false, error: 'No results to synthesize.' }, { status: 400 });
    }

    let raw: string;
    try {
      raw = await callGemini(buildSynthesisPrompt(results), SYSTEM_SYNTHESIS, 2048);
    } catch (err) {
      console.error('Gemini synthesis call failed:', err);
      return NextResponse.json({ success: false, error: 'Synthesis failed. Please try again.' }, { status: 500 });
    }

    let synthesis: SynthesisResult;
    try {
      synthesis = parseJSON<SynthesisResult>(raw);
    } catch {
      try {
        const retryRaw = await callGemini(
          buildSynthesisPrompt(results) + '\n\nIMPORTANT: Respond ONLY with valid JSON.',
          SYSTEM_SYNTHESIS,
          2048
        );
        synthesis = parseJSON<SynthesisResult>(retryRaw);
      } catch (err) {
        console.error('Synthesis JSON parse failed:', err);
        return NextResponse.json({ success: false, error: 'Synthesis failed. Please try again.' }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true, data: synthesis });
  } catch (error) {
    console.error('synthesize error:', error);
    return NextResponse.json(
      { success: false, error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
