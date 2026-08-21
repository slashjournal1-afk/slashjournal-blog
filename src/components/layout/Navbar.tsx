'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bookmark, LogOut, Menu, Search, Shield, X, ChevronDown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import { AuthModal } from '../auth/AuthModal';
import { BrandLogo } from './BrandLogo';

const primaryLinks = [
  { label: 'Tulisan', href: '/' },
  { label: 'Seri', href: '/series' },
  { label: 'Glosarium', href: '/glossary' },
];

const secondaryLinks = [
  { label: 'Semua Tulisan', href: '/' },
  { label: 'Rekayasa Sistem', href: '/category/rekayasa-sistem' },
  { label: 'Desain Antarmuka', href: '/category/desain-antarmuka' },
  { label: 'Seri', href: '/series' },
  { label: 'Glosarium', href: '/glossary' },
];

export function Navbar() {
  const pathname = usePathname();
  const { user, logout, openAuthModal } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsAccountOpen(false);
  }, [pathname]);

  const openSearch = () => {
    window.dispatchEvent(new CustomEvent('open-command-palette'));
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[var(--border-color)] bg-[var(--bg-primary)]/90 backdrop-blur-md transition-colors duration-200">
        <div className="mx-auto flex h-[64px] max-w-editorial items-center justify-between gap-4 px-4 sm:px-8">
          {/* Masthead */}
          <Link
            href="/"
            className="flex shrink-0 items-center gap-1.5"
            aria-label="SlashJournal Beranda"
          >
            <BrandLogo size={34} />
            <span className="font-display text-[22px] font-semibold leading-none tracking-tight text-[var(--text-primary)]">SlashJournal</span>
            <span className="mb-3 h-[3px] w-[3px] rounded-full bg-[var(--accent)]" aria-hidden="true" />
          </Link>

          {/* Topics */}
          <nav aria-label="Navigasi utama" className="hidden items-center gap-6 lg:flex">
            {primaryLinks.map((link) => {
              const active =
                link.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`whitespace-nowrap text-[13px] transition-colors duration-150 ${
                    active
                      ? 'font-semibold text-[var(--text-primary)]'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  } ${active ? 'link-editorial' : ''}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={openSearch}
              className="flex min-h-11 items-center gap-2 rounded-lg px-3 text-[13px] text-[var(--text-muted)] transition-colors duration-150 hover:text-[var(--text-primary)]"
              aria-label="Cari artikel dan konsep"
              title="Cari (Ctrl + K)"
            >
              <Search className="h-4 w-4 text-[var(--text-muted)]" />
              <span className="hidden md:inline">Cari</span>
              <kbd className="hidden rounded-md border border-[var(--border-color)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--text-muted)] md:inline">
                Ctrl K
              </kbd>
            </button>

            <ThemeToggle />

            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsAccountOpen((open) => !open)}
                  className="flex min-h-11 items-center gap-2 rounded-lg px-2 text-[13px] font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-card-muted)]"
                  aria-expanded={isAccountOpen}
                  aria-haspopup="menu"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--accent)] text-xs font-semibold text-white">
                    {user.displayName.charAt(0).toUpperCase()}
                  </span>
                  <span className="hidden max-w-[100px] truncate sm:inline">
                    {user.displayName.split(' ')[0]}
                  </span>
                  <ChevronDown className="h-3 w-3 text-[var(--text-muted)]" />
                </button>

                {isAccountOpen && (
                  <div
                    className="absolute right-0 top-11 w-56 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-1.5 shadow-floating animate-in fade-in zoom-in-95 duration-100 z-50"
                    role="menu"
                  >
                    <div className="border-b border-[var(--border-color)] px-3 py-2">
                      <p className="truncate text-xs font-semibold text-[var(--text-primary)]">
                        {user.displayName}
                      </p>
                      <p className="truncate text-[11px] text-[var(--text-muted)]">{user.email}</p>
                    </div>

                    <div className="pt-1.5">
                      {user.role === 'ADMIN' && (
                        <Link
                          href="/dashboard/superadmin"
                          role="menuitem"
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                        >
                          <Shield className="h-3.5 w-3.5" />
                          <span>Superadmin Control</span>
                        </Link>
                      )}

                      {['ADMIN', 'EDITOR', 'AUTHOR'].includes(user.role) && (
                        <Link
                          href="/dashboard/creator"
                          role="menuitem"
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--bg-card-muted)] transition-colors"
                        >
                          <span className="font-mono text-xs font-bold text-[var(--accent)]">//</span>
                          <span>Studio Penulis</span>
                        </Link>
                      )}

                      {user.role === 'READER' && (
                        <Link
                          href="/dashboard/member"
                          role="menuitem"
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--bg-card-muted)] transition-colors"
                        >
                          <Bookmark className="h-3.5 w-3.5 text-[var(--accent)]" />
                          <span>Dasbor Anggota</span>
                        </Link>
                      )}

                      <Link
                        href="/bookmarks"
                        role="menuitem"
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--bg-card-muted)] transition-colors"
                      >
                        <Bookmark className="h-3.5 w-3.5 text-[var(--accent)]" />
                        <span>Pustaka Bookmark</span>
                      </Link>

                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          logout();
                          setIsAccountOpen(false);
                        }}
                        className="mt-1 flex w-full items-center gap-2 rounded-lg border-t border-[var(--border-color)] px-3 py-2 text-left text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        <span>Keluar Akun</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  openAuthModal();
                }}
                className="hidden min-h-11 items-center rounded-lg px-3.5 text-[13px] font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-card-muted)] sm:inline-flex"
              >
                Masuk
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setIsMenuOpen((open) => !open)}
              className="flex h-11 w-11 items-center justify-center rounded-lg text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-card-muted)] lg:hidden"
              aria-label={isMenuOpen ? 'Tutup menu' : 'Buka menu'}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <nav aria-label="Kanal dan topik" className="border-t border-[var(--border-color)]">
          <div className="scrollbar-none mx-auto flex max-w-editorial overflow-x-auto px-4 sm:px-8">
            {secondaryLinks.map((link) => {
              const active = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  className={`relative flex min-h-11 shrink-0 items-center px-3 text-xs transition-colors first:pl-0 sm:px-4 ${
                    active
                      ? 'font-semibold text-[var(--text-primary)] after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:bg-[var(--accent)] first:after:left-0'
                      : 'font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Mobile Flyout Drawer */}
        {isMenuOpen && (
          <div className="max-h-[calc(100vh-108px)] overflow-y-auto border-t border-[var(--border-color)] bg-[var(--bg-primary)] px-5 py-5 lg:hidden animate-in slide-in-from-top-2 duration-150">
            <nav aria-label="Navigasi Mobile" className="space-y-1">
              {secondaryLinks.map((link) => {
                const active =
                  link.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block rounded-lg px-3 py-2.5 text-[15px] ${
                      active
                        ? 'font-semibold text-[var(--text-primary)]'
                        : 'font-medium text-[var(--text-muted)]'
                    } hover:bg-[var(--bg-card-muted)] transition-colors`}
                  >
                    {link.label}
                  </Link>
                );
              })}

              {!user && (
                <button
                  type="button"
                  onClick={openAuthModal}
                  className="mt-4 w-full rounded-lg bg-[var(--color-ink)] py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-charcoal)]"
                >
                  Masuk / Buat Akun
                </button>
              )}
            </nav>
          </div>
        )}
      </header>
      <AuthModal />
    </>
  );
}
