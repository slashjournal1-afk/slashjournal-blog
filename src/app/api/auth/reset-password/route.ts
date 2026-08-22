import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyResetToken, hashPassword } from '@/lib/auth';
import crypto from 'node:crypto';
import { jsonError } from '@/lib/api-errors';

export async function POST(req: Request) {
  try {
    const { token, password, confirmPassword } = await req.json();

    if (!token || typeof token !== 'string') {
      return NextResponse.json({ error: 'Token pemulihan wajib disertakan' }, { status: 400 });
    }

    if (!password || password.length < 8) {
      return NextResponse.json(
        { error: 'Kata sandi baru minimal harus 8 karakter' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Konfirmasi kata sandi tidak cocok' },
        { status: 400 }
      );
    }

    const verification = verifyResetToken(token);
    if (!verification.valid || !verification.email) {
      return NextResponse.json(
        { error: verification.error || 'Token pemulihan tidak valid atau telah kedaluwarsa' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: verification.email },
    });

    if (!user || user.isBlocked) {
      return NextResponse.json(
        { error: 'Akun tidak ditemukan atau telah dinonaktifkan' },
        { status: 404 }
      );
    }

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const storedToken = await prisma.passwordResetToken.findUnique({ where: { tokenHash } });
    if (!storedToken || storedToken.usedAt || storedToken.expiresAt <= new Date() || storedToken.email !== verification.email) {
      return NextResponse.json({ error: 'Token pemulihan tidak valid atau telah digunakan' }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);
    await prisma.$transaction([
      prisma.user.update({ where: { id: user.id }, data: { passwordHash } }),
      prisma.passwordResetToken.update({ where: { id: storedToken.id }, data: { usedAt: new Date() } }),
      prisma.passwordResetToken.deleteMany({ where: { email: verification.email, id: { not: storedToken.id } } }),
    ]);

    return NextResponse.json({
      success: true,
      message: 'Kata sandi berhasil diperbarui! Silakan masuk dengan kata sandi baru Anda.',
    });
  } catch (err: unknown) {
    console.error('Reset password error:', err);
    return jsonError('Gagal memperbarui kata sandi', 500, err);
  }
}
