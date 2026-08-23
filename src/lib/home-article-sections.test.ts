import assert from 'node:assert/strict';
import test from 'node:test';
import { selectHomeArticleSections } from './home-article-sections';

type Article = { id: string; title: string };

function articles(...ids: string[]): Article[] {
  return ids.map((id) => ({ id, title: `Article ${id}` }));
}

function sectionIds(sections: ReturnType<typeof selectHomeArticleSections<Article>>) {
  return {
    featured: sections.featured?.id,
    secondary: sections.secondary.map(({ id }) => id),
    latest: sections.latest.map(({ id }) => id),
    recent: sections.recent.map(({ id }) => id),
    popular: sections.popular.map(({ id }) => id),
  };
}

test('assigns each article to at most one home section', () => {
  const recent = articles(...Array.from({ length: 20 }, (_, index) => String(index + 1)));
  const popular = articles('1', '4', '10', '16', '19', '20', '21', '22', '23');

  const result = selectHomeArticleSections(recent, popular);
  const selectedIds = [
    result.featured?.id,
    ...result.secondary.map(({ id }) => id),
    ...result.latest.map(({ id }) => id),
    ...result.recent.map(({ id }) => id),
    ...result.popular.map(({ id }) => id),
  ].filter((id): id is string => id !== undefined);

  assert.equal(new Set(selectedIds).size, selectedIds.length);
  assert.deepEqual(
    [result.featured === undefined ? 0 : 1, result.secondary.length, result.latest.length, result.recent.length],
    [1, 3, 6, 5],
  );
  assert.deepEqual(result.popular.map(({ id }) => id), ['16', '19', '20', '21', '22']);
});

test('tolerates empty and small recent arrays', () => {
  assert.deepEqual(sectionIds(selectHomeArticleSections([], [])), {
    featured: undefined,
    secondary: [],
    latest: [],
    recent: [],
    popular: [],
  });

  assert.deepEqual(sectionIds(selectHomeArticleSections(articles('1', '2'), articles('1', '3'))), {
    featured: '1',
    secondary: ['2'],
    latest: [],
    recent: [],
    popular: ['3'],
  });
});

test('backfills popular from candidates after all recent section IDs', () => {
  const recent = articles(...Array.from({ length: 15 }, (_, index) => String(index + 1)));
  const popular = articles(...Array.from({ length: 20 }, (_, index) => String(index + 1)));

  assert.deepEqual(selectHomeArticleSections(recent, popular).popular.map(({ id }) => id), [
    '16',
    '17',
    '18',
    '19',
    '20',
  ]);
});

test('preserves candidate order while skipping repeated IDs', () => {
  const duplicateRecent = articles('1')[0];
  const duplicatePopular = articles('7')[0];
  const result = selectHomeArticleSections(
    [duplicateRecent, duplicateRecent, ...articles('2', '3', '4', '5', '6')],
    [duplicatePopular, duplicatePopular, ...articles('8', '9')],
  );

  assert.deepEqual(sectionIds(result), {
    featured: '1',
    secondary: ['2', '3', '4'],
    latest: ['5', '6'],
    recent: [],
    popular: ['7', '8', '9'],
  });
});
