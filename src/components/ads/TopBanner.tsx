import { getCachedTopBannerAd } from '@/lib/content-loaders';
import { ManualAdCreative } from './ManualAdCreative';

export async function TopBanner() {
  const ad = await getCachedTopBannerAd();

  if (!ad || !ad.isActive) return null;

  return (
    <section aria-label="Iklan banner" className="w-full border-b border-[var(--border-color)] bg-[var(--bg-card)]">
      <div className="mx-auto max-w-editorial px-5 sm:px-8">
        <ManualAdCreative ad={ad} slotName="top_banner" />
      </div>
    </section>
  );
}
