import assert from 'node:assert/strict';
import test from 'node:test';
import { getArticleOrderBy, parseArticleSort } from './article-sort';

test('maps supported article sorting options to Prisma order definitions', () => {
  assert.deepEqual(getArticleOrderBy('title-asc'), [{ title: 'asc' }, { id: 'asc' }]);
  assert.deepEqual(getArticleOrderBy('views-desc'), [{ viewCount: 'desc' }, { id: 'desc' }]);
  assert.deepEqual(getArticleOrderBy('helpful-asc'), [{ helpfulVotes: 'asc' }, { id: 'asc' }]);
  assert.deepEqual(getArticleOrderBy('comments-desc'), [{ comments: { _count: 'desc' } }, { id: 'desc' }]);
  assert.deepEqual(getArticleOrderBy('comments-asc'), [{ comments: { _count: 'asc' } }, { id: 'asc' }]);
  assert.equal(parseArticleSort('comments-desc'), 'comments-desc');
});

test('falls back to most recently updated articles for unknown sorting options', () => {
  assert.deepEqual(getArticleOrderBy('unknown'), [{ updatedAt: 'desc' }, { id: 'desc' }]);
  assert.equal(parseArticleSort('unknown'), 'updated-desc');
});
