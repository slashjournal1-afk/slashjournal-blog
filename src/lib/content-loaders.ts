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

const getCachedNavbarCategories = unstable_cache(async () => {
  return prisma.category.findMany({
    where: { isIndexable: true },
    orderBy: { name: 'asc' },
    take: 8,
    select: { name: true, slug: true, description: true },
  });
}, ['navbar-categories'], { revalidate: 900 });

export const getNavbarCategories = cache(async () => {
  try {
    return await getCachedNavbarCategories();
  } catch (error) {
    console.error('[public-layout] Category fetch failed, rendering without categories.', error);
    return [];
  }
});

const getCachedHomePageData = unstable_cache(async () => {
  const articleSelect = {
    id: true,
    slug: true,
    title: true,
    excerpt: true,
    coverImageUrl: true,
    isSponsored: true,
    sponsorName: true,
    readingTime: true,
    viewCount: true,
    helpfulVotes: true,
    publishedAt: true,
    createdAt: true,
    category: { select: { name: true, slug: true } },
    author: { select: { displayName: true } },
  } as const;

  const signalArticleSelect = {
    id: true,
    slug: true,
    title: true,
    viewCount: true,
    helpfulVotes: true,
    unhelpfulVotes: true,
    category: { select: { name: true } },
  } as const;

  const [
    recentArticles,
    popularArticles,
    helpfulArticles,
    searchQueries,
    categorySections,
    seriesList,
    glossaryTerms,
    leaderboardAd,
    inFeedAd,
    belowHeroAd,
    sidebarRailAd,
  ] = await Promise.all([
    prisma.article.findMany({
      where: publicArticleWhere,
      select: articleSelect,
      orderBy: [{ publishedAt: { sort: 'desc', nulls: 'last' } }, { createdAt: 'desc' }, { id: 'asc' }],
      take: 24,
    }),
    prisma.article.findMany({
      where: publicArticleWhere,
      select: articleSelect,
      orderBy: [
        { viewCount: 'desc' },
        { publishedAt: { sort: 'desc', nulls: 'last' } },
        { createdAt: 'desc' },
        { id: 'asc' },
      ],
      take: 30,
    }),
    prisma.article.findMany({
      where: publicArticleWhere,
      select: signalArticleSelect,
      orderBy: [
        { helpfulVotes: 'desc' },
        { unhelpfulVotes: 'asc' },
        { publishedAt: { sort: 'desc', nulls: 'last' } },
        { id: 'asc' },
      ],
      take: 12,
    }),
    prisma.searchQueryLog.findMany({
      select: { query: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
      take: 500,
    }),
    prisma.category.findMany({
      where: {
        isIndexable: true,
        articles: { some: { status: 'PUBLISHED', isIndexable: true } },
      },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      take: 3,
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        articles: {
          where: { status: 'PUBLISHED', isIndexable: true },
          orderBy: [{ publishedAt: { sort: 'desc', nulls: 'last' } }, { createdAt: 'desc' }, { id: 'asc' }],
          take: 4,
          select: { id: true, slug: true, title: true, publishedAt: true, createdAt: true },
        },
      },
    }),
    prisma.series.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: 'asc' },
      include: { _count: { select: { articles: { where: { status: 'PUBLISHED' } } } } },
    }),
    prisma.glossaryTerm.findMany({ orderBy: { term: 'asc' }, take: 6 }),
    prisma.adSlot.findUnique({ where: { slotName: 'leaderboard' } }),
    prisma.adSlot.findUnique({ where: { slotName: 'in_feed' } }),
    prisma.adSlot.findUnique({ where: { slotName: 'below_hero' } }),
    prisma.adSlot.findUnique({ where: { slotName: 'sidebar_rail' } }),
  ]);

  return {
    recentArticles,
    popularArticles,
    helpfulArticles,
    searchQueries,
    categorySections,
    seriesList,
    glossaryTerms,
    leaderboardAd,
    inFeedAd,
    belowHeroAd,
    sidebarRailAd,
  };
}, ['home-page-data'], { revalidate: 300, tags: ['home-page-data'] });

export const getHomePageData = cache(() => getCachedHomePageData());

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

export const getCachedArticleInFeedAd = unstable_cache(
  async () => prisma.adSlot.findUnique({ where: { slotName: 'article_in_feed' } }),
  ['article-in-feed-ad'],
  { revalidate: 300, tags: ['article-in-feed-ad'] },
);

export const getCachedArticleMidAd = unstable_cache(
  async () => prisma.adSlot.findUnique({ where: { slotName: 'article_mid_content' } }),
  ['article-mid-ad'],
  { revalidate: 300, tags: ['article-mid-ad'] },
);

export const getCachedTopBannerAd = unstable_cache(
  async () => prisma.adSlot.findUnique({ where: { slotName: 'top_banner' } }),
  ['top-banner-ad'],
  { revalidate: 300, tags: ['top-banner-ad'] },
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
