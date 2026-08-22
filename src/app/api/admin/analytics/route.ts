import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getCurrentUser } from '@/lib/auth';
import { runGa4Pages, runGa4Report, type GoogleDateRange } from '@/lib/google/ga4';

const querySchema = z.object({ range: z.enum(['today', '7d', '28d', '90d']).default('28d') });

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
  const parsed = querySchema.safeParse(Object.fromEntries(new URL(request.url).searchParams));
  if (!parsed.success) return NextResponse.json({ error: 'Rentang laporan tidak valid' }, { status: 400 });

  try {
    const [overview, pages] = await Promise.all([runGa4Report(parsed.data.range as GoogleDateRange), runGa4Pages(parsed.data.range as GoogleDateRange)]);
    return NextResponse.json({ overview: overview.value, pages: pages.value, cachedAt: overview.cachedAt, status: 'ok' });
  } catch (error) {
    console.error('GA4 report failed:', error);
    return NextResponse.json({ overview: [], pages: [], cachedAt: null, status: 'unavailable', error: process.env.NODE_ENV === 'production' ? undefined : String(error) });
  }
}
