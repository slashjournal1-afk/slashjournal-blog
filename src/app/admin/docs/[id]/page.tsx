import React from 'react';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { notFound, redirect } from 'next/navigation';
import { SlashEditor } from '@/components/editor/SlashEditor';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditArticlePage({ params }: PageProps) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user || user.role === 'READER') {
    redirect('/admin');
  }

  const article = await prisma.article.findUnique({
    where: { id },
    include: {
      tags: {
        include: { tag: true },
      },
    },
  });

  if (!article) {
    notFound();
  }

  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: 'asc' },
    select: { id: true, name: true, isIndexable: true },
  });

  const seriesList = await prisma.series.findMany({
    where: { isPublished: true },
    orderBy: { sortOrder: 'asc' },
    select: { id: true, title: true },
  });

  return (
    <div className="space-y-6">
      <SlashEditor
        initialArticle={{
          id: article.id,
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt,
          contentMarkdown: article.contentMarkdown,
          categoryId: article.categoryId,
          seriesId: article.seriesId,
          seriesOrder: article.seriesOrder,
          coverImageUrl: article.coverImageUrl,
          coverImageSourceType: article.coverImageSourceType,
          isSponsored: article.isSponsored,
          sponsorName: article.sponsorName,
          sponsorUrl: article.sponsorUrl,
          status: article.status,
          tags: article.tags,
        }}
        categories={categories}
        seriesList={seriesList}
        userRole={user.role}
      />
    </div>
  );
}
