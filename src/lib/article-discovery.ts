export type DiscoveryArticle = {
  id: string;
  slug: string;
  title: string;
  coverImageUrl: string | null;
  viewCount: number;
  publishedAt: Date | null;
  createdAt: Date;
  categoryId: string;
  seriesId: string | null;
  category: { name: string; slug: string };
  tags: { tagId: string }[];
};

export type ArticleDiscoveryContext = {
  articleId: string;
  categoryId: string;
  seriesId: string | null;
  tagIds: string[];
};

export type ArticleDiscoveryResult = {
  recommendations: DiscoveryArticle[];
  trending: DiscoveryArticle[];
  popular: DiscoveryArticle[];
};

export function prepareArticleDiscovery({
  context,
  recommendationCandidates,
  trendingCandidates,
  popularCandidates,
}: {
  context: ArticleDiscoveryContext;
  recommendationCandidates: DiscoveryArticle[];
  trendingCandidates: DiscoveryArticle[];
  popularCandidates: DiscoveryArticle[];
}): ArticleDiscoveryResult {
  const selected = new Set([context.articleId]);
  const recommendations = uniqueArticles(recommendationCandidates)
    .toSorted((a, b) => recommendationScore(b, context) - recommendationScore(a, context) || dateValue(b) - dateValue(a))
    .filter((article) => !selected.has(article.id))
    .slice(0, 3);

  recommendations.forEach((article) => selected.add(article.id));
  const trending = takeUnique(trendingCandidates, selected);
  trending.forEach((article) => selected.add(article.id));
  const popular = takeUnique(popularCandidates, selected);

  return { recommendations, trending, popular };
}

function takeUnique(articles: DiscoveryArticle[], selected: Set<string>) {
  return uniqueArticles(articles).filter((article) => !selected.has(article.id)).slice(0, 3);
}

function uniqueArticles(articles: DiscoveryArticle[]) {
  const seen = new Set<string>();
  return articles.filter((article) => {
    if (seen.has(article.id)) return false;
    seen.add(article.id);
    return true;
  });
}

function recommendationScore(article: DiscoveryArticle, context: ArticleDiscoveryContext) {
  const sharedTags = article.tags.reduce((count, tag) => count + (context.tagIds.includes(tag.tagId) ? 1 : 0), 0);
  return (article.seriesId && article.seriesId === context.seriesId ? 1000 : 0)
    + sharedTags * 100
    + (article.categoryId === context.categoryId ? 10 : 0);
}

function dateValue(article: DiscoveryArticle) {
  return (article.publishedAt || article.createdAt).getTime();
}
