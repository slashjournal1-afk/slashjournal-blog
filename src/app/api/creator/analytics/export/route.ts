import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getCurrentUser } from '@/lib/auth';
import { getCreatorDailyAnalytics } from '@/lib/creator-analytics';
import { parseJakartaDay } from '@/lib/analytics-date';

export const dynamic = 'force-dynamic';

const querySchema = z.object({
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  articleId: z.union([z.string(), z.array(z.string())]).optional(),
  categoryId: z.string().optional(),
  seriesId: z.string().optional(),
});

function csvCell(value: unknown) {
  return `"${String(value ?? '').replaceAll('"', '""')}"`;
}

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role === 'READER') {
    return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
  }

  const url = new URL(request.url);
  const rawIds = url.searchParams.getAll('articleId').filter(Boolean);
  const parsed = querySchema.safeParse({
    from: url.searchParams.get('from') || undefined,
    to: url.searchParams.get('to') || undefined,
    ...(rawIds.length ? { articleId: rawIds } : {}),
    categoryId: url.searchParams.get('categoryId') || undefined,
    seriesId: url.searchParams.get('seriesId') || undefined,
  });
  if (!parsed.success) {
    return NextResponse.json({ error: 'Parameter filter tidak valid' }, { status: 400 });
  }

  const articleIds = parsed.data.articleId
    ? (Array.isArray(parsed.data.articleId) ? parsed.data.articleId : [parsed.data.articleId]).slice(0, 5)
    : [];

  const result = await getCreatorDailyAnalytics(user.id, {
    from: parseJakartaDay(parsed.data.from),
    to: parseJakartaDay(parsed.data.to),
    articleIds,
    categoryId: parsed.data.categoryId,
    seriesId: parsed.data.seriesId,
  });

  const titleById = new Map(result.articles.map((a) => [a.id, a.title] as const));
  const lines = ['date,weekday,article_id,article_title,views'];
  for (const day of result.days) {
    const entries = Object.entries(day.byArticle);
    if (entries.length === 0) {
      lines.push([day.date, day.weekday, '', '', 0].map(csvCell).join(','));
    } else {
      for (const [articleId, views] of entries) {
        lines.push([day.date, day.weekday, articleId, titleById.get(articleId) || '', views].map(csvCell).join(','));
      }
    }
  }

  return new NextResponse(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="slashjournal-traffic-harian.csv"',
      'Cache-Control': 'no-store',
    },
  });
}
