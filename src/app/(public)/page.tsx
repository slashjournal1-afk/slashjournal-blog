import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { AdSlotView } from '@/components/ads/AdSlotView';
import { ArticleRow } from '@/components/content/ArticleRow';
import { ReferenceRail } from '@/components/content/ReferenceRail';
import { SectionHeading } from '@/components/layout/SectionHeading';
import { NewsletterBox } from '@/components/content/NewsletterBox';
import type { Metadata } from 'next';
import { absoluteUrl, siteConfig } from '@/lib/site';
import { JsonLd } from '@/components/seo/JsonLd';
import { siteGraphSchema } from '@/lib/structured-data';
import { selectHomeArticleSections } from '@/lib/home-article-sections';
import { selectTrendingKeywords } from '@/lib/home-trending';
import { HomeSignalDesk } from '@/components/content/HomeSignalDesk';
import { HomeCategorySections } from '@/components/content/HomeCategorySections';
import { getHomePageData } from '@/lib/content-loaders';

export const revalidate = 300;

export const metadata: Metadata = {
  title: { absolute: 'SlashJournal — Catatan Arsitektur & Rekayasa Perangkat Lunak' },
  description: siteConfig.description,
  alternates: { canonical: absoluteUrl() },
};

export default async function HomePage() {
  const {
    recentArticles,
    popularArticles,
    helpfulArticles,
    searchQueries,
    categorySections,
    seriesList,
    glossaryTerms,
    leaderboardAd,
    inFeedAd,
    belowHeroAd,
    sidebarRailAd,
  } = await getHomePageData();

  const { featured, secondary, latest, recent: moreRecent, popular } = selectHomeArticleSections(recentArticles, popularArticles);
  const mostRead = popularArticles.slice(0, 5);
  const mostReadIds = new Set(mostRead.map(({ id }) => id));
  const mostHelpful = helpfulArticles.filter(({ id }) => !mostReadIds.has(id)).slice(0, 5);
  const trendingKeywords = selectTrendingKeywords(searchQueries);
  const belowHeroFilled = Boolean(belowHeroAd?.isActive)
    || Boolean(process.env.NEXT_PUBLIC_ADSENSE_BELOW_HERO_SLOT || process.env.ADSENSE_BELOW_HERO_SLOT);

  return (
    <div className="mx-auto min-h-screen max-w-editorial px-5 pb-24 sm:px-8">
      <JsonLd data={siteGraphSchema()} />
      {/* 1. Featured Story */}
      {featured && (
        <section className="border-b border-[var(--border-color)] py-10 sm:py-14">
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
            <div className="flex flex-col justify-center lg:col-span-5">
              <Link
                href={`/category/${featured.category.slug}`}
                className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--accent)] link-editorial inline-block w-fit"
              >
                {featured.category.name}
              </Link>
              <h1 className="mt-4 font-display text-3xl font-medium leading-[1.08] tracking-tight text-[var(--text-primary)] sm:text-4xl lg:text-[44px]">
                <Link href={`/${featured.slug}`} className="transition-colors hover:text-[var(--accent-hover)]">
                  {featured.title}
                </Link>
              </h1>
              {featured.excerpt && (
                <p className="mt-5 max-w-md text-base leading-relaxed text-[var(--text-muted)]">
                  {featured.excerpt}
                </p>
              )}
              <div className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[var(--text-muted)]">
                <span className="font-medium text-[var(--text-secondary)]">{featured.author.displayName}</span>
                <span aria-hidden="true" className="text-[var(--color-silver)]">·</span>
                <span>{formatDate(featured.publishedAt || featured.createdAt)}</span>
                {featured.readingTime != null && (
                  <>
                    <span aria-hidden="true" className="text-[var(--color-silver)]">·</span>
                    <span>{featured.readingTime} mnt baca</span>
                  </>
                )}
              </div>
            </div>

            <div className="lg:col-span-7">
              <Link href={`/${featured.slug}`} className="group relative block aspect-[4/3] overflow-hidden rounded-2xl bg-[var(--bg-card-muted)] sm:aspect-[3/2]">
                {featured.coverImageUrl ? (
                  <Image
                    src={featured.coverImageUrl}
                    alt={featured.title}
                    fill
                    priority
                    sizes="(min-width: 1024px) 55vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center font-display text-6xl text-[var(--color-silver)]" aria-hidden="true">
                    {'//'}
                  </div>
                )}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 1b. Billboard bawah hero */}
      {featured && (
        <AdSlotView
          slotName="below_hero"
          ad={belowHeroAd}
          adsenseSlot={process.env.NEXT_PUBLIC_ADSENSE_BELOW_HERO_SLOT || process.env.ADSENSE_BELOW_HERO_SLOT}
          className="my-10"
        />
      )}

      {/* 2. Secondary Stories */}
      {secondary.length > 0 && (
        <section className="border-b border-[var(--border-color)] py-12">
          <div className="grid gap-10 sm:grid-cols-3 sm:gap-8">
            {secondary.map((article) => (
              <article key={article.id}>
                <Link
                  href={`/${article.slug}`}
                  className="group relative block aspect-[3/2] overflow-hidden rounded-xl bg-[var(--bg-card-muted)]"
                >
                  {article.coverImageUrl ? (
                    <Image
                      src={article.coverImageUrl}
                      alt={article.title}
                      fill
                      sizes="(min-width: 640px) 33vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center font-display text-4xl text-[var(--color-silver)]" aria-hidden="true">
                      {'//'}
                    </div>
                  )}
                </Link>
                <div className="mt-4">
                  <Link
                    href={`/category/${article.category.slug}`}
                    className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--accent)]"
                  >
                    {article.category.name}
                  </Link>
                  <h2 className="mt-2 font-display text-xl font-medium leading-snug tracking-tight text-[var(--text-primary)] transition-colors hover:text-[var(--accent-hover)]">
                    <Link href={`/${article.slug}`}>{article.title}</Link>
                  </h2>
                  <p className="mt-2 text-xs text-[var(--text-muted)]">
                    {formatDate(article.publishedAt || article.createdAt)}
                    {article.readingTime != null && <> · {article.readingTime} mnt baca</>}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <HomeSignalDesk mostRead={mostRead} mostHelpful={mostHelpful} keywords={trendingKeywords} />

      {/* 4. Latest Articles + Reference Rail */}
      <section className="grid gap-12 py-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(300px,0.6fr)] lg:gap-16">
        <div>
          <SectionHeading
            title="Tulisan Terbaru"
            description="Naskah paling baru dari ruang kerja editorial."
          />
          {latest.length > 0 ? (
            <div className="mt-2">
              {latest.map((article, index) => (
                <React.Fragment key={article.id}>
                  <ArticleRow
                    href={`/${article.slug}`}
                    title={article.title}
                    excerpt={article.excerpt}
                    category={article.category.name}
                    date={formatDate(article.publishedAt || article.createdAt)}
                    readingTime={article.readingTime}
                    imageUrl={article.coverImageUrl}
                    sponsored={article.isSponsored}
                    sponsorName={article.sponsorName}
                  />
                  {index === 1 && (
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
          ) : (
            <div role="status" className="border-b border-t border-[var(--border-color)] py-8 text-sm text-[var(--text-muted)]">
              Belum ada naskah tambahan. Jelajahi{' '}
              <Link href="/series" className="font-semibold text-[var(--text-primary)] hover:text-[var(--accent)]">
                seri panduan
              </Link>{' '}
              atau{' '}
              <Link href="/glossary" className="font-semibold text-[var(--text-primary)] hover:text-[var(--accent)]">
                glosarium
              </Link>.
            </div>
          )}
        </div>

        <ReferenceRail popular={popular} recent={moreRecent} sidebarAd={sidebarRailAd} />
      </section>

      <HomeCategorySections categories={categorySections} />

      {/* 6. Serie & Glosarium */}
      <section className="grid gap-12 border-t border-[var(--border-color)] py-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeading title="Seri Panduan" href="/series" action="Semua seri" />
          <div className="mt-2">
            {seriesList.slice(0, 4).map((series) => (
              <Link
                key={series.id}
                href={`/series/${series.slug}`}
                className="flex items-center justify-between border-b border-[var(--border-color)] py-4 text-[15px] font-medium text-[var(--text-primary)] transition-colors hover:text-[var(--accent-hover)]"
              >
                <span>{series.title}</span>
                <span className="ml-4 shrink-0 text-xs text-[var(--text-muted)]">
                  {series._count.articles} bab
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <SectionHeading title="Glosarium" href="/glossary" action="Buka kamus" />
          <div className="mt-2 grid gap-x-8 sm:grid-cols-2">
            {glossaryTerms.map((term) => (
              <Link
                key={term.id}
                href={`/glossary/${term.slug}`}
                className="block border-b border-[var(--border-color)] py-4 transition-colors"
              >
                <span className="font-display text-[15px] font-medium text-[var(--text-primary)] transition-colors hover:text-[var(--accent-hover)]">
                  {term.term}
                </span>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[var(--text-muted)]">
                  {term.shortDef}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Billboard Ad (kondisional: hanya saat slot bawah hero kosong) */}
      {!belowHeroFilled && (
        <AdSlotView
          slotName="leaderboard"
          ad={leaderboardAd}
          adsenseSlot={process.env.NEXT_PUBLIC_ADSENSE_LEADERBOARD_SLOT || process.env.ADSENSE_LEADERBOARD_SLOT}
          className="my-10"
        />
      )}

      {/* 8. Newsletter */}
      <section className="border-t border-[var(--border-color)] pt-12">
        <div className="grid gap-8 md:grid-cols-2 md:items-end">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
              Catatan Berkala
            </p>
            <h2 className="mt-3 font-display text-2xl font-medium tracking-tight text-[var(--text-primary)] sm:text-3xl">
              Bawa naskah baru ke inbox Anda.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--text-muted)]">
              Satu email saat ada tulisan baru. Tanpa rangkuman kosong atau promosi yang tidak relevan.
            </p>
          </div>
          <NewsletterBox compact className="w-full max-w-md" />
        </div>
      </section>
    </div>
  );
}
