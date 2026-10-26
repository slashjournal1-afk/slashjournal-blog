export type SearchQueryCandidate = {
  query: string;
  createdAt: Date;
};

export type TrendingKeyword = {
  query: string;
  count: number;
};

export type CuratedTopic = {
  label: string;
  href: string;
  hint?: string;
};

export const DEFAULT_CURATED_TOPICS: CuratedTopic[] = [
  { label: 'Arsitektur Frontend', href: '/category/arsitektur-frontend', hint: 'Kategori' },
  { label: 'Sistem Terdistribusi', href: '/category/backend-distributed', hint: 'Kategori' },
  { label: 'DevOps & Cloud Native', href: '/category/devops-cloud', hint: 'Kategori' },
  { label: 'Keamanan Siber & API', href: '/category/keamanan-siber', hint: 'Kategori' },
  { label: 'Rekayasa Kecerdasan Buatan', href: '/category/kecerdasan-buatan', hint: 'Kategori' },
  { label: 'Optimasi Basis Data', href: '/category/basis-data', hint: 'Kategori' },
];

export function getCuratedEditorialTopics(
  categories?: Array<{ name: string; slug: string }>,
  limit = 8,
): CuratedTopic[] {
  if (categories && categories.length > 0) {
    return categories.slice(0, limit).map((c) => ({
      label: c.name,
      href: `/category/${c.slug}`,
      hint: 'Kategori',
    }));
  }
  return DEFAULT_CURATED_TOPICS.slice(0, limit);
}

export function selectTrendingKeywords(
  candidates: SearchQueryCandidate[] | undefined,
  limit = 6,
): TrendingKeyword[] {
  const counts = new Map<string, { query: string; count: number; latest: number }>();

  for (const candidate of candidates ?? []) {
    const query = candidate.query.trim().replace(/\s+/g, ' ');
    if (query.length < 2) continue;

    const key = query.toLocaleLowerCase('id-ID');
    // createdAt bisa string ISO saat data datang dari Data Cache (serialisasi).
    const latest = new Date(candidate.createdAt).getTime();
    const existing = counts.get(key);
    if (existing) {
      existing.count += 1;
      existing.latest = Math.max(existing.latest, latest);
    } else {
      counts.set(key, { query, count: 1, latest });
    }
  }

  return [...counts.values()]
    .sort((a, b) => b.count - a.count || b.latest - a.latest || a.query.localeCompare(b.query, 'id-ID'))
    .slice(0, limit)
    .map(({ query, count }) => ({ query, count }));
}
