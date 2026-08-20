import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { formatDate } from '@/lib/utils';
import { PageIntro } from '@/components/layout/PageIntro';
import { ArticleRow } from '@/components/content/ArticleRow';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = await prisma.tag.findUnique({
    where: { slug },
  });

  if (!tag) return { title: 'Tag Tidak Ditemukan | SlashJournal' };

  return {
    title: `#${tag.name} | SlashJournal`,
    description: `Koleksi tulisan dengan tag #${tag.name}`,
    robots: 'noindex, follow', // Tag archives are noindex per C6
  };
}

export default async function TagPage({ params }: PageProps) {
  const { slug } = await params;

  const tag = await prisma.tag.findUnique({
    where: { slug },
    include: {
      articles: {
        include: {
          article: {
            include: { category: true },
          },
        },
      },
    },
  });

  if (!tag) {
    notFound();
  }

  const publishedArticles = tag.articles
    .map((at) => at.article)
    .filter((a) => a.status === 'PUBLISHED');

  return (
    <div className="min-h-screen max-w-[1200px] mx-auto px-4 sm:px-6 py-12">
      <div className="mb-12"><PageIntro eyebrow="Topik" title={`#${tag.name}`} description="Tulisan yang membahas istilah dan persoalan terkait." count={`${publishedArticles.length} tulisan`} /></div>

      <div>
        {publishedArticles.map((art) => (
          <ArticleRow key={art.id} href={`/${art.slug}`} title={art.title} excerpt={art.excerpt} category={art.category.name} date={formatDate(art.publishedAt || art.createdAt)} readingTime={art.readingTime} imageUrl={art.coverImageUrl} />
        ))}
      </div>
    </div>
  );
}
