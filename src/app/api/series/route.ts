import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { slugify } from '@/lib/utils';
import { recordAuditLog } from '@/lib/audit';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const series = await prisma.series.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      include: {
        _count: {
          select: {
            articles: { where: { status: 'PUBLISHED' } },
          },
        },
      },
    });

    return NextResponse.json({ series });
  } catch (error: any) {
    console.error('Failed to fetch series:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || !['ADMIN', 'EDITOR', 'AUTHOR'].includes(user.role)) {
    return NextResponse.json(
      { error: 'Unauthorized: Hanya penulis atau editor yang dapat membuat seri panduan' },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const {
      title,
      slug,
      description,
      coverImageUrl,
      isPublished = true,
      sortOrder = 0,
    } = body;

    if (!title || typeof title !== 'string' || !title.trim()) {
      return NextResponse.json({ error: 'Judul seri panduan wajib diisi' }, { status: 400 });
    }

    const trimmedTitle = title.trim();
    const generatedSlug = (slug && typeof slug === 'string' && slug.trim())
      ? slugify(slug.trim())
      : slugify(trimmedTitle);

    if (!generatedSlug) {
      return NextResponse.json({ error: 'Slug URL seri tidak valid' }, { status: 400 });
    }

    // Check if series with same slug already exists
    const existing = await prisma.series.findUnique({
      where: { slug: generatedSlug },
    });

    if (existing) {
      return NextResponse.json(
        { series: existing, message: 'Seri panduan dengan judul/slug tersebut sudah ada' },
        { status: 200 }
      );
    }

    const newSeries = await prisma.series.create({
      data: {
        title: trimmedTitle,
        slug: generatedSlug,
        description: description && typeof description === 'string' ? description.trim() : null,
        coverImageUrl: coverImageUrl && typeof coverImageUrl === 'string' ? coverImageUrl.trim() : null,
        isPublished: Boolean(isPublished),
        sortOrder: Number(sortOrder) || 0,
      },
    });

    await recordAuditLog({
      actorEmail: user.email,
      action: 'SERIES_CREATE',
      details: `Membuat seri panduan baru "${newSeries.title}" (${newSeries.slug})`,
      userId: user.id,
    });

    revalidatePath('/series');
    revalidatePath(`/series/${newSeries.slug}`);
    revalidatePath('/dashboard/creator');

    return NextResponse.json(
      { series: newSeries, message: 'Seri panduan baru berhasil dibuat!' },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Failed to create series:', error);
    return NextResponse.json({ error: error.message || 'Gagal membuat seri panduan baru' }, { status: 500 });
  }
}
