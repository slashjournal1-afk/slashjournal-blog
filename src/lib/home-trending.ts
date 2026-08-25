export type SearchQueryCandidate = {
  query: string;
  createdAt: Date;
};

export type TrendingKeyword = {
  query: string;
  count: number;
};

export function selectTrendingKeywords(
  candidates: SearchQueryCandidate[] | undefined,
  limit = 6,
): TrendingKeyword[] {
  const counts = new Map<string, { query: string; count: number; latest: number }>();

  for (const candidate of candidates ?? []) {
    const query = candidate.query.trim().replace(/\s+/g, ' ');
    if (query.length < 2) continue;

    const key = query.toLocaleLowerCase('id-ID');
    const existing = counts.get(key);
    if (existing) {
      existing.count += 1;
      existing.latest = Math.max(existing.latest, candidate.createdAt.getTime());
    } else {
      counts.set(key, { query, count: 1, latest: candidate.createdAt.getTime() });
    }
  }

  return [...counts.values()]
    .sort((a, b) => b.count - a.count || b.latest - a.latest || a.query.localeCompare(b.query, 'id-ID'))
    .slice(0, limit)
    .map(({ query, count }) => ({ query, count }));
}
