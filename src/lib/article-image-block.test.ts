import assert from 'node:assert/strict';
import test from 'node:test';
import {
  isRenderableArticleImageSource,
  parseInlineArticleImageBlock,
  serializeInlineArticleImageBlock,
  serializeArticleImageSource,
  validateArticleImageSource,
  validateExternalArticleImageUrl,
} from './article-image-block';

test('parses an image-only block', () => {
  assert.deepEqual(parseInlineArticleImageBlock('![Diagram](https://example.com/diagram.png)'), {
    image: {
      src: 'https://example.com/diagram.png',
      alt: 'Diagram',
    },
    remainder: '',
  });
});

test('parses a caption without consuming a normal paragraph', () => {
  assert.deepEqual(
    parseInlineArticleImageBlock(
      '![Diagram](https://example.com/diagram.png)\n*Topologi layanan*\n\nParagraph berikutnya.',
    ),
    {
      image: {
        src: 'https://example.com/diagram.png',
        alt: 'Diagram',
        caption: 'Topologi layanan',
      },
      remainder: 'Paragraph berikutnya.',
    },
  );
});

test('parses a caption and exact source attribution', () => {
  assert.deepEqual(
    parseInlineArticleImageBlock(
      '![Diagram](https://example.com/diagram.png)\n*Topologi layanan*\nSumber: [Nama](https://source.example/diagram)',
    ),
    {
      image: {
        src: 'https://example.com/diagram.png',
        alt: 'Diagram',
        caption: 'Topologi layanan',
        source: { name: 'Nama', url: 'https://source.example/diagram' },
      },
      remainder: '',
    },
  );
});

test('preserves a normal paragraph after an image', () => {
  const result = parseInlineArticleImageBlock(
    '![Diagram](https://example.com/diagram.png)\n\nIni paragraf teknis biasa.',
  );

  assert.equal(result?.remainder, 'Ini paragraf teknis biasa.');
  assert.equal(result?.image.caption, undefined);
});

test('does not consume a malformed source attribution', () => {
  const result = parseInlineArticleImageBlock(
    '![Diagram](https://example.com/diagram.png)\n*Topologi layanan*\nSumber: Nama tanpa tautan',
  );

  assert.deepEqual(result, {
    image: {
      src: 'https://example.com/diagram.png',
      alt: 'Diagram',
      caption: 'Topologi layanan',
    },
    remainder: 'Sumber: Nama tanpa tautan',
  });
});

test('validates optional source fields as a pair with an HTTP URL', () => {
  assert.equal(validateArticleImageSource('', ''), null);
  assert.equal(validateArticleImageSource('Unsplash', ''), 'Nama dan URL sumber harus diisi bersama');
  assert.equal(validateArticleImageSource('Unsplash', 'ftp://example.com'), 'URL sumber harus berupa URL http atau https yang valid');
  assert.equal(validateArticleImageSource('Unsplash', 'https://example.com/photo'), null);
});

test('requires an absolute HTTPS URL for URL-tab images', () => {
  assert.equal(validateExternalArticleImageUrl('https://example.com/image.png'), null);
  assert.equal(validateExternalArticleImageUrl('http://example.com/image.png'), 'URL gambar harus berupa URL HTTPS absolut yang valid');
  assert.equal(validateExternalArticleImageUrl('ftp://example.com/image.png'), 'URL gambar harus berupa URL HTTPS absolut yang valid');
  assert.equal(validateExternalArticleImageUrl('/uploads/image.png'), 'URL gambar harus berupa URL HTTPS absolut yang valid');
  assert.equal(validateExternalArticleImageUrl('bukan-url'), 'URL gambar harus berupa URL HTTPS absolut yang valid');
});

test('rejects image URLs that break Markdown image syntax', () => {
  assert.equal(validateExternalArticleImageUrl('https://example.com/image name.png'), 'URL gambar tidak boleh mengandung spasi, baris baru, atau tanda kurung tutup');
  assert.equal(validateExternalArticleImageUrl('https://example.com/image).png'), 'URL gambar tidak boleh mengandung spasi, baris baru, atau tanda kurung tutup');
});

test('constructs source URLs and rejects malformed values', () => {
  assert.equal(validateArticleImageSource('Nama', 'http://example.com/source'), null);
  assert.equal(validateArticleImageSource('Nama', 'https://example.com/source'), null);
  assert.equal(validateArticleImageSource('Nama', 'https://'), 'URL sumber harus berupa URL http atau https yang valid');
  assert.equal(validateArticleImageSource('Nama', 'http://'), 'URL sumber harus berupa URL http atau https yang valid');
});

