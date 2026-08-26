import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { calculateReadingTime, slugify } from '@/lib/utils';
import { recordAuditLog } from '@/lib/audit';
import { revalidatePath } from 'next/cache';
import { jsonError } from '@/lib/api-errors';
import { publicArticleWhere } from '@/lib/visibility';
import { registerArticleRevenueIdentity } from '@/lib/revenue';
import { articleCreateSchema } from '@/lib/validation';

const EDITORIAL_ROLES = new Set(['ADMIN', 'EDITOR']);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const categorySlug = searchParams.get('category');
  const seriesSlug = searchParams.get('series');

  const user = await getCurrentUser();
  const canReadEditorial = user && ['ADMIN', 'EDITOR', 'AUTHOR'].includes(user.role);
  const where = canReadEditorial && status
    ? { status, ...(categorySlug ? { category: { slug: categorySlug } } : {}), ...(seriesSlug ? { series: { slug: seriesSlug } } : {}) }
    : { ...publicArticleWhere, ...(categorySlug ? { category: { slug: categorySlug } } : {}), ...(seriesSlug ? { series: { slug: seriesSlug } } : {}) };

  const articles = await prisma.article.findMany({
    where,
    include: {
      category: true,
      series: true,
      author: { select: { id: true, displayName: true, avatarUrl: true } },
      tags: { include: { tag: true } },
      _count: { select: { comments: true, bookmarks: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ articles });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || !['ADMIN', 'EDITOR', 'AUTHOR'].includes(user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  let rawBody: unknown;
  try {
    rawBody = await req.json();
  } catch {
    return NextResponse.json({ error: 'Body permintaan tidak valid' }, { status: 400 });
  }

  const parsed = articleCreateSchema.safeParse(rawBody);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message || 'Data artikel tidak valid', 400);
  }
  const body = parsed.data;

  const isEditorial = EDITORIAL_ROLES.has(user.role);
  const status = body.status ?? 'DRAFT';
  if (status === 'PUBLISHED' && !isEditorial) {
    return NextResponse.json(
      { error: 'Hanya admin atau editor yang dapat mempublikasikan artikel langsung' },
      { status: 403 }
    );
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

    if (!finalCategoryId) {
      return NextResponse.json({ error: 'Title, contentMarkdown, dan kategori wajib diisi' }, { status: 400 });
    }

    const generatedSlug = body.slug ? slugify(body.slug) : slugify(body.title);
    if (!generatedSlug) {
      return NextResponse.json({ error: 'Slug tidak dapat dibuat dari judul' }, { status: 400 });
    }
    const readingTime = calculateReadingTime(body.contentMarkdown);

    const validSources = (body.sources ?? []).map((s, i) => ({
      label: s.label,
      url: s.url ?? null,
      sortOrder: i,
    }));

    const article = await prisma.article.create({
      data: {
        title: body.title,
        slug: generatedSlug,
        excerpt: body.excerpt || body.title,
        contentMarkdown: body.contentMarkdown,
        categoryId: finalCategoryId,
        seriesId: body.seriesId ?? null,
        seriesOrder: body.seriesOrder ?? null,
        coverImageUrl: body.coverImageUrl ?? null,
        coverImageSourceType: body.coverImageSourceType ?? null,
        isSponsored: isEditorial ? Boolean(body.isSponsored) : false,
        sponsorName: isEditorial ? body.sponsorName ?? null : null,
        sponsorUrl: isEditorial ? body.sponsorUrl ?? null : null,
        status,
        readingTime,
        authorId: user.id,
        publishedAt: status === 'PUBLISHED' ? new Date() : null,
      },
    });
    if (validSources.length > 0) {
      await prisma.articleSource.createMany({
        data: validSources.map((s) => ({ ...s, articleId: article.id })),
      });
    }
    await registerArticleRevenueIdentity(article.id, user.id, article.slug, article.title);

    // Handle tags
    if (body.tags && body.tags.length > 0) {
      for (const tagName of body.tags) {
        const tagSlug = slugify(tagName);
        const tag = await prisma.tag.upsert({
          where: { slug: tagSlug },
          update: {},
          create: { name: tagName, slug: tagSlug },
        });

        await prisma.articleTag.create({
          data: { articleId: article.id, tagId: tag.id },
        }).catch(() => {});
      }
    }

    // Record audit log (S3)
    await recordAuditLog({
      actorEmail: user.email,
      action: 'ARTICLE_CREATE',
      details: `Membuat artikel "${article.title}" (${article.status})`,
      userId: user.id,
    });

    revalidatePath('/');
    revalidatePath('/category/[slug]', 'page');
    revalidatePath('/series/[slug]', 'page');
    if (article.status === 'PUBLISHED') revalidatePath(`/${article.slug}`);

    return NextResponse.json({ article }, { status: 201 });
  } catch (error: unknown) {
    console.error('Failed to create article:', error);
    return jsonError('Gagal membuat artikel', 500, error);
  }
}
