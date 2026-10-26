import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { formatDate } from '@/lib/utils';
import { ArticleRow } from '@/components/content/ArticleRow';
import { PageIntro } from '@/components/layout/PageIntro';
import { AdSlotView } from '@/components/ads/AdSlotView';
import { GoogleMultiplexAd } from '@/components/ads/GoogleMultiplexAd';
import { Lock } from 'lucide-react';
import type { Metadata } from 'next';
import { absoluteUrl } from '@/lib/site';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbSchema } from '@/lib/structured-data';
import { publicArticleWhere } from '@/lib/visibility';
import { parsePaginationPage } from '@/lib/pagination';

export const revalidate = 300;

const PAGE_SIZE = 12;

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ page?: string | string[] | undefined }>;
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const sParams = await searchParams;
  const parsed = parsePaginationPage(sParams?.page, PAGE_SIZE);

  if (!parsed) {
    notFound();
  }

  const category = await prisma.category.findUnique({
    where: { slug },
    select: { id: true, name: true, slug: true, description: true, isIndexable: true },
  });

  if (!category || !category.isIndexable) {
    notFound();
  }

  return {
    title: parsed.page > 1 ? `${category.name} — Halaman ${parsed.page}` : category.name,
    description: category.description || 'Kanal penulisan arsitektur dan sistem.',
    alternates: {
      canonical: absoluteUrl(`/category/${category.slug}${parsed.page > 1 ? `?page=${parsed.page}` : ''}`),
    },
    robots: 'index, follow',
  };
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const sParams = await searchParams;
  const parsed = parsePaginationPage(sParams?.page, PAGE_SIZE);

  if (!parsed) {
    notFound();
  }

  const category = await prisma.category.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      isIndexable: true,
      _count: {
        select: {
          articles: {
            where: publicArticleWhere,
          },
        },
      },
    },
  });

  if (!category || !category.isIndexable) {
    notFound();
  }

  const totalArticles = category._count.articles;
  const totalPages = Math.max(1, Math.ceil(totalArticles / PAGE_SIZE));

  if (parsed.page > totalPages) {
    notFound();
  }

  const articles = await prisma.article.findMany({
    where: {
      categoryId: category.id,
      ...publicArticleWhere,
    },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      readingTime: true,
      coverImageUrl: true,
      isSponsored: true,
      sponsorName: true,
      createdAt: true,
      publishedAt: true,
    },
    orderBy: { createdAt: 'desc' },
    skip: parsed.skip,
    take: PAGE_SIZE,
  });

  const hasNextPage = parsed.page < totalPages;
  const page = parsed.page;

  const breadcrumbJsonLd = breadcrumbSchema([
    { name: 'Beranda', path: '/' },
    { name: category.name, path: `/category/${category.slug}` },
  ]);

  // Safe ad queries: if ad slots fail, page continues to render cleanly without ads
  const [inFeedAd, leaderboardAd] = await Promise.all([
    prisma.adSlot.findUnique({ where: { slotName: 'in_feed' } }).catch(() => null),
    prisma.adSlot.findUnique({ where: { slotName: 'leaderboard' } }).catch(() => null),
  ]);

  return (
    <div className="mx-auto min-h-screen max-w-editorial px-5 py-12 sm:px-8">
      <JsonLd data={breadcrumbJsonLd} />
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-[var(--text-muted)]">
        <Link href="/" className="hover:text-[var(--text-primary)]">Beranda</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{category.name}</span>
      </nav>
      <div className="mb-12 space-y-5">
        <PageIntro
          eyebrow="Kanal pengetahuan"
          title={category.name}
          description={category.description || undefined}
          count={totalPages > 1 ? `Halaman ${page} dari ${totalPages}` : undefined}
        />

        {!category.isIndexable && (
          <div className="p-4 rounded-[20px] bg-[#f4f4f5] dark:bg-[#27272a] border border-[#ececee] dark:border-[#3f3f46] flex items-center gap-3 text-xs text-[#52525b] dark:text-[#a1a1aa]">
            <Lock className="w-4 h-4 text-[var(--accent)] shrink-0" />
            <span>
              <strong>Kanal Refleksi Personal:</strong> Halaman dan artikel dalam kanal ini tidak diindeks secara agresif oleh mesin pencari publik demi menjaga integritas privasi.
            </span>
          </div>
        )}
      </div>

      {articles.length === 0 ? (
        <div className="mb-16 py-12 text-center border-t border-b border-[var(--border-color)]">
          <p className="text-sm text-[var(--text-muted)]">Belum ada tulisan yang dipublikasikan dalam topik ini.</p>
          <Link href="/category" className="mt-4 inline-block text-xs font-semibold text-[var(--accent)] hover:underline">
            ← Kembali ke semua kategori
          </Link>
        </div>
      ) : (
        <div className="mb-16">
          {articles.map((art, idx) => (
            <React.Fragment key={art.id}>
              <ArticleRow
                href={`/${art.slug}`}
                title={art.title}
                excerpt={art.excerpt}
                date={formatDate(art.publishedAt || art.createdAt)}
                readingTime={art.readingTime}
                imageUrl={art.coverImageUrl}
                sponsored={art.isSponsored}
                sponsorName={art.sponsorName}
              />

              {idx === 1 && (
                <AdSlotView
                  slotName="in_feed"
                  ad={inFeedAd}
                  adsenseSlot={process.env.NEXT_PUBLIC_ADSENSE_IN_FEED_SLOT || process.env.ADSENSE_IN_FEED_SLOT}
                  adsenseLayoutKey={process.env.NEXT_PUBLIC_ADSENSE_IN_FEED_LAYOUT_KEY}
                  className="my-6"
                />
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      {(page > 1 || hasNextPage) && (
        <nav aria-label="Paginasi kanal" className="mb-12 flex items-center justify-between border-t border-[var(--border-color)] pt-6 text-sm">
          {page > 1 ? (
            <Link
              href={`/category/${category.slug}${page - 1 > 1 ? `?page=${page - 1}` : ''}`}
              className="font-semibold text-[var(--text-primary)] hover:text-[var(--accent)]"
            >
              ← Halaman sebelumnya
            </Link>
          ) : (
            <span />
          )}
          {hasNextPage ? (
            <Link
              href={`/category/${category.slug}?page=${page + 1}`}
              className="font-semibold text-[var(--text-primary)] hover:text-[var(--accent)]"
            >
              Halaman berikutnya →
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}

      {articles.length > 0 && (
        <>
          <GoogleMultiplexAd className="mt-12" />
          <AdSlotView
            slotName="leaderboard"
            ad={leaderboardAd}
            adsenseSlot={process.env.NEXT_PUBLIC_ADSENSE_LEADERBOARD_SLOT || process.env.ADSENSE_LEADERBOARD_SLOT}
            className="mt-10"
          />
        </>
      )}
    </div>
  );
}
