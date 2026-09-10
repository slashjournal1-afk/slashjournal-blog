import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { rateLimit, requestKey } from '@/lib/rate-limit';
import { jakartaDayBucket } from '@/lib/analytics-date';

const BOT_PATTERN = /bot|crawler|spider|slurp|headless|lighthouse/i;

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (BOT_PATTERN.test(request.headers.get('user-agent') || '')) {
    return new NextResponse(null, { status: 204 });
  }
  if (!rateLimit(requestKey(request, 'view'), 30, 60_000)) {
    return new NextResponse(null, { status: 429 });
  }

  const { id } = await params;

  // Validasi kelayakan view (UU PDP: kanal non-indexable seperti
  // jurnal-personal otomatis dikecualikan di sini).
  const article = await prisma.article.findFirst({
    where: { id, status: 'PUBLISHED', isIndexable: true, category: { isIndexable: true } },
    select: { id: true },
  });
  if (!article) return new NextResponse(null, { status: 404 });

  const bucket = jakartaDayBucket(new Date());

  // Transaction pendek 2-opsi: counter kumulatif + bucket harian WIB.
  // Upsert harian best-effort: jika gagal, increment utama tetap dihitung.
  try {
    await prisma.$transaction([
      prisma.article.update({
        where: { id: article.id },
        data: { viewCount: { increment: 1 } },
      }),
      prisma.articleViewDaily.upsert({
        where: { articleId_date: { articleId: article.id, date: bucket } },
        create: { articleId: article.id, date: bucket, views: 1 },
        update: { views: { increment: 1 } },
      }),
    ]);
  } catch (error) {
    console.warn('[view] daily bucket gagal, fallback increment saja:', error);
    try {
      await prisma.article.update({
        where: { id: article.id },
        data: { viewCount: { increment: 1 } },
      });
    } catch {
      return new NextResponse(null, { status: 500 });
    }
  }

  return new NextResponse(null, { status: 204 });
}
