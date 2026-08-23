import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { createRevenueAdjustment } from '@/lib/payouts';

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
  const body = await request.json().catch(() => ({})) as { revenuePeriodId?: string; authorId?: string; articleId?: string; amount?: string; reason?: string };
  if (!body.revenuePeriodId || !body.authorId || !body.amount || !body.reason?.trim()) return NextResponse.json({ error: 'Period, author, amount, dan reason wajib diisi' }, { status: 400 });
  try {
    const adjustment = await createRevenueAdjustment({ ...body, revenuePeriodId: body.revenuePeriodId, authorId: body.authorId, amount: body.amount, reason: body.reason, adminId: user.id, adminEmail: user.email });
    return NextResponse.json({ success: true, adjustment }, { status: 201 });
  } catch (error) {
    console.error('Revenue adjustment failed:', error);
    return NextResponse.json({ error: process.env.NODE_ENV === 'production' ? 'Adjustment gagal dibuat' : String(error) }, { status: 400 });
  }
}
