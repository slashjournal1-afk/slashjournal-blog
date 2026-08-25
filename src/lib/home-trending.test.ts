import assert from 'node:assert/strict';
import test from 'node:test';
import { selectTrendingKeywords } from './home-trending';

test('normalizes and ranks repeated search queries', () => {
  const result = selectTrendingKeywords([
    { query: '  PostgreSQL  ', createdAt: new Date('2026-08-20') },
    { query: 'postgresql', createdAt: new Date('2026-08-21') },
    { query: 'Next.js', createdAt: new Date('2026-08-22') },
    { query: 'next.js', createdAt: new Date('2026-08-19') },
    { query: '  ', createdAt: new Date('2026-08-23') },
  ]);

  assert.deepEqual(result, [
    { query: 'Next.js', count: 2 },
    { query: 'PostgreSQL', count: 2 },
  ]);
});

test('uses the latest query as a deterministic tie-breaker', () => {
  const result = selectTrendingKeywords([
    { query: 'lama', createdAt: new Date('2026-08-20') },
    { query: 'baru', createdAt: new Date('2026-08-21') },
  ], 1);

  assert.deepEqual(result, [{ query: 'baru', count: 1 }]);
});
