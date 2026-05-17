import { NextRequest, NextResponse } from 'next/server';
import { callGemini } from '@/lib/gemini';
import { SYSTEM_INTERVIEW, buildInterviewPrompt } from '@/lib/prompts';
import { Persona } from '@/lib/types';

interface PreviousRound {
  question: string;
  response: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { persona, conceptDescription, userQuestion, previousRounds } = body as {
      persona: Persona;
      conceptDescription: string;
      userQuestion: string;
      previousRounds?: PreviousRound[];
    };

    if (!persona?.id || !conceptDescription || !userQuestion) {
      return NextResponse.json({ success: false, error: 'Missing persona, concept, or question.' }, { status: 400 });
    }

    const response = await callGemini(
      buildInterviewPrompt(persona, conceptDescription, userQuestion, previousRounds),
      SYSTEM_INTERVIEW
    );

    return NextResponse.json({ success: true, data: { personaId: persona.id, response: response.trim() } });
  } catch (error) {
    console.error('run-interview error:', error);
    return NextResponse.json(
      { success: false, error: 'Something went wrong during the interview. Please try again.' },
      { status: 500 }
    );
  }
}
