import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyPassword, generateToken } from '@/lib/auth';
import { jsonError } from '@/lib/api-errors';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email dan kata sandi wajib diisi' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user || !user.passwordHash) {
      return NextResponse.json({ error: 'Email atau kata sandi tidak valid' }, { status: 401 });
    }

    if (user.isBlocked) {
      return NextResponse.json({ error: 'Akun Anda telah dinonaktifkan' }, { status: 403 });
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: 'Email atau kata sandi tidak valid' }, { status: 401 });
    }

    const token = generateToken({ userId: user.id, role: user.role as any });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
      },
    });

    response.cookies.set('slash_kb_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60,
    });

    return response;
  } catch (err: unknown) {
    console.error(err);
    return jsonError('Gagal memproses login', 500, err);
  }
}
