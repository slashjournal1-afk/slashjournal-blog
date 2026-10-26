import assert from 'node:assert/strict';
import test from 'node:test';
import { parsePaginationPage } from './pagination';
import { canEditArticle, canReadEditorialArticle, canWriteGlossary } from './article-permissions';
import { validatePublication, validateArticleSlug } from './publication-validation';
import { getAdSenseVerificationMetadata } from './ads-approval';

test('pagination validates syntax, ambiguity and Prisma overflow', () => {
  assert.deepEqual(parsePaginationPage(undefined, 12), { page: 1, skip: 0 });
  assert.deepEqual(parsePaginationPage('2', 12), { page: 2, skip: 12 });
  for (const value of ['', '0', '-1', '1.5', '1e3', 'Infinity', 'NaN', '01', ' 2 ', ['2', '3'], '9007199254740992', '2147483648']) {
    assert.equal(parsePaginationPage(value, 12), null);
  }
  assert.throws(() => parsePaginationPage('1', 0), RangeError);
});

test('authors cannot edit published articles even when request status is omitted', () => {
  const author = { id: 'a', role: 'AUTHOR' };
  assert.equal(canEditArticle(author, { authorId: 'a', status: 'PUBLISHED' }), false);
  assert.equal(canEditArticle(author, { authorId: 'a', status: 'DRAFT' }), true);
  assert.equal(canEditArticle(author, { authorId: 'a', status: 'IN_REVIEW' }), true);
  assert.equal(canEditArticle(author, { authorId: 'b', status: 'DRAFT' }), false);
  assert.equal(canReadEditorialArticle(author, { authorId: 'b', status: 'PUBLISHED' }), false);
});

test('editorial writes reject readers, blocked accounts and authors writing glossary', () => {
  const article = { authorId: 'a', status: 'PUBLISHED' };
  for (const user of [null, { id: 'a', role: 'READER' }, { id: 'a', role: 'ADMIN', isBlocked: true }]) assert.equal(canEditArticle(user, article), false);
  assert.equal(canEditArticle({ id: 'e', role: 'EDITOR' }, article), true);
  assert.equal(canWriteGlossary({ id: 'a', role: 'AUTHOR' }), false);
  assert.equal(canWriteGlossary({ id: 'e', role: 'EDITOR' }), true);
});

test('publication validation enforces non-empty body, reserved slugs, and sponsor identity', () => {
  // Reserved slugs
  assert.notEqual(validateArticleSlug('about'), null);
  assert.notEqual(validateArticleSlug('admin'), null);
  assert.equal(validateArticleSlug('my-architecture-article'), null);

  // Empty or whitespace body for published
  assert.notEqual(
    validatePublication({
      status: 'PUBLISHED',
      slug: 'valid-slug',
      contentMarkdown: '   ###   \n\n  ---  ',
      isSponsored: false,
    }),
    null,
  );

  // Demo starter content rejected for published
  assert.notEqual(
    validatePublication({
      status: 'PUBLISHED',
      slug: 'valid-slug',
      contentMarkdown: '## 1. Analisis Latar Belakang & Problem Statement\n\n## 4. Evaluasi Metrik & Latensi',
      isSponsored: false,
    }),
    null,
  );

  // Sponsored article without sponsor name
  assert.notEqual(
    validatePublication({
      status: 'PUBLISHED',
      slug: 'valid-slug',
      contentMarkdown: 'Konten naskah yang sah dan mendalam dengan analisis arsitektur nyata.',
      isSponsored: true,
      sponsorName: '',
    }),
    null,
  );

  // Valid published article
  assert.equal(
    validatePublication({
      status: 'PUBLISHED',
      slug: 'valid-slug',
      contentMarkdown: 'Konten naskah yang sah dan mendalam dengan analisis arsitektur nyata.',
      isSponsored: true,
      sponsorName: 'Tech Sponsor',
    }),
    null,
  );
});

test('getAdSenseVerificationMetadata generates valid account meta tag only for valid publisher id', () => {
  assert.deepEqual(getAdSenseVerificationMetadata('ca-pub-7524844307744923'), {
    'google-adsense-account': 'ca-pub-7524844307744923',
  });
  assert.deepEqual(getAdSenseVerificationMetadata('invalid-id'), {});
  assert.deepEqual(getAdSenseVerificationMetadata(''), {});
  assert.deepEqual(getAdSenseVerificationMetadata(undefined), {});
});
