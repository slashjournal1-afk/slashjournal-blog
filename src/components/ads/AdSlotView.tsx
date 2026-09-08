import type { AdSlot } from '@/lib/types';
import { getAdSlotConfig, type AdSlotName } from '@/lib/ad-slots';
import { ManualAdCreative } from './ManualAdCreative';
import { ManualAdPlaceholder } from './ManualAdPlaceholder';
import { GoogleAdSense } from './GoogleAdSense';

interface AdSlotViewProps {
  slotName: AdSlotName;
  ad?: AdSlot | null;
  adsenseSlot?: string;
  adsenseLayoutKey?: string;
  className?: string;
}

export function AdSlotView({ slotName, ad, adsenseSlot, adsenseLayoutKey, className = '' }: AdSlotViewProps) {
  if (adsenseSlot && getAdSlotConfig(slotName).adsenseAllowed) {
    return <GoogleAdSense slot={adsenseSlot} slotName={slotName} layoutKey={adsenseLayoutKey} className={className} />;
  }

  if (ad && ad.isActive) {
    return <ManualAdCreative ad={ad} slotName={slotName} className={className} />;
  }

  return <ManualAdPlaceholder slotName={slotName} className={className} />;
}
