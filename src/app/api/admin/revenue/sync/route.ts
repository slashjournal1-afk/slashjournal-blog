import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { syncRevenueForDay } from '@/lib/revenue';

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
  const body = await request.json().catch(() => ({})) as { date?: string; force?: boolean };
  const day = body.date ? new Date(`${body.date}T00:00:00.000Z`) : undefined;
  if (day && Number.isNaN(day.getTime())) return NextResponse.json({ error: 'Tanggal tidak valid' }, { status: 400 });
  try {
    const result = await syncRevenueForDay(day, { force: body.force === true });
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error('Manual revenue sync failed:', error);
    return NextResponse.json({ error: process.env.NODE_ENV === 'production' ? 'Revenue sync failed' : String(error) }, { status: 500 });
  }
}
