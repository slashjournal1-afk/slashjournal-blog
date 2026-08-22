import type { Prisma } from '@prisma/client';

export const publicArticleWhere = {
  status: 'PUBLISHED',
  isIndexable: true,
  category: { isIndexable: true },
} satisfies Prisma.ArticleWhereInput;

export const publicArticleSelect = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  contentMarkdown: true,
  status: true,
  isSponsored: true,
  sponsorName: true,
  sponsorUrl: true,
  coverImageUrl: true,
  coverImageSourceType: true,
  readingTime: true,
  viewCount: true,
  helpfulVotes: true,
  unhelpfulVotes: true,
  isIndexable: true,
  createdAt: true,
  updatedAt: true,
  publishedAt: true,
  categoryId: true,
  seriesId: true,
  seriesOrder: true,
  authorId: true,
  category: { select: { id: true, name: true, slug: true, isIndexable: true } },
  series: { select: { id: true, title: true, slug: true, isPublished: true } },
  author: { select: { id: true, displayName: true, avatarUrl: true } },
  tags: { select: { tagId: true, tag: { select: { id: true, name: true, slug: true } } } },
} satisfies Prisma.ArticleSelect;
