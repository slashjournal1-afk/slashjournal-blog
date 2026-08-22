import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { jsonError } from '@/lib/api-errors';

export async function POST() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: Harap masuk terlebih dahulu' }, { status: 401 });
    }

    // UU PDP Compliance (U5):
    // Anonymize user details, remove email, replace displayName with "Pengguna Terhapus"
    // Keep comments for discussion integrity
    const anonymizedEmail = `deleted_${Date.now()}_${Math.random().toString(36).substring(2, 7)}@deleted.user`;

    await prisma.user.update({
      where: { id: user.id },
      data: {
        email: anonymizedEmail,
        displayName: 'Pengguna Terhapus (UU PDP)',
        name: 'Pengguna Terhapus',
        avatarUrl: null,
        passwordHash: null,
        isBlocked: true,
      },
    });

    const response = NextResponse.json({
      success: true,
      message: 'Akun dan data pribadi Anda telah dihapus secara permanen sesuai ketentuan UU PDP.',
    });

    // Clear session cookie
    response.cookies.set('slash_kb_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    });

    return response;
  } catch (err: unknown) {
    console.error('Delete account error:', err);
    return jsonError('Gagal memproses penghapusan akun', 500, err);
  }
}
