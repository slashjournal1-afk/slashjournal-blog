import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { jsonError } from '@/lib/api-errors';
import { profileUpdateSchema } from '@/lib/validation';
import { rateLimit, requestKey } from '@/lib/rate-limit';

export async function PATCH(req: Request) {
  if (!rateLimit(requestKey(req, 'profile-update'), 20, 60_000)) {
    return NextResponse.json({ error: 'Terlalu banyak permintaan. Silakan coba lagi nanti.' }, { status: 429 });
  }

  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Sesi tidak ditemukan. Harap masuk terlebih dahulu.' }, { status: 401 });
    }

    const parsed = profileUpdateSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Data profil tidak valid' }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        displayName: parsed.data.displayName,
        name: parsed.data.name,
        avatarUrl: parsed.data.avatarUrl,
      },
      select: {
        id: true,
        email: true,
        name: true,
        displayName: true,
        avatarUrl: true,
        role: true,
        provider: true,
      },
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (err: unknown) {
    return jsonError('Gagal memperbarui profil', 500, err);
  }
}
