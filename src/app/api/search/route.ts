import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q')?.trim() || '';

  if (!q || q.length < 2) {
    return NextResponse.json({ articles: [], glossaryTerms: [] });
  }

  try {
    // Query articles with case-insensitive search
    const articles = await prisma.article.findMany({
      where: {
        status: 'PUBLISHED',
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { excerpt: { contains: q, mode: 'insensitive' } },
          { contentMarkdown: { contains: q, mode: 'insensitive' } },
        ],
      },
      include: {
        category: true,
        series: true,
      },
      orderBy: { publishedAt: 'desc' },
      take: 8,
    });

    // Query glossary terms with case-insensitive search
    const glossaryTerms = await prisma.glossaryTerm.findMany({
      where: {
        OR: [
          { term: { contains: q, mode: 'insensitive' } },
          { shortDef: { contains: q, mode: 'insensitive' } },
          { definition: { contains: q, mode: 'insensitive' } },
          { category: { contains: q, mode: 'insensitive' } },
        ],
      },
      orderBy: { term: 'asc' },
      take: 6,
    });

    const totalResults = articles.length + glossaryTerms.length;

    // Log telemetry query asynchronously
    prisma.searchQueryLog
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
