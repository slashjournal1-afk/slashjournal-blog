import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser, hasPermission } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { jsonError } from '@/lib/api-errors';

const VALID_STATUSES = ['APPROVED', 'REJECTED', 'SPAM', 'PENDING'] as const;
type CommentModerationStatus = (typeof VALID_STATUSES)[number];

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user.role, ['ADMIN', 'EDITOR'])) {
    return NextResponse.json(
      { error: 'Akses ditolak: Hanya Admin dan Editor yang dapat memoderasi komentar' },
      { status: 403 },
    );
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: 'ID komentar tidak valid' }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { status, blockReader } = body as {
      status?: CommentModerationStatus;
      blockReader?: boolean;
    };

    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: `Status tidak valid. Gunakan salah satu dari: ${VALID_STATUSES.join(', ')}` },
        { status: 400 },
      );
    }

    const existingComment = await prisma.comment.findUnique({
      where: { id },
      include: {
        article: { select: { slug: true } },
        user: { select: { id: true, displayName: true, email: true } },
      },
    });

    if (!existingComment) {
      return NextResponse.json({ error: 'Komentar tidak ditemukan' }, { status: 404 });
    }

    const updatedComment = await prisma.$transaction(async (tx) => {
      if (blockReader && existingComment.userId) {
        await tx.user.update({
          where: { id: existingComment.userId },
          data: { isBlocked: true },
        });
      }

      return tx.comment.update({
        where: { id },
        data: { status },
        include: {
          article: { select: { slug: true, title: true } },
          user: { select: { id: true, displayName: true, email: true, isBlocked: true } },
        },
      });
    });

    if (updatedComment.article?.slug) {
      revalidatePath(`/${updatedComment.article.slug}`);
    }

    return NextResponse.json({
      success: true,
      comment: updatedComment,
    });
  } catch (error) {
    return jsonError('Gagal memoderasi komentar', 500, error);
  }
}
