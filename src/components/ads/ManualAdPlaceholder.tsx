import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { getDummyAdImage } from '@/lib/ad-slots';

export function ManualAdPlaceholder({ slotName, className = '' }: { slotName: string; className?: string }) {
  const isSidebar = slotName === 'sidebar_sticky';

  return (
    <Link
      href="/contact?subject=sponsor"
      className={`group relative block overflow-hidden border border-[var(--border-color)] bg-[var(--bg-card)] ${isSidebar ? 'rounded-[28px]' : 'rounded-[32px]'} ${className}`}
      aria-label="Hubungi SlashJournal untuk memasang iklan"
    >
      <div className={isSidebar ? 'aspect-[3/4]' : 'aspect-[16/6]'}>
        <Image
          src={getDummyAdImage(slotName)}
          alt="Ruang iklan manual SlashJournal"
          fill
          sizes={isSidebar ? '(max-width: 1024px) 0px, 320px' : '(max-width: 768px) 100vw, 1376px'}
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
      </div>
      <span className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-[#09090b]/85 px-4 py-3 text-xs font-bold text-white">
        <span>Pasang Iklan Terkurasi</span>
        <ArrowUpRight className="h-4 w-4 text-[var(--accent)]" />
      </span>
    </Link>
  );
}
