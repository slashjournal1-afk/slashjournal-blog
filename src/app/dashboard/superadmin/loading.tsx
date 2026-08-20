import React from 'react';
import { Skeleton, SkeletonCard, SkeletonArticleRow } from '@/components/ui/Skeleton';

export default function SuperAdminLoading() {
  return (
    <div className="space-y-10 animate-in fade-in duration-200">
      {/* Header Skeleton */}
      <div className="pb-6 border-b border-[var(--border-color)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-5 w-36 rounded-full" />
          <Skeleton className="h-8 w-72 rounded-[12px]" />
          <Skeleton className="h-4 w-96 rounded-[8px]" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-32 rounded-[14px]" />
          <Skeleton className="h-9 w-28 rounded-[14px]" />
        </div>
      </div>

      {/* 4 Metrics Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>

      {/* Main Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-4">
          <div className="rounded-[28px] border border-[var(--border-color)] bg-[var(--bg-card)] p-6 space-y-4 shadow-xs">
            <Skeleton className="h-6 w-48 rounded-[8px]" />
            <SkeletonArticleRow />
            <SkeletonArticleRow />
            <SkeletonArticleRow />
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-[28px] border border-[var(--border-color)] bg-[var(--bg-card)] p-6 space-y-4 shadow-xs">
            <Skeleton className="h-5 w-40 rounded-[8px]" />
            <Skeleton className="h-12 w-full rounded-[14px]" />
            <Skeleton className="h-12 w-full rounded-[14px]" />
            <Skeleton className="h-12 w-full rounded-[14px]" />
          </div>
        </div>
      </div>
    </div>
  );
}
