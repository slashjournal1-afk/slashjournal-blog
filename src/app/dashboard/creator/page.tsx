import React from 'react';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { formatDateTime } from '@/lib/utils';
import {
  PenTool,
  Plus,
  FileText,
  Clock,
  Eye,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ThumbsUp,
  ArrowUpRight,
  Edit3,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function CreatorDashboardPage() {
  const user = await getCurrentUser();

  if (!user || user.role === 'READER') {
    redirect('/dashboard/member');
  }

  // Fetch only articles authored by current user
  const [
    myArticles,
    draftCount,
    inReviewCount,
    publishedCount,
    viewsResult,
    helpfulVotesResult,
  ] = await Promise.all([
    prisma.article.findMany({
      where: { authorId: user.id },
      orderBy: { updatedAt: 'desc' },
      include: {
        category: true,
        reviewer: { select: { displayName: true } },
      },
    }),
    prisma.article.count({ where: { authorId: user.id, status: 'DRAFT' } }),
    prisma.article.count({ where: { authorId: user.id, status: 'IN_REVIEW' } }),
    prisma.article.count({ where: { authorId: user.id, status: 'PUBLISHED' } }),
    prisma.article.aggregate({
      where: { authorId: user.id },
      _sum: { viewCount: true },
    }),
    prisma.article.aggregate({
      where: { authorId: user.id },
      _sum: { helpfulVotes: true },
    }),
  ]);

  const totalViews = viewsResult._sum.viewCount || 0;
  const totalHelpful = helpfulVotesResult._sum.helpfulVotes || 0;

  return (
    <div className="space-y-10">
      {/* Creator Header */}
      <div className="pb-6 border-b border-[var(--border-color)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-[8px] bg-orange-500/15 text-[#ff5a00] font-mono text-[10.5px] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <PenTool className="w-3 h-3" />
              Studio Kepenulisan &amp; Redaksi
            </span>
          </div>
          <h1 className="text-[26px] md:text-[30px] font-extrabold text-[var(--text-primary)] tracking-tight">
            Ruang Kerja Penulis
          </h1>
          <p className="text-[13.5px] text-[var(--text-muted)]">
            Tulis riset arsitektur, kelola draf naskah, pantau status review redaksi, dan analisis respon pembaca.
          </p>
        </div>

        <Link
          href="/admin/docs/new"
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-[16px] bg-[#09090b] dark:bg-white text-white dark:text-[#09090b] text-xs font-bold shadow-awesomic-dark-btn hover:bg-[#18181b] dark:hover:bg-zinc-200 active:scale-95 transition-all shrink-0"
        >
          <Plus className="w-4 h-4 text-[#ff5a00]" />
          <span>Tulis Naskah Baru</span>
        </Link>
      </div>

      {/* Creator Performance Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Published Articles */}
        <div className="p-5 rounded-[24px] border border-[var(--border-color)] bg-[var(--bg-card)] space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-[var(--text-muted)]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-500">
              Naskah Terbit
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-[30px] font-extrabold text-[var(--text-primary)] leading-none">
            {publishedCount}
          </p>
          <p className="text-[10.5px] text-[var(--text-muted)]">
            Naskah telah lolos kurasi &amp; terindeks publik
          </p>
        </div>

        {/* In Review Queue */}
        <div className="p-5 rounded-[24px] border border-[var(--border-color)] bg-[var(--bg-card)] space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-[var(--text-muted)]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-500">
              Menunggu Review
            </span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-[30px] font-extrabold text-amber-500 leading-none">
            {inReviewCount}
          </p>
          <p className="text-[10.5px] text-[var(--text-muted)]">
            {inReviewCount > 0 ? 'Sedang ditinjau oleh redaksi' : 'Tidak ada naskah dalam antrean'}
          </p>
        </div>

        {/* Drafts */}
        <div className="p-5 rounded-[24px] border border-[var(--border-color)] bg-[var(--bg-card)] space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-[var(--text-muted)]">
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Draf Tersimpan
            </span>
            <FileText className="w-4 h-4 text-[#71717a]" />
          </div>
          <p className="text-[30px] font-extrabold text-[var(--text-primary)] leading-none">
            {draftCount}
          </p>
          <p className="text-[10.5px] text-[var(--text-muted)]">
            Tersimpan di database &amp; peramban lokal
          </p>
        </div>

        {/* Total Views on My Articles */}
        <div className="p-5 rounded-[24px] border border-[var(--border-color)] bg-[var(--bg-card)] space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-[var(--text-muted)]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#ff5a00]">
              Total Pembaca Saya
            </span>
            <Eye className="w-4 h-4 text-[#ff5a00]" />
          </div>
          <p className="text-[30px] font-extrabold text-[#ff5a00] leading-none">
            {totalViews.toLocaleString('id-ID')}
          </p>
          <p className="text-[10.5px] text-[var(--text-muted)] font-mono">
            {totalHelpful} respon &amp; apresiasi
          </p>
        </div>
      </div>

      {/* My Articles Master View */}
      <div className="rounded-[28px] border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-color)] pb-4">
          <div>
            <h3 className="text-[16px] font-bold text-[var(--text-primary)]">
              Koleksi Naskah &amp; Status Editorial Saya
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Kelola seluruh artikel yang Anda tulis di platform SlashJournal.
            </p>
          </div>
          <span className="text-xs font-mono text-[var(--text-muted)] font-bold">
            Total {myArticles.length} Naskah
          </span>
        </div>

        {myArticles.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-[16px] bg-[#f4f4f5] dark:bg-[#27272a] text-[#71717a] mx-auto flex items-center justify-center">
              <PenTool className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-[var(--text-primary)]">
              Belum Ada Naskah Ditulis
            </h4>
            <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
              Mulai tulis panduan arsitektur atau catatan rekayasa sistem pertama Anda dengan editor berbasis blok.
            </p>
            <Link
              href="/admin/docs/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-[12px] bg-[#ff5a00] text-white text-xs font-bold mt-2"
            >
              <Plus className="w-3.5 h-3.5" />
              Mulai Menulis
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {myArticles.map((art) => (
              <div
                key={art.id}
                className="p-4 sm:p-5 rounded-[20px] bg-[var(--bg-card-muted)] border border-[var(--border-color)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-[#ff5a00]/40"
              >
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-[9.5px] px-2.5 py-0.5 rounded-full font-mono font-bold ${
                        art.status === 'PUBLISHED'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : art.status === 'IN_REVIEW'
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                          : 'bg-zinc-500/10 text-zinc-500'
                      }`}
                    >
                      {art.status === 'PUBLISHED'
                        ? 'DITERBITKAN'
                        : art.status === 'IN_REVIEW'
                        ? 'MENUNGGU REVIEW'
                        : 'DRAF'}
                    </span>
                    <span className="text-[11px] font-bold text-[#ff5a00]">
                      {art.category.name}
                    </span>
                    <span className="text-[10.5px] text-[var(--text-muted)] font-mono">
                      • {art.readingTime} menit baca
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-[var(--text-primary)] leading-snug">
                    {art.title}
                  </h4>

                  {art.reviewNote && (
                    <div className="p-2.5 rounded-[12px] bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs flex items-center gap-2">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>Catatan Reviewer: {art.reviewNote}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-[11px] text-[var(--text-muted)] font-mono pt-1">
                    <span>Diperbarui {formatDateTime(art.updatedAt)}</span>
                    {art.status === 'PUBLISHED' && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-[#ff5a00] font-bold">
                          <Eye className="w-3 h-3" />
                          {art.viewCount} pembaca
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-emerald-500 font-bold">
                          <ThumbsUp className="w-3 h-3" />
                          {art.helpfulVotes} apresiasi
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <Link
                    href={`/admin/docs/${art.id}`}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-[12px] bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[#ff5a00] text-xs font-bold text-[var(--text-primary)] transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#ff5a00]" />
                    <span>Edit Naskah</span>
                  </Link>

                  {art.status === 'PUBLISHED' && (
                    <Link
                      href={`/${art.slug}`}
                      target="_blank"
                      className="p-2 rounded-[12px] bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[#ff5a00] transition-colors"
                      title="Buka Halaman Artikel"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
