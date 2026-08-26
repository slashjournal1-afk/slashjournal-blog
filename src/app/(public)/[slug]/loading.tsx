export default function Loading() {
  return (
    <div className="min-h-screen animate-pulse pb-20">
      <div className="border-b border-[var(--border-color)]">
        <div className="mx-auto flex max-w-editorial items-center gap-3 px-5 py-4 sm:px-8">
          <div className="h-3 w-16 rounded bg-[var(--bg-card-muted)]" />
          <div className="h-3 w-3 rounded bg-[var(--bg-card-muted)]" />
          <div className="h-3 w-28 rounded bg-[var(--bg-card-muted)]" />
        </div>
      </div>
      <div className="mx-auto max-w-editorial px-5 sm:px-8">
        <div className="mx-auto max-w-[760px] space-y-6 pt-10 sm:pt-14">
          <div className="h-3 w-24 rounded-full bg-[var(--bg-card-muted)]" />
          <div className="space-y-3">
            <div className="h-9 w-full rounded-lg bg-[var(--bg-card-muted)]" />
            <div className="h-9 w-5/6 rounded-lg bg-[var(--bg-card-muted)]" />
          </div>
          <div className="h-5 w-4/5 rounded bg-[var(--bg-card-muted)]" />
          <div className="flex items-center gap-4 border-y border-[var(--border-color)] py-5">
            <div className="h-10 w-10 rounded-full bg-[var(--bg-card-muted)]" />
            <div className="space-y-1.5">
              <div className="h-3 w-32 rounded bg-[var(--bg-card-muted)]" />
              <div className="h-3 w-20 rounded bg-[var(--bg-card-muted)]" />
            </div>
          </div>
        </div>
        <div className="mx-auto mt-10 max-w-[1000px]">
          <div className="aspect-[16/9] w-full rounded-2xl bg-[var(--bg-card-muted)]" />
        </div>
        <div className="mx-auto mt-12 max-w-[720px] space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-4 rounded bg-[var(--bg-card-muted)]" style={{ width: `${[100, 96, 88, 92, 70, 80][i]}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}
