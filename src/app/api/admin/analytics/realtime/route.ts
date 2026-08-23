import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { runGa4Realtime } from '@/lib/google/ga4';
import { googleErrorMessage } from '@/lib/google/auth';

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
  try {
    const report = await runGa4Realtime();
    return NextResponse.json({ activeUsers: report.value, cachedAt: report.cachedAt, status: 'ok' });
  } catch (error) {
    console.error('GA4 realtime report failed:', error);
    return NextResponse.json({ activeUsers: 0, cachedAt: null, status: 'unavailable', errorCode: googleErrorMessage(error).includes('not configured') ? 'CONFIGURATION_MISSING' : 'GOOGLE_API_ERROR', error: process.env.NODE_ENV === 'production' ? undefined : googleErrorMessage(error) });
  }
}
