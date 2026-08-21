import React from 'react';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { SlashEditor } from '@/components/editor/SlashEditor';

export const dynamic = 'force-dynamic';

export default async function NewArticlePage() {
  const user = await getCurrentUser();
  if (!user || user.role === 'READER') {
    redirect('/admin');
  }

  const [categories, seriesList] = await Promise.all([
    prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
      select: { id: true, name: true, isIndexable: true },
    }),
    prisma.series.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: 'asc' },
      select: { id: true, title: true },
    }),
  ]);

  return (
    <div className="space-y-6">
      <SlashEditor
        categories={categories}
        seriesList={seriesList}
        userRole={user.role}
      />
    </div>
  );
}
