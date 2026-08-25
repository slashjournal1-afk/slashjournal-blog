'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { AdSlot } from '@/lib/types';
import { ManualAdPlaceholder } from './ManualAdPlaceholder';

interface InFeedAdProps {
  ad?: AdSlot | null;
  adsenseSlot?: string;
  className?: string;
}

export function InFeedAd({ ad, className = '' }: InFeedAdProps) {
  if (!ad || !ad.isActive) {
    return <ManualAdPlaceholder slotName="in_feed" className={className} />;
  }

  return (
    <div
      className={`rounded-[36px] bg-white dark:bg-[#18181b] border border-[#ececee] dark:border-[#27272a] overflow-hidden flex flex-col justify-between group hover:border-[var(--accent-line)] transition-all duration-300 shadow-xs ${className}`}
    >
      {ad.imageUrl && (
        <div className="w-full h-48 relative overflow-hidden bg-zinc-100 dark:bg-zinc-800 border-b border-[#ececee] dark:border-[#27272a]">
          <Image
            src={ad.imageUrl}
            alt={ad.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}

      <div className="p-7 flex flex-col justify-between flex-1 space-y-4">
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-[8px] bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--accent-line)] text-[10px] font-bold uppercase tracking-wider">
              Sponsor: {ad.sponsorName}
            </span>
          </div>

          <h4 className="text-base font-bold text-[var(--text-primary)] leading-snug group-hover:text-[var(--accent)] transition-colors">
            {ad.title}
          </h4>

          {ad.description && (
            <p className="text-xs text-[#52525b] dark:text-[#a1a1aa] leading-relaxed line-clamp-3">
              {ad.description}
            </p>
          )}
        </div>

        <div className="pt-4 border-t border-[#ececee] dark:border-[#27272a] flex items-center justify-between">
          <span className="text-[11px] text-[var(--text-muted)]">Rekomendasi Redaksi</span>
          <a
            href={ad.targetUrl}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#09090b] dark:text-white hover:text-[var(--accent)] transition-colors"
          >
             <span>{ad.ctaLabel || 'Kunjungi Situs'}</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[var(--accent)]" />
          </a>
        </div>
      </div>
    </div>
  );
}
