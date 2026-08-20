import React from 'react';

export default function GlossaryLoading() {
  return (
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-10 space-y-10 animate-pulse">
      <div className="space-y-4 max-w-2xl">
        <div className="h-6 w-32 rounded-full bg-[#e4e4e7] dark:bg-[#27272a]" />
        <div className="h-10 w-3/4 rounded-[16px] bg-[#e4e4e7] dark:bg-[#27272a]" />
        <div className="h-4 w-full rounded bg-[#e4e4e7] dark:bg-[#27272a]" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
          <div
            key={i}
            className="p-6 rounded-[28px] bg-white dark:bg-[#18181b] border border-[#ececee] dark:border-[#27272a] space-y-3 shadow-xs"
          >
            <div className="h-4 w-20 rounded bg-[#e4e4e7] dark:bg-[#27272a]" />
            <div className="h-6 w-3/4 rounded bg-[#e4e4e7] dark:bg-[#27272a]" />
            <div className="h-4 w-full rounded bg-[#e4e4e7] dark:bg-[#27272a]" />
            <div className="h-4 w-2/3 rounded bg-[#e4e4e7] dark:bg-[#27272a]" />
          </div>
        ))}
      </div>
    </div>
  );
}
