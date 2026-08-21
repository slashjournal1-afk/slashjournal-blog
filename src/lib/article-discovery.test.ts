import assert from 'node:assert/strict';
import test from 'node:test';
import { prepareArticleDiscovery } from './article-discovery';

const now = new Date('2026-08-21T00:00:00.000Z');

function article(
  id: string,
  overrides: Partial<{
    seriesId: string | null;
    categoryId: string;
    tagIds: string[];
    viewCount: number;
    publishedAt: Date | null;
    createdAt: Date;
  }> = {},
) {
  const { tagIds = [], ...articleOverrides } = overrides;
  return {
    id,
    slug: id,
    title: id,
    coverImageUrl: null,
    viewCount: 0,
    publishedAt: now,
    createdAt: now,
    categoryId: 'other',
    seriesId: null,
    category: { name: 'Category', slug: 'category' },
    ...articleOverrides,
    tags: tagIds.map((tagId) => ({ tagId })),
  };
}

test('ranks recommendations by series, shared tags, then category', () => {
  const result = prepareArticleDiscovery({
    context: { articleId: 'current', categoryId: 'backend', seriesId: 'series-a', tagIds: ['tag-a', 'tag-b'] },
    recommendationCandidates: [
      article('category', { categoryId: 'backend' }),
      article('tag', { tagIds: ['tag-a'] }),
      article('series', { seriesId: 'series-a' }),
    ],
    trendingCandidates: [],
    popularCandidates: [],
  });

  assert.deepEqual(result.recommendations.map(({ id }) => id), ['series', 'tag', 'category']);
});

test('removes the current article and duplicates across columns', () => {
  const duplicate = article('duplicate', { categoryId: 'backend', viewCount: 20 });
  const result = prepareArticleDiscovery({
    context: { articleId: 'current', categoryId: 'backend', seriesId: null, tagIds: [] },
    recommendationCandidates: [article('current'), duplicate],
    trendingCandidates: [duplicate, article('trending', { viewCount: 10 })],
    popularCandidates: [duplicate, article('trending'), article('popular', { viewCount: 30 })],
  });

  assert.deepEqual(result.recommendations.map(({ id }) => id), ['duplicate']);
  assert.deepEqual(result.trending.map(({ id }) => id), ['trending']);
  assert.deepEqual(result.popular.map(({ id }) => id), ['popular']);
});

test('deduplicates recommendation candidates before applying the limit', () => {
  const duplicate = article('duplicate', { seriesId: 'series-a' });
  const result = prepareArticleDiscovery({
    context: { articleId: 'current', categoryId: 'backend', seriesId: 'series-a', tagIds: [] },
    recommendationCandidates: [duplicate, duplicate, article('second'), article('third')],
    trendingCandidates: [],
    popularCandidates: [],
  });

  assert.deepEqual(result.recommendations.map(({ id }) => id), ['duplicate', 'second', 'third']);
});
