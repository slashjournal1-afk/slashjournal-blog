import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { slugify } from '@/lib/utils';
import { recordAuditLog } from '@/lib/audit';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      include: {
        _count: {
          select: {
            articles: { where: { status: 'PUBLISHED' } },
          },
        },
      },
    });

    return NextResponse.json({ categories });
  } catch (error: any) {
    console.error('Failed to fetch categories:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || !['ADMIN', 'EDITOR', 'AUTHOR'].includes(user.role)) {
    return NextResponse.json({ error: 'Unauthorized: Hanya penulis atau editor yang dapat membuat kategori' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { name, description, icon = 'Layers', isIndexable = true } = body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ error: 'Nama kategori wajib diisi' }, { status: 400 });
    }

    const trimmedName = name.trim();
    const generatedSlug = slugify(trimmedName);

    // Check if category already exists
    const existing = await prisma.category.findUnique({
      where: { slug: generatedSlug },
    });

    if (existing) {
      return NextResponse.json(
        { category: existing, message: 'Kategori dengan nama tersebut sudah ada' },
        { status: 200 }
      );
    }

    const category = await prisma.category.create({
      data: {
        name: trimmedName,
        slug: generatedSlug,
        description: description ? description.trim() : null,
        icon: icon || 'Layers',
        isIndexable: Boolean(isIndexable),
      },
    });

    await recordAuditLog({
      actorEmail: user.email,
      action: 'CATEGORY_CREATE',
      details: `Membuat kategori baru "${category.name}" (${category.slug})`,
      userId: user.id,
    });

    return NextResponse.json({ category, message: 'Kategori baru berhasil dibuat!' }, { status: 201 });
  } catch (error: any) {
    console.error('Failed to create category:', error);
    return NextResponse.json({ error: error.message || 'Gagal membuat kategori baru' }, { status: 500 });
  }
}
