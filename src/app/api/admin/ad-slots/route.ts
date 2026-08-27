import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { jsonError } from '@/lib/api-errors';
import { parseAdSlotPayload } from '@/lib/ad-slots';
import { recordAuditLog } from '@/lib/audit';

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
  const slots = await prisma.adSlot.findMany({ orderBy: { slotName: 'asc' } });
  return NextResponse.json({ slots });
}

export async function PUT(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });

  try {
    const payload = parseAdSlotPayload(await request.json());
    const slot = await prisma.adSlot.upsert({
      where: { slotName: payload.slotName },
      create: payload,
      update: payload,
    });

    await recordAuditLog({
      actorEmail: user.email,
      userId: user.id,
      action: 'AD_SLOT_UPDATE',
      details: `${payload.slotName}: ${payload.isActive ? 'aktif' : 'nonaktif'}`,
    });

    revalidatePath('/');
    revalidatePath('/', 'layout');
    revalidatePath('/category/[slug]', 'page');
    revalidatePath('/[slug]', 'page');
    revalidateTag('home-page-data', 'max');
    revalidateTag('sidebar-sticky-ad', 'max');
    revalidateTag('article-in-feed-ad', 'max');
    revalidateTag('article-mid-ad', 'max');
    revalidateTag('top-banner-ad', 'max');
    return NextResponse.json({ slot });
  } catch (error: unknown) {
    return jsonError('Data iklan tidak valid', 400, error);
  }
}
