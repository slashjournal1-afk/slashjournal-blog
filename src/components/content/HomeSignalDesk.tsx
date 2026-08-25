import Link from 'next/link';
import { ArrowUpRight, Eye, Search, ThumbsUp } from 'lucide-react';

type SignalArticle = {
  id: string;
  slug: string;
  title: string;
  category: { name: string };
  viewCount: number;
  helpfulVotes: number;
};

type TrendingKeyword = { query: string; count: number };

function SignalList({ articles, metric }: { articles: SignalArticle[]; metric: 'views' | 'helpful' }) {
  return (
    <ol className="mt-2 divide-y divide-[var(--border-color)]">
      {articles.map((article, index) => (
        <li key={article.id}>
          <Link href={`/${article.slug}`} className="group flex items-start gap-3 py-4">
            <span className="w-6 shrink-0 pt-0.5 font-mono text-xs text-[var(--accent)]">{String(index + 1).padStart(2, '0')}</span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold leading-snug text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent-hover)]">{article.title}</span>
              <span className="mt-1 block text-xs text-[var(--text-muted)]">{article.category.name}</span>
            </span>
            <span className="flex shrink-0 items-center gap-1 pt-0.5 font-mono text-[10px] text-[var(--text-muted)]">
              {metric === 'views' ? <Eye className="h-3 w-3" aria-hidden="true" /> : <ThumbsUp className="h-3 w-3" aria-hidden="true" />}
              {metric === 'views' ? article.viewCount.toLocaleString('id-ID') : article.helpfulVotes.toLocaleString('id-ID')}
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}

export function HomeSignalDesk({ mostRead, mostHelpful, keywords }: { mostRead: SignalArticle[]; mostHelpful: SignalArticle[]; keywords: TrendingKeyword[] }) {
  return (
    <section className="border-b border-[var(--border-color)] py-12" aria-labelledby="signal-desk-title">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--border-color)] pb-4">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--accent)]">{'// sinyal redaksi'}</p>
          <h2 id="signal-desk-title" className="mt-2 font-display text-2xl font-medium tracking-tight text-[var(--text-primary)] sm:text-3xl">Yang sedang menggerakkan meja baca</h2>
        </div>
        <p className="max-w-xs text-right text-xs leading-relaxed text-[var(--text-muted)]">Tiga cara pembaca menemukan catatan berikutnya.</p>
      </div>

      <div className="grid gap-10 pt-6 lg:grid-cols-2 lg:gap-12">
        <section aria-labelledby="most-read-title">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-primary)]"><Eye className="h-3.5 w-3.5 text-[var(--accent)]" aria-hidden="true" /><h3 id="most-read-title">Paling dibaca</h3></div>
          {mostRead.length > 0 ? <SignalList articles={mostRead} metric="views" /> : <p className="mt-4 text-sm text-[var(--text-muted)]">Belum ada cukup data tayangan.</p>}
        </section>
        <section aria-labelledby="most-helpful-title">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-primary)]"><ThumbsUp className="h-3.5 w-3.5 text-[var(--accent)]" aria-hidden="true" /><h3 id="most-helpful-title">Paling diapresiasi</h3></div>
          {mostHelpful.length > 0 ? <SignalList articles={mostHelpful} metric="helpful" /> : <p className="mt-4 text-sm text-[var(--text-muted)]">Belum ada cukup data apresiasi.</p>}
        </section>
      </div>

      <section className="mt-8 border-t border-[var(--border-color)] pt-6" aria-labelledby="search-signal-title">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-primary)]"><Search className="h-3.5 w-3.5 text-[var(--accent)]" aria-hidden="true" /><h3 id="search-signal-title">Dicari pembaca</h3></div>
        {keywords.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3">
            {keywords.map((keyword) => <Link key={keyword.query} href={`/search?q=${encodeURIComponent(keyword.query)}`} className="group inline-flex items-center gap-2 font-mono text-xs text-[var(--text-secondary)] hover:text-[var(--accent)]"><span>“{keyword.query}”</span><span className="text-[var(--text-muted)]">{keyword.count}x</span><ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" /></Link>)}
          </div>
        ) : <p className="mt-4 text-sm text-[var(--text-muted)]">Keyword pembaca akan muncul setelah pencarian mulai terbentuk.</p>}
      </section>
    </section>
  );
}
