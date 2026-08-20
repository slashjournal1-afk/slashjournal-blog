import React from 'react';

export default function CategoryLoading() {
  return (
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-10 space-y-10 animate-pulse">
      {/* Category Header Skeleton */}
      <div className="space-y-4 max-w-2xl">
        <div className="h-6 w-28 rounded-full bg-[#e4e4e7] dark:bg-[#27272a]" />
        <div className="h-10 w-3/4 rounded-[16px] bg-[#e4e4e7] dark:bg-[#27272a]" />
        <div className="h-4 w-full rounded bg-[#e4e4e7] dark:bg-[#27272a]" />
      </div>

      {/* Article Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="rounded-[36px] bg-white dark:bg-[#18181b] border border-[#ececee] dark:border-[#27272a] overflow-hidden space-y-4 p-6 shadow-xs"
          >
            <div className="h-44 w-full rounded-[24px] bg-[#e4e4e7] dark:bg-[#27272a]" />
            <div className="h-4 w-20 rounded-full bg-[#e4e4e7] dark:bg-[#27272a]" />
            <div className="h-6 w-5/6 rounded-[10px] bg-[#e4e4e7] dark:bg-[#27272a]" />
            <div className="h-4 w-full rounded bg-[#e4e4e7] dark:bg-[#27272a]" />
          </div>
        ))}
      </div>
    </div>
  );
}
