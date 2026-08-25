export const ARTICLE_SORT_OPTIONS = [
  'updated-desc',
  'updated-asc',
  'title-asc',
  'title-desc',
  'views-desc',
  'views-asc',
  'helpful-desc',
  'helpful-asc',
] as const;

export type ArticleSort = (typeof ARTICLE_SORT_OPTIONS)[number];
type ArticleOrderBy =
  | [{ updatedAt: 'desc' }, { id: 'desc' }]
  | [{ updatedAt: 'asc' }, { id: 'asc' }]
  | [{ title: 'asc' }, { id: 'asc' }]
  | [{ title: 'desc' }, { id: 'desc' }]
  | [{ viewCount: 'desc' }, { id: 'desc' }]
  | [{ viewCount: 'asc' }, { id: 'asc' }]
  | [{ helpfulVotes: 'desc' }, { id: 'desc' }]
  | [{ helpfulVotes: 'asc' }, { id: 'asc' }];

export function getArticleOrderBy(value: string | undefined): ArticleOrderBy {
  switch (value) {
    case 'updated-asc': return [{ updatedAt: 'asc' }, { id: 'asc' }];
    case 'title-asc': return [{ title: 'asc' }, { id: 'asc' }];
    case 'title-desc': return [{ title: 'desc' }, { id: 'desc' }];
    case 'views-desc': return [{ viewCount: 'desc' }, { id: 'desc' }];
    case 'views-asc': return [{ viewCount: 'asc' }, { id: 'asc' }];
    case 'helpful-desc': return [{ helpfulVotes: 'desc' }, { id: 'desc' }];
    case 'helpful-asc': return [{ helpfulVotes: 'asc' }, { id: 'asc' }];
    default: return [{ updatedAt: 'desc' }, { id: 'desc' }];
  }
}

export function parseArticleSort(value: string | undefined): ArticleSort {
  return ARTICLE_SORT_OPTIONS.find((option) => option === value) || 'updated-desc';
}
