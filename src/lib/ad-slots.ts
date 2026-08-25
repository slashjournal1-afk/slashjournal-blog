import { z } from 'zod';

export const AD_SLOT_NAMES = ['leaderboard', 'in_feed', 'sidebar_sticky'] as const;
export type AdSlotName = (typeof AD_SLOT_NAMES)[number];

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
