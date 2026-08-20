import React from 'react';
import { Skeleton, SkeletonCard, SkeletonArticleRow } from '@/components/ui/Skeleton';

export default function MemberLoading() {
  return (
    <div className="space-y-10 animate-in fade-in duration-200">
      {/* Header Skeleton */}
      <div className="pb-6 border-b border-[var(--border-color)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-5 w-36 rounded-full" />
          <Skeleton className="h-8 w-64 rounded-[12px]" />
          <Skeleton className="h-4 w-96 rounded-[8px]" />
        </div>
        <Skeleton className="h-10 w-44 rounded-[14px]" />
      </div>

      {/* 3 Metrics Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>

      {/* Main Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-[28px] border border-[var(--border-color)] bg-[var(--bg-card)] p-6 space-y-4 shadow-xs">
            <Skeleton className="h-6 w-48 rounded-[8px]" />
            <SkeletonArticleRow />
            <SkeletonArticleRow />
            <SkeletonArticleRow />
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-[28px] border border-[var(--border-color)] bg-[var(--bg-card)] p-6 space-y-4 shadow-xs">
            <Skeleton className="h-5 w-32 rounded-[8px]" />
            <Skeleton className="h-20 w-full rounded-[14px]" />
          </div>
          <div className="rounded-[28px] border border-[var(--border-color)] bg-[var(--bg-card)] p-6 space-y-4 shadow-xs">
            <Skeleton className="h-5 w-36 rounded-[8px]" />
            <Skeleton className="h-14 w-full rounded-[14px]" />
            <Skeleton className="h-14 w-full rounded-[14px]" />
          </div>
        </div>
      </div>
    </div>
  );
}
