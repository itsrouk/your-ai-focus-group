import { NextRequest, NextResponse } from 'next/server';
import { callGemini, parseJSON } from '@/lib/gemini';
import { SYSTEM_CONTEXT_EXTRACTION, buildContextExtractionPrompt } from '@/lib/prompts';
import { checkRateLimit, incrementRateLimit } from '@/lib/rate-limit';
import { ExtractedContext } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const { allowed, remaining } = await checkRateLimit();
    if (!allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "You've used your 3 free focus groups for today. Come back tomorrow for more.",
          rateLimitExceeded: true,
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { userInput } = body as { userInput: string };

    if (!userInput || userInput.trim().length < 20) {
      return NextResponse.json(
        { success: false, error: 'Tell us what you want to test — we need at least a couple sentences to work with.' },
        { status: 400 }
      );
    }

    let raw: string;
    try {
      raw = await callGemini(buildContextExtractionPrompt(userInput), SYSTEM_CONTEXT_EXTRACTION);
    } catch (err: unknown) {
      console.error('Gemini call failed:', err);
      const msg = err instanceof Error ? err.message : '';
      if (msg.includes('429') || msg.includes('quota')) {
        return NextResponse.json({ success: false, error: 'The AI service is temporarily over capacity. Please wait a moment and try again.' }, { status: 503 });
      }
      return NextResponse.json({ success: false, error: 'Something went wrong generating your focus group. Please try again.' }, { status: 500 });
    }

    let context: ExtractedContext;
    try {
      context = parseJSON<ExtractedContext>(raw);
    } catch {
      // Retry once with explicit JSON reminder
      try {
        const retryRaw = await callGemini(
          buildContextExtractionPrompt(userInput) + '\n\nIMPORTANT: Respond ONLY with valid JSON, no other text.',
          SYSTEM_CONTEXT_EXTRACTION
        );
        context = parseJSON<ExtractedContext>(retryRaw);
      } catch (err) {
        console.error('JSON parse failed after retry:', err, 'Raw:', raw);
        return NextResponse.json({ success: false, error: 'Something went wrong generating your focus group. Please try again.' }, { status: 500 });
      }
    }

    await incrementRateLimit();

    return NextResponse.json({ success: true, data: context, remaining: remaining - 1 });
  } catch (error) {
    console.error('extract-context error:', error);
    return NextResponse.json(
      { success: false, error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
