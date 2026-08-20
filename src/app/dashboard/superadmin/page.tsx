import React from 'react';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { formatDateTime } from '@/lib/utils';
import {
  Shield,
  Users,
  FileText,
  Inbox,
  Activity,
  CheckCircle2,
  Clock,
  Eye,
  AlertCircle,
  TrendingUp,
  Plus,
  Search,
  Settings,
  ArrowUpRight,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function SuperAdminDashboardPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  const [
    totalUsers,
    usersByRole,
    totalArticles,
    articlesByStatus,
    inReviewCount,
    totalViewsResult,
    recentUsers,
    recentArticles,
    zeroResults,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.groupBy({
      by: ['role'],
      _count: { id: true },
    }),
    prisma.article.count(),
    prisma.article.groupBy({
      by: ['status'],
      _count: { id: true },
    }),
    prisma.article.count({ where: { status: 'IN_REVIEW' } }),
    prisma.article.aggregate({ _sum: { viewCount: true } }),
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 8,
    }),
    prisma.article.findMany({
      orderBy: { updatedAt: 'desc' },
      take: 8,
      include: { author: true, category: true },
    }),
    prisma.searchQueryLog.findMany({
      where: { resultsCount: 0 },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
  ]);

  const roleCountMap = usersByRole.reduce((acc, curr) => {
    acc[curr.role] = curr._count.id;
    return acc;
  }, {} as Record<string, number>);

  const statusCountMap = articlesByStatus.reduce((acc, curr) => {
    acc[curr.status] = curr._count.id;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-10">
      {/* Superadmin Header */}
      <div className="pb-6 border-b border-[var(--border-color)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-[8px] bg-rose-500/15 text-rose-600 dark:text-rose-400 font-mono text-[10.5px] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-3 h-3" />
              Superadmin Control Center
            </span>
          </div>
          <h1 className="text-[26px] md:text-[30px] font-extrabold text-[var(--text-primary)] tracking-tight">
            Pusat Kendali Ekosistem Sistem
          </h1>
          <p className="text-[13.5px] text-[var(--text-muted)]">
            Pengawasan menyeluruh terhadap otorisasi pengguna, antrean editorial, kinerja naskah, dan integritas platform.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/admin/review-queue"
            className="flex items-center gap-2 px-4 py-2.5 rounded-[14px] bg-[#ff5a00] text-white text-xs font-bold shadow-xs hover:bg-[#e04f00] active:scale-95 transition-all"
          >
            <Inbox className="w-4 h-4" />
            <span>Antrean Review ({inReviewCount})</span>
          </Link>
          <Link
            href="/admin/docs/new"
            className="flex items-center gap-2 px-4 py-2.5 rounded-[14px] bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] text-xs font-bold hover:bg-[var(--bg-card-muted)] active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 text-[#ff5a00]" />
            <span>Naskah Baru</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Users */}
        <div className="p-5 rounded-[24px] border border-[var(--border-color)] bg-[var(--bg-card)] space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-[var(--text-muted)]">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Pengguna</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-[30px] font-extrabold text-[var(--text-primary)] leading-none">
            {totalUsers}
          </p>
          <div className="text-[10.5px] text-[var(--text-muted)] font-mono flex items-center gap-2">
            <span>{roleCountMap.READER || 0} Member</span>
            <span>•</span>
            <span>{(roleCountMap.AUTHOR || 0) + (roleCountMap.EDITOR || 0)} Creator</span>
            <span>•</span>
            <span className="text-rose-500">{roleCountMap.ADMIN || 0} Admin</span>
          </div>
        </div>

        {/* Total Articles */}
        <div className="p-5 rounded-[24px] border border-[var(--border-color)] bg-[var(--bg-card)] space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-[var(--text-muted)]">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Naskah</span>
            <FileText className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-[30px] font-extrabold text-[var(--text-primary)] leading-none">
            {totalArticles}
          </p>
          <div className="text-[10.5px] text-[var(--text-muted)] font-mono flex items-center gap-2">
            <span className="text-emerald-500 font-bold">{statusCountMap.PUBLISHED || 0} Terbit</span>
            <span>•</span>
            <span className="text-amber-500 font-bold">{statusCountMap.IN_REVIEW || 0} Review</span>
            <span>•</span>
            <span>{statusCountMap.DRAFT || 0} Draf</span>
          </div>
        </div>

        {/* Total Views */}
        <div className="p-5 rounded-[24px] border border-[var(--border-color)] bg-[var(--bg-card)] space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-[var(--text-muted)]">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Pembaca</span>
            <Eye className="w-4 h-4 text-[#ff5a00]" />
          </div>
          <p className="text-[30px] font-extrabold text-[#ff5a00] leading-none">
            {(totalViewsResult._sum.viewCount || 0).toLocaleString('id-ID')}
          </p>
          <p className="text-[10.5px] text-[var(--text-muted)]">
            Akumulasi tayangan seluruh naskah
          </p>
        </div>

        {/* Review Queue Status */}
        <div className="p-5 rounded-[24px] border border-[var(--border-color)] bg-[var(--bg-card)] space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-[var(--text-muted)]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-500">
              Antrean Redaksi
            </span>
            <Inbox className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-[30px] font-extrabold text-amber-500 leading-none">
            {inReviewCount}
          </p>
          <p className="text-[10.5px] text-[var(--text-muted)]">
            {inReviewCount > 0 ? 'Naskah menunggu moderasi' : 'Seluruh naskah telah ditinjau'}
          </p>
        </div>
      </div>

      {/* Main Grid: Articles Master & Quick Control Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Recent Articles & Statuses */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-[28px] border border-[var(--border-color)] bg-[var(--bg-card)] p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
              <h3 className="text-[15px] font-bold text-[var(--text-primary)] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#ff5a00]" />
                <span>Naskah &amp; Bab Dokumen Terkini</span>
              </h3>
              <span className="text-xs font-mono text-[var(--text-muted)]">Semua Penulis</span>
            </div>

            <div className="space-y-3">
              {recentArticles.map((art) => (
                <div
                  key={art.id}
                  className="p-3.5 rounded-[16px] bg-[var(--bg-card-muted)] border border-[var(--border-color)] flex items-center justify-between gap-4"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-[9.5px] px-2 py-0.5 rounded-full font-mono font-bold ${
                          art.status === 'PUBLISHED'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : art.status === 'IN_REVIEW'
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                            : 'bg-zinc-500/10 text-zinc-500'
                        }`}
                      >
                        {art.status}
                      </span>
                      <span className="text-[10.5px] font-bold text-[#ff5a00]">
                        {art.category.name}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-[var(--text-primary)] truncate">
                      {art.title}
                    </h4>
                    <p className="text-[10.5px] text-[var(--text-muted)] mt-0.5">
                      Penulis: <span className="font-semibold">{art.author.displayName}</span> • Diperbarui {formatDateTime(art.updatedAt)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/admin/docs/${art.id}`}
                      className="px-3 py-1.5 rounded-[10px] bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[#ff5a00] text-xs font-bold text-[var(--text-primary)] transition-colors"
                    >
                      Edit
                    </Link>
                    {art.status === 'PUBLISHED' && (
                      <Link
                        href={`/${art.slug}`}
                        target="_blank"
                        className="p-1.5 rounded-[10px] bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[#ff5a00] transition-colors"
                        title="Lihat Publikasi"
                      >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: User Management Directory & Quick System Links */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick System Navigation */}
          <div className="rounded-[28px] border border-[var(--border-color)] bg-[var(--bg-card)] p-6 space-y-3 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-2">
              <Settings className="w-3.5 h-3.5 text-[#ff5a00]" />
              <span>Pusat Navigasi Sistem</span>
            </h3>

            <div className="space-y-2 pt-1">
              <Link
                href="/admin/review-queue"
                className="flex items-center justify-between p-3 rounded-[14px] bg-[var(--bg-card-muted)] border border-[var(--border-color)] hover:border-[#ff5a00] transition-colors text-xs font-bold text-[var(--text-primary)]"
              >
                <div className="flex items-center gap-2.5">
                  <Inbox className="w-4 h-4 text-amber-500" />
                  <span>Antrean Moderasi Redaksi</span>
                </div>
                <span className="font-mono text-amber-500 font-bold">{inReviewCount}</span>
              </Link>

              <Link
                href="/admin/telemetry"
                className="flex items-center justify-between p-3 rounded-[14px] bg-[var(--bg-card-muted)] border border-[var(--border-color)] hover:border-[#ff5a00] transition-colors text-xs font-bold text-[var(--text-primary)]"
              >
                <div className="flex items-center gap-2.5">
                  <Activity className="w-4 h-4 text-blue-500" />
                  <span>Telemetri &amp; Kesenjangan Konten</span>
                </div>
                <span className="font-mono text-blue-500 font-bold">Wawasan</span>
              </Link>

              <Link
                href="/admin/audit-logs"
                className="flex items-center justify-between p-3 rounded-[14px] bg-[var(--bg-card-muted)] border border-[var(--border-color)] hover:border-[#ff5a00] transition-colors text-xs font-bold text-[var(--text-primary)]"
              >
                <div className="flex items-center gap-2.5">
                  <Shield className="w-4 h-4 text-rose-500" />
                  <span>Log Audit &amp; Keamanan</span>
                </div>
                <span className="font-mono text-rose-500 font-bold">Audit</span>
              </Link>
            </div>
          </div>

          {/* User Directory Preview */}
          <div className="rounded-[28px] border border-[var(--border-color)] bg-[var(--bg-card)] p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-[#ff5a00]" />
                <span>Pengguna Terdaftar Baru</span>
              </h3>
              <span className="text-[10px] font-mono text-[var(--text-muted)] font-bold">{totalUsers} Total</span>
            </div>

            <div className="space-y-2.5">
              {recentUsers.map((u) => (
                <div
                  key={u.id}
                  className="p-3 rounded-[14px] bg-[var(--bg-card-muted)] border border-[var(--border-color)] flex items-center justify-between text-xs"
                >
                  <div className="min-w-0 pr-2">
                    <p className="font-bold text-[var(--text-primary)] truncate">{u.displayName}</p>
                    <p className="text-[10px] text-[var(--text-muted)] truncate">{u.email}</p>
                  </div>
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded-full font-mono font-bold shrink-0 ${
                      u.role === 'ADMIN'
                        ? 'bg-rose-500/10 text-rose-500'
                        : u.role === 'AUTHOR' || u.role === 'EDITOR'
                        ? 'bg-orange-500/10 text-[#ff5a00]'
                        : 'bg-emerald-500/10 text-emerald-500'
                    }`}
                  >
                    {u.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
