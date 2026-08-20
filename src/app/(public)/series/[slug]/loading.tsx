import React from 'react';

export default function SeriesDetailLoading() {
  return (
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-10 space-y-10 animate-pulse">
      <div className="space-y-4 max-w-2xl">
        <div className="h-6 w-28 rounded-full bg-[#e4e4e7] dark:bg-[#27272a]" />
        <div className="h-10 w-3/4 rounded-[16px] bg-[#e4e4e7] dark:bg-[#27272a]" />
        <div className="h-4 w-full rounded bg-[#e4e4e7] dark:bg-[#27272a]" />
      </div>

      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-6 rounded-[28px] bg-white dark:bg-[#18181b] border border-[#ececee] dark:border-[#27272a] flex items-center justify-between shadow-xs"
          >
            <div className="space-y-2 flex-1">
              <div className="h-5 w-2/3 rounded bg-[#e4e4e7] dark:bg-[#27272a]" />
              <div className="h-3.5 w-1/2 rounded bg-[#e4e4e7] dark:bg-[#27272a]" />
            </div>
            <div className="h-8 w-24 rounded-[12px] bg-[#e4e4e7] dark:bg-[#27272a] shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
