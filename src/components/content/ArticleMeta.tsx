export function ArticleMeta({ category, date, readingTime }: { category?: string; date: string; readingTime?: number }) {
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[var(--text-muted)]">
      {category && <span className="font-semibold uppercase tracking-[0.08em] text-[11px] text-[var(--accent)]">{category}</span>}
      {category && <span aria-hidden="true" className="text-[var(--color-silver)]">·</span>}
      <span>{date}</span>
      {readingTime != null && (
        <>
          <span aria-hidden="true" className="text-[var(--color-silver)]">·</span>
          <span>{readingTime} mnt baca</span>
        </>
      )}
    </div>
  );
}