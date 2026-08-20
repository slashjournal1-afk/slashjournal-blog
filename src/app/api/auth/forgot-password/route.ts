import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateResetToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Masukkan alamat email yang valid' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
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
    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'https://slashjournal.my.id';
    const resetUrl = `${origin}/reset-password?token=${resetToken}`;

    return NextResponse.json({
      success: true,
      message: 'Instruksi pemulihan kata sandi berhasil dibuat.',
      // In development, return the link directly for instant testing
      resetUrl,
      token: resetToken,
    });
  } catch (err: any) {
    console.error('Forgot password error:', err);
    return NextResponse.json(
      { error: 'Terjadi kesalahan sistem saat memproses permintaan' },
      { status: 500 }
    );
  }
}
