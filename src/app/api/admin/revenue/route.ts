import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(_request: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
  const [periods, authors, articles, latestJob] = await Promise.all([
    prisma.revenuePeriod.findMany({ orderBy: { periodStart: 'desc' }, take: 30 }),
    prisma.authorRevenue.findMany({ orderBy: { createdAt: 'desc' }, take: 100, include: { author: { select: { id: true, displayName: true, email: true } }, revenuePeriod: true } }),
    prisma.articleRevenue.findMany({ orderBy: { createdAt: 'desc' }, take: 100, include: { article: { select: { id: true, title: true, slug: true, author: { select: { displayName: true } } } }, revenuePeriod: true } }),
    prisma.revenueJobRun.findFirst({ orderBy: { startedAt: 'desc' } }),
  ]);
  return NextResponse.json({ periods, authors, articles, latestJob });
}
