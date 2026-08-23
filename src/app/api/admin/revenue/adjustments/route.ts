import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
  const adjustments = await prisma.revenueAdjustment.findMany({ orderBy: { createdAt: 'desc' }, take: 200, include: { author: { select: { displayName: true, email: true } }, revenuePeriod: { select: { periodStart: true, currencyCode: true } } } });
  return NextResponse.json({ adjustments });
}
