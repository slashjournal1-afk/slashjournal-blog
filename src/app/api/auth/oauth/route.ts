import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateToken } from '@/lib/auth';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const provider = searchParams.get('provider') || 'github';

  // Demo OAuth simulation: logs in / creates demo oauth user
  const email = `engineer-${provider}@slashjournal.dev`;
  const displayName = `${provider.toUpperCase()} Engineer`;

  let user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        displayName,
        provider: provider.toUpperCase(),
        role: 'READER',
      },
    });
  }

  const token = generateToken({ userId: user.id, role: user.role as any });

  const response = NextResponse.redirect(new URL('/', req.url));
  response.cookies.set('slash_kb_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 30 * 24 * 60 * 60,
  });

  return response;
}
