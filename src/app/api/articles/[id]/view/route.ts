import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { rateLimit, requestKey } from '@/lib/rate-limit';

const BOT_PATTERN = /bot|crawler|spider|slurp|headless|lighthouse/i;

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (BOT_PATTERN.test(request.headers.get('user-agent') || '')) {
    return new NextResponse(null, { status: 204 });
  }
  if (!rateLimit(requestKey(request, 'view'), 30, 60_000)) {
    return new NextResponse(null, { status: 429 });
  }

  const { id } = await params;
  const result = await prisma.article.updateMany({
    where: { id, status: 'PUBLISHED', isIndexable: true, category: { isIndexable: true } },
    data: { viewCount: { increment: 1 } },
  });

  return new NextResponse(null, { status: result.count ? 204 : 404 });
}
