import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { absoluteUrl, siteConfig } from '@/lib/site';
import { publicArticleWhere } from '@/lib/visibility';

export const dynamic = 'force-dynamic';

export async function GET() {
  const [articles, categories, series] = await Promise.all([
    prisma.article.findMany({
      where: publicArticleWhere,
      select: { title: true, slug: true, excerpt: true },
      orderBy: { publishedAt: 'desc' },
      take: 30,
    }),
    prisma.category.findMany({ where: { isIndexable: true }, select: { name: true, slug: true, description: true } }),
    prisma.series.findMany({ where: { isPublished: true }, select: { title: true, slug: true, description: true } }),
  ]);

  const body = `# ${siteConfig.name}
> ${siteConfig.description}

## Main sections
- [Beranda](${absoluteUrl('/')}): Publikasi dan indeks tulisan terbaru.
- [Seri panduan](${absoluteUrl('/series') }): Jalur belajar arsitektur sistem.
- [Glosarium](${absoluteUrl('/glossary') }): Definisi istilah teknis yang terhubung ke artikel.
- [Tentang](${absoluteUrl('/about') }): Profil penulis dan standar editorial.

## Categories
${categories.map((category) => `- [${category.name}](${absoluteUrl(`/category/${category.slug}`)}): ${category.description || 'Tulisan teknis terkurasi.'}`).join('\n')}

## Series
${series.map((item) => `- [${item.title}](${absoluteUrl(`/series/${item.slug}`)}): ${item.description || 'Seri panduan teknis.'}`).join('\n')}

## Featured articles
${articles.map((article) => `- [${article.title}](${absoluteUrl(`/${article.slug}`)}): ${article.excerpt}`).join('\n')}

## Note
This file is provided for documentation and agent usability. It is not presented as a Google ranking or AI citation signal.
`;

  return new NextResponse(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 's-maxage=3600, stale-while-revalidate' } });
}
