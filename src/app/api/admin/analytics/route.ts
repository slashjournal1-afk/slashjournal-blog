import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getCurrentUser } from '@/lib/auth';
import { runGa4Events, runGa4Pages, runGa4Summary, type GoogleDateRange } from '@/lib/google/ga4';
import { googleErrorMessage } from '@/lib/google/auth';

const querySchema = z.object({ range: z.enum(['today', '7d', '28d', '90d']).default('28d') });

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
  const parsed = querySchema.safeParse(Object.fromEntries(new URL(request.url).searchParams));
  if (!parsed.success) return NextResponse.json({ error: 'Rentang laporan tidak valid' }, { status: 400 });

  try {
    const [summary, events, pages] = await Promise.all([runGa4Summary(parsed.data.range as GoogleDateRange), runGa4Events(parsed.data.range as GoogleDateRange), runGa4Pages(parsed.data.range as GoogleDateRange)]);
    return NextResponse.json({ summary: summary.value, events: events.value, pages: pages.value, range: parsed.data.range, cachedAt: summary.cachedAt, status: 'ok' });
  } catch (error) {
    console.error('GA4 report failed:', error);
    return NextResponse.json({
      summary: null,
      events: [],
      pages: [],
      cachedAt: null,
      status: 'unavailable',
      errorCode: googleErrorMessage(error).includes('not configured') ? 'CONFIGURATION_MISSING' : 'GOOGLE_API_ERROR',
      error: process.env.NODE_ENV === 'production' ? undefined : googleErrorMessage(error),
    });
  }
}
