import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role === 'READER') return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
  const rows = await prisma.articleRevenue.findMany({ where: { article: { authorId: user.id } }, orderBy: { createdAt: 'desc' }, take: 500, include: { article: { select: { title: true, slug: true } }, revenuePeriod: true } });
  const csv = ['article_title,article_slug,period_start,currency,gross_revenue,author_share,impressions,clicks,page_views,status', ...rows.map((row) => [row.titleSnapshot, row.slugSnapshot, row.revenuePeriod.periodStart.toISOString(), row.revenuePeriod.currencyCode, row.grossRevenue.toString(), row.authorShare.toString(), row.impressions, row.clicks, row.pageViews, row.revenuePeriod.status].map(csvCell).join(','))].join('\n');
  return new NextResponse(csv, { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="slashjournal-revenue.csv"', 'Cache-Control': 'no-store' } });
}

function csvCell(value: unknown) {
  return `"${String(value ?? '').replaceAll('"', '""')}"`;
}
