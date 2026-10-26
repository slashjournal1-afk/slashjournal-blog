import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { jsonError } from '@/lib/api-errors';
import { publicArticleWhere } from '@/lib/visibility';
import { feedbackSchema } from '@/lib/validation';
import { rateLimit, requestKey } from '@/lib/rate-limit';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const articleId = searchParams.get('articleId');
    if (!articleId) {
      return NextResponse.json({ error: 'articleId diperlukan' }, { status: 400 });
    }

    const feedbacks = await prisma.articleFeedback.groupBy({
      by: ['reaction'],
      where: { articleId, reaction: { not: null } },
      _count: { _all: true },
    });

    const counts: Record<string, number> = {
      helpful: 0,
      insight: 0,
      solid: 0,
      practical: 0,
      'deep-dive': 0,
    };

    for (const item of feedbacks) {
      if (item.reaction && item.reaction in counts) {
        counts[item.reaction] = item._count._all;
      }
    }

    return NextResponse.json({ counts });
  } catch (err: unknown) {
    return jsonError('Gagal mengambil data reaksi', 500, err);
  }
}

export async function POST(req: Request) {
  if (!rateLimit(requestKey(req, 'feedback'), 20, 60_000)) return NextResponse.json({ error: 'Terlalu banyak feedback' }, { status: 429 });
  try {
    const parsed = feedbackSchema.safeParse(await req.json());
    if (!parsed.success) return jsonError(parsed.error.issues[0]?.message || 'Feedback tidak valid', 400);
    const { articleId, isHelpful, reaction } = parsed.data;
    const user = await getCurrentUser();

    const article = await prisma.article.findFirst({ where: { id: articleId, ...publicArticleWhere }, select: { id: true } });
    if (!article) return NextResponse.json({ error: 'Artikel tidak ditemukan' }, { status: 404 });

    await prisma.$transaction(async (tx) => {
      await tx.articleFeedback.create({
        data: { articleId, isHelpful: isHelpful ?? true, reaction: reaction || null, userId: user?.id || null },
      });
      if (isHelpful !== undefined) {
        await tx.article.update({
          where: { id: articleId },
          data: isHelpful ? { helpfulVotes: { increment: 1 } } : { unhelpfulVotes: { increment: 1 } },
        });
      }
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    return jsonError('Gagal merekam umpan balik', 500, err);
  }
}

export async function DELETE(req: Request) {
  if (!rateLimit(requestKey(req, 'feedback_del'), 20, 60_000)) {
    return NextResponse.json({ error: 'Terlalu banyak permintaan' }, { status: 429 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const articleId = searchParams.get('articleId');
    const reaction = searchParams.get('reaction');

    if (!articleId) {
      return NextResponse.json({ error: 'articleId diperlukan' }, { status: 400 });
    }

    const user = await getCurrentUser();

    await prisma.$transaction(async (tx) => {
      const feedback = await tx.articleFeedback.findFirst({
        where: {
          articleId,
          ...(reaction ? { reaction } : {}),
          ...(user ? { userId: user.id } : {}),
        },
        orderBy: { createdAt: 'desc' },
      });

      if (feedback) {
        await tx.articleFeedback.delete({ where: { id: feedback.id } });
        if (feedback.isHelpful) {
          const article = await tx.article.findUnique({
            where: { id: articleId },
            select: { helpfulVotes: true },
          });
          if (article && article.helpfulVotes > 0) {
            await tx.article.update({
              where: { id: articleId },
              data: { helpfulVotes: { decrement: 1 } },
            });
          }
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    return jsonError('Gagal membatalkan umpan balik', 500, err);
  }
}
