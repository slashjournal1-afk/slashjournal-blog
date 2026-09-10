import { redirect } from 'next/navigation';
import { BarChart3 } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import { getCreatorArticleOptions } from '@/lib/creator-analytics';
import { prisma } from '@/lib/db';
import { CreatorAnalyticsClient } from '@/components/creator/CreatorAnalyticsClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Analitik Pembaca — Creator Studio',
  robots: { index: false, follow: false },
};

export default async function CreatorAnalyticsPage() {
  const user = await getCurrentUser();
  if (!user || user.role === 'READER') redirect('/dashboard/member');

  const [articleOptions, categories, seriesList] = await Promise.all([
    getCreatorArticleOptions(user.id, { take: 100 }),
    prisma.category.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true } }),
    prisma.series.findMany({ orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }], take: 100, select: { id: true, title: true } }),
  ]);

  return (
    <div className="space-y-8">
      <header className="border-b border-[var(--border-color)] pb-6">
        <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[var(--accent)]">
          <BarChart3 className="h-3.5 w-3.5" /> Creator Studio
        </p>
        <h1 className="mt-2 text-[26px] font-extrabold tracking-tight text-[var(--text-primary)] md:text-[30px]">
          Analitik Pembaca Harian
        </h1>
        <p className="mt-1 max-w-2xl text-[13.5px] text-[var(--text-muted)]">
          Lihat hari mana traffic penonton naik, bandingkan hingga 5 artikel, dan temukan hari apa pembaca paling ramai — semua dalam WIB.
        </p>
      </header>

      <CreatorAnalyticsClient articleOptions={articleOptions} categories={categories} seriesList={seriesList} />
    </div>
  );
}
