import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { calculateReadingTime, slugify } from '@/lib/utils';
import { recordAuditLog } from '@/lib/audit';
import { revalidatePath } from 'next/cache';
import { jsonError } from '@/lib/api-errors';
import { publicArticleWhere } from '@/lib/visibility';
import { registerArticleRevenueIdentity } from '@/lib/revenue';
import { articleUpdateSchema } from '@/lib/validation';

const EDITORIAL_ROLES = new Set(['ADMIN', 'EDITOR']);

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  const canReadEditorial = user && ['ADMIN', 'EDITOR', 'AUTHOR'].includes(user.role);
  const article = await prisma.article.findUnique({
    where: { id },
    include: {
      category: true,
      series: true,
      author: { select: { id: true, displayName: true, avatarUrl: true } },
      tags: { include: { tag: true } },
      sources: { orderBy: { sortOrder: 'asc' } },
      revisions: { orderBy: { createdAt: 'desc' }, take: 10 },
    },
  });

  if (!article) return NextResponse.json({ error: 'Article not found' }, { status: 404 });
  if (!canReadEditorial && (article.status !== 'PUBLISHED' || !article.isIndexable || !article.category.isIndexable)) {
    return NextResponse.json({ error: 'Article not found' }, { status: 404 });
  }
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

  let rawBody: unknown;
  try {
    rawBody = await req.json();
  } catch {
    return NextResponse.json({ error: 'Body permintaan tidak valid' }, { status: 400 });
  }

  const parsed = articleUpdateSchema.safeParse(rawBody);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message || 'Data artikel tidak valid', 400);
  }
  const body = parsed.data;

  const isEditorial = EDITORIAL_ROLES.has(user.role);

  // Editorial workflow guard: only ADMIN/EDITOR control status transitions,
  // except an author moving their own article between DRAFT and IN_REVIEW.
  if (body.status !== undefined && body.status !== existing.status && !isEditorial) {
    const authorDraftFlow =
      existing.authorId === user.id &&
      ['DRAFT', 'IN_REVIEW'].includes(existing.status) &&
      ['DRAFT', 'IN_REVIEW'].includes(body.status);
    if (!authorDraftFlow) {
      return NextResponse.json(
        { error: 'Hanya admin atau editor yang dapat mengubah status artikel ini' },
        { status: 403 }
      );
    }
  }

  try {
    let finalCategoryId = body.categoryId;
    if (!finalCategoryId && body.newCategoryName) {
      const catSlug = slugify(body.newCategoryName);
      const newCat = await prisma.category.upsert({
        where: { slug: catSlug },
        update: {},
        create: {
          name: body.newCategoryName.trim(),
          slug: catSlug,
          icon: 'Layers',
        },
      });
      finalCategoryId = newCat.id;
    }

    // Snapshot revision if content changed
    if (body.contentMarkdown !== undefined && body.contentMarkdown !== existing.contentMarkdown) {
      await prisma.articleRevision.create({
        data: {
          articleId: id,
          title: existing.title,
          contentMarkdown: existing.contentMarkdown,
          note: body.revisionNote || 'Auto snapshot before update',
        },
      });
    }

    const readingTime = body.contentMarkdown !== undefined ? calculateReadingTime(body.contentMarkdown) : existing.readingTime;
    const finalStatus = body.status ?? existing.status;

    const updated = await prisma.article.update({
      where: { id },
      data: {
        title: body.title !== undefined ? body.title : existing.title,
        slug: body.slug !== undefined ? slugify(body.slug) : existing.slug,
        excerpt: body.excerpt !== undefined ? body.excerpt : existing.excerpt,
        contentMarkdown: body.contentMarkdown !== undefined ? body.contentMarkdown : existing.contentMarkdown,
        categoryId: finalCategoryId || existing.categoryId,
        seriesId: body.seriesId !== undefined ? body.seriesId : existing.seriesId,
        seriesOrder: body.seriesOrder !== undefined ? body.seriesOrder : existing.seriesOrder,
        coverImageUrl: body.coverImageUrl !== undefined ? body.coverImageUrl : existing.coverImageUrl,
        coverImageSourceType: body.coverImageSourceType !== undefined ? body.coverImageSourceType : existing.coverImageSourceType,
        isSponsored: isEditorial && body.isSponsored !== undefined ? Boolean(body.isSponsored) : existing.isSponsored,
        sponsorName: isEditorial && body.sponsorName !== undefined ? body.sponsorName : existing.sponsorName,
        sponsorUrl: isEditorial && body.sponsorUrl !== undefined ? body.sponsorUrl : existing.sponsorUrl,
        status: finalStatus,
        readingTime,
        reviewerId: isEditorial ? user.id : existing.reviewerId,
        reviewNote: body.reviewNote !== undefined ? body.reviewNote : existing.reviewNote,
        publishedAt: finalStatus === 'PUBLISHED' && !existing.publishedAt ? new Date() : existing.publishedAt,
      },
    });
    await registerArticleRevenueIdentity(updated.id, updated.authorId, updated.slug, updated.title);

    // Handle tags update if provided
    if (Array.isArray(body.tags)) {
      await prisma.articleTag.deleteMany({ where: { articleId: id } });

      for (const tagName of body.tags) {
        if (!tagName.trim()) continue;
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

    // Handle sources update if provided (replace whole list)
    if (Array.isArray(body.sources)) {
      await prisma.articleSource.deleteMany({ where: { articleId: id } });

      const validSources = body.sources.map((s, i) => ({
        articleId: id,
        label: s.label,
        url: s.url ?? null,
        sortOrder: i,
      }));

      if (validSources.length > 0) {
        await prisma.articleSource.createMany({ data: validSources });
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
  } catch (error: unknown) {
    console.error('Failed to update article:', error);
    return jsonError('Gagal memperbarui artikel', 500, error);
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
  } catch (error: unknown) {
    console.error('Failed to delete article:', error);
    return jsonError('Gagal menghapus artikel', 500, error);
  }
}
