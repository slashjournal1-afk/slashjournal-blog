import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { formatDate } from '@/lib/utils';
import { ArticleRow } from '@/components/content/ArticleRow';
import { PageIntro } from '@/components/layout/PageIntro';
import { BannerAd } from '@/components/ads/BannerAd';
import { InFeedAd } from '@/components/ads/InFeedAd';
import { Lock } from 'lucide-react';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await prisma.category.findUnique({
    where: { slug },
  });

  if (!category) return { title: 'Kanal Tidak Ditemukan | SlashJournal' };

  return {
    title: `${category.name} | SlashJournal`,
    description: category.description || 'Kanal penulisan arsitektur dan sistem.',
    robots: category.isIndexable ? 'index, follow' : 'noindex, nofollow',
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;

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
      },
    },
  });

  if (!category) {
    notFound();
  }

  // Fetch in-feed & leaderboard ad
  const inFeedAd = await prisma.adSlot.findUnique({ where: { slotName: 'in_feed' } });
  const leaderboardAd = await prisma.adSlot.findUnique({ where: { slotName: 'leaderboard' } });

  return (
    <div className="mx-auto min-h-screen max-w-editorial px-5 py-12 sm:px-8">
      <div className="mb-12 space-y-5">
        <PageIntro eyebrow="Kanal pengetahuan" title={category.name} description={category.description || undefined} count={`${category.articles.length} naskah`} />

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
        {category.articles.map((art, idx) => (
          <React.Fragment key={art.id}>
            <ArticleRow href={`/${art.slug}`} title={art.title} excerpt={art.excerpt} date={formatDate(art.publishedAt || art.createdAt)} readingTime={art.readingTime} imageUrl={art.coverImageUrl} sponsored={art.isSponsored} sponsorName={art.sponsorName} />

            {idx === 1 && <InFeedAd ad={inFeedAd} />}
          </React.Fragment>
        ))}
      </div>

      <BannerAd ad={leaderboardAd} />
    </div>
  );
}
