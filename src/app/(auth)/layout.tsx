import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { BrandLogo } from '@/components/layout/BrandLogo';
import type { Metadata } from 'next';

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col justify-between bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* Top Header Bar */}
      <header className="z-10 mx-auto flex w-full max-w-editorial items-center justify-between px-6 py-6">
        <Link
          href="/"
          className="flex items-center gap-1.5"
          title="Kembali ke Beranda Utama"
        >
          <BrandLogo size={34} />
          <span className="font-display text-[22px] font-semibold leading-none tracking-tight text-[var(--text-primary)]">SlashJournal</span>
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-card-muted)] hover:text-[var(--text-primary)]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Beranda</span>
          </Link>
        </div>
      </header>

      {/* Main Authentication Canvas */}
      <main className="z-10 flex flex-1 items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md">{children}</div>
      </main>

      {/* Minimal Footer */}
      <footer className="z-10 mx-auto flex w-full max-w-editorial flex-col items-center justify-between gap-3 border-t border-[var(--border-color)] px-6 py-6 text-xs text-[var(--text-muted)] sm:flex-row">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-[var(--accent)]" />
          <span>Koneksi Terenkripsi &amp; Token HMAC Aman</span>
        </div>
        <div>
          <span>&copy; {new Date().getFullYear()} SlashJournal. Platform Publikasi &amp; Rekayasa Sistem.</span>
        </div>
      </footer>
    </div>
  );
}
