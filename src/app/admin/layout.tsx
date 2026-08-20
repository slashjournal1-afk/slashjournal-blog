import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import {
  LayoutDashboard,
  FileText,
  Plus,
  Inbox,
  Activity,
  LogOut,
  Shield,
  Home,
  PenTool,
} from 'lucide-react';

export const metadata = {
  title: 'Editorial CMS Workspace — SlashJournal',
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  if (!user || user.role === 'READER') {
    redirect('/');
  }

  const navItems = [
    { label: 'Overview Superadmin', href: '/dashboard/superadmin', icon: Shield, roles: ['ADMIN'] },
    { label: 'Studio Penulis', href: '/dashboard/creator', icon: PenTool, roles: ['ADMIN', 'EDITOR', 'AUTHOR'] },
    { label: 'Tulis Dokumen Baru', href: '/admin/docs/new', icon: Plus, roles: ['ADMIN', 'EDITOR', 'AUTHOR'] },
    { label: 'Antrean Review Draf', href: '/admin/review-queue', icon: Inbox, roles: ['ADMIN', 'EDITOR'] },
    { label: 'Telemetri Pencarian', href: '/admin/telemetry', icon: Activity, roles: ['ADMIN', 'EDITOR'] },
    { label: 'Log Audit & Revisi', href: '/admin/audit-logs', icon: FileText, roles: ['ADMIN'] },
  ];

  const allowedNav = navItems.filter((item) => item.roles.includes(user.role));

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[var(--bg-card)] border-r border-[var(--border-color)] flex flex-col justify-between shrink-0">
        <div className="p-6 space-y-6">
          {/* Logo SlashJournal Button -> Direct Link to Landing Page / */}
          <Link
            href="/"
            title="Kembali ke Beranda Utama SlashJournal"
            className="flex items-center gap-2.5 group p-1.5 -m-1.5 rounded-[14px] hover:bg-[var(--bg-card-muted)] transition-all"
          >
            <div className="w-9 h-9 rounded-[12px] bg-[#09090b] text-white flex items-center justify-center font-mono font-bold text-sm shadow-xs group-hover:scale-105 group-hover:bg-[#ff5a00] transition-all dark:bg-white dark:text-[#09090b] dark:group-hover:bg-[#ff5a00] dark:group-hover:text-white">
              //
            </div>
            <div>
              <span className="text-[17px] font-extrabold text-[var(--text-primary)] tracking-tight block leading-none">
                SLASH<span className="text-[#ff5a00]">JOURNAL</span>
              </span>
              <span className="text-[9.5px] font-mono text-[var(--text-muted)] group-hover:text-[#ff5a00] block mt-1 uppercase font-bold tracking-wider transition-colors">
                ← Beranda Utama
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="space-y-1">
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Menu Navigasi
            </div>
            {allowedNav.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-btn text-[13px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-muted)] transition-colors active:scale-98"
                >
                  <Icon className="w-4 h-4 text-[#ff5a00] shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer User Info */}
        <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-card-muted)] space-y-3">
          <div className="flex items-center justify-between text-[12px] px-1">
            <div className="min-w-0 pr-2">
              <span className="font-bold text-[var(--text-primary)] truncate max-w-[130px] block">
                {user.displayName}
              </span>
              <span className="text-[10px] text-[var(--text-muted)] truncate max-w-[130px] block">
                {user.email}
              </span>
            </div>
            <span className="text-[9.5px] px-2 py-0.5 rounded-full bg-[#ff5a00]/15 text-[#ff5a00] font-mono font-bold shrink-0">
              {user.role}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <Link
              href="/"
              className="flex items-center justify-center gap-1.5 py-2 rounded-btn bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[#ff5a00] text-[11.5px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <Home className="w-3.5 h-3.5 text-[#ff5a00]" />
              <span>Beranda</span>
            </Link>
            <form action="/api/auth/logout" method="POST">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-1 py-2 rounded-btn bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 text-[11.5px] font-medium transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                Keluar
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main Admin Area - Expansive width on desktop */}
      <main className="flex-1 min-w-0 p-6 md:p-8 xl:p-10 overflow-y-auto w-full max-w-[1720px] mx-auto">
        {children}
      </main>
    </div>
  );
}
