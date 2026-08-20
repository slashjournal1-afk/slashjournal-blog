import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ bookmarks: [], bookmarked: false });

  const { searchParams } = new URL(req.url);
  const articleId = searchParams.get('articleId') || searchParams.get('docId');

  if (articleId) {
    const existing = await prisma.bookmark.findUnique({
      where: { userId_articleId: { userId: user.id, articleId } },
    });
    return NextResponse.json({ bookmarked: !!existing });
  }

  const bookmarks = await prisma.bookmark.findMany({
    where: { userId: user.id },
    include: {
      article: {
        include: { category: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ bookmarks });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Silakan login terlebih dahulu' }, { status: 401 });

  try {
    const body = await req.json();
    const articleId = body.articleId || body.docId;

    const existing = await prisma.bookmark.findUnique({
      where: { userId_articleId: { userId: user.id, articleId } },
    });

    if (existing) {
      await prisma.bookmark.delete({
        where: { id: existing.id },
      });
      return NextResponse.json({ bookmarked: false });
    } else {
      await prisma.bookmark.create({
        data: { userId: user.id, articleId },
      });
      return NextResponse.json({ bookmarked: true });
    }
  } catch (err: any) {
    return NextResponse.json({ error: 'Gagal mengubah status bookmark' }, { status: 500 });
  }
}
