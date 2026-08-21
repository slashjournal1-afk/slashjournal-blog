import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q')?.trim() || '';

  if (!q || q.length < 2) {
    return NextResponse.json({ articles: [], glossaryTerms: [] });
  }

  try {
    const [articles, glossaryTerms] = await Promise.all([
      prisma.article.findMany({
        where: {
          status: 'PUBLISHED',
          isIndexable: true,
          category: { isIndexable: true },
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { excerpt: { contains: q, mode: 'insensitive' } },
            { contentMarkdown: { contains: q, mode: 'insensitive' } },
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
      }),
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
        categoryName: a.category?.name || 'Umum',
        seriesTitle: a.series?.title || null,
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
