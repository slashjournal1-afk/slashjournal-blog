import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { ArrowRight } from 'lucide-react';
import { PageIntro } from '@/components/layout/PageIntro';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Seri Panduan Terkurasi | SlashJournal',
  description: 'Kumpulan artikel mendalam yang saling menyambung dan dikurasi manual.',
};

export default async function SeriesIndexPage() {
  const seriesList = await prisma.series.findMany({
    where: { isPublished: true },
    orderBy: { sortOrder: 'asc' },
    include: {
      articles: {
        where: { status: 'PUBLISHED' },
        orderBy: { seriesOrder: 'asc' },
        select: { id: true, title: true, slug: true, readingTime: true },
      },
    },
  });

  return (
    <div className="min-h-screen max-w-[1200px] mx-auto px-4 sm:px-6 py-12">
      <div className="mb-12"><PageIntro eyebrow="Jalur belajar" title="Seri panduan arsitektur" description="Tulisan yang dirancang berurutan dari prinsip fundamental hingga implementasi skala produksi." count={`${seriesList.length} seri`} /></div>

      <div className="space-y-8">
        {seriesList.map((ser) => (
          <div
            key={ser.id}
            className="rounded-[36px] bg-white dark:bg-[#18181b] border border-[#ececee] dark:border-[#27272a] p-6 sm:p-8 space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#ececee] dark:border-[#27272a] pb-6">
              <div>
                <span className="px-2.5 py-0.5 rounded-[10px] bg-[var(--accent-soft)] text-[var(--accent)] text-[10px] font-bold uppercase">
                  SERI
                </span>
                <h2 className="text-2xl font-bold text-[#09090b] dark:text-white tracking-tight mt-1">
                  {ser.title}
                </h2>
                <p className="text-xs text-[#52525b] dark:text-[#a1a1aa] mt-1">
                  {ser.description}
                </p>
              </div>

              <Link
                href={`/series/${ser.slug}`}
                className="px-5 py-2.5 rounded-[14px] bg-[#09090b] text-white hover:bg-[#18181b] text-xs font-medium shadow-awesomic-dark-btn transition-all shrink-0 flex items-center gap-2"
              >
                <span>Lihat Panduan Lengkap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div>
              {ser.articles.map((art, idx) => (
                <Link
                  key={art.id}
                  href={`/${art.slug}`}
                  className="flex items-center justify-between gap-4 border-b border-[#ececee] py-4 last:border-b-0 group"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-white dark:bg-[#18181b] text-xs font-bold flex items-center justify-center text-[var(--accent)] shrink-0 border border-[#ececee] dark:border-[#3f3f46]">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-[#09090b] dark:text-white group-hover:text-[var(--accent)] transition-colors line-clamp-1">
                      {art.title}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#71717a] dark:text-[#a1a1aa] shrink-0">
                    {art.readingTime} mnt
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
