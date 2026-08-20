import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { formatDate } from '@/lib/utils';
import { ArticleRow } from '@/components/content/ArticleRow';
import { PageIntro } from '@/components/layout/PageIntro';
import { BannerAd } from '@/components/ads/BannerAd';
import { InFeedAd } from '@/components/ads/InFeedAd';
import { Lock } from 'lucide-react';
import type { Metadata } from 'next';
import { absoluteUrl } from '@/lib/site';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbSchema } from '@/lib/structured-data';

export const revalidate = 300;
const PAGE_SIZE = 12;

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ page?: string }>;
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = Math.max(1, Number((await searchParams)?.page || '1') || 1);
  const category = await prisma.category.findUnique({
    where: { slug },
  });

  if (!category) return { title: 'Kanal Tidak Ditemukan', robots: { index: false, follow: false } };

  return {
    title: category.name,
    description: category.description || 'Kanal penulisan arsitektur dan sistem.',
    alternates: { canonical: absoluteUrl(`/category/${category.slug}${page > 1 ? `?page=${page}` : ''}`) },
    robots: category.isIndexable ? 'index, follow' : 'noindex, nofollow',
  };
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const page = Math.max(1, Number((await searchParams)?.page || '1') || 1);

  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      articles: {
        where: { status: 'PUBLISHED' },
        include: {
          author: true,
          tags: { include: { tag: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE + 1,
      },
    },
  });

  if (!category) {
    notFound();
  }

  const hasNextPage = category.articles.length > PAGE_SIZE;
  const articles = category.articles.slice(0, PAGE_SIZE);
  if (page > 1 && articles.length === 0) notFound();
  const breadcrumbJsonLd = breadcrumbSchema([
    { name: 'Beranda', path: '/' },
    { name: category.name, path: `/category/${category.slug}` },
  ]);

  // Fetch in-feed & leaderboard ad
  const inFeedAd = await prisma.adSlot.findUnique({ where: { slotName: 'in_feed' } });
  const leaderboardAd = await prisma.adSlot.findUnique({ where: { slotName: 'leaderboard' } });

  return (
    <div className="mx-auto min-h-screen max-w-editorial px-5 py-12 sm:px-8">
      <JsonLd data={breadcrumbJsonLd} />
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-[var(--text-muted)]">
        <Link href="/" className="hover:text-[var(--text-primary)]">Beranda</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{category.name}</span>
      </nav>
      <div className="mb-12 space-y-5">
        <PageIntro eyebrow="Kanal pengetahuan" title={category.name} description={category.description || undefined} count={`Halaman ${page}`} />

        {!category.isIndexable && (
          <div className="p-4 rounded-[20px] bg-[#f4f4f5] dark:bg-[#27272a] border border-[#ececee] dark:border-[#3f3f46] flex items-center gap-3 text-xs text-[#52525b] dark:text-[#a1a1aa]">
            <Lock className="w-4 h-4 text-[var(--accent)] shrink-0" />
            <span>
              <strong>Kanal Refleksi Personal:</strong> Halaman dan artikel dalam kanal ini tidak diindeks secara agresif oleh mesin pencari publik demi menjaga integritas privasi (sesuai ketentuan UU PDP & keputusan KB2).
            </span>
          </div>
        )}
      </div>

      <div className="mb-16">
        {articles.map((art, idx) => (
          <React.Fragment key={art.id}>
            <ArticleRow href={`/${art.slug}`} title={art.title} excerpt={art.excerpt} date={formatDate(art.publishedAt || art.createdAt)} readingTime={art.readingTime} imageUrl={art.coverImageUrl} sponsored={art.isSponsored} sponsorName={art.sponsorName} />

            {idx === 1 && <InFeedAd ad={inFeedAd} />}
          </React.Fragment>
        ))}
      </div>

      {(page > 1 || hasNextPage) && (
        <nav aria-label="Paginasi kanal" className="mb-12 flex items-center justify-between border-t border-[var(--border-color)] pt-6 text-sm">
          {page > 1 ? <Link href={`/category/${category.slug}?page=${page - 1}`} className="font-semibold text-[var(--text-primary)]">← Halaman sebelumnya</Link> : <span />}
          {hasNextPage ? <Link href={`/category/${category.slug}?page=${page + 1}`} className="font-semibold text-[var(--text-primary)]">Halaman berikutnya →</Link> : <span />}
        </nav>
      )}

      <BannerAd ad={leaderboardAd} />
    </div>
  );
}
