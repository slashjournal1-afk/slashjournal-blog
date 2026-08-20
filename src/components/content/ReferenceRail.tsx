import React from 'react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

export type ReferenceArticle = {
  id: string;
  slug: string;
  title: string;
  coverImageUrl?: string | null;
  viewCount: number;
  publishedAt: Date | null;
  createdAt: Date;
  category: { name: string };
};

export function ReferenceRail({
  popular,
  recent,
}: {
  popular: ReferenceArticle[];
  recent: ReferenceArticle[];
}) {
  return (
    <aside aria-labelledby="reference-rail-title" className="self-start space-y-10 lg:sticky lg:top-24">
      {/* Paling Banyak Dibaca */}
      <section aria-labelledby="popular-title">
        <h2
          id="reference-rail-title"
          className="border-b border-[var(--border-color)] pb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-primary)]"
        >
          Paling Banyak Dibaca
        </h2>
        <ol className="mt-1">
          {popular.map((article, index) => (
            <li key={article.id} className="border-b border-[var(--border-color)] last:border-0">
              <Link href={`/${article.slug}`} className="group flex items-start gap-4 py-4">
                <span
                  className="font-display w-8 shrink-0 pt-0.5 text-2xl font-light leading-none text-[var(--color-silver)] transition-colors group-hover:text-[var(--accent)]"
                  aria-label={`Peringkat ${index + 1}`}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0 flex-1">
                  <span className="block font-display text-[15px] font-medium leading-snug text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent-hover)] line-clamp-2">
                    {article.title}
                  </span>
                  <span className="mt-1.5 flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                    <span className="font-medium text-[var(--text-secondary)]">{article.category.name}</span>
                    <span aria-hidden="true" className="text-[var(--color-silver)]">·</span>
                    <span>{article.viewCount.toLocaleString('id-ID')} pembaca</span>
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {/* Naskah Baru Lainnya */}
      <section aria-labelledby="recent-reference-title">
        <h3
          id="recent-reference-title"
          className="border-b border-[var(--border-color)] pb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-primary)]"
        >
          Naskah Baru
        </h3>
        <ul className="mt-1">
          {recent.map((article) => (
            <li key={article.id} className="border-b border-[var(--border-color)] last:border-0">
              <Link href={`/${article.slug}`} className="group block py-4">
                <span className="block font-display text-[15px] font-medium leading-snug text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent-hover)] line-clamp-2">
                  {article.title}
                </span>
                <span className="mt-1.5 flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                  <span className="font-medium text-[var(--text-secondary)]">{article.category.name}</span>
                  <span aria-hidden="true" className="text-[var(--color-silver)]">·</span>
                  <span>{formatDate(article.publishedAt || article.createdAt)}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
}