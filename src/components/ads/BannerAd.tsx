'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { AdSlot } from '@/lib/types';
import { ManualAdPlaceholder } from './ManualAdPlaceholder';

interface BannerAdProps {
  ad?: AdSlot | null;
  adsenseSlot?: string;
  className?: string;
}

export function BannerAd({ ad, className = '' }: BannerAdProps) {
  if (!ad || !ad.isActive) {
    return (
      <ManualAdPlaceholder slotName="leaderboard" className={`my-10 ${className}`} />
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
         <span>{ad.ctaLabel || 'Kunjungi Situs'}</span>
        <ArrowUpRight className="w-4 h-4 text-[var(--accent)]" />
      </a>
    </div>
  );
}
