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

  return (
    <a
      href={ad.targetUrl}
      target="_blank"
      rel="noopener noreferrer nofollow sponsored"
      aria-label={`Iklan billboard ${ad.sponsorName}: ${ad.title}`}
      className={`group relative block overflow-hidden border border-[var(--border-color)] bg-[var(--accent-soft)] transition-all duration-300 hover:border-[var(--accent)] ${config.roundedClass} ${config.aspectClass} ${className}`}
    >
      {ad.imageUrl ? (
        <Image
          src={ad.imageUrl}
          alt=""
          fill
          sizes={config.sizes}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      ) : (
        <span className="absolute inset-0 bg-gradient-to-br from-[var(--bg-card-muted)] to-[var(--accent-soft)]" aria-hidden="true" />
      )}
      <span className={`absolute inset-0 ${config.scrimClass}`} aria-hidden="true" />

      {config.contentLayout === 'bar' ? (
        <span className="absolute inset-0 flex items-center gap-3 px-4 sm:gap-4 sm:px-6">
          <span className="inline-flex shrink-0 items-center rounded-full bg-white/95 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#09090b] shadow-xs">
            Iklan · {ad.sponsorName}
          </span>
          <span className="truncate text-xs font-semibold text-white drop-shadow-xs sm:text-sm">
            {ad.title}
          </span>
          <ArrowUpRight className="ml-auto h-4 w-4 shrink-0 text-white/80 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" aria-hidden="true" />
        </span>
      ) : (
        <span className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-2 p-5 sm:gap-2.5 sm:p-7">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#09090b] shadow-xs sm:text-[10px]">
            <span>Iklan · Sponsor: {ad.sponsorName}</span>
            <ArrowUpRight className="h-3 w-3 text-[var(--accent)]" aria-hidden="true" />
          </span>
          <span className="font-display text-lg font-medium leading-snug tracking-tight text-white drop-shadow-xs sm:text-2xl">
            {ad.title}
          </span>
          {ad.description && (
            <span className="max-w-2xl text-xs leading-relaxed text-zinc-200 line-clamp-2 drop-shadow-xs sm:text-sm">
              {ad.description}
            </span>
          )}
        </span>
      )}
    </a>
  );
}
