import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { calculateReadingTime, slugify } from '@/lib/utils';
import { recordAuditLog } from '@/lib/audit';
import { revalidatePath } from 'next/cache';
import { jsonError } from '@/lib/api-errors';
import { publicArticleWhere } from '@/lib/visibility';

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
      status = 'DRAFT',
      tags = [],
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

    if (!title || !contentMarkdown || !finalCategoryId) {
      return NextResponse.json({ error: 'Title, contentMarkdown, dan kategori wajib diisi' }, { status: 400 });
    }

    const generatedSlug = slug ? slugify(slug) : slugify(title);
    const readingTime = calculateReadingTime(contentMarkdown);

    const article = await prisma.article.create({
      data: {
        title,
        slug: generatedSlug,
        excerpt: excerpt || title,
        contentMarkdown,
        categoryId: finalCategoryId,
        seriesId: seriesId || null,
        seriesOrder: seriesOrder ? parseInt(seriesOrder) : null,
        coverImageUrl: coverImageUrl || null,
        coverImageSourceType: coverImageSourceType || null,
        isSponsored: Boolean(isSponsored),
        sponsorName: sponsorName || null,
        sponsorUrl: sponsorUrl || null,
        status: status || 'DRAFT',
        readingTime,
        authorId: user.id,
        publishedAt: status === 'PUBLISHED' ? new Date() : null,
      },
    });

    // Handle tags
    if (tags && tags.length > 0) {
      for (const tagName of tags) {
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
      details: `Membuat artikel "${title}" (${article.status})`,
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
