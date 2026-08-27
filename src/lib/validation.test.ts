import test from 'node:test';
import assert from 'node:assert/strict';
import { articleCreateSchema, articleUpdateSchema } from './validation';

test('articleCreateSchema allows long coverImageUrl (e.g. Base64 data URL > 2048 chars)', () => {
  const longBase64 = 'data:image/png;base64,' + 'A'.repeat(50000);
  const result = articleCreateSchema.safeParse({
    title: 'Arsitektur Sistem Terdistribusi',
    contentMarkdown: '## Pendahuluan\n\nPenjelasan sistem terdistribusi.',
    categoryId: 'cat-123',
    coverImageUrl: longBase64,
  });

  assert.equal(result.success, true);
  if (result.success) {
    assert.equal(result.data.coverImageUrl, longBase64);
  }
});

test('articleCreateSchema allows long source URLs > 2048 chars and normal URLs', () => {
  const longUrl = 'https://example.com/research/paper?query=' + 'a'.repeat(3000);
  const result = articleCreateSchema.safeParse({
    title: 'Studi Kasus Latensi Tinggi',
    contentMarkdown: '## Hasil Pengukuran\n\nMetrik latensi.',
    categoryId: 'cat-123',
    sources: [
      { label: 'Paper ACM', url: longUrl },
      { label: 'Dokumentasi Internal', url: null },
      { label: 'RFC 9110', url: 'https://www.rfc-editor.org/rfc/rfc9110' },
      { label: 'Sumber tanpa URL', url: '' },
    ],
  });

  assert.equal(result.success, true);
  if (result.success) {
    assert.equal(result.data.sources?.[0].url, longUrl);
    assert.equal(result.data.sources?.[1].url, null);
    assert.equal(result.data.sources?.[2].url, 'https://www.rfc-editor.org/rfc/rfc9110');
    assert.equal(result.data.sources?.[3].url, null);
  }
});

test('articleCreateSchema handles empty/whitespace strings for nullish fields cleanly', () => {
  const result = articleCreateSchema.safeParse({
    title: 'Panduan Arsitektur',
    contentMarkdown: 'Konten naskah...',
    categoryId: 'cat-123',
    coverImageUrl: '   ',
    sponsorUrl: '   ',
  });

  assert.equal(result.success, true);
  if (result.success) {
    assert.equal(result.data.coverImageUrl, null);
    assert.equal(result.data.sponsorUrl, null);
  }
});

test('articleUpdateSchema supports partial updates with long URLs and notes', () => {
  const longUrl = 'https://sponsor.org/partner?token=' + 'x'.repeat(2500);
  const result = articleUpdateSchema.safeParse({
    sponsorUrl: longUrl,
    revisionNote: 'Pembaruan tautan sponsor',
  });

  assert.equal(result.success, true);
  if (result.success) {
    assert.equal(result.data.sponsorUrl, longUrl);
    assert.equal(result.data.revisionNote, 'Pembaruan tautan sponsor');
  }
});

test('articleCreateSchema returns descriptive error when required fields are missing', () => {
  const result = articleCreateSchema.safeParse({
    title: '',
    contentMarkdown: '',
  });

  assert.equal(result.success, false);
  if (!result.success) {
    const errorMessages = result.error.issues.map((i) => i.message);
    assert.ok(errorMessages.includes('Judul wajib diisi'));
    assert.ok(errorMessages.includes('Konten wajib diisi'));
  }
});
