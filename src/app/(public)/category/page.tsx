import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, BookOpen } from 'lucide-react';
import { prisma } from '@/lib/db';
import { absoluteUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Kategori',
  description: 'Jelajahi kategori tulisan arsitektur sistem dan rekayasa perangkat lunak di SlashJournal.',
  alternates: { canonical: absoluteUrl('/category') },
};

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    where: { isIndexable: true },
    orderBy: { name: 'asc' },
    select: { name: true, slug: true, description: true, _count: { select: { articles: true } } },
  });

  return (
    <div className="mx-auto max-w-editorial px-4 py-12 sm:px-8 sm:py-16">
      <header className="max-w-2xl border-b border-[var(--border-color)] pb-8">
        <div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--accent)]">
          <BookOpen className="h-3.5 w-3.5" />
          Index pengetahuan
        </div>
        <h1 className="mt-4 font-display text-4xl leading-tight text-[var(--text-primary)] sm:text-5xl">Kategori tulisan</h1>
        <p className="mt-4 max-w-xl text-sm leading-7 text-[var(--text-muted)]">Pilih jalur baca untuk menemukan catatan tentang sistem, perangkat lunak, dan keputusan teknis yang membentuknya.</p>
      </header>

      <div className="mt-8 grid gap-px border border-[var(--border-color)] bg-[var(--border-color)] sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Link key={category.slug} href={`/category/${category.slug}`} className="group flex min-h-40 flex-col justify-between bg-[var(--bg-card)] p-5 transition-colors hover:bg-[var(--bg-card-muted)]">
            <div>
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-base font-semibold text-[var(--text-primary)]">{category.name}</h2>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-[var(--text-muted)] transition-colors group-hover:text-[var(--accent)]" />
              </div>
              <p className="mt-3 text-xs leading-6 text-[var(--text-muted)]">{category.description || 'Tulisan teknis terkurasi untuk memperluas cara berpikir tentang sistem.'}</p>
            </div>
            <p className="mt-5 font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--accent)]">{category._count.articles} tulisan</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
