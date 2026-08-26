import React from 'react';
import Link from 'next/link';
import { Search, ArrowRight, ArrowUpRight } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { NotFoundTracker } from '@/components/seo/NotFoundTracker';
import { prisma } from '@/lib/db';
import { formatDate } from '@/lib/utils';

type RecentArticle = {
  slug: string;
  title: string;
  readingTime: number;
  publishedAt: Date | null;
  createdAt: Date;
  category: { name: string };
};

const exploreLinks = [
  { href: '/', label: 'Beranda' },
  { href: '/category', label: 'Semua Kategori' },
  { href: '/series', label: 'Seri Artikel' },
  { href: '/glossary', label: 'Glosarium' },
  { href: '/about', label: 'Tentang' },
];

export default async function NotFound() {
  const [categories, recentArticles] = await Promise.all([
    prisma.category
      .findMany({
        where: { isIndexable: true },
        orderBy: { name: 'asc' },
        take: 8,
        select: { name: true, slug: true, description: true },
      })
      .catch(() => []),
    prisma.article
      .findMany({
        where: { status: 'PUBLISHED', isIndexable: true, category: { isIndexable: true } },
        orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
        take: 3,
        select: {
          slug: true,
          title: true,
          readingTime: true,
          publishedAt: true,
          createdAt: true,
          category: { select: { name: true } },
        },
      })
      .catch(() => [] as RecentArticle[]),
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <NotFoundTracker />
      <a href="#not-found-main" className="skip-link">
        Lewati ke konten utama
      </a>
      <Navbar categories={categories} />

      <main id="not-found-main" className="mx-auto w-full max-w-[1280px] flex-1 px-5 sm:px-8 lg:px-12">
        {/* Editorial error header — typography carries the moment */}
        <section className="border-b border-[var(--border-color)] pb-12 pt-16 lg:pb-16 lg:pt-24">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
            Error · Halaman Tidak Ditemukan
          </p>

          <div aria-hidden="true" className="mt-4 font-display text-[clamp(88px,16vw,160px)] font-medium leading-none tracking-tight text-[var(--text-primary)]">
            <span className="text-[var(--accent)]">/</span>404
          </div>

          <h1 className="mt-6 max-w-2xl font-display text-3xl font-medium leading-tight tracking-tight text-[var(--text-primary)] sm:text-4xl">
            Alamat ini tidak ada atau sudah dipindahkan.
          </h1>
          <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-[var(--text-secondary)]">
            Tautan yang Anda buka mungkin salah ketik, usang, atau artikelnya telah diarsipkan.
            Coba cari dari sini — atau lanjutkan menjelajah lewat tautan di bawah.
          </p>

          {/* Search — the primary recovery path */}
          <form action="/search" method="GET" role="search" className="mt-10 max-w-xl">
            <label htmlFor="not-found-search" className="sr-only">
              Cari artikel di SlashJournal
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]"
                />
                <input
                  type="search"
                  id="not-found-search"
                  name="q"
                  minLength={2}
                  placeholder="Cari topik, mis. “database indexing”…"
                  autoComplete="off"
                  className="h-11 w-full rounded-btn border border-[var(--border-color)] bg-[var(--bg-card)] pl-10 pr-4 text-[15px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] transition-colors focus:border-[var(--accent-line)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-soft)]"
                />
              </div>
              <button
                type="submit"
                className="inline-flex h-11 shrink-0 cursor-pointer items-center justify-center rounded-btn border border-[var(--text-primary)] bg-[var(--text-primary)] px-5 text-[14px] font-medium text-[var(--bg-primary)] transition-all duration-150 hover:bg-[var(--text-secondary)] active:scale-[0.98]"
              >
                Cari
              </button>
            </div>
          </form>

          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
            <Link
              href="/"
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-btn border border-[var(--text-primary)] bg-[var(--text-primary)] px-5 text-[14px] font-medium text-[var(--bg-primary)] transition-all duration-150 hover:bg-[var(--text-secondary)] active:scale-[0.98]"
            >
              Kembali ke Beranda
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex min-h-[44px] items-center gap-1.5 text-[14px] font-medium text-[var(--text-muted)] underline decoration-[var(--border-color)] underline-offset-4 transition-colors duration-150 hover:text-[var(--text-primary)] hover:decoration-[var(--accent-line)]"
            >
              Laporkan tautan rusak
            </Link>
          </div>
        </section>

        {/* Recovery paths — quiet editorial columns, no cards */}
        <section className="grid gap-12 py-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-16 lg:py-16">
          <nav aria-label="Jelajahi bagian situs">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
              Jelajahi
            </h2>
            <ul className="mt-4 divide-y divide-[var(--border-subtle)]">
              {exploreLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex min-h-[44px] items-center justify-between py-2.5 text-[15px] font-medium text-[var(--text-secondary)] transition-colors duration-150 hover:text-[var(--text-primary)]"
                  >
                    <span className="underline-offset-4 group-hover:underline">{link.label}</span>
                    <ArrowUpRight
                      aria-hidden="true"
                      className="h-4 w-4 shrink-0 text-[var(--color-silver)] opacity-40 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--accent)] group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {recentArticles.length > 0 && (
            <div>
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                Baru Saja Diterbitkan
              </h2>
              <ul className="mt-4 divide-y divide-[var(--border-subtle)]">
                {recentArticles.map((article) => (
                  <li key={article.slug}>
                    <Link
                      href={`/${article.slug}`}
                      className="group block py-4 transition-colors duration-150"
                    >
                      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--accent)]">
                        {article.category.name}
                      </p>
                      <h3 className="mt-1.5 font-display text-lg font-medium leading-snug tracking-tight text-[var(--text-primary)] decoration-[var(--accent-line)] underline-offset-4 group-hover:underline">
                        {article.title}
                      </h3>
                      <p className="mt-1.5 text-[13px] font-medium text-[var(--text-muted)]">
                        {formatDate(article.publishedAt ?? article.createdAt)} · {article.readingTime} mnt baca
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
