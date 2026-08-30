import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import type { ArticleDiscoveryResult, DiscoveryArticle } from '@/lib/article-discovery';

export function ArticleDiscoveryBand({ recommendations, trending, popular }: ArticleDiscoveryResult) {
  if (recommendations.length === 0 && trending.length === 0 && popular.length === 0) return null;

  return (
    <section className="mt-16 border-y border-[var(--border-color)] py-10 sm:mt-20 sm:py-12" aria-labelledby="article-discovery-title">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">Indeks bacaan</p>
          <h2 id="article-discovery-title" className="mt-2 font-display text-2xl font-medium tracking-tight text-[var(--text-primary)] sm:text-3xl">
            Eksplorasi berikutnya
          </h2>
        </div>
        <p className="max-w-md text-sm leading-relaxed text-[var(--text-muted)]">
          Lanjutkan dari konteks tulisan ini, pembahasan terbaru, atau naskah yang paling banyak dibaca.
        </p>
      </div>

      <div className="mt-8 grid min-w-0 gap-10 md:grid-cols-3 md:gap-0 md:divide-x md:divide-[var(--border-color)]">
        <DiscoveryColumn title="Rekomendasi" articles={recommendations} mode="recommended" />
        <DiscoveryColumn title="Sedang trending" articles={trending} mode="trending" />
        <DiscoveryColumn title="Terpopuler" articles={popular} mode="popular" />
      </div>
    </section>
  );
}

function DiscoveryColumn({
  title,
  articles,
  mode,
}: {
  title: string;
  articles: DiscoveryArticle[];
  mode: 'recommended' | 'trending' | 'popular';
}) {
  return (
    <section className="min-w-0 border-t border-[var(--border-color)] pt-6 first:border-t-0 first:pt-0 md:border-t-0 md:px-7 md:pt-0 md:first:pl-0 md:last:pr-0" aria-labelledby={`discovery-${mode}`}>
      <h3 id={`discovery-${mode}`} className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-primary)]">
        {title}
      </h3>
      {articles.length > 0 ? (
        <ol className="mt-2">
          {articles.map((article, index) => (
            <li key={article.id} className="border-b border-[var(--border-color)] last:border-b-0">
              <Link href={`/${article.slug}`} className="group flex min-w-0 gap-3 py-4">
                {mode === 'popular' && (
                  <span className="w-7 shrink-0 font-display text-xl font-light text-[var(--color-silver)] group-hover:text-[var(--accent)]" aria-label={`Peringkat ${index + 1}`}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                )}
                <span className="min-w-0 flex-1">
                  <span className="block text-[11px] font-semibold text-[var(--accent)]">{article.category.name}</span>
                  <span className="mt-1 block break-words font-display text-[15px] font-medium leading-snug text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent-hover)]">
                    {article.title}
                  </span>
                  <span className="mt-1.5 block text-xs text-[var(--text-muted)]">
                    {formatDate(article.publishedAt || article.createdAt)}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      ) : (
        <p className="mt-4 text-sm leading-relaxed text-[var(--text-muted)]">Belum ada naskah untuk bagian ini.</p>
      )}
    </section>
  );
}
