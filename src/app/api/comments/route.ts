import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser, hasPermission } from '@/lib/auth';

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Silakan login terlebih dahulu' }, { status: 401 });

  try {
    const body = await req.json();
    const articleId = body.articleId || body.docId;
    const content = body.content;

    if (!articleId || !content || !content.trim()) {
      return NextResponse.json({ error: 'Komentar tidak boleh kosong' }, { status: 400 });
    }

    const comment = await prisma.comment.create({
      data: {
        articleId,
        content: content.trim(),
        userId: user.id,
      },
      include: {
        user: {
          select: { id: true, displayName: true, avatarUrl: true, role: true },
        },
      },
    });

    return NextResponse.json({ success: true, comment });
  } catch (err: any) {
    return NextResponse.json({ error: 'Gagal mengirim komentar' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Akses ditolak' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID komentar diperlukan' }, { status: 400 });

  const comment = await prisma.comment.findUnique({ where: { id } });
  if (!comment) return NextResponse.json({ error: 'Komentar tidak ditemukan' }, { status: 404 });

  if (comment.userId !== user.id && !hasPermission(user.role, ['ADMIN', 'EDITOR'])) {
    return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
  }

  await prisma.comment.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
