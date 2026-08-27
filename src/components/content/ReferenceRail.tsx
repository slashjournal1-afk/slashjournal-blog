import React from 'react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

import { AdSlotView } from '@/components/ads/AdSlotView';
import type { AdSlot } from '@/lib/types';

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
  sidebarAd,
}: {
  popular: ReferenceArticle[];
  recent: ReferenceArticle[];
  sidebarAd?: AdSlot | null;
}) {
  if (popular.length === 0 && recent.length === 0) return null;

  return (
    <aside aria-label="Referensi artikel" className="self-start space-y-10 lg:sticky lg:top-24">
      {/* Paling Banyak Dibaca */}
      {popular.length > 0 && (
        <section aria-labelledby="popular-reference-title">
          <h2
            id="popular-reference-title"
            className="border-b border-[var(--border-color)] pb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-primary)]"
          >
            Paling Banyak Dibaca
          </h2>
          <ol className="mt-1">
            {popular.map((article, index) => (
              <React.Fragment key={article.id}>
                <li className="border-b border-[var(--border-color)] last:border-0">
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
                        <span>{article.viewCount.toLocaleString('id-ID')} tayangan</span>
                      </span>
                    </div>
                  </Link>
                </li>
                {index === 1 && (
                  <li className="border-b border-[var(--border-color)] py-4 list-none" aria-label="Iklan sidebar">
                    <AdSlotView
                      slotName="sidebar_rail"
                      ad={sidebarAd}
                      adsenseSlot={process.env.NEXT_PUBLIC_ADSENSE_SIDEBAR_RAIL_SLOT || process.env.ADSENSE_SIDEBAR_RAIL_SLOT}
                    />
                  </li>
                )}
              </React.Fragment>
            ))}
          </ol>
        </section>
      )}

      {/* Naskah Baru Lainnya */}
      {recent.length > 0 && (
        <section aria-labelledby="recent-reference-title">
          <h2
            id="recent-reference-title"
            className="border-b border-[var(--border-color)] pb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-primary)]"
          >
            Naskah Baru
          </h2>
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
      )}
    </aside>
  );
}
