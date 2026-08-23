import { NextRequest, NextResponse } from 'next/server';
import { syncRollingRevenue } from '@/lib/revenue';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const expected = process.env.CRON_SECRET;
  const provided = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!expected || provided !== expected) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const result = await syncRollingRevenue();
    return NextResponse.json({ success: true, periods: result });
  } catch (error) {
    console.error('Revenue sync failed:', error);
    await prisma.revenueJobRun.create({ data: { jobName: 'adsense-daily-sync', status: 'FAILED', errorMessage: process.env.NODE_ENV === 'production' ? 'Revenue sync failed' : String(error), completedAt: new Date() } }).catch(() => {});
    return NextResponse.json({ error: process.env.NODE_ENV === 'production' ? 'Revenue sync failed' : String(error) }, { status: 500 });
  }
}
