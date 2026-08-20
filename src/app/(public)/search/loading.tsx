import React from 'react';

export default function SearchLoading() {
  return (
    <div className="space-y-10 max-w-4xl mx-auto py-12 px-4 animate-pulse">
      <div className="space-y-4">
        <div className="h-6 w-28 rounded-full bg-[#e4e4e7] dark:bg-[#27272a]" />
        <div className="h-10 w-2/3 rounded-[16px] bg-[#e4e4e7] dark:bg-[#27272a]" />
        <div className="h-12 w-full rounded-[14px] bg-[#e4e4e7] dark:bg-[#27272a]" />
      </div>

      <div className="space-y-6 pt-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-6 rounded-[28px] bg-white dark:bg-[#18181b] border border-[#ececee] dark:border-[#27272a] space-y-3 shadow-xs"
          >
            <div className="h-4 w-24 rounded bg-[#e4e4e7] dark:bg-[#27272a]" />
            <div className="h-6 w-3/4 rounded bg-[#e4e4e7] dark:bg-[#27272a]" />
            <div className="h-4 w-full rounded bg-[#e4e4e7] dark:bg-[#27272a]" />
          </div>
        ))}
      </div>
    </div>
  );
}
