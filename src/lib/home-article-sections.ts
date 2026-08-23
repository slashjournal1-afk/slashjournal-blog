export type HomeArticleSections<T extends { id: string }> = {
  featured: T | undefined;
  secondary: T[];
  latest: T[];
  recent: T[];
  popular: T[];
};

export function selectHomeArticleSections<T extends { id: string }>(
  recentCandidates: T[] | undefined,
  popularCandidates: T[] | undefined,
): HomeArticleSections<T> {
  const usedIds = new Set<string>();
  const select = (candidates: T[] | undefined, limit: number) => {
    const selected: T[] = [];

    for (const article of candidates ?? []) {
      if (usedIds.has(article.id)) continue;
      usedIds.add(article.id);
      selected.push(article);
      if (selected.length === limit) break;
    }

    return selected;
  };

  const featured = select(recentCandidates, 1)[0];
  return {
    featured,
    secondary: select(recentCandidates, 3),
    latest: select(recentCandidates, 6),
    recent: select(recentCandidates, 5),
    popular: select(popularCandidates, 5),
  };
}
