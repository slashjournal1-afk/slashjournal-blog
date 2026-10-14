import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { rateLimitAsync, requestKey } from '@/lib/rate-limit';
import { buildSearchTsQuery } from '@/lib/keyword-extractor';

type SearchArticleRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  readingTime: number | null;
  coverImageUrl: string | null;
  isSponsored: boolean;
  sponsorName: string | null;
  categoryName: string;
  seriesTitle: string | null;
};

export async function GET(req: NextRequest) {
  if (!(await rateLimitAsync(requestKey(req, 'search'), 30, 60_000))) return NextResponse.json({ error: 'Terlalu banyak permintaan' }, { status: 429 });
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q')?.trim() || '';

  if (!q || q.length < 2) {
    return NextResponse.json({ articles: [], glossaryTerms: [] });
  }

  try {
    // FTS title+excerpt saja — contentMarkdown (TOAST, besar) tidak di-scan lagi.
    const tsQuery = buildSearchTsQuery(q);
    const articlePromise: Promise<SearchArticleRow[]> = tsQuery
      ? prisma.$queryRaw<SearchArticleRow[]>`
          SELECT a.id, a.title, a.slug, a.excerpt, a."readingTime", a."coverImageUrl",
            a."isSponsored", a."sponsorName", c.name AS "categoryName", s.title AS "seriesTitle"
          FROM "Article" a
          JOIN "Category" c ON a."categoryId" = c.id
          LEFT JOIN "Series" s ON a."seriesId" = s.id
          WHERE a.status = 'PUBLISHED'
            AND a."isIndexable" = true
            AND c."isIndexable" = true
            AND (
              setweight(to_tsvector('simple', COALESCE(a.title, '')), 'A') ||
              setweight(to_tsvector('simple', COALESCE(a.excerpt, '')), 'B')
            ) @@ to_tsquery('simple', ${tsQuery})
          ORDER BY ts_rank_cd(
            setweight(to_tsvector('simple', COALESCE(a.title, '')), 'A') ||
            setweight(to_tsvector('simple', COALESCE(a.excerpt, '')), 'B'),
            to_tsquery('simple', ${tsQuery})
          ) DESC, a."publishedAt" DESC NULLS LAST
          LIMIT 8;
        `
      : prisma.article
          .findMany({
            where: {
              status: 'PUBLISHED',
              isIndexable: true,
              category: { isIndexable: true },
              OR: [
                { title: { contains: q, mode: 'insensitive' } },
                { excerpt: { contains: q, mode: 'insensitive' } },
              ],
            },
            select: {
              id: true,
              title: true,
              slug: true,
              excerpt: true,
              readingTime: true,
              coverImageUrl: true,
              isSponsored: true,
              sponsorName: true,
              category: { select: { name: true } },
              series: { select: { title: true } },
            },
            orderBy: { publishedAt: 'desc' },
            take: 8,
          })
          .then((rows) =>
            rows.map((a) => ({
              id: a.id,
              title: a.title,
              slug: a.slug,
              excerpt: a.excerpt,
              readingTime: a.readingTime,
              coverImageUrl: a.coverImageUrl,
              isSponsored: a.isSponsored,
              sponsorName: a.sponsorName,
              categoryName: a.category?.name || 'Umum',
              seriesTitle: a.series?.title || null,
            })),
          );

    const [articles, glossaryTerms] = await Promise.all([
      articlePromise,
      prisma.glossaryTerm.findMany({
        where: {
          OR: [
            { term: { contains: q, mode: 'insensitive' } },
            { shortDef: { contains: q, mode: 'insensitive' } },
            { definition: { contains: q, mode: 'insensitive' } },
            { category: { contains: q, mode: 'insensitive' } },
          ],
        },
        select: { id: true, term: true, slug: true, category: true, shortDef: true },
        orderBy: { term: 'asc' },
        take: 6,
      }),
    ]);

    const totalResults = articles.length + glossaryTerms.length;

    // Log telemetry query asynchronously
    void prisma.searchQueryLog
      .create({
        data: {
          query: q,
          resultsCount: totalResults,
        },
      })
      .catch(() => {});

    return NextResponse.json({
      articles: articles.map((a) => ({
        id: a.id,
        title: a.title,
        slug: a.slug,
        excerpt: a.excerpt,
        categoryName: a.categoryName || 'Umum',
        seriesTitle: a.seriesTitle,
        readingTime: a.readingTime,
        coverImageUrl: a.coverImageUrl,
        isSponsored: a.isSponsored,
        sponsorName: a.sponsorName,
      })),
      glossaryTerms: glossaryTerms.map((g) => ({
        id: g.id,
        term: g.term,
        slug: g.slug,
        category: g.category,
        shortDef: g.shortDef,
      })),
    });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ articles: [], glossaryTerms: [] }, { status: 500 });
  }
}
