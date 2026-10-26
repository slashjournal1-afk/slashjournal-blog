import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { canWriteGlossary } from '@/lib/article-permissions';
import { revalidatePath, revalidateTag } from 'next/cache';
import { slugify } from '@/lib/utils';
import { jsonError } from '@/lib/api-errors';

export async function GET() {
  const terms = await prisma.glossaryTerm.findMany({
    orderBy: { term: 'asc' },
  });
  return NextResponse.json({ terms });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!canWriteGlossary(user) || !user) {
    return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
  }

  try {
    const { term, category, shortDef, definition } = await req.json();

    if ([term, category, shortDef, definition].some((value) => typeof value !== 'string' || !value.trim())) {
      return NextResponse.json({ error: 'Semua kolom wajib diisi' }, { status: 400 });
    }

    const termSlug = slugify(term);
    if (!termSlug) return NextResponse.json({ error: 'Slug istilah tidak valid' }, { status: 400 });

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

    revalidatePath('/glossary');
    revalidatePath(`/glossary/${created.slug}`);
    revalidateTag('wikilinks', { expire: 0 });
    return NextResponse.json({ success: true, term: created });
  } catch (err: unknown) {
    return jsonError('Gagal menyimpan istilah glosarium', 500, err);
  }
}
