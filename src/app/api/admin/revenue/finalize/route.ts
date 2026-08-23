import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { finalizeRevenuePeriod } from '@/lib/revenue';

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
  const body = await request.json().catch(() => ({})) as { periodId?: string };
  if (!body.periodId) return NextResponse.json({ error: 'periodId wajib diisi' }, { status: 400 });
  try {
    const period = await finalizeRevenuePeriod(body.periodId);
    return NextResponse.json({ success: true, period });
  } catch (error) {
    console.error('Revenue finalization failed:', error);
    return NextResponse.json({ error: process.env.NODE_ENV === 'production' ? 'Revenue finalization failed' : String(error) }, { status: 400 });
  }
}
