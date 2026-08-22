import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser, hasPermission } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { jsonError } from '@/lib/api-errors';
import { publicArticleWhere } from '@/lib/visibility';
import { commentSchema } from '@/lib/validation';
import { rateLimit, requestKey } from '@/lib/rate-limit';

export async function GET(req: Request) {
  const articleId = new URL(req.url).searchParams.get('articleId');
  if (!articleId) return NextResponse.json({ comments: [] }, { status: 400 });

  const comments = await prisma.comment.findMany({
    where: { article: { ...publicArticleWhere }, articleId },
    orderBy: { createdAt: 'desc' },
    take: 20,
    include: {
      user: { select: { id: true, displayName: true, avatarUrl: true, role: true } },
    },
  });

  return NextResponse.json({ comments });
}

export async function POST(req: Request) {
  if (!rateLimit(requestKey(req, 'comments'), 5, 60_000)) return NextResponse.json({ error: 'Terlalu banyak komentar' }, { status: 429 });
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Silakan login terlebih dahulu' }, { status: 401 });

  try {
    const parsed = commentSchema.safeParse(await req.json());
    if (!parsed.success) return jsonError(parsed.error.issues[0]?.message || 'Komentar tidak valid', 400);
    const { articleId, content } = parsed.data;

    const article = await prisma.article.findFirst({ where: { id: articleId, ...publicArticleWhere }, select: { slug: true } });
    if (!article) return NextResponse.json({ error: 'Artikel tidak ditemukan' }, { status: 404 });

    const comment = await prisma.comment.create({
      data: {
        articleId,
        content: content.trim(),
        userId: user.id,
      },
      include: {
        article: { select: { slug: true } },
        user: {
          select: { id: true, displayName: true, avatarUrl: true, role: true },
        },
      },
    });

    revalidatePath(`/${comment.article.slug}`);

    const { article: _article, ...publicComment } = comment;
    return NextResponse.json({ success: true, comment: publicComment });
  } catch (err: unknown) {
    return jsonError('Gagal mengirim komentar', 500, err);
  }
}

export async function DELETE(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Akses ditolak' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID komentar diperlukan' }, { status: 400 });

  const comment = await prisma.comment.findUnique({
    where: { id },
    include: { article: { select: { slug: true } } },
  });
  if (!comment) return NextResponse.json({ error: 'Komentar tidak ditemukan' }, { status: 404 });

  if (comment.userId !== user.id && !hasPermission(user.role, ['ADMIN', 'EDITOR'])) {
    return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
  }

  await prisma.comment.delete({ where: { id } });
  revalidatePath(`/${comment.article.slug}`);
  return NextResponse.json({ success: true });
}
