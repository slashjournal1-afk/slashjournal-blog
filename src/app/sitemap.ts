import { MetadataRoute } from 'next';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://slashjournal.dev';

  // Fetch all published and indexable articles
  const articles = await prisma.article.findMany({
    where: {
      status: 'PUBLISHED',
      isIndexable: true,
    },
    select: {
      slug: true,
      updatedAt: true,
      publishedAt: true,
    },
  });

  // Fetch indexable categories
  const categories = await prisma.category.findMany({
    where: { isIndexable: true },
    select: { slug: true, updatedAt: true },
  });

  // Fetch published series
  const seriesList = await prisma.series.findMany({
    where: { isPublished: true },
    select: { slug: true, updatedAt: true },
  });

  // Fetch glossary terms
  const glossaryTerms = await prisma.glossaryTerm.findMany({
    select: { slug: true, updatedAt: true },
  });

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/series`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/glossary`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  const articleRoutes: MetadataRoute.Sitemap = articles.map((art) => ({
    url: `${baseUrl}/${art.slug}`,
    lastModified: art.updatedAt || art.publishedAt || new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${baseUrl}/category/${cat.slug}`,
    lastModified: cat.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const seriesRoutes: MetadataRoute.Sitemap = seriesList.map((ser) => ({
    url: `${baseUrl}/series/${ser.slug}`,
    lastModified: ser.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const glossaryRoutes: MetadataRoute.Sitemap = glossaryTerms.map((term) => ({
    url: `${baseUrl}/glossary/${term.slug}`,
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
