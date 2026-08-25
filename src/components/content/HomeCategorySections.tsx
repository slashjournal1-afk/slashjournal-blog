import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { formatDate } from '@/lib/utils';

type CategoryArticle = { id: string; slug: string; title: string; publishedAt: Date | null; createdAt: Date };
type CategorySection = { id: string; name: string; slug: string; description: string | null; articles: CategoryArticle[] };

export function HomeCategorySections({ categories }: { categories: CategorySection[] }) {
  if (categories.length === 0) return null;

  return (
    <section className="border-t border-[var(--border-color)] py-12" aria-labelledby="category-paths-title">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--accent)]">{'// jalur baca'}</p><h2 id="category-paths-title" className="mt-2 font-display text-2xl font-medium tracking-tight text-[var(--text-primary)] sm:text-3xl">Pilih ruang kerja</h2></div>
        <Link href="/category" className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--accent)]">Semua kategori <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" /></Link>
      </div>
      <div className="mt-6 grid gap-px border border-[var(--border-color)] bg-[var(--border-color)] md:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => (
          <section key={category.id} className="flex min-h-72 flex-col bg-[var(--bg-card)] p-5 sm:p-6" aria-labelledby={`home-category-${category.id}`}>
            <div className="border-b border-[var(--border-color)] pb-4"><Link href={`/category/${category.slug}`} className="group flex items-start justify-between gap-4"><h3 id={`home-category-${category.id}`} className="font-display text-xl font-medium tracking-tight text-[var(--text-primary)] group-hover:text-[var(--accent-hover)]">{category.name}</h3><ArrowUpRight className="h-4 w-4 shrink-0 text-[var(--text-muted)] group-hover:text-[var(--accent)]" aria-hidden="true" /></Link>{category.description && <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[var(--text-muted)]">{category.description}</p>}</div>
            <ul className="mt-1 flex-1 divide-y divide-[var(--border-color)]">
              {category.articles.map((article) => <li key={article.id}><Link href={`/${article.slug}`} className="group block py-3"><span className="block line-clamp-2 text-sm font-semibold leading-snug text-[var(--text-primary)] group-hover:text-[var(--accent-hover)]">{article.title}</span><span className="mt-1 block text-[10px] text-[var(--text-muted)]">{formatDate(article.publishedAt || article.createdAt)}</span></Link></li>)}
            </ul>
            <Link href={`/category/${category.slug}`} className="mt-3 pt-2 text-xs font-semibold text-[var(--accent)] hover:text-[var(--accent-hover)]">Buka kategori →</Link>
          </section>
        ))}
      </div>
    </section>
  );
}
