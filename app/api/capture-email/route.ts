import { NextRequest, NextResponse } from 'next/server';

// TODO: Replace with your systeme.io form action URL
// Create a form in systeme.io, get the action URL, and set SYSTEME_IO_FORM_URL in .env.local
const SYSTEME_FORM_URL = process.env.SYSTEME_IO_FORM_URL || '';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, conceptDescription, averageScore } = body as {
      email: string;
      conceptDescription: string;
      averageScore: number;
    };

    if (!email || !email.includes('@')) {
      return NextResponse.json({ success: false, error: 'Please enter a valid email address.' }, { status: 400 });
    }

    if (!SYSTEME_FORM_URL) {
      // Form URL not configured — silently succeed so the UI doesn't break
      console.warn('SYSTEME_IO_FORM_URL is not configured.');
      return NextResponse.json({ success: true, data: { message: 'Email capture not configured yet.' } });
    }

    const formData = new URLSearchParams();
    formData.append('email', email);
    formData.append('concept', conceptDescription?.slice(0, 200) || '');
    formData.append('score', String(averageScore || ''));

    const res = await fetch(SYSTEME_FORM_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
    });

    if (!res.ok) {
      console.error('systeme.io POST failed:', res.status, await res.text());
      return NextResponse.json({ success: false, error: 'Could not save your email. Please try again.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: { message: 'Email captured.' } });
  } catch (error) {
    console.error('capture-email error:', error);
    return NextResponse.json(
      { success: false, error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
