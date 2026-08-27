import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import type { AdSlot } from '@/lib/types';
import { getAdSlotConfig, type AdSlotName } from '@/lib/ad-slots';

interface ManualAdCreativeProps {
  ad: AdSlot;
  slotName: AdSlotName;
  className?: string;
}

export function ManualAdCreative({ ad, slotName, className = '' }: ManualAdCreativeProps) {
  const config = getAdSlotConfig(slotName);
  const ctaLabel = ad.ctaLabel || 'Kunjungi Situs';

  return (
    <a
      href={ad.targetUrl}
      target="_blank"
      rel="noopener noreferrer nofollow sponsored"
      aria-label={`Iklan bersponsor ${ad.sponsorName}: ${ad.title}`}
      className={`group relative block overflow-hidden border border-[var(--border-color)] bg-[var(--accent-soft)] ${config.roundedClass} ${config.aspectClass} ${className}`}
    >
      {ad.imageUrl ? (
        <Image
          src={ad.imageUrl}
          alt=""
          fill
          sizes={config.sizes}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
      ) : (
        <span className="absolute inset-0 bg-gradient-to-br from-[var(--bg-card-muted)] to-[var(--accent-soft)]" aria-hidden="true" />
      )}
      <span className={`absolute inset-0 ${config.scrimClass}`} aria-hidden="true" />

      {config.contentLayout === 'bar' ? (
        <span className="absolute inset-0 flex items-center gap-3 px-4 sm:gap-4 sm:px-6">
          <span className="inline-flex shrink-0 items-center rounded-full bg-white/95 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#09090b]">
            Iklan · {ad.sponsorName}
          </span>
          <span className="truncate text-xs font-semibold text-white sm:text-sm">
            {ad.title}
          </span>
          <span className="ml-auto hidden shrink-0 items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-bold text-[#09090b] transition-colors group-hover:bg-[var(--accent)] group-hover:text-white sm:inline-flex">
            {ctaLabel}
            <ArrowUpRight className="h-3.5 w-3.5 text-[var(--accent)] transition-colors group-hover:text-white" />
          </span>
        </span>
      ) : (
        <span className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-2 p-5 sm:gap-2.5 sm:p-7">
          <span className="inline-flex items-center rounded-full bg-white/95 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#09090b] sm:text-[10px]">
            Iklan · Sponsor: {ad.sponsorName}
          </span>
          <span className="font-display text-lg font-medium leading-snug tracking-tight text-white sm:text-2xl">
            {ad.title}
          </span>
          {ad.description && (
            <span className="max-w-2xl text-xs leading-relaxed text-zinc-200 line-clamp-2 sm:text-sm">
              {ad.description}
            </span>
          )}
          <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-4 py-2 text-[11px] font-bold text-[#09090b] transition-colors group-hover:bg-[var(--accent)] group-hover:text-white sm:text-xs">
            {ctaLabel}
            <ArrowUpRight className="h-3.5 w-3.5 text-[var(--accent)] transition-colors group-hover:text-white" />
          </span>
        </span>
      )}
    </a>
  );
}