test('rejects source fields that cannot round-trip through the source grammar', () => {
  assert.equal(validateArticleImageSource('Nama]Rusak', 'https://example.com'), 'Nama sumber tidak boleh mengandung tanda ] atau baris baru');
  assert.equal(validateArticleImageSource('Nama\nRusak', 'https://example.com'), 'Nama sumber tidak boleh mengandung tanda ] atau baris baru');
  assert.equal(validateArticleImageSource('Nama', 'https://example.com/a b'), 'URL sumber tidak boleh mengandung spasi, tanda kurung tutup, atau baris baru');
  assert.equal(validateArticleImageSource('Nama', 'https://example.com/a)'), 'URL sumber tidak boleh mengandung spasi, tanda kurung tutup, atau baris baru');
});

test('accepts only local, image data, and absolute HTTPS renderer sources', () => {
  assert.equal(isRenderableArticleImageSource('/uploads/image.webp'), true);
  assert.equal(isRenderableArticleImageSource('data:image/png;base64,abc'), true);
  assert.equal(isRenderableArticleImageSource('https://example.com/image.png'), true);
  assert.equal(isRenderableArticleImageSource('http://example.com/image.png'), false);
  assert.equal(isRenderableArticleImageSource('ftp://example.com/image.png'), false);
  assert.equal(isRenderableArticleImageSource('//example.com/image.png'), false);
  assert.equal(isRenderableArticleImageSource('legacy/image.png'), false);
});

test('requires a source pair for free stock images', () => {
  assert.equal(
    validateArticleImageSource('', '', true),
    'Nama dan URL sumber wajib diisi untuk stok bebas royalti',
  );
});

test('serializes an exact source line only for a complete pair', () => {
  assert.equal(
    serializeArticleImageSource(' Unsplash ', ' https://example.com/photo '),
    'Sumber: [Unsplash](https://example.com/photo)\n',
  );
  assert.equal(serializeArticleImageSource('Unsplash', ''), '');
});

test('round-trips caption asterisks through explicit metadata', () => {
  const markdown = serializeInlineArticleImageBlock({
    src: 'https://example.com/image.png',
    alt: 'Diagram',
    caption: 'Gunakan *wildcard* untuk semua layanan',
  });

  assert.deepEqual(parseInlineArticleImageBlock(markdown), {
    image: {
      src: 'https://example.com/image.png',
      alt: 'Diagram',
      caption: 'Gunakan *wildcard* untuk semua layanan',
    },
    remainder: '',
  });
});

test('round-trips alt delimiters and newlines through explicit metadata', () => {
  const markdown = serializeInlineArticleImageBlock({
    src: '/uploads/image.webp',
    alt: 'Diagram [utama]\nBaris kedua',
  });

  assert.match(markdown, /^!\[\]\(\/uploads\/image\.webp\)\nSJ-Image-Alt: /);
  assert.equal(parseInlineArticleImageBlock(markdown)?.image.alt, 'Diagram [utama]\nBaris kedua');
});

test('preserves legacy prose metadata-looking lines after an image', () => {
  const parsed = parseInlineArticleImageBlock(
    '![Diagram](https://example.com/image.png)\nAlt: prose biasa\nCaption: prose biasa',
  );

  assert.deepEqual(parsed, {
    image: { src: 'https://example.com/image.png', alt: 'Diagram' },
    remainder: 'Alt: prose biasa\nCaption: prose biasa',
  });
});

test('parses only namespaced image metadata', () => {
  const parsed = parseInlineArticleImageBlock(
    '![Diagram](https://example.com/image.png)\nSJ-Image-Alt: "Alt baru"\nSJ-Image-Caption: "Caption *baru*"',
  );

  assert.deepEqual(parsed?.image, {
    src: 'https://example.com/image.png',
    alt: 'Alt baru',
    caption: 'Caption *baru*',
  });
});

test('preserves block-separated remainder for normal tokenization', () => {
  const parsed = parseInlineArticleImageBlock(
    '![Diagram](https://example.com/image.png)\n\n## Heading berikutnya\n\n- satu\n- dua',
  );

  assert.equal(parsed?.remainder, '## Heading berikutnya\n\n- satu\n- dua');
});
