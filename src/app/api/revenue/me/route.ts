import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

const querySchema = z.object({ limit: z.coerce.number().int().min(1).max(100).default(30) });

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role === 'READER') return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
  const { limit } = querySchema.parse(Object.fromEntries(new URL(request.url).searchParams));
  const [authorRows, articleRows] = await Promise.all([
    prisma.authorRevenue.findMany({ where: { authorId: user.id }, orderBy: { createdAt: 'desc' }, take: limit, include: { revenuePeriod: true } }),
    prisma.articleRevenue.findMany({ where: { article: { authorId: user.id } }, orderBy: { createdAt: 'desc' }, take: limit, include: { article: { select: { id: true, title: true, slug: true } }, revenuePeriod: true } }),
  ]);
  return NextResponse.json({ authorRows, articleRows });
}
