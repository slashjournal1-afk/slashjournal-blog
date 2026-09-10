export default function Loading() {
  return (
    <div className="space-y-8" aria-label="Memuat analitik">
      <div className="space-y-2 border-b border-[var(--border-color)] pb-6">
        <div className="h-4 w-32 animate-pulse rounded-full bg-[var(--bg-card-muted)]" />
        <div className="h-8 w-72 animate-pulse rounded-[12px] bg-[var(--bg-card-muted)]" />
        <div className="h-4 w-96 animate-pulse rounded-full bg-[var(--bg-card-muted)]" />
      </div>
      <div className="h-24 animate-pulse rounded-[24px] bg-[var(--bg-card-muted)]" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-28 animate-pulse rounded-[24px] bg-[var(--bg-card-muted)]" />
        ))}
      </div>
      <div className="h-[320px] animate-pulse rounded-[28px] bg-[var(--bg-card-muted)]" />
    </div>
  );
}
