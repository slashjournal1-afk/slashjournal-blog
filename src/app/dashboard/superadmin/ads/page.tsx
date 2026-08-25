import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { AD_SLOT_NAMES } from '@/lib/ad-slots';
import { ManualAdsForm } from './ManualAdsForm';

export const dynamic = 'force-dynamic';

export default async function ManualAdsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') redirect('/dashboard');

  const slots = await prisma.adSlot.findMany({ orderBy: { slotName: 'asc' } });
  const slotsByName = new Map(slots.map((slot) => [slot.slotName, slot]));
  const initialSlots = AD_SLOT_NAMES.map((slotName) => slotsByName.get(slotName) || {
    id: '',
    slotName,
    title: 'Ruang Kemitraan SlashJournal',
    description: null,
    imageUrl: null,
    targetUrl: 'https://slashjournal.dev/contact?subject=sponsor',
    sponsorName: 'Nama Brand',
    ctaLabel: 'Kunjungi Situs',
    isActive: false,
    createdAt: new Date(0),
    updatedAt: new Date(0),
  });
  return <ManualAdsForm initialSlots={initialSlots} />;
}
