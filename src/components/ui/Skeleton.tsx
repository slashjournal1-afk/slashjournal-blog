import React from 'react';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Skeleton({ className = '', ...props }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-[16px] bg-[#f4f4f5] dark:bg-[#27272a] ${className}`}
      {...props}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-[28px] border border-[#ececee] dark:border-[#27272a] bg-white dark:bg-[#18181b] p-6 space-y-4 shadow-xs">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24 rounded-[8px]" />
        <Skeleton className="h-4 w-12 rounded-[8px]" />
      </div>
      <Skeleton className="h-8 w-36 rounded-[12px]" />
      <Skeleton className="h-3 w-48 rounded-[6px]" />
    </div>
  );
}

export function SkeletonArticleRow() {
  return (
    <div className="flex items-center gap-4 p-4 rounded-[22px] border border-[#ececee] dark:border-[#27272a] bg-white dark:bg-[#18181b]">
      <Skeleton className="w-20 h-16 rounded-[14px] shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3 w-20 rounded-[6px]" />
        <Skeleton className="h-4 w-3/4 rounded-[8px]" />
        <Skeleton className="h-3 w-1/2 rounded-[6px]" />
      </div>
    </div>
  );
}
