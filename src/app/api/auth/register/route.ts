import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hashPassword, generateToken } from '@/lib/auth';
import { jsonError } from '@/lib/api-errors';

export function getRegistrationRole(accountType?: unknown): 'READER' | 'AUTHOR' {
  return accountType === 'author' ? 'AUTHOR' : 'READER';
}

export async function POST(req: Request) {
  try {
    const { email, password, displayName, accountType } = await req.json();
    const role = getRegistrationRole(accountType);

    if (!email || !password || !displayName) {
      return NextResponse.json({ error: 'Semua kolom wajib diisi' }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existing) {
      return NextResponse.json({ error: 'Email sudah terdaftar' }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        displayName: displayName.trim(),
        passwordHash,
        role,
        provider: 'LOCAL',
      },
    });

    const token = generateToken({ userId: user.id, role });

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
    return jsonError('Gagal mendaftarkan akun', 500, err);
  }
}
