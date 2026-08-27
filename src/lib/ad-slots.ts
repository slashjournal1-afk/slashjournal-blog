import { z } from 'zod';

export const AD_SLOT_NAMES = ['top_banner', 'below_hero', 'leaderboard', 'in_feed', 'sidebar_sticky'] as const;
export type AdSlotName = (typeof AD_SLOT_NAMES)[number];

export interface AdSlotConfig {
  label: string;
  placement: string;
  aspectClass: string;
  roundedClass: string;
  contentLayout: 'bar' | 'stack';
  scrimClass: string;
  sizes: string;
  creativeWidth: number;
  creativeHeight: number;
  adsenseAllowed: boolean;
}

export const AD_SLOT_CONFIG: Record<AdSlotName, AdSlotConfig> = {
  top_banner: {
    label: 'Banner Atas Header',
    placement: 'Strip di atas header pada semua halaman publik kecuali halaman artikel (M3: tanpa iklan di atas judul).',
    aspectClass: 'aspect-[320/50] sm:aspect-[970/90]',
    roundedClass: 'rounded-none',
    contentLayout: 'bar',
    scrimClass: 'bg-gradient-to-r from-[#09090b]/95 via-[#09090b]/80 to-[#09090b]/30',
    sizes: '(max-width: 640px) 100vw, 1216px',
    creativeWidth: 1940,
    creativeHeight: 180,
    adsenseAllowed: false,
  },
  below_hero: {
    label: 'Billboard Bawah Hero',
    placement: 'Tepat di bawah featured story pada beranda.',
    aspectClass: 'aspect-[320/100] sm:aspect-[970/250]',
    roundedClass: 'rounded-[32px]',
    contentLayout: 'stack',
    scrimClass: 'bg-gradient-to-t from-[#09090b]/95 via-[#09090b]/65 to-transparent',
    sizes: '(max-width: 640px) 100vw, 1216px',
    creativeWidth: 1940,
    creativeHeight: 500,
    adsenseAllowed: true,
  },
  leaderboard: {
    label: 'Billboard Bawah Konten',
    placement: 'Bawah beranda (kondisional saat slot bawah hero kosong) dan bawah halaman kanal.',
    aspectClass: 'aspect-[320/100] sm:aspect-[970/250]',
    roundedClass: 'rounded-[32px]',
    contentLayout: 'stack',
    scrimClass: 'bg-gradient-to-t from-[#09090b]/95 via-[#09090b]/65 to-transparent',
    sizes: '(max-width: 640px) 100vw, 1216px',
    creativeWidth: 1940,
    creativeHeight: 500,
    adsenseAllowed: true,
  },
  in_feed: {
    label: 'In-Feed Native',
    placement: 'Tersisip di antara daftar artikel pada beranda dan halaman kanal.',
    aspectClass: 'aspect-[16/9]',
    roundedClass: 'rounded-[36px]',
    contentLayout: 'stack',
    scrimClass: 'bg-gradient-to-t from-[#09090b]/95 via-[#09090b]/65 to-transparent',
    sizes: '(max-width: 1024px) 100vw, 806px',
    creativeWidth: 1612,
    creativeHeight: 907,
    adsenseAllowed: true,
  },
  sidebar_sticky: {
    label: 'Sidebar Vertikal',
    placement: 'Rail kanan 280px pada halaman artikel (non-sticky, patuh kebijakan penempatan AdSense).',
    aspectClass: 'aspect-[4/5]',
    roundedClass: 'rounded-[28px]',
    contentLayout: 'stack',
    scrimClass: 'bg-gradient-to-t from-[#09090b]/95 via-[#09090b]/65 to-transparent',
    sizes: '(max-width: 1024px) 0px, 320px',
    creativeWidth: 560,
    creativeHeight: 700,
    adsenseAllowed: true,
  },
};

export function getAdSlotConfig(slotName: AdSlotName): AdSlotConfig {
  return AD_SLOT_CONFIG[slotName];
}

const adSlotSchema = z.object({
  slotName: z.enum(AD_SLOT_NAMES, { invalid_type_error: 'Slot iklan tidak valid' }),
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().max(500).nullable().optional(),
  sponsorName: z.string().trim().min(1).max(100),
  targetUrl: z.string().url().refine((value) => value.startsWith('https://'), 'URL tujuan harus HTTPS'),
  ctaLabel: z.string().trim().min(1).max(40),
  imageUrl: z.string().trim().max(500).nullable().optional(),
  isActive: z.boolean().default(true),
});

export type AdSlotPayload = z.infer<typeof adSlotSchema>;

export function parseAdSlotPayload(input: unknown): AdSlotPayload {
  return adSlotSchema.parse(input);
}

export function getDummyAdImage(slotName: string) {
  return slotName === 'sidebar_sticky' ? '/vertical_dummy_ads.webp' : '/horizontal_dummy_ads.webp';
}
