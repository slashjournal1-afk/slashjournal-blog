import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { jsonError } from '@/lib/api-errors';
import { publicArticleWhere } from '@/lib/visibility';
import { feedbackSchema } from '@/lib/validation';
import { rateLimit, requestKey } from '@/lib/rate-limit';

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
