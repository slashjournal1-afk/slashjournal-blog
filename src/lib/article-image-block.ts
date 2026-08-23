export interface ArticleImageSource {
  name: string;
  url: string;
}

export interface InlineArticleImage {
  src: string;
  alt: string;
  caption?: string;
  source?: ArticleImageSource;
}

export interface ParsedInlineArticleImageBlock {
  image: InlineArticleImage;
  remainder: string;
}

const IMAGE_LINE = /^!\[(.*?)\]\((.*?)(?:\s+"(.*?)")?\)$/;
const CAPTION_LINE = /^(?:\*([^*]+)\*|_([^_]+)_)$/;
const SOURCE_LINE = /^Sumber: \[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/;
const ALT_METADATA_LINE = /^SJ-Image-Alt: ("(?:\\.|[^"\\])*")$/;
const CAPTION_METADATA_LINE = /^SJ-Image-Caption: ("(?:\\.|[^"\\])*")$/;

export function parseInlineArticleImageBlock(
  block: string,
): ParsedInlineArticleImageBlock | null {
  const lines = block.trim().split('\n');
  const imageMatch = lines[0]?.trim().match(IMAGE_LINE);
  if (!imageMatch) return null;

  const image: InlineArticleImage = {
    alt: imageMatch[1],
    src: imageMatch[2],
  };
  let consumedLines = 1;

  const altMetadataMatch = lines[consumedLines]?.trim().match(ALT_METADATA_LINE);
  if (altMetadataMatch) {
    const parsedAlt = parseMetadataString(altMetadataMatch[1]);
    if (parsedAlt === null) return null;
    image.alt = parsedAlt;
    consumedLines += 1;
  }

  const captionMetadataMatch = lines[consumedLines]?.trim().match(CAPTION_METADATA_LINE);
  const captionMatch = lines[consumedLines]?.trim().match(CAPTION_LINE);
  if (captionMetadataMatch) {
    const parsedCaption = parseMetadataString(captionMetadataMatch[1]);
    if (parsedCaption === null) return null;
    image.caption = parsedCaption;
    consumedLines += 1;
  } else if (captionMatch) {
    image.caption = (captionMatch[1] || captionMatch[2]).trim();
    consumedLines += 1;
  } else if (imageMatch[3]) {
    image.caption = imageMatch[3].trim();
  }

  const sourceMatch = lines[consumedLines]?.trim().match(SOURCE_LINE);
  if (sourceMatch) {
    image.source = { name: sourceMatch[1], url: sourceMatch[2] };
    consumedLines += 1;
  }

  return {
    image,
    remainder: lines.slice(consumedLines).join('\n').trim(),
  };
}

export function validateArticleImageSource(
  name: string,
  url: string,
  required = false,
): string | null {
  const trimmedName = name.trim();
  const trimmedUrl = url.trim();
  if (required && (!trimmedName || !trimmedUrl)) {
    return 'Nama dan URL sumber wajib diisi untuk stok bebas royalti';
  }
  if (Boolean(trimmedName) !== Boolean(trimmedUrl)) {
    return 'Nama dan URL sumber harus diisi bersama';
  }
  if (/[\]\r\n]/.test(trimmedName)) {
    return 'Nama sumber tidak boleh mengandung tanda ] atau baris baru';
  }
  if (/[\s)\r\n]/.test(trimmedUrl)) {
    return 'URL sumber tidak boleh mengandung spasi, tanda kurung tutup, atau baris baru';
  }
  if (trimmedUrl && !isAbsoluteUrlWithProtocols(trimmedUrl, ['http:', 'https:'])) {
    return 'URL sumber harus berupa URL http atau https yang valid';
  }
  return null;
}

export function validateExternalArticleImageUrl(url: string): string | null {
  const trimmedUrl = url.trim();
  if (/[\s)\r\n]/.test(trimmedUrl)) {
    return 'URL gambar tidak boleh mengandung spasi, baris baru, atau tanda kurung tutup';
  }
  return isAbsoluteUrlWithProtocols(trimmedUrl, ['https:'])
    ? null
    : 'URL gambar harus berupa URL HTTPS absolut yang valid';
}

export function isRenderableArticleImageSource(src: string): boolean {
  if (src.startsWith('/') && !src.startsWith('//')) return true;
  if (src.startsWith('data:image/')) return true;
  return isAbsoluteUrlWithProtocols(src, ['https:']);
}

export function serializeArticleImageSource(name: string, url: string): string {
  const trimmedName = name.trim();
  const trimmedUrl = url.trim();
  return trimmedName && trimmedUrl
    ? `Sumber: [${trimmedName}](${trimmedUrl})\n`
    : '';
}

export function serializeInlineArticleImageBlock(image: InlineArticleImage): string {
  let markdown = `![](${image.src})\nSJ-Image-Alt: ${JSON.stringify(image.alt)}`;
  if (image.caption) markdown += `\nSJ-Image-Caption: ${JSON.stringify(image.caption)}`;
  if (image.source) markdown += `\n${serializeArticleImageSource(image.source.name, image.source.url).trimEnd()}`;
  return markdown;
}

function isAbsoluteUrlWithProtocols(value: string, protocols: string[]): boolean {
  try {
    const url = new URL(value);
    return protocols.includes(url.protocol) && Boolean(url.hostname);
  } catch {
    return false;
  }
}

function parseMetadataString(value: string): string | null {
  try {
    const parsed: unknown = JSON.parse(value);
    return typeof parsed === 'string' ? parsed : null;
  } catch {
    return null;
  }
}
