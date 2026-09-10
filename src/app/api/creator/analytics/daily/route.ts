import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createHash } from 'node:crypto';
import { getCurrentUser } from '@/lib/auth';
import { getCreatorDailyAnalytics } from '@/lib/creator-analytics';
import { cachedAnalytics } from '@/lib/analytics-cache';
import { parseJakartaDay } from '@/lib/analytics-date';

export const dynamic = 'force-dynamic';

const querySchema = z.object({
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  articleId: z.union([z.string(), z.array(z.string())]).optional(),
  categoryId: z.string().optional(),
  seriesId: z.string().optional(),
});

const CACHE_TTL_SECONDS = 300; // 5 menit

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role === 'READER') {
    return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
  }

  const params = Object.fromEntries(new URL(request.url).searchParams.entries());
  // Dukung ?articleId=a&articleId=b (multi compare)
  const rawIds = new URL(request.url).searchParams.getAll('articleId').filter(Boolean);
  const parsed = querySchema.safeParse({ ...params, ...(rawIds.length ? { articleId: rawIds } : {}) });
  if (!parsed.success) {
    return NextResponse.json({ error: 'Parameter filter tidak valid' }, { status: 400 });
  }

  const articleIds = parsed.data.articleId
    ? (Array.isArray(parsed.data.articleId) ? parsed.data.articleId : [parsed.data.articleId]).slice(0, 5)
    : [];

  const filter = {
    from: parseJakartaDay(parsed.data.from),
    to: parseJakartaDay(parsed.data.to),
    articleIds,
    categoryId: parsed.data.categoryId,
    seriesId: parsed.data.seriesId,
  };

  const cacheKey = `creator:analytics:${user.id}:${createHash('sha256')
    .update(JSON.stringify({ ...filter, from: parsed.data.from || '', to: parsed.data.to || '' }))
    .digest('hex')
    .slice(0, 32)}`;

  try {
    const { value, cachedAt, hit } = await cachedAnalytics(cacheKey, CACHE_TTL_SECONDS, () =>
      getCreatorDailyAnalytics(user.id, filter),
    );
    const res = NextResponse.json({ ...value, cachedAt });
    res.headers.set('Cache-Control', 'private, max-age=60');
    res.headers.set('X-Cache', hit ? 'HIT' : 'MISS');
    return res;
  } catch (error) {
    console.error('[creator-analytics] query gagal:', error);
    return NextResponse.json({ error: 'Gagal memuat analitik' }, { status: 500 });
  }
}
