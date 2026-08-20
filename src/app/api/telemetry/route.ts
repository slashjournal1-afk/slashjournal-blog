import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser, hasPermission } from '@/lib/auth';

export async function GET() {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user.role, ['ADMIN', 'EDITOR'])) {
    return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
  }

  // 1. Total searches
  const totalSearches = await prisma.searchQueryLog.count();

  // 2. Zero-result queries (Content gaps)
  const zeroResultQueries = await prisma.searchQueryLog.findMany({
    where: { resultsCount: 0 },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });

  // 3. Recent search logs
  const recentSearches = await prisma.searchQueryLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 30,
  });

  return NextResponse.json({
    totalSearches,
    zeroResultQueries,
    recentSearches,
  });
}
