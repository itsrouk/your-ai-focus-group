import { cookies } from 'next/headers';

const COOKIE_NAME = 'fg_runs';
const MAX_RUNS = 3;

interface RateLimitData {
  count: number;
  date: string;
}

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

function parseData(raw: string | undefined): RateLimitData {
  const today = getToday();
  if (!raw) return { count: 0, date: today };
  try {
    const data = JSON.parse(raw) as RateLimitData;
    return data.date !== today ? { count: 0, date: today } : data;
  } catch {
    return { count: 0, date: today };
  }
}

export async function checkRateLimit(): Promise<{ allowed: boolean; remaining: number }> {
  if (process.env.NODE_ENV === 'development') {
    return { allowed: true, remaining: 999 };
  }

  const cookieStore = await cookies();
  const data = parseData(cookieStore.get(COOKIE_NAME)?.value);
  return { allowed: data.count < MAX_RUNS, remaining: Math.max(0, MAX_RUNS - data.count) };
}

export async function incrementRateLimit(): Promise<void> {
  if (process.env.NODE_ENV === 'development') return;

  const cookieStore = await cookies();
  const data = parseData(cookieStore.get(COOKIE_NAME)?.value);
  data.count += 1;
  cookieStore.set(COOKIE_NAME, JSON.stringify(data), {
    httpOnly: true,
    maxAge: 86400,
    path: '/',
  });
}
