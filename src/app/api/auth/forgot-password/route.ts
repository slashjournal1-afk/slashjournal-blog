import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateResetToken } from '@/lib/auth';
import { jsonError } from '@/lib/api-errors';
import { z } from 'zod';
import crypto from 'node:crypto';
import { rateLimit, requestKey } from '@/lib/rate-limit';

export async function POST(req: Request) {
  if (!rateLimit(requestKey(req, 'forgot-password'), 5, 3600_000)) {
    return NextResponse.json(
      { error: 'Terlalu banyak permintaan pemulihan. Silakan coba lagi nanti.' },
      { status: 429 }
    );
  }
  try {
    const parsed = z.object({ email: z.string().trim().email().max(320) }).safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Masukkan alamat email yang valid' },
        { status: 400 }
      );
    }

    const cleanEmail = parsed.data.email.toLowerCase().trim();
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
      select: { id: true, email: true, isBlocked: true, passwordHash: true },
    });

    // For safety, if user doesn't exist or is blocked, respond with generic message
    if (!user || user.isBlocked) {
      return NextResponse.json({
        success: true,
        message: 'Jika email terdaftar, instruksi pemulihan kata sandi telah disiapkan.',
      });
    }

    const resetToken = generateResetToken(cleanEmail);
    const tokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    await prisma.passwordResetToken.deleteMany({ where: { email: cleanEmail, usedAt: null } });
    await prisma.passwordResetToken.create({
      data: { tokenHash, email: cleanEmail, expiresAt: new Date(Date.now() + 60 * 60 * 1000) },
    });
    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'https://www.slashjournal.my.id';
    const resetUrl = `${origin}/reset-password?token=${resetToken}`;

    const response: { success: true; message: string; resetUrl?: string; token?: string } = {
      success: true,
      message: 'Instruksi pemulihan kata sandi berhasil dibuat.',
    };
    if (process.env.NODE_ENV !== 'production') {
      response.resetUrl = resetUrl;
      response.token = resetToken;
    }
    return NextResponse.json(response);
  } catch (err: unknown) {
    console.error('Forgot password error:', err);
    return jsonError('Terjadi kesalahan sistem saat memproses permintaan', 500, err);
  }
}
