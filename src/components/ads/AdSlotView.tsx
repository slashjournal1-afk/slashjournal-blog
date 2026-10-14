import type { AdSlot } from '@/lib/types';
import { isAdSenseApproved } from '@/lib/ads-approval';
import { getAdSlotConfig, type AdSlotName } from '@/lib/ad-slots';
import { ManualAdCreative } from './ManualAdCreative';
import { GoogleAdSense } from './GoogleAdSense';

interface AdSlotViewProps {
  slotName: AdSlotName;
  ad?: AdSlot | null;
  adsenseSlot?: string;
  adsenseLayoutKey?: string;
  className?: string;
}

export function AdSlotView({ slotName, ad, adsenseSlot, adsenseLayoutKey, className = '' }: AdSlotViewProps) {
  // Pre-approval AdSense: JANGAN tampilkan placeholder "Pasang Iklan".
  // Situs harus terlihat 100% konten saat direview ("Konten tanpa manfaat").
  if (!isAdSenseApproved()) return null;

  if (adsenseSlot && getAdSlotConfig(slotName).adsenseAllowed) {
    return <GoogleAdSense slot={adsenseSlot} slotName={slotName} layoutKey={adsenseLayoutKey} className={className} />;
  }

  if (ad && ad.isActive) {
    return <ManualAdCreative ad={ad} slotName={slotName} className={className} />;
  }

  return null;
}
