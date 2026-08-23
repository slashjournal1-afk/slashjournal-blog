import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
  const rows = await prisma.authorRevenue.findMany({ orderBy: { createdAt: 'desc' }, take: 5000, include: { author: { select: { displayName: true, email: true } }, revenuePeriod: true } });
  const csv = ['author,author_email,period,currency,gross_revenue,author_share,adjustment,payable,payout_status,paid_at,payout_reference', ...rows.map((row) => [row.author.displayName, row.author.email, row.revenuePeriod.periodStart.toISOString(), row.revenuePeriod.currencyCode, row.grossAttributedRevenue, row.authorShare, row.adjustmentAmount, row.payableAmount, row.payoutStatus, row.paidAt?.toISOString() || '', row.payoutReference || ''].map(csvCell).join(','))].join('\n');
  return new NextResponse(csv, { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="slashjournal-admin-revenue.csv"', 'Cache-Control': 'no-store' } });
}

function csvCell(value: unknown) { return `"${String(value ?? '').replaceAll('"', '""')}"`; }
