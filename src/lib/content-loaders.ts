import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/db';
import { prepareArticleDiscovery, type ArticleDiscoveryContext, type DiscoveryArticle } from '@/lib/article-discovery';
import { publicArticleWhere } from '@/lib/visibility';

const discoveryArticleSelect = {
  id: true,
  slug: true,
  title: true,
  coverImageUrl: true,
  viewCount: true,
  publishedAt: true,
  createdAt: true,
  categoryId: true,
  seriesId: true,
  category: { select: { name: true, slug: true } },
  tags: { select: { tagId: true } },
} as const;

const getCachedPublishedArticle = unstable_cache(async (slug: string) => {
  return prisma.article.findFirst({
    where: { slug, ...publicArticleWhere },
    include: {
      category: true,
      series: {
        include: {
          articles: {
            where: { status: 'PUBLISHED', isIndexable: true, category: { isIndexable: true } },
            orderBy: { seriesOrder: 'asc' },
            select: { id: true, slug: true, title: true, seriesOrder: true },
          },
        },
      },
      author: { select: { displayName: true } },
      tags: { include: { tag: true } },
      sources: { orderBy: { sortOrder: 'asc' } },
    },
  });
}, ['published-article-by-slug'], { revalidate: 900 });

export const getPublishedArticle = cache((slug: string) => getCachedPublishedArticle(slug));

export const getArticleComments = cache(async (articleId: string) => {
  return prisma.comment.findMany({
    where: { articleId },
    orderBy: { createdAt: 'desc' },
    take: 20,
    include: {
      user: { select: { id: true, displayName: true, avatarUrl: true, role: true } },
    },
  });
});

export const getCachedGlossaryItems = unstable_cache(
  async () => prisma.glossaryTerm.findMany({
    select: { term: true, slug: true, shortDef: true, category: true },
  }),
  ['article-glossary-items'],
  { revalidate: 3600 },
);

export const getCachedSidebarAd = unstable_cache(
  async () => prisma.adSlot.findUnique({ where: { slotName: 'sidebar_sticky' } }),
  ['sidebar-sticky-ad'],
  { revalidate: 300, tags: ['sidebar-sticky-ad'] },
);

export const getRelatedArticles = cache(async (categoryId: string, articleId: string) => {
  return unstable_cache(
    async () => prisma.article.findMany({
      where: { ...publicArticleWhere, categoryId, id: { not: articleId } },
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
      take: 3,
      select: {
        id: true,
        slug: true,
        title: true,
        coverImageUrl: true,
        publishedAt: true,
        createdAt: true,
        category: { select: { name: true, slug: true } },
      },
    }),
    ['related-articles', categoryId, articleId],
    { revalidate: 900 },
  )();
});

export const getArticleDiscovery = cache(async (context: ArticleDiscoveryContext) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const tagFilter = context.tagIds.length > 0 ? { tags: { some: { tagId: { in: context.tagIds } } } } : undefined;

  const [relatedCandidates, fallbackCandidates, trendingCandidates, popularCandidates] = await Promise.all([
    prisma.article.findMany({
      where: {
        ...publicArticleWhere,
        id: { not: context.articleId },
        OR: [
          ...(context.seriesId ? [{ seriesId: context.seriesId }] : []),
          ...(tagFilter ? [tagFilter] : []),
          { categoryId: context.categoryId },
        ],
      },
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
      take: 40,
      select: discoveryArticleSelect,
    }),
    prisma.article.findMany({
      where: { ...publicArticleWhere, id: { not: context.articleId } },
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
      take: 12,
      select: discoveryArticleSelect,
    }),
    prisma.article.findMany({
      where: { ...publicArticleWhere, id: { not: context.articleId }, publishedAt: { gte: thirtyDaysAgo } },
      orderBy: [{ viewCount: 'desc' }, { publishedAt: 'desc' }, { createdAt: 'desc' }],
      take: 12,
      select: discoveryArticleSelect,
    }),
    prisma.article.findMany({
      where: { ...publicArticleWhere, id: { not: context.articleId } },
      orderBy: [{ viewCount: 'desc' }, { publishedAt: 'desc' }, { createdAt: 'desc' }],
      take: 12,
      select: discoveryArticleSelect,
    }),
  ]);

  return prepareArticleDiscovery({
    context,
    recommendationCandidates: [...relatedCandidates, ...fallbackCandidates] as DiscoveryArticle[],
    trendingCandidates: trendingCandidates as DiscoveryArticle[],
    popularCandidates: popularCandidates as DiscoveryArticle[],
  });
});
