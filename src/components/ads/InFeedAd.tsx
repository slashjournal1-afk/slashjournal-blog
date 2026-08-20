'use client';

import React from 'react';
import Image from 'next/image';
import { ExternalLink, Sparkles, ArrowUpRight } from 'lucide-react';
import { AdSlot } from '@/lib/types';

interface InFeedAdProps {
  ad?: AdSlot | null;
  className?: string;
}

export function InFeedAd({ ad, className = '' }: InFeedAdProps) {
  if (!ad || !ad.isActive) {
    return (
      <div
        className={`rounded-[36px] bg-gradient-to-b from-[#f4f4f5]/60 to-white dark:from-[#18181b]/60 dark:to-[#121214] border border-dashed border-[#d4d4d8] dark:border-[#3f3f46] p-7 flex flex-col justify-between shadow-xs ${className}`}
      >
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[8px] bg-white dark:bg-[#27272a] text-[#71717a] dark:text-[#a1a1aa] text-[10px] font-bold uppercase tracking-wider shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
            Native In-Feed Slot
          </div>
          <h4 className="text-base font-bold text-[#09090b] dark:text-white leading-snug">
            Promosikan Produk Engineering &amp; SaaS Anda
          </h4>
          <p className="text-xs text-[#52525b] dark:text-[#a1a1aa] leading-relaxed">
            Format terpadu yang membaur harmonis dengan aliran artikel dan kurasi mingguan.
          </p>
        </div>
        <div className="mt-6 pt-4 border-t border-[#ececee] dark:border-[#27272a]">
          <a
            href="/contact?subject=sponsor"
            className="inline-flex items-center gap-1 text-xs font-bold text-[var(--accent)] hover:underline"
          >
            <span>Hubungi untuk Kemitraan</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    );
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

          <h4 className="text-base font-bold text-[#09090b] dark:text-white leading-snug group-hover:text-[var(--accent)] transition-colors">
            {ad.title}
          </h4>

          {ad.description && (
            <p className="text-xs text-[#52525b] dark:text-[#a1a1aa] leading-relaxed line-clamp-3">
              {ad.description}
            </p>
          )}
        </div>

        <div className="pt-4 border-t border-[#ececee] dark:border-[#27272a] flex items-center justify-between">
          <span className="text-[11px] text-[#71717a]">Rekomendasi Redaksi</span>
          <a
            href={ad.targetUrl}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#09090b] dark:text-white hover:text-[var(--accent)] transition-colors"
          >
            <span>Kunjungi Situs</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[var(--accent)]" />
          </a>
        </div>
      </div>
    </div>
  );
}
