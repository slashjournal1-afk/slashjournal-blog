'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { AdSlot } from '@/lib/types';

interface SidebarStickyAdProps {
  ad?: AdSlot | null;
  className?: string;
}

export function SidebarStickyAd({ ad, className = '' }: SidebarStickyAdProps) {
  if (!ad || !ad.isActive) {
    return (
      <div
        className={`rounded-[28px] bg-white dark:bg-[#18181b] border border-[#ececee] dark:border-[#27272a] p-5 text-left space-y-3 shadow-xs ${className}`}
      >
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[8px] bg-[#f4f4f5] dark:bg-[#27272a] text-[#71717a] dark:text-[#a1a1aa] text-[10px] font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
            Ruang Sponsor
          </div>
        </div>

        <h5 className="text-xs font-bold text-[#09090b] dark:text-white leading-snug">
          Promosikan Solusi &amp; Tooling Anda
        </h5>

        <p className="text-[11px] text-[#52525b] dark:text-[#a1a1aa] leading-relaxed">
          Dilihat oleh para pengambil keputusan teknis, arsitek cloud, dan engineering lead.
        </p>

        <div className="pt-1">
          <Link
            href="/contact?subject=sponsor"
            className="inline-flex items-center gap-1 text-[11px] font-bold text-[var(--accent)] hover:underline"
          >
            <span>Kemitraan &amp; Pasang Iklan</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-[28px] bg-white dark:bg-[#18181b] border border-[#ececee] dark:border-[#27272a] overflow-hidden text-left group hover:border-[var(--accent-line)] transition-all duration-300 shadow-xs ${className}`}
    >
      {ad.imageUrl && (
        <div className="w-full h-32 relative overflow-hidden bg-zinc-100 dark:bg-zinc-800 border-b border-[#ececee] dark:border-[#27272a]">
          <Image
            src={ad.imageUrl}
            alt={ad.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}

      <div className="p-5 space-y-2">
        <div className="flex items-center justify-between">
          <span className="px-2 py-0.5 rounded-[6px] bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--accent-line)] text-[9.5px] font-bold uppercase tracking-wider">
            Sponsor: {ad.sponsorName}
          </span>
        </div>

        <h5 className="text-xs font-bold text-[#09090b] dark:text-white leading-snug group-hover:text-[var(--accent)] transition-colors">
          {ad.title}
        </h5>

        {ad.description && (
          <p className="text-[11px] text-[#52525b] dark:text-[#a1a1aa] leading-relaxed line-clamp-2">
            {ad.description}
          </p>
        )}

        <div className="pt-2">
          <a
            href={ad.targetUrl}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="w-full py-2 px-3 rounded-[10px] bg-[#f4f4f5] dark:bg-[#27272a] hover:bg-[#09090b] hover:text-white dark:hover:bg-white dark:hover:text-[#09090b] text-[11px] font-bold text-[#09090b] dark:text-white transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-2xs"
          >
            <span>Pelajari Lebih Lanjut</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[var(--accent)]" />
          </a>
        </div>
      </div>
    </div>
  );
}
