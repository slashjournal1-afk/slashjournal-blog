'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { AdSlot } from '@/lib/types';
import { GoogleAdSense } from './GoogleAdSense';

interface BannerAdProps {
  ad?: AdSlot | null;
  adsenseSlot?: string;
  className?: string;
}

export function BannerAd({ ad, adsenseSlot, className = '' }: BannerAdProps) {
  if (!ad || !ad.isActive) {
    return (
      <div className={`w-full my-10 ${className}`}>
        <GoogleAdSense slot={adsenseSlot || process.env.NEXT_PUBLIC_ADSENSE_LEADERBOARD_SLOT} className="mb-4" />
        <div className="rounded-[32px] bg-gradient-to-r from-[#f4f4f5]/80 via-white to-[#f4f4f5]/80 dark:from-[#18181b]/80 dark:via-[#121214] dark:to-[#18181b]/80 border border-[#ececee] dark:border-[#27272a] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent-soft)] rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="flex-1 space-y-2 relative z-10 text-left w-full">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[10px] bg-white dark:bg-[#27272a] border border-[#ececee] dark:border-[#3f3f46] text-[#71717a] dark:text-[#a1a1aa] text-[10.5px] font-bold uppercase tracking-wider shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
            Ruang Kemitraan Redaksi
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#09090b] dark:text-white tracking-tight leading-snug">
            Jangkau Ribuan Software Architect &amp; Senior Engineer
          </h3>
          <p className="text-xs sm:text-sm text-[#52525b] dark:text-[#a1a1aa] max-w-xl leading-relaxed">
            Format iklan native, non-intrusif, dan berkonteks tinggi yang dirancang untuk platform SaaS, infrastruktur cloud, dan developer tooling.
          </p>
        </div>

        <Link
          href="/contact?subject=sponsor"
          className="px-5 py-3 rounded-[14px] bg-[var(--text-primary)] text-[var(--bg-primary)] hover:bg-[var(--text-secondary)] text-xs font-bold transition-all shrink-0 flex items-center gap-2 active:scale-95 z-10"
        >
          <span>Pasang Iklan Terkurasi</span>
          <ArrowUpRight className="w-4 h-4 text-[var(--accent)]" />
        </Link>
        </div>
      </div>
    );
  }

  return (
    <div
        className={`w-full my-10 rounded-[32px] bg-[var(--bg-card)] border border-[var(--border-color)] overflow-hidden p-6 sm:p-7 flex flex-col md:flex-row items-center justify-between gap-6 relative group transition-all duration-300 hover:border-[var(--accent-line)] shadow-xs ${className}`}
    >
      {ad.imageUrl && (
        <div className="w-full md:w-44 h-28 rounded-[20px] overflow-hidden relative shrink-0 border border-[#ececee] dark:border-[#27272a] bg-zinc-100 dark:bg-zinc-800">
          <Image
            src={ad.imageUrl}
            alt={ad.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}

      <div className="flex-1 space-y-1.5 text-left w-full">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-[8px] bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--accent-line)] text-[10px] font-bold uppercase tracking-wider">
            Mitra Redaksi: {ad.sponsorName}
          </span>
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-[#09090b] dark:text-white tracking-tight group-hover:text-[var(--accent)] transition-colors leading-snug">
          {ad.title}
        </h3>

        {ad.description && (
          <p className="text-xs sm:text-sm text-[#52525b] dark:text-[#a1a1aa] leading-relaxed line-clamp-2">
            {ad.description}
          </p>
        )}
      </div>

      <a
        href={ad.targetUrl}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="px-5 py-3 rounded-[14px] bg-[var(--text-primary)] text-[var(--bg-primary)] hover:bg-[var(--text-secondary)] text-xs font-bold transition-all shrink-0 flex items-center gap-2 active:scale-95"
      >
        <span>Kunjungi Situs</span>
        <ArrowUpRight className="w-4 h-4 text-[var(--accent)]" />
      </a>
    </div>
  );
}
