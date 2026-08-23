'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ArrowUpRight,
  BookOpen,
  Bookmark,
  ChevronDown,
  FileText,
  LogOut,
  Menu,
  Search,
  Shield,
  User,
  X,
  LogIn,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import { AuthModal } from '../auth/AuthModal';
import { BrandLogo } from './BrandLogo';
import { useDismissiblePopover } from './useDismissiblePopover';

type Category = {
  name: string;
  slug: string;
  description: string | null;
};

const primaryLinks = [
  { label: 'Beranda', href: '/' },
  { label: 'Seri', href: '/series' },
  { label: 'Glosarium', href: '/glossary' },
  { label: 'Tentang', href: '/about' },
  { label: 'Kontak', href: '/contact' },
];

function isActivePath(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname.startsWith(href);
}

export function Navbar({ categories }: { categories: Category[] }) {
  const pathname = usePathname();
  const { user, logout, openAuthModal } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openSurface, setOpenSurface] = useState<'category' | 'account' | null>(null);
  const [isMobileCategoryOpen, setIsMobileCategoryOpen] = useState(false);
  const categoryPanelId = useId();
  const accountMenuId = useId();
  const mobileNavigationId = useId();
  const mobileCategoryPanelId = useId();
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const authRestoreFocusRef = useRef<HTMLElement | null>(null);

  const closeMenus = () => {
    setOpenSurface(null);
    setIsMenuOpen(false);
    setIsMobileCategoryOpen(false);
  };
  const openCategory = () => {
    setOpenSurface((surface) => surface === 'category' ? null : 'category');
    setIsMenuOpen(false);
    setIsMobileCategoryOpen(false);
  };
  const openAccount = () => {
    setOpenSurface((surface) => surface === 'account' ? null : 'account');
    setIsMenuOpen(false);
    setIsMobileCategoryOpen(false);
  };
  const openAuth = (restoreFocusTo: HTMLElement) => {
    authRestoreFocusRef.current = restoreFocusTo;
    closeMenus();
    openAuthModal();
  };

  const categoryOpen = openSurface === 'category';
  const accountOpen = openSurface === 'account';
  const categoryPopoverRef = useDismissiblePopover<HTMLDivElement>({ open: categoryOpen, onClose: () => setOpenSurface(null) });
  const accountPopoverRef = useDismissiblePopover<HTMLDivElement>({ open: accountOpen, onClose: () => setOpenSurface(null) });
  const mobileNavigationRef = useDismissiblePopover<HTMLDivElement>({
    open: isMenuOpen,
    onClose: closeMenus,
    closeOnPointerLeave: false,
    additionalRef: mobileMenuButtonRef,
  });

  useEffect(() => {
    // Navigation invalidates every menu surface, including nested mobile state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpenSurface(null);
    setIsMenuOpen(false);
    setIsMobileCategoryOpen(false);
  }, [pathname]);

  const openSearch = () => window.dispatchEvent(new CustomEvent('open-command-palette'));
  const categoryActive = pathname.startsWith('/category');

  const dashboardEntry = user
    ? user.role === 'ADMIN'
      ? { href: '/dashboard/superadmin', label: 'Superadmin Control', Icon: Shield }
      : user.role === 'EDITOR' || user.role === 'AUTHOR'
      ? { href: '/dashboard/creator', label: 'Studio Penulis', Icon: FileText }
      : { href: '/dashboard/member', label: 'Dasbor Anggota', Icon: User }
    : null;

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[var(--border-color)] bg-[var(--bg-primary)]/95 backdrop-blur-md">
        <div className="mx-auto flex min-h-[68px] max-w-editorial items-center justify-between gap-4 px-4 sm:px-8">
          <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="SlashJournal Beranda">
            <BrandLogo size={34} />
            <span className="font-display text-[22px] font-semibold leading-none tracking-tight text-[var(--text-primary)]">
              SlashJournal
            </span>
            <span className="mb-3 h-[3px] w-[3px] rounded-full bg-[var(--accent)]" aria-hidden="true" />
          </Link>

          <nav aria-label="Navigasi utama" className="hidden items-center gap-1 lg:flex">
            {primaryLinks.slice(0, 1).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenus}
                className={`rounded-btn px-3 py-2 text-[13px] transition-colors ${
                  isActivePath(pathname, link.href)
                    ? 'font-semibold text-[var(--text-primary)] bg-[var(--bg-card-muted)]'
                    : 'text-[var(--text-muted)] hover:bg-[var(--bg-card-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="relative" ref={categoryPopoverRef}>
              <button
                type="button"
                onClick={openCategory}
                className={`flex items-center gap-1 rounded-btn px-3 py-2 text-[13px] transition-colors ${
                  categoryActive || categoryOpen
                    ? 'font-semibold text-[var(--text-primary)] bg-[var(--bg-card-muted)]'
                    : 'text-[var(--text-muted)] hover:bg-[var(--bg-card-muted)] hover:text-[var(--text-primary)]'
                }`}
                aria-expanded={categoryOpen}
                aria-controls={categoryPanelId}
                aria-haspopup="true"
              >
                Kategori
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${categoryOpen ? 'rotate-180' : ''}`} />
              </button>

              {categoryOpen && (
                <div id={categoryPanelId} className="absolute left-0 top-11 z-10 max-h-[min(70vh,560px)] w-[min(340px,calc(100vw_-_2rem))] overflow-y-auto border border-[var(--border-color)] bg-[var(--bg-card)] p-2 shadow-floating animate-in fade-in slide-in-from-top-1 duration-100">
                  <div className="border-b border-[var(--border-color)] px-3 pb-2 pt-1">
                    <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--accent)]">Index topik</p>
                    <p className="mt-1 text-xs text-[var(--text-muted)]">Pilih jalur baca berdasarkan bidang rekayasa.</p>
                  </div>
                  <div className="grid gap-1 py-1">
                    {categories.map((category) => (
                      <Link
                        key={category.slug}
                        href={`/category/${category.slug}`}
                        onClick={closeMenus}
                        className="group flex items-start justify-between gap-3 px-3 py-2.5 transition-colors hover:bg-[var(--bg-card-muted)]"
                      >
                        <span className="min-w-0 flex-1">
                          <span className="block break-words text-xs font-semibold text-[var(--text-primary)]">{category.name}</span>
                          {category.description && (
                            <span className="mt-0.5 block truncate text-[10px] text-[var(--text-muted)]">{category.description}</span>
                          )}
                        </span>
                        <ArrowUpRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--text-muted)] transition-colors group-hover:text-[var(--accent)]" />
                      </Link>
                    ))}
                  </div>
                  <Link href="/category" onClick={closeMenus} className="flex items-center gap-2 border-t border-[var(--border-color)] px-3 py-2.5 text-xs font-bold text-[var(--accent)] hover:bg-[var(--bg-card-muted)]">
                    <BookOpen className="h-3.5 w-3.5" />
                    Lihat semua kategori
                  </Link>
                </div>
              )}
            </div>

            {primaryLinks.slice(1).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenus}
                className={`rounded-btn px-3 py-2 text-[13px] transition-colors ${
                  isActivePath(pathname, link.href)
                    ? 'font-semibold text-[var(--text-primary)] bg-[var(--bg-card-muted)]'
                    : 'text-[var(--text-muted)] hover:bg-[var(--bg-card-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={openSearch}
              className="flex min-h-11 items-center gap-2 rounded-btn px-3 text-[13px] text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-card-muted)] hover:text-[var(--text-primary)]"
              aria-label="Cari artikel dan konsep"
              title="Cari (Ctrl + K)"
            >
              <Search className="h-4 w-4" />
              <span className="hidden xl:inline">Cari</span>
              <kbd className="hidden rounded-md border border-[var(--border-color)] px-1.5 py-0.5 font-mono text-[10px] xl:inline">Ctrl K</kbd>
            </button>
            <ThemeToggle />

            {user ? (
              <div className="relative hidden sm:block" ref={accountPopoverRef}>
                <button
                  type="button"
                  onClick={openAccount}
                  className="flex min-h-11 items-center gap-2 rounded-btn px-2 text-[13px] font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-card-muted)]"
                  aria-expanded={accountOpen}
                  aria-controls={accountMenuId}
                  aria-haspopup="menu"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent)] text-xs font-semibold text-[var(--accent-foreground)]">{user.displayName.charAt(0).toUpperCase()}</span>
                  <span className="hidden max-w-[92px] truncate md:inline">{user.displayName.split(' ')[0]}</span>
                  <ChevronDown className="h-3 w-3 text-[var(--text-muted)]" />
                </button>
                {accountOpen && (
                  <div id={accountMenuId} className="absolute right-0 top-12 z-10 w-56 border border-[var(--border-color)] bg-[var(--bg-card)] p-1.5 shadow-floating animate-in fade-in zoom-in-95 duration-100" role="menu">
                    <div className="border-b border-[var(--border-color)] px-3 py-2">
                      <p className="truncate text-xs font-semibold text-[var(--text-primary)]">{user.displayName}</p>
                      <p className="truncate text-[11px] text-[var(--text-muted)]">{user.email}</p>
                    </div>
                    <div className="pt-1.5">
                      {user.role === 'ADMIN' && <AccountLink href="/dashboard/superadmin" icon={<Shield className="h-3.5 w-3.5" />} label="Superadmin Control" tone="danger" onClick={closeMenus} />}
                      {['ADMIN', 'EDITOR', 'AUTHOR'].includes(user.role) && <AccountLink href="/dashboard/creator" icon={<FileText className="h-3.5 w-3.5 text-[var(--accent)]" />} label="Studio Penulis" onClick={closeMenus} />}
                      {user.role === 'READER' && <AccountLink href="/dashboard/member" icon={<Bookmark className="h-3.5 w-3.5 text-[var(--accent)]" />} label="Dasbor Anggota" onClick={closeMenus} />}
                      <AccountLink href="/bookmarks" icon={<Bookmark className="h-3.5 w-3.5 text-[var(--accent)]" />} label="Pustaka Bookmark" onClick={closeMenus} />
                      <button type="button" role="menuitem" onClick={() => { closeMenus(); logout(); }} className="mt-1 flex min-h-10 w-full items-center gap-2 border-t border-[var(--border-color)] px-3 text-left text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20">
                        <LogOut className="h-3.5 w-3.5" /> Keluar Akun
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button type="button" onClick={(event) => openAuth(event.currentTarget)} className="hidden min-h-11 items-center gap-2 rounded-btn bg-[var(--color-ink)] px-3.5 text-[13px] font-semibold text-white transition-colors hover:bg-[var(--color-charcoal)] sm:inline-flex"><LogIn className="h-4 w-4" />Masuk</button>
            )}

            <button ref={mobileMenuButtonRef} type="button" onClick={() => { setIsMenuOpen((open) => !open); setOpenSurface(null); setIsMobileCategoryOpen(false); }} className="flex h-11 w-11 items-center justify-center rounded-btn text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-card-muted)] lg:hidden" aria-label={isMenuOpen ? 'Tutup menu' : 'Buka menu'} aria-expanded={isMenuOpen} aria-controls={mobileNavigationId}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div ref={mobileNavigationRef} id={mobileNavigationId} className="border-t border-[var(--border-color)] bg-[var(--bg-card)] lg:hidden">
            <nav aria-label="Navigasi mobile" className="mx-auto max-h-[calc(100vh_-_69px)] max-w-editorial overflow-y-auto px-4 py-4 sm:px-8">
              <div className="mb-3 flex items-center justify-between px-1">
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--accent)]">Navigasi SlashJournal</span>
                <span className="text-[10px] text-[var(--text-muted)]">{categories.length} topik aktif</span>
              </div>
              <div className="grid gap-1">
                {primaryLinks.slice(0, 1).map((link) => <MobileLink key={link.href} href={link.href} label={link.label} active={isActivePath(pathname, link.href)} onClick={closeMenus} />)}
                <button type="button" onClick={() => setIsMobileCategoryOpen((open) => !open)} className={`flex min-h-12 w-full items-center justify-between px-3 text-left text-[15px] font-semibold ${categoryActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`} aria-expanded={isMobileCategoryOpen} aria-controls={mobileCategoryPanelId}>
                  <span className="flex items-center gap-3"><BookOpen className="h-4 w-4 text-[var(--accent)]" /> Kategori</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${isMobileCategoryOpen ? 'rotate-180' : ''}`} />
                </button>
                {isMobileCategoryOpen && <div id={mobileCategoryPanelId} className="ml-7 border-l border-[var(--border-color)] pl-3">{categories.map((category) => <MobileLink key={category.slug} href={`/category/${category.slug}`} label={category.name} active={pathname.startsWith(`/category/${category.slug}`)} onClick={closeMenus} />)}<MobileLink href="/category" label="Semua kategori" active={pathname === '/category'} onClick={closeMenus} /></div>}
                {primaryLinks.slice(1).map((link) => <MobileLink key={link.href} href={link.href} label={link.label} active={isActivePath(pathname, link.href)} onClick={closeMenus} />)}
              </div>
              <div className="mt-4 grid gap-2 border-t border-[var(--border-color)] pt-4 sm:grid-cols-2">
                {dashboardEntry && (
                  <Link
                    href={dashboardEntry.href}
                    onClick={closeMenus}
                    className="flex min-h-12 items-center gap-3 border border-[var(--accent-line)] bg-[var(--accent-soft)] px-3 text-sm font-semibold text-[var(--text-primary)] transition-colors hover:border-[var(--accent)]"
                  >
                    <dashboardEntry.Icon className="h-4 w-4 text-[var(--accent)]" />
                    {dashboardEntry.label}
                  </Link>
                )}
                <button type="button" onClick={() => { closeMenus(); openSearch(); }} className="flex min-h-12 items-center gap-3 border border-[var(--border-color)] px-3 text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-card-muted)]"><Search className="h-4 w-4 text-[var(--accent)]" /> Cari tulisan</button>
                {!user && <button type="button" onClick={() => { if (mobileMenuButtonRef.current) openAuth(mobileMenuButtonRef.current); }} className="flex min-h-12 items-center justify-center gap-2 bg-[var(--color-ink)] px-3 text-sm font-semibold text-white hover:bg-[var(--color-charcoal)]"><LogIn className="h-4 w-4" />Masuk / Buat akun</button>}
                {user && <button type="button" onClick={() => { closeMenus(); logout(); }} className="flex min-h-12 items-center gap-3 border border-rose-200 px-3 text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:border-rose-900 dark:hover:bg-rose-950/20"><LogOut className="h-4 w-4" /> Keluar akun</button>}
              </div>
            </nav>
          </div>
        )}
      </header>
      <AuthModal restoreFocusRef={authRestoreFocusRef} />
    </>
  );
}

function MobileLink({ href, label, active, onClick }: { href: string; label: string; active: boolean; onClick: () => void }) {
  return <Link href={href} onClick={onClick} className={`flex min-h-12 items-center justify-between px-3 text-[15px] ${active ? 'font-semibold text-[var(--text-primary)] bg-[var(--bg-card-muted)]' : 'font-medium text-[var(--text-secondary)]'} hover:bg-[var(--bg-card-muted)]`}>{label}{active && <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />}</Link>;
}

function AccountLink({ href, icon, label, tone = 'default', onClick }: { href: string; icon: React.ReactNode; label: string; tone?: 'default' | 'danger'; onClick: () => void }) {
  return <Link href={href} onClick={onClick} role="menuitem" className={`flex min-h-10 items-center gap-2 px-3 text-xs font-medium transition-colors hover:bg-[var(--bg-card-muted)] ${tone === 'danger' ? 'text-rose-600' : 'text-[var(--text-primary)]'}`}>{icon}<span>{label}</span></Link>;
}
