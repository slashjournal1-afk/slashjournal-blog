import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser, verifyPassword, hashPassword } from '@/lib/auth';
import { jsonError } from '@/lib/api-errors';
import { changePasswordSchema } from '@/lib/validation';
import { rateLimit, requestKey } from '@/lib/rate-limit';

export async function POST(req: Request) {
  if (!rateLimit(requestKey(req, 'change-password'), 5, 3600_000)) {
    return NextResponse.json({ error: 'Terlalu banyak permintaan. Silakan coba lagi nanti.' }, { status: 429 });
  }

  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Sesi tidak ditemukan. Harap masuk terlebih dahulu.' }, { status: 401 });
    }

    const parsed = changePasswordSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Data kata sandi tidak valid' }, { status: 400 });
    }

    const account = await prisma.user.findUnique({
      where: { id: user.id },
      select: { passwordHash: true, provider: true },
    });
    if (!account) {
      return NextResponse.json({ error: 'Akun tidak ditemukan' }, { status: 404 });
    }
    if (account.provider !== 'LOCAL' || !account.passwordHash) {
      return NextResponse.json({ error: 'Akun ini masuk melalui penyedia OAuth sehingga kata sandi dikelola di sana' }, { status: 400 });
    }

    const matches = await verifyPassword(parsed.data.currentPassword, account.passwordHash);
    if (!matches) {
      return NextResponse.json({ error: 'Kata sandi saat ini salah' }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: await hashPassword(parsed.data.newPassword) },
    });

    return NextResponse.json({ success: true, message: 'Kata sandi berhasil diperbarui' });
  } catch (err: unknown) {
    return jsonError('Gagal memperbarui kata sandi', 500, err);
  }
}
