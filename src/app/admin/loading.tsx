import React from 'react';
import { Skeleton, SkeletonCard, SkeletonArticleRow } from '@/components/ui/Skeleton';

export default function AdminLoading() {
  return (
    <div className="space-y-10 animate-in fade-in duration-200">
      <div className="pb-6 border-b border-[var(--border-color)] space-y-2">
        <Skeleton className="h-5 w-32 rounded-full" />
        <Skeleton className="h-8 w-64 rounded-[12px]" />
        <Skeleton className="h-4 w-96 rounded-[8px]" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>

      <div className="rounded-[28px] border border-[var(--border-color)] bg-[var(--bg-card)] p-6 space-y-4 shadow-xs">
        <Skeleton className="h-6 w-48 rounded-[8px]" />
        <SkeletonArticleRow />
        <SkeletonArticleRow />
      </div>
    </div>
  );
}
