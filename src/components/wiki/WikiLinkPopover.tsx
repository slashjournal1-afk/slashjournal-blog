'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PopoverMetadata } from '@/lib/wikilinks';
import { ExternalLink, Sparkles } from 'lucide-react';

export interface WikiLinkPopoverProps {
  slug: string;
  label?: string;
  conceptName?: string;
  shortDef?: string;
  category?: string;
  metadata?: PopoverMetadata;
}

export function WikiLinkPopover({
  slug,
  label,
  conceptName,
  shortDef,
  category,
  metadata,
}: WikiLinkPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);

  const displayLabel = label || conceptName || slug;
  const termName = metadata?.term || conceptName || label || slug;
  const def = metadata?.shortDef || shortDef || 'Konsep dan definisi arsitektur sistem.';
  const cat = metadata?.category || category || 'Arsitektur';
  const targetHref = metadata?.type === 'article' ? `/${slug}` : `/glossary/${slug}`;

  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <Link
        href={targetHref}
        className="text-[var(--accent)] font-semibold underline decoration-[var(--accent-line)] underline-offset-4 hover:decoration-[var(--accent)] transition-colors inline-flex items-center gap-0.5"
      >
        <span>{displayLabel}</span>
      </Link>

      {/* Floating Popover Card */}
      {isOpen && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-4 rounded-[20px] bg-white dark:bg-[#18181b] border border-[#ececee] dark:border-[#27272a] shadow-xl z-50 text-left">
          <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#ececee] dark:border-[#27272a]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--accent)] flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              {cat}
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#f4f4f5] dark:bg-[#27272a] text-[#71717a] font-mono">
              {metadata?.type === 'article' ? 'Artikel' : 'Glosarium'}
            </span>
          </div>

          <h4 className="text-sm font-bold text-[#09090b] dark:text-white mt-2">
            {termName}
          </h4>
          <p className="text-xs text-[#52525b] dark:text-[#a1a1aa] mt-1 line-clamp-3 leading-relaxed">
            {def}
          </p>

          <div className="mt-3 pt-2 border-t border-[#ececee] dark:border-[#27272a] flex items-center justify-between text-xs text-[var(--accent)] font-semibold">
            <span>Buka Definisi Lengkap</span>
            <ExternalLink className="w-3 h-3" />
          </div>

          {/* Pointer triangle */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-[#ececee] dark:border-t-[#27272a]" />
        </div>
      )}
    </span>
  );
}
