import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser, hasPermission } from '@/lib/auth';
import { slugify } from '@/lib/utils';

export async function GET() {
  const terms = await prisma.glossaryTerm.findMany({
    orderBy: { term: 'asc' },
  });
  return NextResponse.json({ terms });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user.role, ['ADMIN', 'EDITOR', 'AUTHOR'])) {
    return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
  }

  try {
    const { term, category, shortDef, definition } = await req.json();

    if (!term || !category || !shortDef || !definition) {
      return NextResponse.json({ error: 'Semua kolom wajib diisi' }, { status: 400 });
    }

    const termSlug = slugify(term);

    const created = await prisma.glossaryTerm.upsert({
      where: { slug: termSlug },
      update: { category, shortDef, definition },
      create: {
        term,
        slug: termSlug,
        category,
        shortDef,
        definition,
        authorId: user.id,
      },
    });

    return NextResponse.json({ success: true, term: created });
  } catch (err: any) {
    return NextResponse.json({ error: 'Gagal menyimpan istilah glosarium' }, { status: 500 });
  }
}
