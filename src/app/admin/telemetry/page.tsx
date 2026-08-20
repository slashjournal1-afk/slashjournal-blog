import React from 'react';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { formatDateTime } from '@/lib/utils';
import {
  Activity,
  Search,
  AlertCircle,
  Sparkles,
  TrendingUp,
  Mail,
  ThumbsUp,
  ThumbsDown,
  Eye,
  BookOpen,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function TelemetryPage() {
  const user = await getCurrentUser();
  if (!user || (user.role !== 'ADMIN' && user.role !== 'EDITOR')) {
    redirect('/admin');
  }

  const [
    totalSearches,
    zeroResults,
    recentSearches,
    topArticles,
    totalSubscribers,
    subscribersByTopic,
    feedbacks,
  ] = await Promise.all([
    prisma.searchQueryLog.count(),
    prisma.searchQueryLog.findMany({
      where: { resultsCount: 0 },
      orderBy: { createdAt: 'desc' },
      take: 12,
    }),
    prisma.searchQueryLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 15,
    }),
    prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { viewCount: 'desc' },
      take: 5,
      select: {
        id: true,
        title: true,
        slug: true,
        viewCount: true,
        helpfulVotes: true,
        unhelpfulVotes: true,
        category: { select: { name: true } },
      },
    }),
    prisma.subscription.count(),
    prisma.subscription.groupBy({
      by: ['topic'],
      _count: { email: true },
    }),
    prisma.articleFeedback.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: { article: { select: { title: true, slug: true } } },
    }),
  ]);

  return (
    <div className="space-y-10">
      <div className="pb-6 border-b border-[var(--border-color)]">
        <h1 className="text-[26px] md:text-[30px] font-extrabold text-[var(--text-primary)] tracking-tight">
          Dasbor Analitik &amp; Telemetri Redaksi
        </h1>
        <p className="text-[13.5px] text-[var(--text-muted)] mt-1">
          Wawasan kata kunci pencarian, performa baca naskah, kepuasan pembaca, dan pertumbuhan pelanggan berkala.
        </p>
      </div>

      {/* Top Stat Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-[24px] border border-[var(--border-color)] bg-[var(--bg-card)] space-y-1 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
            Total Pencarian (Ctrl+K)
          </span>
          <p className="text-[30px] font-extrabold text-[var(--text-primary)]">{totalSearches}</p>
        </div>

        <div className="p-5 rounded-[24px] border border-[var(--border-color)] bg-[var(--bg-card)] space-y-1 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-500">
            Pencarian Tanpa Hasil
          </span>
          <p className="text-[30px] font-extrabold text-rose-500">{zeroResults.length}</p>
        </div>

        <div className="p-5 rounded-[24px] border border-[var(--border-color)] bg-[var(--bg-card)] space-y-1 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#ff5a00]">
            Total Subscriber Newsletter
          </span>
          <p className="text-[30px] font-extrabold text-[#ff5a00]">{totalSubscribers}</p>
        </div>

        <div className="p-5 rounded-[24px] border border-[var(--border-color)] bg-[var(--bg-card)] space-y-1 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-500">
            Rasio Temu Pencarian
          </span>
          <p className="text-[30px] font-extrabold text-emerald-500">
            {totalSearches > 0
              ? `${Math.round(((totalSearches - zeroResults.length) / totalSearches) * 100)}%`
              : '100%'}
          </p>
        </div>
      </div>

      {/* Top Read Articles & Subscriber Topics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Top 5 Articles */}
        <div className="lg:col-span-7 rounded-[28px] border border-[var(--border-color)] bg-[var(--bg-card)] p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
            <h3 className="text-[15px] font-bold text-[var(--text-primary)] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#ff5a00]" />
              <span>Naskah Paling Banyak Dibaca</span>
            </h3>
            <span className="text-xs font-mono text-[var(--text-muted)]">Top 5</span>
          </div>

          <div className="space-y-3">
            {topArticles.map((art, idx) => (
              <div
                key={art.id}
                className="p-3.5 rounded-[16px] bg-[var(--bg-card-muted)] border border-[var(--border-color)] flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-mono text-sm font-bold text-[var(--text-muted)] w-5 shrink-0">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0">
                    <h5 className="text-xs font-bold text-[var(--text-primary)] truncate">
                      {art.title}
                    </h5>
                    <p className="text-[10.5px] text-[var(--text-muted)] mt-0.5">
                      {art.category.name} • {art.helpfulVotes} apresiasi
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 font-mono text-xs font-bold text-[var(--ember-color)] shrink-0">
                  <Eye className="w-3.5 h-3.5" />
                  <span>{art.viewCount.toLocaleString('id-ID')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subscriber Topic Distribution */}
        <div className="lg:col-span-5 rounded-[28px] border border-[var(--border-color)] bg-[var(--bg-card)] p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
            <h3 className="text-[15px] font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#ff5a00]" />
              <span>Distribusi Minat Subscriber</span>
            </h3>
          </div>

          <div className="space-y-3">
            {subscribersByTopic.map((item) => (
              <div
                key={item.topic}
                className="p-3.5 rounded-[16px] bg-[var(--bg-card-muted)] border border-[var(--border-color)] flex items-center justify-between"
              >
                <span className="text-xs font-bold capitalize text-[var(--text-primary)]">
                  {item.topic === 'all'
                    ? 'Semua Kanal'
                    : item.topic.replace('-', ' ')}
                </span>
                <span className="font-mono text-xs font-bold text-[#ff5a00]">
                  {item._count.email} Pelanggan
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content Gap Alert: Zero-Result Searches */}
      <div className="rounded-[28px] border border-amber-500/30 bg-[var(--bg-card)] p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
          <h3 className="text-[15px] font-bold text-[var(--text-primary)] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            <span>Peluang Tulisan Baru (Zero-Result Searches)</span>
          </h3>
          <span className="text-xs text-amber-500 font-mono font-bold">
            {zeroResults.length} Kata Kunci
          </span>
        </div>

        {zeroResults.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {zeroResults.map((q) => (
              <div
                key={q.id}
                className="p-3.5 rounded-[14px] bg-[var(--bg-card-muted)] border border-[var(--border-color)] text-xs flex items-center justify-between"
              >
                <span className="font-mono font-semibold text-[var(--text-primary)] truncate">
                  &ldquo;{q.query}&rdquo;
                </span>
                <span className="text-[10px] text-[var(--text-muted)] shrink-0 ml-2">
                  {formatDateTime(q.createdAt)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[var(--text-muted)]">
            Seluruh pencarian pembaca saat ini menemukan bab dokumen atau istilah glosarium yang relevan.
          </p>
        )}
      </div>

      {/* Recent Queries Table */}
      <div className="rounded-[28px] border border-[var(--border-color)] bg-[var(--bg-card)] overflow-hidden shadow-xs">
        <div className="p-6 border-b border-[var(--border-color)]">
          <h3 className="text-[15px] font-bold text-[var(--text-primary)]">
            Aktivitas Pencarian Terkini
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--border-color)] bg-[var(--bg-card-muted)] text-[var(--text-muted)] text-[11px] uppercase font-bold tracking-wider">
                <th className="px-6 py-3.5">Kueri Pencarian</th>
                <th className="px-6 py-3.5">Jumlah Hasil</th>
                <th className="px-6 py-3.5 text-right">Waktu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {recentSearches.map((s) => (
                <tr key={s.id} className="hover:bg-[var(--bg-card-muted)] transition-colors">
                  <td className="px-6 py-4 font-mono font-semibold text-[var(--text-primary)]">
                    {s.query}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-[8px] text-[10.5px] font-bold font-mono ${
                        s.resultsCount > 0
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'bg-rose-500/10 text-rose-500'
                      }`}
                    >
                      {s.resultsCount} Hasil
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-[11px] text-[var(--text-muted)] font-mono">
                    {formatDateTime(s.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
