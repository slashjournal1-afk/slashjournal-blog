import React from 'react';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { CommentModerationList } from '@/components/admin/CommentModerationList';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Moderasi Komentar — SlashJournal Admin',
  robots: { index: false, follow: false },
};

export default async function AdminCommentsPage() {
  const user = await getCurrentUser();
  if (!user || (user.role !== 'ADMIN' && user.role !== 'EDITOR')) {
    redirect('/admin');
  }

  const rawComments = await prisma.comment.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: {
      user: {
        select: {
          id: true,
          email: true,
          displayName: true,
          isBlocked: true,
        },
      },
      article: {
        select: {
          id: true,
          title: true,
          slug: true,
        },
      },
    },
  });

  const comments = rawComments.map((c) => ({
    id: c.id,
    content: c.content,
    status: c.status,
    createdAt: c.createdAt,
    user: c.user,
    reader: c.user,
    article: c.article,
  }));

  return (
    <div className="space-y-8">
      <div className="pb-6 border-b border-[#ececee] dark:border-[#27272a]">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#09090b] dark:text-white tracking-tight">
          Moderasi Tanggapan Pembaca
        </h1>
        <p className="text-xs sm:text-sm text-[#52525b] dark:text-[#a1a1aa] mt-1">
          Tinjau komentar pembaca sebelum dipublikasikan untuk mencegah spam, ujaran kebencian, atau pelanggaran kebijakan konten Google AdSense.
        </p>
      </div>

      <CommentModerationList initialComments={comments} />
    </div>
  );
}
