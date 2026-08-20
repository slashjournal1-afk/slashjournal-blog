import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const articles = await prisma.article.findMany({
    include: {
      category: true,
      author: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ docs: articles });
}

export async function POST(req: NextRequest) {
  return NextResponse.redirect(new URL('/api/articles', req.url));
}
