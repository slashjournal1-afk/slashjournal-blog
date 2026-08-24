'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Menu, X, LayoutDashboard, FileText, Plus, Inbox, Activity, Shield, Bookmark, User, PenTool } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { BrandLogo } from '@/components/layout/BrandLogo';
import { LogoutButton } from '@/components/auth/LogoutButton';

export type DashboardIconKey =
  | 'layout-dashboard'
  | 'file-text'
  | 'plus'
  | 'inbox'
  | 'activity'
  | 'shield'
  | 'bookmark'
  | 'user'
  | 'pen-tool';

const DASHBOARD_ICONS: Record<DashboardIconKey, LucideIcon> = {
  'layout-dashboard': LayoutDashboard,
  'file-text': FileText,
  plus: Plus,
  inbox: Inbox,
  activity: Activity,
  shield: Shield,
  bookmark: Bookmark,
  user: User,
  'pen-tool': PenTool,
};

export interface DashboardNavItem {
  label: string;
  href: string;
  icon: DashboardIconKey;
}

interface DashboardSidebarProps {
  navItems: DashboardNavItem[];
  sectionLabel: string;
  user: { displayName: string; email: string };
  roleBadge: { label: string; bg: string; text: string };
}

export function DashboardSidebar({ navItems, sectionLabel, user, roleBadge }: DashboardSidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile Top Bar - Sidebar toggled via hamburger */}
      <header className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-[var(--border-color)] bg-[var(--bg-primary)]/95 backdrop-blur-md px-4 py-3 md:hidden">
        <Link
          href="/"
          title="Kembali ke Beranda Utama SlashJournal"
          className="flex items-center gap-2"
        >
          <BrandLogo size={30} className="rounded-[10px]" />
          <span className="text-[15px] font-extrabold tracking-tight leading-none text-[var(--text-primary)]">
            SLASH<span className="text-[var(--accent)]">JOURNAL</span>
          </span>
        </Link>
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          className="flex h-10 w-10 items-center justify-center rounded-btn border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-card-muted)]"
          aria-label={isOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
          aria-expanded={isOpen}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {/* Dynamic Sidebar - Hidden on mobile unless opened via toggle */}
      <aside
        className={`${isOpen ? 'flex' : 'hidden'} w-full flex-col justify-between md:flex md:w-64 md:sticky md:top-0 md:h-screen bg-[var(--bg-card)] md:border-r border-b md:border-b-0 border-[var(--border-color)] shrink-0 overflow-y-auto scrollbar-none`}
      >
        <div className="p-6 space-y-6">
          {/* Brand Logo Button -> Direct Link to Landing Page / (hidden on mobile since topbar has it) */}
          <Link
            href="/"
            title="Kembali ke Beranda Utama SlashJournal"
            className="hidden md:flex items-center gap-2.5 group p-1.5 -m-1.5 rounded-[14px] hover:bg-[var(--bg-card-muted)] transition-all"
          >
            <BrandLogo size={36} className="rounded-[12px]" />
            <div>
              <span className="text-[17px] font-extrabold text-[var(--text-primary)] tracking-tight block leading-none">
                SLASH<span className="text-[var(--accent)]">JOURNAL</span>
              </span>
              <span className="text-[9.5px] font-mono text-[var(--text-muted)] group-hover:text-[var(--accent)] block mt-1 uppercase font-bold tracking-wider transition-colors">
                ← Beranda Utama
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
              {sectionLabel}
            </div>
            {navItems.map((item) => {
              const Icon = DASHBOARD_ICONS[item.icon] ?? Activity;
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-btn text-[13px] transition-colors active:scale-98 ${
                    isActive
                      ? 'font-semibold text-[var(--text-primary)] bg-[var(--bg-card-muted)]'
                      : 'font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-muted)]'
                  }`}
                >
                  <Icon className="w-4 h-4 text-[var(--accent)] shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-card-muted)] space-y-3">
          <div className="flex items-center justify-between text-[12px] px-1">
            <div className="min-w-0 pr-2">
              <p className="font-bold text-[var(--text-primary)] truncate max-w-[130px]">
                {user.displayName}
              </p>
              <p className="text-[10px] text-[var(--text-muted)] truncate max-w-[130px]">
                {user.email}
              </p>
            </div>
            <span
              className={`text-[9.5px] px-2 py-0.5 rounded-full font-mono font-bold shrink-0 ${roleBadge.bg} ${roleBadge.text}`}
            >
              {roleBadge.label}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <Link
              href="/"
              onClick={closeMenu}
              className="flex items-center justify-center gap-1.5 py-2 rounded-btn bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--accent)] text-[11.5px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <Home className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>Beranda</span>
            </Link>
            <LogoutButton className="w-full flex items-center justify-center gap-1 py-2 rounded-btn bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 text-[11.5px] font-medium transition-colors disabled:opacity-60" />
          </div>
        </div>
      </aside>
    </>
  );
}
