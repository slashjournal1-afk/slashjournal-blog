const RESERVED_SLUGS = new Set(['about', 'admin', 'api', 'auth', 'bookmarks', 'category', 'contact', 'cookie-policy', 'dashboard', 'feed', 'forgot-password', 'glossary', 'llms', 'login', 'manifest', 'not-found-shell', 'privacy-policy', 'register', 'reset-password', 'robots', 'search', 'series', 'sitemap', 'tag', 'terms', 'uploads', '_not-found']);

export function validateArticleSlug(slug: string): string | null {
  return !slug || RESERVED_SLUGS.has(slug) ? 'Slug kosong atau digunakan oleh halaman sistem' : null;
}

interface PublicationData {
  status: string;
  slug: string;
  contentMarkdown: string;
  isSponsored: boolean;
  sponsorName?: string | null;
}

export function validatePublication(article: PublicationData): string | null {
  const slugError = validateArticleSlug(article.slug);
  if (slugError) return slugError;
  if (article.status !== 'PUBLISHED') return null;
  const prose = article.contentMarkdown.replace(/<!--[\s\S]*?-->/g, '').replace(/[#\s*_~`>\-]/g, '');
  if (!prose) return 'Naskah publik harus berisi materi, bukan whitespace atau markup kosong';
  if (/## 1\. Analisis Latar Belakang & Problem Statement/.test(article.contentMarkdown) && /## 4\. Evaluasi Metrik & Latensi/.test(article.contentMarkdown)) return 'Ganti materi demo editor sebelum publikasi';
  if (/<!-- slashjournal:editor-example -->/.test(article.contentMarkdown)) return 'Hapus penanda contoh dan revisi ilustrasi sebelum publikasi';
  if (article.isSponsored && !article.sponsorName?.trim()) return 'Identitas sponsor wajib untuk publikasi bersponsor';
  return null;
}
