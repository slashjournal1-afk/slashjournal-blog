import { cache } from 'react';
import { prisma } from '@/lib/db';

export const getPublishedArticle = cache(async (slug: string) => {
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
      comments: {
        include: {
          user: { select: { id: true, displayName: true, avatarUrl: true, role: true } },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });
});
