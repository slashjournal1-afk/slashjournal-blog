import { MetadataRoute } from 'next';
import { prisma } from '@/lib/db';
import { absoluteUrl } from '@/lib/site';

export const revalidate = 3600;

interface SlugDate {
  slug: string;
  updatedAt: Date;
}

interface SitemapData {
  articles: { slug: string; updatedAt: Date; publishedAt: Date | null }[];
  categories: SlugDate[];
  seriesList: SlugDate[];
  glossaryTerms: SlugDate[];
}

let sitemapCache: SitemapData | null = null;

async function loadSitemapData(): Promise<SitemapData> {
  try {
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
    const data: SitemapData = { articles, categories, seriesList, glossaryTerms };
    sitemapCache = data;
    return data;
  } catch (error) {
    console.error('[sitemap] Database unavailable, serving last known URL set.', error);
    return (
      sitemapCache ?? { articles: [], categories: [], seriesList: [], glossaryTerms: [] }
    );
  }
}

function latest(dates: (Date | null | undefined)[]): Date | undefined {
  return dates.reduce<Date | undefined>((acc, d) => (d && (!acc || d > acc) ? d : acc), undefined);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { articles, categories, seriesList, glossaryTerms } = await loadSitemapData();
  const latestContentUpdate = latest(
    articles.map((a) => a.updatedAt || a.publishedAt)
  );

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl(),
      lastModified: latestContentUpdate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: absoluteUrl('/category'),
      lastModified: latest(categories.map((c) => c.updatedAt)),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: absoluteUrl('/series'),
      lastModified: latest(seriesList.map((s) => s.updatedAt)),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: absoluteUrl('/glossary'),
      lastModified: latest(glossaryTerms.map((t) => t.updatedAt)),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    { url: absoluteUrl('/about'), changeFrequency: 'monthly', priority: 0.5 },
    { url: absoluteUrl('/contact'), changeFrequency: 'monthly', priority: 0.5 },
    { url: absoluteUrl('/privacy-policy'), changeFrequency: 'yearly', priority: 0.3 },
    { url: absoluteUrl('/terms'), changeFrequency: 'yearly', priority: 0.3 },
    { url: absoluteUrl('/cookie-policy'), changeFrequency: 'yearly', priority: 0.3 },
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
