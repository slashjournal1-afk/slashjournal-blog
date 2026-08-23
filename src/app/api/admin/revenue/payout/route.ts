import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { markRevenuePaid } from '@/lib/payouts';

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
  const body = await request.json().catch(() => ({})) as { authorRevenueId?: string; reference?: string };
  if (!body.authorRevenueId || !body.reference?.trim()) return NextResponse.json({ error: 'Author revenue ID dan reference wajib diisi' }, { status: 400 });
  try {
    const paid = await markRevenuePaid({ authorRevenueId: body.authorRevenueId, reference: body.reference, adminId: user.id, adminEmail: user.email });
    return NextResponse.json({ success: true, paid });
  } catch (error) {
    console.error('Revenue payout failed:', error);
    return NextResponse.json({ error: process.env.NODE_ENV === 'production' ? 'Payout gagal diproses' : String(error) }, { status: 400 });
  }
}
