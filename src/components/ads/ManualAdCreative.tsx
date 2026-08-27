import Image from 'next/image';
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
      aria-label={`Iklan ${ad.sponsorName}: ${ad.title}`}
      className={`group relative block overflow-hidden border border-[var(--border-color)] bg-[var(--bg-card-muted)] transition-all duration-300 hover:border-[var(--accent)] hover:shadow-md ${config.roundedClass} ${config.aspectClass} ${className}`}
    >
      {ad.imageUrl ? (
        <Image
          src={ad.imageUrl}
          alt={ad.title || ad.sponsorName}
          fill
          sizes={config.sizes}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--bg-card-muted)] to-[var(--accent-soft)] p-4 text-center">
          <span className="font-display text-sm font-semibold text-[var(--text-primary)]">
            {ad.title}
          </span>
        </div>
      )}
    </a>
  );
}
