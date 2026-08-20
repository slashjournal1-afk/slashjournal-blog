import React from 'react';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { ReviewQueueClient } from '@/components/admin/ReviewQueueClient';

export const dynamic = 'force-dynamic';

export default async function ReviewQueuePage() {
  const user = await getCurrentUser();
  if (!user || (user.role !== 'ADMIN' && user.role !== 'EDITOR')) {
    redirect('/admin');
  }

  const reviewArticles = await prisma.article.findMany({
    where: { status: 'IN_REVIEW' },
    include: {
      category: true,
      author: { select: { id: true, displayName: true, email: true } },
    },
    orderBy: { updatedAt: 'desc' },
  });

  return (
    <div className="space-y-8">
      <div className="pb-6 border-b border-[#ececee] dark:border-[#27272a]">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#09090b] dark:text-white tracking-tight">
          Antrean Review Naskah Artikel
        </h1>
        <p className="text-xs sm:text-sm text-[#52525b] dark:text-[#a1a1aa] mt-1">
          Draf artikel teknis yang diajukan oleh Author untuk diverifikasi dan diterbitkan oleh Editor.
        </p>
      </div>

      <ReviewQueueClient initialArticles={reviewArticles as any} />
    </div>
  );
}
