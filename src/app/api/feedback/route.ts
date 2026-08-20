import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const articleId = body.articleId || body.docId;
    const { isHelpful, reaction } = body;
    const user = await getCurrentUser();

    await prisma.articleFeedback.create({
      data: {
        articleId,
        isHelpful: !!isHelpful,
        reaction: reaction || null,
        userId: user ? user.id : null,
      },
    });

    if (isHelpful !== undefined) {
      await prisma.article.update({
        where: { id: articleId },
        data: {
          helpfulVotes: isHelpful ? { increment: 1 } : undefined,
          unhelpfulVotes: !isHelpful ? { increment: 1 } : undefined,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: 'Gagal merekam umpan balik' }, { status: 500 });
  }
}
