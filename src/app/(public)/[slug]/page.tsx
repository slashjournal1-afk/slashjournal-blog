import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { ArticleContentRenderer } from '@/components/content/ArticleContentRenderer';
import { ScrollSpyTOC } from '@/components/wiki/ScrollSpyTOC';
import { MobileTOC } from '@/components/wiki/MobileTOC';
import { StickyReadingHeader } from '@/components/layout/StickyReadingHeader';
import { ArticleReactions } from '@/components/content/ArticleReactions';
import { NewsletterBox } from '@/components/content/NewsletterBox';
import { InlineSelectionQuote } from '@/components/content/InlineSelectionQuote';
import { BookmarkButton } from '@/components/wiki/BookmarkButton';
import { CommentSection } from '@/components/comments/CommentSection';
import { SponsoredBadge } from '@/components/ads/SponsoredBadge';
import { SidebarStickyAd } from '@/components/ads/SidebarStickyAd';
import { Calendar, Clock, Eye, ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import type { Metadata } from 'next';
import { absoluteUrl, siteConfig } from '@/lib/site';
import { JsonLd } from '@/components/seo/JsonLd';
import { authorId, breadcrumbSchema, organizationId, websiteId } from '@/lib/structured-data';
import { ArticleViewTracker } from '@/components/content/ArticleViewTracker';
import { ArticleDiscoveryBand } from '@/components/content/ArticleDiscoveryBand';
import { getArticleDiscovery, getCachedGlossaryItems, getCachedSidebarAd, getPublishedArticle } from '@/lib/content-loaders';

export const revalidate = 900;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPublishedArticle(slug);

  if (!article || article.status !== 'PUBLISHED') {
    return { title: 'Artikel Tidak Ditemukan', robots: { index: false, follow: false } };
  }

  const publishedIso = article.publishedAt
    ? new Date(article.publishedAt).toISOString()
    : new Date(article.createdAt).toISOString();

  // Resolve dynamic absolute OpenGraph & Twitter Card image URL
  const ogImageUrl = article.coverImageUrl
    ? article.coverImageUrl.startsWith('http://') || article.coverImageUrl.startsWith('https://')
      ? article.coverImageUrl
      : absoluteUrl(article.coverImageUrl)
    : absoluteUrl('/og-image.jpeg');

  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: absoluteUrl(`/${article.slug}`) },
    robots: article.isIndexable && article.category.isIndexable ? 'index, follow' : 'noindex, nofollow',
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      url: absoluteUrl(`/${article.slug}`),
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      publishedTime: publishedIso,
      images: [
        {
          url: ogImageUrl,
          alt: article.title,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: [ogImageUrl],
    },
  };
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const article = await getPublishedArticle(slug);

  if (!article || article.status !== 'PUBLISHED') {
    notFound();
  }

  const [glossaryTerms, discovery, sidebarAd] = await Promise.all([
    getCachedGlossaryItems(),
    getArticleDiscovery({
      articleId: article.id,
      categoryId: article.categoryId,
      seriesId: article.seriesId,
      tagIds: article.tags.map(({ tagId }) => tagId),
    }),
    getCachedSidebarAd(),
  ]);

  // Extract headings for Table of Contents
  const headings = extractHeadings(article.contentMarkdown || '');

  // Determine Previous & Next chapters in the series
  let prevArticle: { title: string; slug: string; seriesOrder?: number | null } | null = null;
  let nextArticle: { title: string; slug: string; seriesOrder?: number | null } | null = null;

  if (article.series?.articles) {
    const currentIndex = article.series.articles.findIndex((a) => a.id === article.id);
    if (currentIndex > 0) prevArticle = article.series.articles[currentIndex - 1];
    if (currentIndex >= 0 && currentIndex < article.series.articles.length - 1) {
      nextArticle = article.series.articles[currentIndex + 1];
    }
  }

  const publishedIso = article.publishedAt
    ? new Date(article.publishedAt).toISOString()
    : new Date(article.createdAt).toISOString();
  const modifiedIso = new Date(article.updatedAt).toISOString();

  // Resolve absolute image for Google Schema.org
  const articleSchemaImage = article.coverImageUrl
    ? article.coverImageUrl.startsWith('http://') || article.coverImageUrl.startsWith('https://')
      ? article.coverImageUrl
      : absoluteUrl(article.coverImageUrl)
    : absoluteUrl('/og-image.jpeg');

  // Schema.org JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: article.title,
    description: article.excerpt,
    image: [articleSchemaImage],
    datePublished: publishedIso,
    dateModified: modifiedIso,
    author: {
      '@type': 'Person',
      name: article.author.displayName,
      '@id': authorId,
      url: absoluteUrl('/about#author'),
    },
    publisher: {
      '@type': 'Organization',
      '@id': organizationId,
      name: 'SlashJournal',
      url: siteConfig.url,
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl('/icon/Minimalist_SJ_monogram_logo_design_202608201741.png'),
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': absoluteUrl(`/${article.slug}`),
    },
    url: absoluteUrl(`/${article.slug}`),
    inLanguage: siteConfig.locale,
    articleSection: article.category.name,
    keywords: article.tags.map(({ tag }) => tag.name),
    isPartOf: { '@id': websiteId },
    citation: [
      ...(article.sources || []).map((s) => s.url).filter((url): url is string => Boolean(url)),
      ...extractExternalReferences(article.contentMarkdown || ''),
    ],
  };
  const breadcrumbJsonLd = breadcrumbSchema([
    { name: 'Beranda', path: '/' },
    { name: article.category.name, path: `/category/${article.category.slug}` },
    ...(article.series ? [{ name: article.series.title, path: `/series/${article.series.slug}` }] : []),
    { name: article.title, path: `/${article.slug}` },
  ]);

  return (
    <div className="min-h-screen pb-20">
      {/* Schema.org Structured Data */}
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <ArticleViewTracker
        articleId={article.id}
        articleSlug={article.slug}
        articleTitle={article.title}
        articleCategory={article.category.name}
        articleSeries={article.series?.title}
      />

      {/* Floating Sticky Reading Header on Scroll */}
      <StickyReadingHeader
        articleId={article.id}
        title={article.title}
        slug={article.slug}
        authorName={article.author.displayName}
        readingTime={article.readingTime}
      />

      {/* Breadcrumb */}
      <div className="border-b border-[var(--border-color)]">
        <div className="mx-auto flex min-w-0 max-w-editorial items-center justify-between gap-3 px-4 py-4 text-xs text-[var(--text-muted)] sm:px-8">
          <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-2 overflow-hidden">
            <Link href="/" className="shrink-0 transition-colors hover:text-[var(--text-primary)]">
              Beranda
            </Link>
            <span aria-hidden="true" className="text-[var(--color-silver)]">/</span>
            <Link
              href={`/category/${article.category.slug}`}
              className="shrink-0 font-medium transition-colors hover:text-[var(--text-primary)]"
            >
              {article.category.name}
            </Link>
            {article.series && (
              <>
                <span aria-hidden="true" className="text-[var(--color-silver)]">/</span>
                <Link
                  href={`/series/${article.series.slug}`}
                  className="hidden shrink-0 font-medium transition-colors hover:text-[var(--text-primary)] sm:inline"
                >
                  {article.series.title}
                </Link>
              </>
            )}
            <span aria-hidden="true" className="text-[var(--color-silver)]">/</span>
            <span aria-current="page" className="min-w-0 truncate text-[var(--text-secondary)]">{article.title}</span>
          </nav>

          <BookmarkButton articleId={article.id} articleSlug={article.slug} articleTitle={article.title} articleCategory={article.category.name} />
        </div>
      </div>

      <article className="mx-auto w-full min-w-0 max-w-editorial px-4 sm:px-8">
        {/* Article Header */}
        <header className="mx-auto w-full min-w-0 max-w-[760px] pt-8 sm:pt-14">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            {article.isSponsored ? (
              <SponsoredBadge sponsorName={article.sponsorName} sponsorUrl={article.sponsorUrl} />
            ) : (
              <Link
                href={`/category/${article.category.slug}`}
                className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--accent)] link-editorial"
              >
                {article.category.name}
              </Link>
            )}
            {article.series && (
              <Link
                href={`/series/${article.series.slug}`}
                className="text-xs font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
              >
                Seri: {article.series.title} · Bagian {article.seriesOrder || 1}
              </Link>
            )}
          </div>

          <h1 className="mt-4 break-words font-display text-2xl font-semibold leading-[1.14] tracking-tight text-[var(--text-primary)] sm:mt-5 sm:text-4xl md:text-5xl lg:text-[52px]">
            {article.title}
          </h1>

          {article.excerpt && (
            <p className="mt-4 sm:mt-6 font-display text-base sm:text-lg lg:text-xl leading-relaxed text-[var(--text-secondary)]">
              {article.excerpt}
            </p>
          )}

          {/* Metadata Row */}
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-y border-[var(--border-color)] py-4 sm:py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-ink)] text-sm font-bold text-white shadow-xs">
                {article.author.displayName.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)]">{article.author.displayName}</p>
                <p className="text-xs text-[var(--text-muted)]">Penulis &amp; Arsitek</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--text-muted)]">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--bg-card-muted)] border border-[var(--border-color)] px-3 py-1 font-medium">
                <Calendar className="h-3.5 w-3.5 text-[var(--accent)] shrink-0" />
                {formatDate(article.publishedAt || article.createdAt)}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--bg-card-muted)] border border-[var(--border-color)] px-3 py-1 font-medium">
                <Clock className="h-3.5 w-3.5 text-[var(--accent)] shrink-0" />
                {article.readingTime} mnt baca
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--bg-card-muted)] border border-[var(--border-color)] px-3 py-1 font-medium">
                <Eye className="h-3.5 w-3.5 text-[var(--accent)] shrink-0" />
                {article.viewCount} pembaca
              </span>
            </div>
          </div>
        </header>

        {/* Cover Image — wider than the reading column, full uncropped presentation */}
        {article.coverImageUrl && (
          <div className="mx-auto mt-8 sm:mt-10 max-w-[1000px]">
            <div className="relative w-full overflow-hidden rounded-[20px] sm:rounded-3xl bg-[var(--bg-card-muted)] border border-[var(--border-color)] shadow-xs flex items-center justify-center p-1 sm:p-2">
              <Image
                src={article.coverImageUrl}
                alt={article.title}
                width={1200}
                height={675}
                priority
                unoptimized={Boolean(article.coverImageUrl?.startsWith('/uploads') || article.coverImageUrl?.includes('supabase.co'))}
                sizes="(min-width: 1000px) 1000px, 100vw"
                className="w-full h-auto max-h-[620px] object-contain rounded-[16px] sm:rounded-[20px]"
              />
            </div>
            {article.coverImageSourceType && (
              <p className="mt-2 text-right text-xs text-[var(--text-muted)]">
                Sumber visual: <span className="font-medium">{formatSourceType(article.coverImageSourceType)}</span>
              </p>
            )}
          </div>
        )}

        {/* Content + Sidebar */}
        <div className="mt-10 grid min-w-0 gap-10 sm:mt-12 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-16">
          {/* Main Article Body */}
          <div className="mx-auto w-full min-w-0 max-w-[720px] space-y-8">
            {/* Mobile Collapsible Table of Contents */}
            <MobileTOC headings={headings} />

            <InlineSelectionQuote articleTitle={article.title} />

            <div id="article-body" className="relative min-w-0 max-w-full break-words">
              <ArticleContentRenderer content={article.contentMarkdown} glossary={glossaryTerms} />
            </div>

            {/* Tags / Keywords */}
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 border-t border-[var(--border-color)] pt-7">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mr-1">
                  Kata Kunci:
                </span>
                {article.tags.map(({ tag }) => (
                  <Link
                    key={tag.id}
                    href={`/tag/${tag.slug}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[var(--bg-card-muted)] hover:bg-[var(--border-color)] border border-[var(--border-color)] text-xs font-semibold text-[var(--text-primary)] transition-all hover:scale-105 active:scale-95"
                  >
                    <span className="text-[var(--accent)] font-bold">#</span>
                    <span>{tag.name}</span>
                  </Link>
                ))}
              </div>
            )}

            {/* Sumber / Referensi */}
            {article.sources && article.sources.length > 0 && (
              <div className="border-t border-[var(--border-color)] pt-7">
                <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  <ExternalLink className="h-3.5 w-3.5" />
                  Sumber
                </h2>
                <ol className="mt-4 space-y-2.5">
                  {article.sources.map((source) => (
                    <li key={source.id} className="flex gap-3 text-sm leading-relaxed text-[var(--text-primary)]">
                      <span className="font-mono text-xs font-bold text-[var(--accent)] pt-0.5 shrink-0">
                        [{source.sortOrder + 1}]
                      </span>
                      {source.url ? (
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline decoration-[var(--border-color)] underline-offset-4 transition-colors hover:text-[var(--accent-hover)] hover:decoration-[var(--accent-hover)]"
                        >
                          {source.label}
                        </a>
                      ) : (
                        <span>{source.label}</span>
                      )}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Reader Reactions */}
            <ArticleReactions articleId={article.id} />

            {/* Chapter Navigation in Series */}
            {(prevArticle || nextArticle) && (
              <div className="grid grid-cols-1 gap-4 border-t border-[var(--border-color)] pt-8 sm:grid-cols-2">
                {prevArticle ? (
                  <Link
                    href={`/${prevArticle.slug}`}
                    className="group p-4 rounded-[20px] bg-[var(--bg-card-muted)] border border-[var(--border-color)] hover:border-[var(--accent)] transition-all block"
                  >
                    <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                      <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
                      Bab Sebelumnya
                    </span>
                    <span className="mt-2 block font-display text-base sm:text-lg font-medium leading-snug text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent-hover)]">
                      {prevArticle.title}
                    </span>
                  </Link>
                ) : (
                  <span className="hidden sm:block" />
                )}

                {nextArticle && (
                  <Link
                    href={`/${nextArticle.slug}`}
                    className="group p-4 rounded-[20px] bg-[var(--bg-card-muted)] border border-[var(--border-color)] hover:border-[var(--accent)] transition-all block text-right sm:col-start-2"
                  >
                    <span className="flex items-center justify-end gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--accent)]">
                      Bab Selanjutnya
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                    <span className="mt-2 block font-display text-base sm:text-lg font-medium leading-snug text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent-hover)]">
                      {nextArticle.title}
                    </span>
                  </Link>
                )}
              </div>
            )}

            {/* Newsletter */}
            <NewsletterBox className="border-t border-[var(--border-color)] pt-8" />

            {/* Comments */}
            <CommentSection
              articleId={article.id}
              initialComments={[]}
            />
          </div>

          {/* Sticky Right Sidebar */}
          <aside className="hidden lg:block">
            <div className="space-y-10 lg:sticky lg:top-24">
              <ScrollSpyTOC headings={headings} />

              {/* Author */}
              <div className="border-t border-[var(--border-color)] pt-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-ink)] text-base font-semibold text-white">
                    {article.author.displayName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">
                      {article.author.displayName}
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">Penulis &amp; Arsitek</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-[var(--text-muted)]">
                  Menulis panduan arsitektur perangkat lunak dengan fokus pada keandalan sistem dan kesederhanaan desain.
                </p>
                <Link
                  href="/about"
                  className="mt-3 inline-block text-xs font-medium text-[var(--accent)] transition-colors hover:text-[var(--accent-hover)]"
                >
                  Profil Lengkap →
                </Link>
              </div>

              <SidebarStickyAd ad={sidebarAd} adsenseSlot={process.env.NEXT_PUBLIC_ADSENSE_SIDEBAR_STICKY_SLOT || process.env.ADSENSE_SIDEBAR_STICKY_SLOT} />
            </div>
          </aside>
        </div>

        <ArticleDiscoveryBand {...discovery} />
      </article>
    </div>
  );
}

function extractHeadings(markdown: string) {
  const lines = markdown.split('\n');
  const headings: { text: string; id: string; level: number }[] = [];

  for (const line of lines) {
    const match = line.match(/^(#{2,3})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
      headings.push({ text, id, level });
    }
  }

  return headings;
}

function extractExternalReferences(markdown: string) {
  const urls = markdown.match(/https?:\/\/[^\s)"'<>]+/g) || [];
  return [...new Set(urls)];
}

function formatSourceType(source: string) {
  switch (source) {
    case 'SELF_SHOT':
      return 'Dokumentasi / Foto Sendiri';
    case 'FREE_STOCK':
      return 'Stok Lisensi Bebas Royalty';
    case 'AI_GENERATED':
      return 'Ilustrasi AI Berlabel';
    default:
      return source;
  }
}
