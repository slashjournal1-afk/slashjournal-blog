import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/db';
import { formatDate } from '@/lib/utils';
import { ArticleContentRenderer } from '@/components/content/ArticleContentRenderer';
import { GitFork } from 'lucide-react';
import type { Metadata } from 'next';
import { absoluteUrl } from '@/lib/site';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbSchema } from '@/lib/structured-data';

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const term = await prisma.glossaryTerm.findUnique({
    where: { slug },
  });

  // Resolve inside metadata so the HTTP 404 status is set before streaming begins.
  if (!term) notFound();

  return {
    title: `${term.term} — Glosarium Arsitektur`,
    description: term.shortDef,
    alternates: { canonical: absoluteUrl(`/glossary/${term.slug}`) },
  };
}

export default async function GlossaryDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const term = await prisma.glossaryTerm.findUnique({
    where: { slug },
    include: { author: true },
  });

  if (!term) {
    notFound();
  }
  const termSchema = {
    '@context': 'https://schema.org', '@type': 'DefinedTerm',
    name: term.term, description: term.shortDef, url: absoluteUrl(`/glossary/${term.slug}`),
    inDefinedTermSet: { '@id': absoluteUrl('/glossary#term-set') }, inLanguage: 'id-ID',
  };
  const breadcrumbJsonLd = breadcrumbSchema([
    { name: 'Beranda', path: '/' }, { name: 'Glosarium', path: '/glossary' },
    { name: term.term, path: `/glossary/${term.slug}` },
  ]);

  // Find articles that reference this term (bidirectional knowledge backlinks)
  const referencingArticles = await prisma.article.findMany({
    where: {
      status: 'PUBLISHED',
      isIndexable: true,
      category: { isIndexable: true },
      OR: [
        { contentMarkdown: { contains: `[[${term.slug}`, mode: 'insensitive' } },
        { contentMarkdown: { contains: `[[${term.term}`, mode: 'insensitive' } },
        { contentMarkdown: { contains: term.term, mode: 'insensitive' } },
      ],
    },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      coverImageUrl: true,
      readingTime: true,
      publishedAt: true,
      createdAt: true,
      category: { select: { name: true } },
    },
    take: 8,
  });

  return (
    <div className="min-h-screen max-w-[1200px] mx-auto px-4 sm:px-6 py-12">
      <JsonLd data={termSchema} />
      <JsonLd data={breadcrumbJsonLd} />
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-[#71717a] dark:text-[#a1a1aa]">
        <Link href="/" className="hover:text-[#09090b] dark:hover:text-white">Beranda</Link>
        <span aria-hidden="true">/</span>
        <Link href="/glossary" className="hover:text-[#09090b] dark:hover:text-white">Glosarium</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{term.term}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Definition Col */}
        <div className="lg:col-span-8 space-y-8">
          <div className="rounded-[36px] bg-white dark:bg-[#18181b] border border-[#ececee] dark:border-[#27272a] p-8 sm:p-12 space-y-6 shadow-xs">
            <div className="space-y-2">
              <span className="px-3 py-1 rounded-[10px] bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--accent-line)] text-[11px] font-bold uppercase tracking-wider">
                Kategori: {term.category}
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#09090b] dark:text-white pt-2">
                {term.term}
              </h1>
            </div>

            <div className="p-5 rounded-[22px] bg-[#f4f4f5] dark:bg-[#27272a] border border-[#ececee] dark:border-[#3f3f46]">
              <p className="text-sm font-semibold text-[#09090b] dark:text-white leading-relaxed">
                {term.shortDef}
              </p>
            </div>

            <div className="pt-2">
              <ArticleContentRenderer content={term.definition} />
            </div>
          </div>
        </div>

        {/* Inbound Articles Knowledge Graph Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-[28px] bg-white dark:bg-[#18181b] border border-[#ececee] dark:border-[#27272a] p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#ececee] dark:border-[#27272a] pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#09090b] dark:text-white flex items-center gap-2">
                <GitFork className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span>Naskah Terkait (Backlinks)</span>
              </h3>
              <span className="font-mono text-[10px] text-[var(--accent)] font-bold">
                {referencingArticles.length} rujukan
              </span>
            </div>

            {referencingArticles.length === 0 ? (
              <p className="text-xs text-[#71717a] dark:text-[#a1a1aa] py-2">
                Belum ada naskah yang mereferensikan konsep ini secara langsung.
              </p>
            ) : (
              <div className="space-y-3">
                {referencingArticles.map((art) => (
                  <Link
                    key={art.id}
                    href={`/${art.slug}`}
                    className="flex items-center gap-3 p-3 rounded-[16px] bg-[#f4f4f5] dark:bg-[#27272a]/50 border border-[#ececee] dark:border-[#27272a] hover:border-[var(--accent-line)] transition-all group"
                  >
                    {art.coverImageUrl ? (
                      <div className="relative w-14 h-14 rounded-[10px] overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0 border border-[#ececee] dark:border-[#3f3f46]">
                        <Image src={art.coverImageUrl} alt="" fill sizes="56px" className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-[10px] bg-zinc-200 dark:bg-zinc-800 shrink-0 flex items-center justify-center font-mono font-bold text-[var(--accent)] text-xs">
                        //
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold text-[var(--accent)]">
                        {art.category.name}
                      </span>
                      <h4 className="text-xs font-bold text-[#09090b] dark:text-white group-hover:text-[var(--accent)] transition-colors line-clamp-2 leading-snug">
                        {art.title}
                      </h4>
                      <p className="text-[10px] text-[#71717a] mt-0.5 font-mono">
                        {art.readingTime} mnt baca
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
