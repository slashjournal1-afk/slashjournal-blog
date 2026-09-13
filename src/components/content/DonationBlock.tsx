import React from 'react';
import Link from 'next/link';
import { Coffee, ExternalLink, Sparkles } from 'lucide-react';

export const DONATION_URL = 'https://saweria.co/slashjournal';

interface DonationBlockProps {
  className?: string;
}

/**
 * Blok CTA donasi editorial di tengah alur konten artikel.
 * - Dilabeli eksplisit sebagai "Dukungan Pembaca" agar patuh kebijakan editorial & discover.
 * - Menggunakan ragam visual Awesomic Zinc dengan hairline borders, aksen halus, dan visual chips.
 * - Eksklusif dirender pada halaman detail artikel.
 */
export function DonationBlock({ className = '' }: DonationBlockProps) {
  return (
    <aside
      aria-label="Dukungan pembaca independen via Saweria"
      className={`group not-prose relative overflow-hidden rounded-[24px] sm:rounded-[30px] border border-[var(--border-color)] bg-[var(--bg-card)] transition-all duration-300 hover:border-[var(--border-subtle)] ${className}`}
    >
      {/* Subtle ambient lighting accent */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[var(--accent)]/5 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-16 -left-16 h-44 w-44 rounded-full bg-[var(--accent)]/3 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
      />

      {/* Editorial Header Strip */}
      <div className="flex items-center justify-between border-b border-[var(--border-color)] bg-[var(--bg-card-muted)]/50 px-5 py-2.5 sm:px-7">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent)]" />
          </span>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">
            Dukungan Pembaca · Riset Terbuka
          </p>
        </div>
        <span className="hidden text-[11px] font-medium text-[var(--text-muted)] sm:inline-flex sm:items-center sm:gap-1">
          <Sparkles className="h-3 w-3 text-[var(--accent)]" />
          Saweria / QRIS
        </span>
      </div>

      {/* Main Content Area */}
      <div className="relative flex flex-col gap-6 p-5 sm:p-7 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4 sm:gap-5">
          {/* Visual Coffee Badge */}
          <div
            aria-hidden="true"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[var(--accent)]/20 bg-[var(--accent-soft)] text-[var(--accent)] shadow-xs transition-transform duration-300 group-hover:scale-105 sm:h-14 sm:w-14"
          >
            <Coffee className="h-6 w-6" />
          </div>

          <div className="min-w-0 flex-1 space-y-1.5">
            <h3 className="font-display text-lg font-medium leading-snug tracking-tight text-[var(--text-primary)] sm:text-xl">
              Tulisan ini bebas diakses. Bantu agar tetap independen.
            </h3>
            <p className="max-w-xl text-[13.5px] leading-relaxed text-[var(--text-muted)] sm:text-sm">
              Jika bedah arsitektur dan rekayasa ini memberi nilai bagi pekerjaan atau riset Anda, dukung biaya operasional dan kelanjutan naskah berkualitas di SlashJournal.
            </p>

            {/* Payment Method Badges */}
            <div className="flex flex-wrap items-center gap-1.5 pt-2 text-[11px] font-medium text-[var(--text-muted)]">
              <span className="text-[var(--text-secondary)]">Dukungan via:</span>
              <span className="rounded-md border border-[var(--border-color)] bg-[var(--bg-card-muted)]/70 px-2 py-0.5">
                QRIS
              </span>
              <span className="rounded-md border border-[var(--border-color)] bg-[var(--bg-card-muted)]/70 px-2 py-0.5">
                GoPay
              </span>
              <span className="rounded-md border border-[var(--border-color)] bg-[var(--bg-card-muted)]/70 px-2 py-0.5">
                OVO
              </span>
              <span className="rounded-md border border-[var(--border-color)] bg-[var(--bg-card-muted)]/70 px-2 py-0.5">
                Dana
              </span>
              <span className="rounded-md border border-[var(--border-color)] bg-[var(--bg-card-muted)]/70 px-2 py-0.5">
                ShopeePay
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="shrink-0 pt-1 md:pt-0">
          <Link
            href={DONATION_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Traktir kopi untuk SlashJournal via Saweria (terbuka di tab baru)"
            className="group/btn inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--text-primary)] px-5 py-3 text-sm font-semibold text-[var(--bg-primary)] shadow-xs transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] sm:w-auto"
          >
            <span>Traktir via Saweria</span>
            <ExternalLink className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
