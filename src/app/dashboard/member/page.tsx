import React from 'react';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { formatDate, formatDateTime } from '@/lib/utils';
import {
  Bookmark,
  MessageSquare,
  Mail,
  User,
  Clock,
  Sparkles,
  Calendar,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function MemberDashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/?auth=login');
  }

  // Fetch Member's personal bookmarks, comments, and newsletter subscription
  const [bookmarks, comments, subscription] = await Promise.all([
    prisma.bookmark.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        article: {
          include: {
            category: true,
            author: { select: { displayName: true } },
          },
        },
      },
    }),
    prisma.comment.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        article: {
          select: { title: true, slug: true, category: { select: { name: true } } },
        },
      },
    }),
    prisma.subscription.findFirst({
      where: { email: user.email },
    }),
  ]);

  return (
    <div className="space-y-10">
      {/* Member Header */}
      <div className="pb-6 border-b border-[var(--border-color)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-[8px] bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-mono text-[10.5px] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3 h-3" />
              Ruang Anggota &amp; Pembaca
            </span>
          </div>
          <h1 className="text-[26px] md:text-[30px] font-extrabold text-[var(--text-primary)] tracking-tight">
            Selamat Datang, {user.displayName}
          </h1>
          <p className="text-[13.5px] text-[var(--text-muted)]">
            Akses pustaka naskah tersimpan, riwayat kontribusi diskusi, dan kelola preferensi buletin berkala Anda.
          </p>
        </div>

        <Link
          href="/"
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-[14px] bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] text-xs font-bold hover:bg-[var(--bg-card-muted)] active:scale-95 transition-all shrink-0"
        >
          <BookOpen className="w-4 h-4 text-[#ff5a00]" />
          <span>Jelajahi Naskah Baru</span>
        </Link>
      </div>

      {/* Member Overview Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Saved Bookmarks */}
        <div className="p-5 rounded-[24px] border border-[var(--border-color)] bg-[var(--bg-card)] space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-[var(--text-muted)]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#ff5a00]">
              Pustaka Bookmark
            </span>
            <Bookmark className="w-4 h-4 text-[#ff5a00]" />
          </div>
          <p className="text-[30px] font-extrabold text-[var(--text-primary)] leading-none">
            {bookmarks.length}
          </p>
          <p className="text-[10.5px] text-[var(--text-muted)]">
            Naskah arsitektur tersimpan untuk dibaca kembali
          </p>
        </div>

        {/* Total Comments Posted */}
        <div className="p-5 rounded-[24px] border border-[var(--border-color)] bg-[var(--bg-card)] space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-[var(--text-muted)]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-500">
              Diskusi &amp; Komentar
            </span>
            <MessageSquare className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-[30px] font-extrabold text-[var(--text-primary)] leading-none">
            {comments.length}
          </p>
          <p className="text-[10.5px] text-[var(--text-muted)]">
            Kontribusi dalam forum diskusi teknis
          </p>
        </div>

        {/* Newsletter Subscription Status */}
        <div className="p-5 rounded-[24px] border border-[var(--border-color)] bg-[var(--bg-card)] space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-[var(--text-muted)]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-500">
              Status Buletin
            </span>
            <Mail className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <p className="text-sm font-bold text-[var(--text-primary)]">
              {subscription ? 'Berlangganan Aktif' : 'Belum Berlangganan'}
            </p>
          </div>
          <p className="text-[10.5px] text-[var(--text-muted)] capitalize">
            Topik: {subscription ? (subscription.topic === 'all' ? 'Semua Kanal' : subscription.topic) : 'Tidak ada'}
          </p>
        </div>
      </div>

      {/* Grid: Bookmarks List & Comments/Account Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Bookmarked Articles */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-[28px] border border-[var(--border-color)] bg-[var(--bg-card)] p-6 sm:p-8 space-y-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
              <h3 className="text-[15px] font-bold text-[var(--text-primary)] flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-[#ff5a00]" />
                <span>Naskah Tersimpan (Bookmark)</span>
              </h3>
              <span className="text-xs font-mono text-[var(--text-muted)] font-bold">
                {bookmarks.length} Artikel
              </span>
            </div>

            {bookmarks.length === 0 ? (
              <div className="py-8 text-center space-y-2">
                <Bookmark className="w-8 h-8 text-[var(--text-muted)] mx-auto opacity-50" />
                <p className="text-xs text-[var(--text-muted)]">
                  Belum ada artikel yang Anda simpan. Gunakan tombol bookmark pada naskah untuk membacanya nanti.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {bookmarks.map(({ article, createdAt }) => (
                  <Link
                    key={article.id}
                    href={`/${article.slug}`}
                    className="flex items-center gap-3.5 p-3.5 rounded-[18px] bg-[var(--bg-card-muted)] border border-[var(--border-color)] hover:border-[#ff5a00]/40 transition-all group"
                  >
                    {article.coverImageUrl ? (
                      <div className="relative w-16 h-16 rounded-[12px] overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0 border border-[var(--border-color)]">
                        <Image src={article.coverImageUrl} alt="" fill sizes="64px" className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-[12px] bg-zinc-200 dark:bg-zinc-800 shrink-0 flex items-center justify-center font-mono font-bold text-[#ff5a00] text-sm">
                        //
                      </div>
                    )}

                    <div className="min-w-0 flex-1 space-y-1">
                      <span className="text-[10px] font-bold text-[#ff5a00]">
                        {article.category.name}
                      </span>
                      <h4 className="text-xs font-bold text-[var(--text-primary)] group-hover:text-[#ff5a00] transition-colors line-clamp-2 leading-snug">
                        {article.title}
                      </h4>
                      <p className="text-[10.5px] text-[var(--text-muted)] font-mono">
                        Disimpan {formatDate(createdAt)} • {article.readingTime} mnt baca
                      </p>
                    </div>

                    <ArrowUpRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[#ff5a00] shrink-0" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Comments History & Account Profile */}
        <div className="lg:col-span-5 space-y-6">
          {/* Account Profile Card */}
          <div className="rounded-[28px] border border-[var(--border-color)] bg-[var(--bg-card)] p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Profil Akun</span>
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10.5px] text-[var(--text-muted)] block">Nama Lengkap</span>
                <span className="font-bold text-[var(--text-primary)] text-sm">{user.displayName}</span>
              </div>

              <div>
                <span className="text-[10.5px] text-[var(--text-muted)] block">Email Terdaftar</span>
                <span className="font-mono text-[var(--text-primary)]">{user.email}</span>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-[var(--border-color)]">
                <span className="text-[10.5px] text-[var(--text-muted)]">Peran Sistem</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-bold text-[10px]">
                  {user.role}
                </span>
              </div>
            </div>
          </div>

          {/* Comments History */}
          <div className="rounded-[28px] border border-[var(--border-color)] bg-[var(--bg-card)] p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
                <span>Riwayat Diskusi Anda</span>
              </h3>
              <span className="text-[10px] font-mono text-[var(--text-muted)] font-bold">{comments.length} Diskusi</span>
            </div>

            {comments.length === 0 ? (
              <p className="text-xs text-[var(--text-muted)] py-3">
                Anda belum pernah memberikan komentar pada artikel apapun.
              </p>
            ) : (
              <div className="space-y-3">
                {comments.map((comm) => (
                  <Link
                    key={comm.id}
                    href={`/${comm.article.slug}`}
                    className="block p-3 rounded-[14px] bg-[var(--bg-card-muted)] border border-[var(--border-color)] hover:border-blue-500/40 transition-all group text-xs space-y-1"
                  >
                    <p className="font-bold text-[var(--text-primary)] group-hover:text-blue-500 transition-colors line-clamp-1">
                      {comm.article.title}
                    </p>
                    <p className="text-[11.5px] text-[var(--text-muted)] line-clamp-2 italic">
                      &ldquo;{comm.content}&rdquo;
                    </p>
                    <span className="font-mono text-[9.5px] text-[var(--text-muted)] block">
                      {formatDateTime(comm.createdAt)}
                    </span>
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
