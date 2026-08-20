import React from 'react';

export default function PublicLoading() {
  return (
    <div className="mx-auto max-w-editorial animate-pulse px-5 py-10 sm:px-8">
      {/* Featured Skeleton */}
      <div className="grid gap-8 border-b border-[var(--border-color)] py-10 lg:grid-cols-12 lg:gap-12">
        <div className="space-y-5 lg:col-span-5">
          <div className="h-3 w-28 rounded-full bg-[var(--bg-card-muted)]" />
          <div className="h-9 w-11/12 rounded-lg bg-[var(--bg-card-muted)]" />
          <div className="h-9 w-4/5 rounded-lg bg-[var(--bg-card-muted)]" />
          <div className="h-4 w-3/4 rounded bg-[var(--bg-card-muted)]" />
          <div className="h-4 w-2/3 rounded bg-[var(--bg-card-muted)]" />
          <div className="h-3 w-40 rounded bg-[var(--bg-card-muted)]" />
        </div>
        <div className="lg:col-span-7">
          <div className="aspect-[3/2] w-full rounded-2xl bg-[var(--bg-card-muted)]" />
        </div>
      </div>

      {/* Secondary Skeleton */}
      <div className="grid gap-8 border-b border-[var(--border-color)] py-12 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-3">
            <div className="aspect-[3/2] w-full rounded-xl bg-[var(--bg-card-muted)]" />
            <div className="h-3 w-20 rounded-full bg-[var(--bg-card-muted)]" />
            <div className="h-5 w-full rounded bg-[var(--bg-card-muted)]" />
            <div className="h-5 w-2/3 rounded bg-[var(--bg-card-muted)]" />
          </div>
        ))}
      </div>

      {/* Latest + Rail Skeleton */}
      <div className="grid gap-12 py-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(300px,0.6fr)] lg:gap-16">
        <div className="space-y-0">
          <div className="h-6 w-48 rounded bg-[var(--bg-card-muted)]" />
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="grid grid-cols-[168px_1fr] gap-6 border-t border-[var(--border-color)] py-6">
              <div className="aspect-[4/3] w-full rounded-lg bg-[var(--bg-card-muted)]" />
              <div className="space-y-3">
                <div className="h-3 w-32 rounded-full bg-[var(--bg-card-muted)]" />
                <div className="h-5 w-full rounded bg-[var(--bg-card-muted)]" />
                <div className="h-4 w-2/3 rounded bg-[var(--bg-card-muted)]" />
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-6">
          <div className="h-4 w-40 rounded bg-[var(--bg-card-muted)]" />
          <div className="h-4 w-full rounded bg-[var(--bg-card-muted)]" />
          <div className="h-4 w-full rounded bg-[var(--bg-card-muted)]" />
          <div className="h-4 w-3/4 rounded bg-[var(--bg-card-muted)]" />
        </div>
      </div>
    </div>
  );
}