import { MetadataRoute } from 'next';
import { prisma } from '@/lib/db';
import { absoluteUrl } from '@/lib/site';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, categories, seriesList, glossaryTerms] = await Promise.all([
    prisma.article.findMany({
      where: { status: 'PUBLISHED', isIndexable: true, category: { isIndexable: true } },
      select: { slug: true, updatedAt: true, publishedAt: true },
    }),
    prisma.category.findMany({
      where: { isIndexable: true, articles: { some: { status: 'PUBLISHED', isIndexable: true } } },
      select: { slug: true, updatedAt: true },
    }),
    prisma.series.findMany({
      where: { isPublished: true, articles: { some: { status: 'PUBLISHED', isIndexable: true, category: { isIndexable: true } } } },
      select: { slug: true, updatedAt: true },
    }),
    prisma.glossaryTerm.findMany({
      where: { definition: { not: '' } },
      select: { slug: true, updatedAt: true },
    }),
  ]);
  const latestContentUpdate = articles.reduce<Date | undefined>((latest, article) => {
    const candidate = article.updatedAt || article.publishedAt || undefined;
    return candidate && (!latest || candidate > latest) ? candidate : latest;
  }, undefined);


  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl(),
      lastModified: latestContentUpdate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: absoluteUrl('/series'),
      lastModified: seriesList.reduce<Date | undefined>((latest, item) => !latest || item.updatedAt > latest ? item.updatedAt : latest, undefined),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: absoluteUrl('/glossary'),
      lastModified: glossaryTerms.reduce<Date | undefined>((latest, item) => !latest || item.updatedAt > latest ? item.updatedAt : latest, undefined),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: absoluteUrl('/about'),
      lastModified: new Date('2026-08-20T00:00:00.000Z'),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  const articleRoutes: MetadataRoute.Sitemap = articles.map((art) => ({
    url: absoluteUrl(`/${art.slug}`),
    lastModified: art.updatedAt || art.publishedAt || new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: absoluteUrl(`/category/${cat.slug}`),
    lastModified: cat.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const seriesRoutes: MetadataRoute.Sitemap = seriesList.map((ser) => ({
    url: absoluteUrl(`/series/${ser.slug}`),
    lastModified: ser.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const glossaryRoutes: MetadataRoute.Sitemap = glossaryTerms.map((term) => ({
    url: absoluteUrl(`/glossary/${term.slug}`),
    lastModified: term.updatedAt,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [
    ...staticRoutes,
    ...articleRoutes,
    ...categoryRoutes,
    ...seriesRoutes,
    ...glossaryRoutes,
  ];
}
