import React from 'react';
import { Skeleton, SkeletonCard, SkeletonArticleRow } from '@/components/ui/Skeleton';

export default function DashboardLoading() {
  return (
    <div className="space-y-10 animate-in fade-in duration-200">
      {/* Header Skeleton */}
      <div className="pb-6 border-b border-[var(--border-color)] space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-28 rounded-full" />
        </div>
        <Skeleton className="h-8 w-64 rounded-[12px]" />
        <Skeleton className="h-4 w-96 rounded-[8px]" />
      </div>

      {/* Metric Cards Skeleton Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>

      {/* Main Content Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-4">
          <div className="rounded-[28px] border border-[var(--border-color)] bg-[var(--bg-card)] p-6 space-y-4 shadow-xs">
            <Skeleton className="h-6 w-40 rounded-[8px]" />
            <div className="space-y-3">
              <SkeletonArticleRow />
              <SkeletonArticleRow />
              <SkeletonArticleRow />
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-[28px] border border-[var(--border-color)] bg-[var(--bg-card)] p-6 space-y-4 shadow-xs">
            <Skeleton className="h-6 w-32 rounded-[8px]" />
            <Skeleton className="h-20 w-full rounded-[16px]" />
            <Skeleton className="h-20 w-full rounded-[16px]" />
          </div>
        </div>
      </div>
    </div>
  );
}
