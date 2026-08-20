import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { formatDate } from '@/lib/utils';
import { Search as SearchIcon, FileText, Sparkles, ArrowRight, BookOpen, Clock, Tag } from 'lucide-react';
import { PageIntro } from '@/components/layout/PageIntro';
import { ArticleRow } from '@/components/content/ArticleRow';

type SearchArticle = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: Date | null;
  createdAt: Date;
  readingTime: number;
  coverImageUrl: string | null;
  category: { name: string };
};

type SearchTerm = {
  id: string;
  slug: string;
  term: string;
  category: string;
  shortDef: string;
};

export const metadata: Metadata = {
  title: 'Pencarian Artikel & Glosarium — SlashJournal',
  description: 'Cari panduan arsitektur sistem, modul rekayasa, dan istilah glosarium teknis.',
  robots: { index: false, follow: true },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tab?: string }>;
}) {
  const { q, tab = 'all' } = await searchParams;
  const query = q?.trim() || '';

  let articles: SearchArticle[] = [];
  let terms: SearchTerm[] = [];

  if (query) {
    [articles, terms] = await Promise.all([
      prisma.article.findMany({
        where: {
          status: 'PUBLISHED',
          isIndexable: true,
          category: { isIndexable: true },
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { excerpt: { contains: query, mode: 'insensitive' } },
            { contentMarkdown: { contains: query, mode: 'insensitive' } },
          ],
        },
        select: {
          id: true,
          slug: true,
          title: true,
          excerpt: true,
          publishedAt: true,
          createdAt: true,
          readingTime: true,
          coverImageUrl: true,
          category: { select: { name: true } },
        },
        orderBy: { publishedAt: 'desc' },
        take: 50,
      }),
      prisma.glossaryTerm.findMany({
        where: {
          OR: [
            { term: { contains: query, mode: 'insensitive' } },
            { shortDef: { contains: query, mode: 'insensitive' } },
            { definition: { contains: query, mode: 'insensitive' } },
            { category: { contains: query, mode: 'insensitive' } },
          ],
        },
        select: { id: true, slug: true, term: true, category: true, shortDef: true },
        orderBy: { term: 'asc' },
        take: 50,
      }),
    ]);
  }

  const showArticles = tab === 'all' || tab === 'articles';
  const showGlossary = tab === 'all' || tab === 'glossary';

  return (
    <div className="space-y-10 max-w-4xl mx-auto py-12 px-4">
      {/* Header & Search Input Box */}
      <div className="space-y-6">
        <PageIntro
          eyebrow="Pencarian Cerdas"
          title="Temukan Tulisan, Pola, atau Istilah"
          description="Eksplorasi seluruh basis data arsitektur, panduan rekayasa antarmuka, dan kamus glosarium teknis."
        />

        {/* Search Input Form */}
        <form method="GET" action="/search" className="relative mt-4">
          <SearchIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[var(--accent)]" />
          <label htmlFor="search-query" className="sr-only">Kata kunci pencarian</label>
          <input
            id="search-query"
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Ketik topik, pola arsitektur, atau istilah teknis..."
            className="w-full pl-12 pr-28 py-3.5 rounded-[16px] bg-white dark:bg-[#18181b] border border-[#ececee] dark:border-[#27272a] text-sm text-[#09090b] dark:text-white focus:outline-none focus:border-[var(--accent)] shadow-xs"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-[12px] bg-[#09090b] text-white hover:bg-[#18181b] text-xs font-bold shadow-awesomic-dark-btn transition-all active:scale-95"
          >
            Cari Naskah
          </button>
        </form>

        {/* Quick Suggestion Chips */}
        {!query && (
          <div className="pt-2 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-[#71717a]">
              Topik &amp; Konsep Populer:
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                'idempotency-key',
                'acid-transactions',
                'circuit-breaker-pattern',
                'row-level-security',
                'clean-architecture',
                'postgresql',
              ].map((s) => (
                <Link
                  key={s}
                  href={`/search?q=${encodeURIComponent(s)}`}
                  className="px-3 py-1.5 rounded-[12px] bg-[#f4f4f5] dark:bg-[#27272a] text-xs font-mono font-medium text-[#52525b] dark:text-[#a1a1aa] hover:text-[var(--accent)] dark:hover:text-[var(--accent)] hover:bg-[var(--accent-soft)] transition-all active:scale-95"
                >
                  #{s}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {query && (
        <div className="space-y-8">
          {/* Filter Tabs & Count */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#ececee] dark:border-[#27272a] pb-4">
            <div className="flex items-center gap-1.5 bg-[#f4f4f5] dark:bg-[#27272a] p-1 rounded-[14px]">
              <Link
                href={`/search?q=${encodeURIComponent(query)}&tab=all`}
                className={`px-3.5 py-1.5 rounded-[10px] text-xs font-bold transition-all ${
                  tab === 'all'
                    ? 'bg-white dark:bg-[#18181b] text-[#09090b] dark:text-white shadow-xs'
                    : 'text-[#71717a] hover:text-[#09090b] dark:hover:text-white'
                }`}
              >
                Semua ({articles.length + terms.length})
              </Link>
              <Link
                href={`/search?q=${encodeURIComponent(query)}&tab=articles`}
                className={`px-3.5 py-1.5 rounded-[10px] text-xs font-bold transition-all ${
                  tab === 'articles'
                    ? 'bg-white dark:bg-[#18181b] text-[#09090b] dark:text-white shadow-xs'
                    : 'text-[#71717a] hover:text-[#09090b] dark:hover:text-white'
                }`}
              >
                Artikel ({articles.length})
              </Link>
              <Link
                href={`/search?q=${encodeURIComponent(query)}&tab=glossary`}
                className={`px-3.5 py-1.5 rounded-[10px] text-xs font-bold transition-all ${
                  tab === 'glossary'
                    ? 'bg-white dark:bg-[#18181b] text-[#09090b] dark:text-white shadow-xs'
                    : 'text-[#71717a] hover:text-[#09090b] dark:hover:text-white'
                }`}
              >
                Glosarium ({terms.length})
              </Link>
            </div>

            <p className="text-xs text-[#71717a]">
              Hasil pencarian: <span className="font-bold text-[#09090b] dark:text-white">&ldquo;{query}&rdquo;</span>
            </p>
          </div>

          {/* Empty State */}
          {articles.length === 0 && terms.length === 0 && (
            <div className="text-center py-16 space-y-3 rounded-[32px] bg-white dark:bg-[#18181b] border border-[#ececee] dark:border-[#27272a] p-8">
              <div className="w-12 h-12 rounded-2xl bg-[var(--accent-soft)]/40 text-[var(--accent)] flex items-center justify-center mx-auto">
                <SearchIcon className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#09090b] dark:text-white">
                Tidak ada hasil ditemukan
              </h3>
              <p className="text-xs text-[#71717a] max-w-sm mx-auto">
                Coba gunakan kata kunci lain atau periksa daftar topik arsitektur populer di atas.
              </p>
            </div>
          )}

          {/* Articles Section */}
          {showArticles && articles.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-[#09090b] dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-[var(--accent)]" />
                <span>Naskah &amp; Bab Arsitektur ({articles.length})</span>
              </h2>

              <div className="grid grid-cols-1 gap-4">
                {articles.map((art) => (
                  <ArticleRow
                    key={art.id}
                    href={`/${art.slug}`}
                    title={art.title}
                    excerpt={art.excerpt}
                    category={art.category?.name}
                    date={formatDate(art.publishedAt || art.createdAt)}
                    readingTime={art.readingTime}
                    imageUrl={art.coverImageUrl}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Glossary Section */}
          {showGlossary && terms.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-[#ececee] dark:border-[#27272a]">
              <h2 className="text-base font-bold text-[#09090b] dark:text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[var(--accent)]" />
                <span>Istilah Glosarium Teknis ({terms.length})</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {terms.map((t) => (
                  <Link
                    key={t.id}
                    href={`/glossary/${t.slug}`}
                    className="p-5 rounded-[24px] border border-[#ececee] dark:border-[#27272a] bg-white dark:bg-[#18181b] hover:border-[var(--accent)] transition-all duration-200 group block space-y-2 shadow-xs active:scale-[0.99]"
                  >
                    <span className="text-[10px] uppercase font-bold text-[var(--accent)] tracking-wider">
                      {t.category}
                    </span>
                    <h3 className="text-sm font-bold text-[#09090b] dark:text-white group-hover:text-[var(--accent)] transition-colors">
                      {t.term}
                    </h3>
                    <p className="text-xs text-[#52525b] dark:text-[#a1a1aa] line-clamp-2 leading-relaxed">
                      {t.shortDef}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
