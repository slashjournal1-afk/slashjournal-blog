import { prisma } from '@/lib/db';
import {
  clampDayRange,
  formatJakartaDay,
  formatWeekday,
  jakartaWeekdayIndex,
  WEEKDAY_LABELS,
} from '@/lib/analytics-date';

export interface CreatorAnalyticsFilter {
  from: Date;
  to: Date;
  articleIds?: string[];
  categoryId?: string;
  seriesId?: string;
}

export interface CreatorAnalyticsDay {
  date: string;
  label: string;
  weekday: string;
  total: number;
  byArticle: Record<string, number>;
}

export interface CreatorAnalyticsArticle {
  id: string;
  title: string;
  slug: string;
  category: string;
  total: number;
}

export interface CreatorAnalyticsResult {
  days: CreatorAnalyticsDay[];
  articles: CreatorAnalyticsArticle[];
  summary: {
    total: number;
    dayCount: number;
    avgPerDay: number;
    peakDay: { date: string; label: string; weekday: string; views: number } | null;
    lowDay: { date: string; label: string; weekday: string; views: number } | null;
    weekdayAvg: { weekday: string; avg: number; total: number }[];
    articleCount: number;
  };
  range: { from: string; to: string };
}

const DAY_MS = 24 * 60 * 60 * 1000;

/** Daftar artikel milik creator untuk dropdown filter (dibatasi). */
export async function getCreatorArticleOptions(
  authorId: string,
  opts: { categoryId?: string; seriesId?: string; take?: number } = {},
) {
  return prisma.article.findMany({
    where: {
      authorId,
      status: 'PUBLISHED',
      ...(opts.categoryId ? { categoryId: opts.categoryId } : {}),
      ...(opts.seriesId ? { seriesId: opts.seriesId } : {}),
    },
    orderBy: [{ viewCount: 'desc' }, { updatedAt: 'desc' }],
    take: Math.min(Math.max(opts.take ?? 100, 1), 200),
    select: {
      id: true,
      title: true,
      slug: true,
      viewCount: true,
      category: { select: { id: true, name: true } },
      series: { select: { id: true, title: true } },
    },
  });
}

export async function getCreatorDailyAnalytics(
  authorId: string,
  rawFilter: { from: Date | null; to: Date | null; articleIds?: string[]; categoryId?: string; seriesId?: string },
): Promise<CreatorAnalyticsResult> {
  const { from, to } = clampDayRange(rawFilter.from, rawFilter.to);

  // Batasi compare maksimal 5 artikel agar query + chart tetap ringan.
  const articleIds = (rawFilter.articleIds || []).filter(Boolean).slice(0, 5);

  // Pastikan articleIds benar milik creator (anti lintas-author).
  let scopedArticleIds: string[] | undefined;
  if (articleIds.length > 0) {
    const owned = await prisma.article.findMany({
      where: { id: { in: articleIds }, authorId },
      select: { id: true },
    });
    scopedArticleIds = owned.map((a) => a.id);
  }

  const rows = await prisma.articleViewDaily.findMany({
    where: {
      date: { gte: from, lte: to },
      article: {
        authorId,
        status: 'PUBLISHED',
        ...(scopedArticleIds ? { id: { in: scopedArticleIds } } : {}),
        ...(rawFilter.categoryId ? { categoryId: rawFilter.categoryId } : {}),
        ...(rawFilter.seriesId ? { seriesId: rawFilter.seriesId } : {}),
      },
    },
    include: {
      article: { select: { id: true, title: true, slug: true, category: { select: { name: true } } } },
    },
    orderBy: { date: 'asc' },
    take: 5000,
  });

  // Bangun kerangka hari penuh (termasuk hari 0 view) agar grafik kontinu.
  const dayKeys: string[] = [];
  for (let t = from.getTime(); t <= to.getTime(); t += DAY_MS) {
    dayKeys.push(formatJakartaDay(new Date(t)));
  }

  const dayTotals = new Map<string, number>();
  const dayByArticle = new Map<string, Map<string, number>>();
  const articleTotals = new Map<string, { title: string; slug: string; category: string; total: number }>();

  for (const key of dayKeys) {
    dayTotals.set(key, 0);
    dayByArticle.set(key, new Map());
  }

  for (const row of rows) {
    const key = formatJakartaDay(row.date);
    if (!dayTotals.has(key)) continue;
    dayTotals.set(key, (dayTotals.get(key) || 0) + row.views);
    dayByArticle.get(key)?.set(row.articleId, (dayByArticle.get(key)?.get(row.articleId) || 0) + row.views);
    const cur = articleTotals.get(row.articleId) || {
      title: row.article.title,
      slug: row.article.slug,
      category: row.article.category.name,
      total: 0,
    };
    cur.total += row.views;
    articleTotals.set(row.articleId, cur);
  }

  const days: CreatorAnalyticsDay[] = dayKeys.map((key) => {
    const probe = new Date(`${key}T12:00:00+07:00`);
    const byArticle: Record<string, number> = {};
    dayByArticle.get(key)?.forEach((v, k) => {
      byArticle[k] = v;
    });
    return {
      date: key,
      label: new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', timeZone: 'Asia/Jakarta' }).format(probe),
      weekday: formatWeekday(probe),
      total: dayTotals.get(key) || 0,
      byArticle,
    };
  });

  const articles: CreatorAnalyticsArticle[] = [...articleTotals.entries()]
    .map(([id, v]) => ({ id, ...v }))
    .sort((a, b) => b.total - a.total);

  const total = days.reduce((s, d) => s + d.total, 0);
  const dayCount = days.length || 1;
  const sorted = [...days].sort((a, b) => b.total - a.total);

  const weekdayBuckets = WEEKDAY_LABELS.map((weekday) => ({ weekday, total: 0, count: 0 }));
  for (const d of days) {
    const idx = jakartaWeekdayIndex(new Date(`${d.date}T12:00:00+07:00`));
    weekdayBuckets[idx].total += d.total;
    weekdayBuckets[idx].count += 1;
  }

  return {
    days,
    articles,
    summary: {
      total,
      dayCount,
      avgPerDay: Math.round((total / dayCount) * 10) / 10,
      peakDay: sorted.length ? { date: sorted[0].date, label: sorted[0].label, weekday: sorted[0].weekday, views: sorted[0].total } : null,
      lowDay: sorted.length ? { date: sorted[sorted.length - 1].date, label: sorted[sorted.length - 1].label, weekday: sorted[sorted.length - 1].weekday, views: sorted[sorted.length - 1].total } : null,
      weekdayAvg: weekdayBuckets.map((b) => ({
        weekday: b.weekday,
        total: b.total,
        avg: b.count ? Math.round((b.total / b.count) * 10) / 10 : 0,
      })),
      articleCount: articles.length,
    },
    range: { from: formatJakartaDay(from), to: formatJakartaDay(to) },
  };
}
