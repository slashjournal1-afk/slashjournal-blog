'use client';

import { useRouter } from 'next/navigation';

export function ArticleSortSelect({ value }: { value: string }) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="article-sort" className="text-xs font-semibold text-[var(--text-muted)]">Urutkan</label>
      <select
        id="article-sort"
        value={value}
        onChange={(event) => router.replace(`/dashboard/creator?sort=${encodeURIComponent(event.target.value)}`)}
        className="border border-[var(--border-color)] bg-[var(--bg-primary)] px-2 py-2 text-xs text-[var(--text-primary)]"
      >
        <option value="updated-desc">Diperbarui terbaru</option>
        <option value="updated-asc">Diperbarui terlama</option>
        <option value="title-asc">Judul A-Z</option>
        <option value="title-desc">Judul Z-A</option>
        <option value="views-desc">Pembaca terbanyak</option>
        <option value="views-asc">Pembaca tersedikit</option>
        <option value="helpful-desc">Apresiasi terbanyak</option>
        <option value="helpful-asc">Apresiasi tersedikit</option>
      </select>
    </div>
  );
}
