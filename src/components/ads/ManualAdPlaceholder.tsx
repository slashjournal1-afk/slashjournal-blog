import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { getAdSlotConfig, getDummyAdImage, type AdSlotName } from '@/lib/ad-slots';

export function ManualAdPlaceholder({ slotName, className = '' }: { slotName: AdSlotName; className?: string }) {
  const config = getAdSlotConfig(slotName);

  return (
    <Link
      href="/contact?subject=sponsor"
      className={`group relative block overflow-hidden border border-[var(--border-color)] bg-[var(--bg-card)] ${config.roundedClass} ${config.aspectClass} ${className}`}
      aria-label="Hubungi SlashJournal untuk memasang iklan"
    >
      <Image
        src={getDummyAdImage(slotName)}
        alt="Ruang iklan manual SlashJournal"
        fill
        sizes={config.sizes}
        className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
      />
      <span className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-[#09090b]/85 px-4 py-2 text-[10px] font-bold text-white sm:py-3 sm:text-xs">
        <span>Slot {config.label} — Pasang Iklan Terkurasi</span>
        <ArrowUpRight className="h-4 w-4 text-[var(--accent)]" />
      </span>
    </Link>
  );
}
