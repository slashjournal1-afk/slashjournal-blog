import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { calculateReadingTime, slugify } from '@/lib/utils';
import { recordAuditLog } from '@/lib/audit';
import { revalidatePath } from 'next/cache';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = await prisma.article.findUnique({
    where: { id },
    include: {
      category: true,
      series: true,
      author: true,
      tags: { include: { tag: true } },
      revisions: { orderBy: { createdAt: 'desc' }, take: 10 },
    },
  });

  if (!article) return NextResponse.json({ error: 'Article not found' }, { status: 404 });
  return NextResponse.json({ article });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user || !['ADMIN', 'EDITOR', 'AUTHOR'].includes(user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const existing = await prisma.article.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: 'Article not found' }, { status: 404 });

  // Authors can only edit their own drafts
  if (user.role === 'AUTHOR' && existing.authorId !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const {
      title,
      slug,
      excerpt,
      contentMarkdown,
      categoryId,
      newCategoryName,
      seriesId,
      seriesOrder,
      coverImageUrl,
      coverImageSourceType,
      isSponsored,
      sponsorName,
      sponsorUrl,
      status,
      tags,
      reviewNote,
      revisionNote,
    } = body;

    let finalCategoryId = categoryId;
    if (!finalCategoryId && newCategoryName) {
      const catSlug = slugify(newCategoryName);
      const newCat = await prisma.category.upsert({
        where: { slug: catSlug },
        update: {},
        create: {
          name: newCategoryName.trim(),
          slug: catSlug,
          icon: 'Layers',
        },
      });
      finalCategoryId = newCat.id;
    }

    // Snapshot revision if content changed
    if (contentMarkdown && contentMarkdown !== existing.contentMarkdown) {
      await prisma.articleRevision.create({
        data: {
          articleId: id,
          title: existing.title,
          contentMarkdown: existing.contentMarkdown,
          note: revisionNote || 'Auto snapshot before update',
        },
      });
    }

    const readingTime = contentMarkdown ? calculateReadingTime(contentMarkdown) : existing.readingTime;

    const updated = await prisma.article.update({
      where: { id },
      data: {
        title: title !== undefined ? title : existing.title,
        slug: slug !== undefined ? slugify(slug) : existing.slug,
        excerpt: excerpt !== undefined ? excerpt : existing.excerpt,
        contentMarkdown: contentMarkdown !== undefined ? contentMarkdown : existing.contentMarkdown,
        categoryId: finalCategoryId || existing.categoryId,
        seriesId: seriesId !== undefined ? seriesId : existing.seriesId,
        seriesOrder: seriesOrder !== undefined ? parseInt(seriesOrder) : existing.seriesOrder,
        coverImageUrl: coverImageUrl !== undefined ? coverImageUrl : existing.coverImageUrl,
        coverImageSourceType: coverImageSourceType !== undefined ? coverImageSourceType : existing.coverImageSourceType,
        isSponsored: isSponsored !== undefined ? Boolean(isSponsored) : existing.isSponsored,
        sponsorName: sponsorName !== undefined ? sponsorName : existing.sponsorName,
        sponsorUrl: sponsorUrl !== undefined ? sponsorUrl : existing.sponsorUrl,
        status: status || existing.status,
        readingTime,
        reviewerId: user.role === 'EDITOR' || user.role === 'ADMIN' ? user.id : existing.reviewerId,
        reviewNote: reviewNote !== undefined ? reviewNote : existing.reviewNote,
        publishedAt: status === 'PUBLISHED' && !existing.publishedAt ? new Date() : existing.publishedAt,
      },
    });

    // Handle tags update if provided
    if (Array.isArray(tags)) {
      await prisma.articleTag.deleteMany({ where: { articleId: id } });

      for (const tagName of tags) {
        if (!tagName || !tagName.trim()) continue;
        const tagSlug = slugify(tagName.trim());
        const tag = await prisma.tag.upsert({
          where: { slug: tagSlug },
          update: {},
          create: { name: tagName.trim(), slug: tagSlug },
        });

        await prisma.articleTag.create({
          data: { articleId: id, tagId: tag.id },
        }).catch(() => {});
      }
    }

    await recordAuditLog({
      actorEmail: user.email,
      action: 'ARTICLE_UPDATE',
      details: `Mengubah artikel "${updated.title}" (Status: ${updated.status})`,
      userId: user.id,
    });

    revalidatePath('/');
    revalidatePath('/category/[slug]', 'page');
    revalidatePath('/series/[slug]', 'page');
    revalidatePath(`/${updated.slug}`);

    return NextResponse.json({ article: updated });
  } catch (error: any) {
    console.error('Failed to update article:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user || !['ADMIN', 'EDITOR'].includes(user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const deleted = await prisma.article.delete({ where: { id } });

    await recordAuditLog({
      actorEmail: user.email,
      action: 'ARTICLE_DELETE',
      details: `Menghapus artikel "${deleted.title}"`,
      userId: user.id,
    });

    revalidatePath('/');
    revalidatePath('/category/[slug]', 'page');
    revalidatePath('/series/[slug]', 'page');
    revalidatePath(`/${deleted.slug}`);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Failed to delete article:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}
