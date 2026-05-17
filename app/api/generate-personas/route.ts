import { NextRequest, NextResponse } from 'next/server';
import { callGemini, parseJSON } from '@/lib/gemini';
import { SYSTEM_PERSONA_GENERATION, buildPersonaGenerationPrompt } from '@/lib/prompts';
import { ExtractedContext, Persona } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { context } = body as { context: ExtractedContext };

    if (!context?.productCategory) {
      return NextResponse.json({ success: false, error: 'Invalid context provided.' }, { status: 400 });
    }

    let raw: string;
    try {
      raw = await callGemini(buildPersonaGenerationPrompt(context), SYSTEM_PERSONA_GENERATION, 8192);
    } catch (err) {
      console.error('Gemini call failed:', err);
      return NextResponse.json({ success: false, error: 'Something went wrong generating personas. Please try again.' }, { status: 500 });
    }

    let personas: Persona[];
    try {
      personas = parseJSON<Persona[]>(raw);
    } catch {
      try {
        const retryRaw = await callGemini(
          buildPersonaGenerationPrompt(context) + '\n\nIMPORTANT: Respond ONLY with a valid JSON array, no other text.',
          SYSTEM_PERSONA_GENERATION,
          8192
        );
        personas = parseJSON<Persona[]>(retryRaw);
      } catch (err) {
        console.error('JSON parse failed after retry:', err);
        return NextResponse.json({ success: false, error: 'Something went wrong generating personas. Please try again.' }, { status: 500 });
      }
    }

    if (!Array.isArray(personas) || personas.length === 0) {
      return NextResponse.json({ success: false, error: 'Failed to generate personas. Please try again.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: personas });
  } catch (error) {
    console.error('generate-personas error:', error);
    return NextResponse.json(
      { success: false, error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
