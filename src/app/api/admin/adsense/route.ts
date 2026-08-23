import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getCurrentUser } from '@/lib/auth';
import { runAdSenseReport } from '@/lib/google/adsense';
import { googleErrorMessage } from '@/lib/google/auth';

const querySchema = z.object({ range: z.enum(['today', '7d', '28d', '90d']).default('28d') });

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
  const parsed = querySchema.safeParse(Object.fromEntries(new URL(request.url).searchParams));
  if (!parsed.success) return NextResponse.json({ error: 'Rentang laporan tidak valid' }, { status: 400 });

  try {
    const report = await runAdSenseReport(parsed.data.range);
    return NextResponse.json({ report: report.value, cachedAt: report.cachedAt, status: 'ok' });
  } catch (error) {
    console.error('AdSense report failed:', error);
    return NextResponse.json({
      report: null,
      cachedAt: null,
      status: 'unavailable',
      errorCode: googleErrorMessage(error).includes('not configured') ? 'CONFIGURATION_MISSING' : 'GOOGLE_API_ERROR',
      error: process.env.NODE_ENV === 'production' ? undefined : googleErrorMessage(error),
    });
  }
}
