import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { formatDate } from '@/lib/utils';
import { Layers, ArrowRight, Clock } from 'lucide-react';
import type { Metadata } from 'next';
import { absoluteUrl } from '@/lib/site';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbSchema } from '@/lib/structured-data';

export const revalidate = 900;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const series = await prisma.series.findUnique({
    where: { slug },
  });

  // Resolve inside metadata so the HTTP 404 status is set before streaming begins.
  if (!series || !series.isPublished) notFound();

  const ogImageUrl = series.coverImageUrl
    ? series.coverImageUrl.startsWith('http://') || series.coverImageUrl.startsWith('https://')
      ? series.coverImageUrl
      : absoluteUrl(series.coverImageUrl)
    : absoluteUrl('/og-image.jpeg');

  return {
    title: series.title,
    description: series.description || 'Seri panduan terkurasi.',
    alternates: { canonical: absoluteUrl(`/series/${series.slug}`) },
    openGraph: {
      title: series.title,
      description: series.description || 'Seri panduan terkurasi.',
      type: 'website',
      url: absoluteUrl(`/series/${series.slug}`),
      images: [{ url: ogImageUrl, alt: series.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: series.title,
      description: series.description || 'Seri panduan terkurasi.',
      images: [ogImageUrl],
    },
  };
}

export default async function SeriesDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const series = await prisma.series.findUnique({
    where: { slug },
    include: {
      articles: {
        where: { status: 'PUBLISHED', isIndexable: true, category: { isIndexable: true } },
        orderBy: { seriesOrder: 'asc' },
        include: { author: true },
      },
    },
  });

  if (!series || !series.isPublished) {
    notFound();
  }
  const breadcrumbJsonLd = breadcrumbSchema([
    { name: 'Beranda', path: '/' }, { name: 'Seri', path: '/series' },
    { name: series.title, path: `/series/${series.slug}` },
  ]);

  return (
    <div className="min-h-screen max-w-[1200px] mx-auto px-4 sm:px-6 py-12">
      <JsonLd data={breadcrumbJsonLd} />
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-[#71717a] dark:text-[#a1a1aa]">
        <Link href="/" className="hover:text-[#09090b] dark:hover:text-white">Beranda</Link>
        <span aria-hidden="true">/</span>
        <Link href="/series" className="hover:text-[#09090b] dark:hover:text-white">Seri</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{series.title}</span>
      </nav>

      <div className="rounded-[36px] bg-white dark:bg-[#18181b] border border-[#ececee] dark:border-[#27272a] p-8 sm:p-12 mb-12 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-[20px] bg-[#09090b] text-white dark:bg-white dark:text-[#09090b] flex items-center justify-center font-bold">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <span className="px-2.5 py-0.5 rounded-[10px] bg-[var(--accent-soft)] text-[var(--accent)] text-[11px] font-bold uppercase">
              SERI TERKURASI
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#09090b] dark:text-white">
              {series.title}
            </h1>
          </div>
        </div>

        <p className="text-sm sm:text-base text-[#52525b] dark:text-[#a1a1aa] max-w-2xl leading-relaxed">
          {series.description}
        </p>

        <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-[#71717a] dark:text-[#a1a1aa]">
          <span>Total {series.articles.length} Bab Terpublikasi</span>
        </div>
      </div>

      {/* Chapters list */}
      <div className="space-y-4 max-w-4xl">
        {series.articles.map((art, idx) => (
          <Link
            key={art.id}
            href={`/${art.slug}`}
            className="block rounded-[28px] bg-white dark:bg-[#18181b] border border-[#ececee] dark:border-[#27272a] p-6 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all group"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <span className="w-8 h-8 rounded-full bg-[#f4f4f5] dark:bg-[#27272a] text-sm font-bold flex items-center justify-center text-[var(--accent)] shrink-0 border border-[#ececee] dark:border-[#3f3f46] mt-0.5">
                  {idx + 1}
                </span>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-[#09090b] dark:text-white group-hover:text-[var(--accent)] transition-colors leading-snug">
                    {art.title}
                  </h3>
                  <p className="text-xs text-[#52525b] dark:text-[#a1a1aa] line-clamp-2">
                    {art.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-[11px] text-[#71717a] dark:text-[#a1a1aa] pt-2">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[var(--accent)]" />
                      {art.readingTime} menit baca
                    </span>
                    <span>{formatDate(art.publishedAt || art.createdAt)}</span>
                  </div>
                </div>
              </div>

              <span className="inline-flex items-center gap-1 text-xs font-bold text-[#09090b] dark:text-white group-hover:translate-x-1 transition-transform shrink-0 pt-1">
                Baca Bab <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
