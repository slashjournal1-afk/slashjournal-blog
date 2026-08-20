import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { calculateReadingTime, slugify } from '@/lib/utils';
import { recordAuditLog } from '@/lib/audit';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const categorySlug = searchParams.get('category');
  const seriesSlug = searchParams.get('series');

  const where: any = {};
  if (status) where.status = status;
  if (categorySlug) where.category = { slug: categorySlug };
  if (seriesSlug) where.series = { slug: seriesSlug };

  const articles = await prisma.article.findMany({
    where,
    include: {
      category: true,
      series: true,
      author: true,
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

    return NextResponse.json({ article }, { status: 201 });
  } catch (error: any) {
    console.error('Failed to create article:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}
