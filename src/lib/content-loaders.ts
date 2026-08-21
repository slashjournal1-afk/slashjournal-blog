import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/db';

const getCachedPublishedArticle = unstable_cache(async (slug: string) => {
  return prisma.article.findUnique({
    where: { slug },
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
  { revalidate: 300 },
);

export const getRelatedArticles = cache(async (categoryId: string, articleId: string) => {
  return unstable_cache(
    async () => prisma.article.findMany({
      where: { status: 'PUBLISHED', categoryId, id: { not: articleId } },
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
