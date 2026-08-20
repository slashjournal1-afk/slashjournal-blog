import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://slashjournal.dev';

  const articles = await prisma.article.findMany({
    where: {
      status: 'PUBLISHED',
      isIndexable: true,
      isSponsored: false, // Exclude advertorials per M5 standard
    },
    include: {
      author: true,
      category: true,
    },
    orderBy: { publishedAt: 'desc' },
    take: 30,
  });

  const rssItemsXml = articles
    .map((art) => {
      const pubDate = new Date(art.publishedAt || art.createdAt).toUTCString();
      const cleanTitle = escapeXml(art.title);
      const cleanExcerpt = escapeXml(art.excerpt);
      const cleanAuthor = escapeXml(art.author.displayName);
      const cleanCategory = escapeXml(art.category.name);

      return `
    <item>
      <title>${cleanTitle}</title>
      <link>${baseUrl}/${art.slug}</link>
      <guid isPermaLink="true">${baseUrl}/${art.slug}</guid>
      <description>${cleanExcerpt}</description>
      <author>${cleanAuthor}</author>
      <category>${cleanCategory}</category>
      <pubDate>${pubDate}</pubDate>
    </item>`;
    })
    .join('');

  const rssFeedXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>SlashJournal // Rekayasa Sistem &amp; Arsitektur Perangkat Lunak</title>
    <link>${baseUrl}</link>
    <description>Publikasi rekayasa sistem, arsitektur database, dan desain antarmuka.</description>
    <language>id-ID</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    ${rssItemsXml}
  </channel>
</rss>`;

  return new NextResponse(rssFeedXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case '\'':
        return '&apos;';
      case '"':
        return '&quot;';
      default:
        return c;
    }
  });
}
