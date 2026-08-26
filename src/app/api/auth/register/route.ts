import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { hashPassword, generateToken } from '@/lib/auth';
import { jsonError } from '@/lib/api-errors';
import { rateLimit, requestKey } from '@/lib/rate-limit';

export function getRegistrationRole(accountType?: unknown): 'READER' | 'AUTHOR' {
  return accountType === 'author' ? 'AUTHOR' : 'READER';
}

const registerSchema = z.object({
  email: z.string().trim().toLowerCase().email('Alamat email tidak valid').max(320),
  password: z.string().min(8, 'Kata sandi minimal harus 8 karakter').max(128, 'Kata sandi maksimal 128 karakter'),
  displayName: z.string().trim().min(1, 'Nama tampilan wajib diisi').max(80, 'Nama tampilan terlalu panjang'),
  accountType: z.string().trim().max(32).optional(),
});

export async function POST(req: Request) {
  if (!rateLimit(requestKey(req, 'register'), 5, 3600_000)) {
    return NextResponse.json(
      { error: 'Terlalu banyak permintaan pendaftaran. Silakan coba lagi nanti.' },
      { status: 429 }
    );
  }

  try {
    const parsed = registerSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Data pendaftaran tidak valid' }, { status: 400 });
    }
    const { email, password, displayName, accountType } = parsed.data;
    const role = getRegistrationRole(accountType);

    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json({ error: 'Email sudah terdaftar' }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        displayName,
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
