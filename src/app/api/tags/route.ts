import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { slugify } from '@/lib/utils';
import { jsonError } from '@/lib/api-errors';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || '';

    const where: Record<string, unknown> = {
      articles: { some: { article: { status: 'PUBLISHED', isIndexable: true, category: { isIndexable: true } } } },
    };
    if (query) {
      where.name = { contains: query, mode: 'insensitive' };
    }

    const tags = await prisma.tag.findMany({
          where: where as never,
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: {
            articles: true,
          },
        },
      },
      take: 50,
    });

    return NextResponse.json({ tags });
  } catch (error: unknown) {
    console.error('Failed to fetch tags:', error);
    return jsonError('Gagal mengambil tag', 500, error);
  }
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || !['ADMIN', 'EDITOR', 'AUTHOR'].includes(user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { name } = body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ error: 'Nama tag / kata kunci wajib diisi' }, { status: 400 });
    }

    const trimmedName = name.trim();
    const generatedSlug = slugify(trimmedName);

    const tag = await prisma.tag.upsert({
      where: { slug: generatedSlug },
      update: {},
      create: {
        name: trimmedName,
        slug: generatedSlug,
      },
    });

    return NextResponse.json({ tag }, { status: 201 });
  } catch (error: unknown) {
    console.error('Failed to create tag:', error);
    return jsonError('Gagal membuat tag', 500, error);
  }
}
