import React from 'react';

export function PageIntro({ eyebrow, title, description, count }: { eyebrow?: string; title: string; description?: string; count?: string }) {
  return (
    <header className="pb-8">
      {eyebrow && <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">{eyebrow}</p>}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="max-w-3xl font-display text-3xl font-medium leading-tight tracking-tight text-[var(--text-primary)] sm:text-5xl">{title}</h1>
        {count && <span className="text-xs font-medium text-[var(--text-muted)]">{count}</span>}
      </div>
      {description && <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--text-muted)]">{description}</p>}
    </header>
  );
}