import { PrismaClient } from '@prisma/client';

/**
 * Audit mutu konten pra-pengajuan AdSense ("Konten tanpa manfaat" & Kepatuhan Kebijakan).
 * Penggunaan: npx tsx scripts/audit-content.ts
 * Syarat lolos: nol temuan KRITIS.
 */

const MIN_ABSOLUTE_WORDS = 300;
const MIN_THIN_WORDS = 800;
const MIN_GUIDE_WORDS = 1200;
const WORDS_PER_MINUTE = 200;

const PROHIBITED_PATTERNS = [
  { regex: /\b(hack|crack|bypass)\b.*(gratis|tanpa limit|free access|tanpa bayar)/i, label: 'Eksploitasi bypass berbayar/hacking terlarang' },
  { regex: /https?:\/\/(?:www\.)?example\.(?:com|org|net)/i, label: 'Domain placeholder fiktif (example.com)' },
];

const prisma = new PrismaClient();

function stripMarkdown(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[\[([^\]]*)\]\]/g, '$1')
    .replace(/[#>*_~|-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function countWords(text: string): number {
  if (!text) return 0;
  return text.split(/\s+/).filter(Boolean).length;
}

function hasCodeOrDiagram(md: string): boolean {
  return /```/.test(md) || /```mermaid|::: (tabs|tab)|<Tabs/.test(md);
}

function extractWikiLinks(markdown: string): string[] {
  const matches = markdown.matchAll(/\[\[(.*?)\]\]/g);
  const terms: string[] = [];
  for (const match of matches) {
    const raw = match[1]?.trim();
    if (raw) {
      const term = raw.split('|')[0].trim();
      if (term) terms.push(term);
    }
  }
  return terms;
}

async function main() {
  const [articles, glossaryTerms, publicArticles] = await Promise.all([
    prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      select: {
        slug: true,
        title: true,
        contentMarkdown: true,
        readingTime: true,
        coverImageUrl: true,
        coverImageSourceType: true,
        isIndexable: true,
        isSponsored: true,
        sponsorName: true,
        sponsorUrl: true,
        category: { select: { slug: true, isIndexable: true } },
        _count: { select: { sources: true } },
      },
      orderBy: { publishedAt: 'asc' },
    }),
    prisma.glossaryTerm.findMany({
      select: { term: true, slug: true },
    }),
    prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      select: { title: true, slug: true },
    }),
  ]);

  const validWikiTargets = new Set<string>();
  for (const g of glossaryTerms) {
    validWikiTargets.add(g.term.toLowerCase());
    validWikiTargets.add(g.slug.toLowerCase());
  }
  for (const pa of publicArticles) {
    validWikiTargets.add(pa.title.toLowerCase());
    validWikiTargets.add(pa.slug.toLowerCase());
  }

  const coverUseCount = new Map<string, string[]>();
  for (const a of articles) {
    if (a.coverImageUrl) {
      const list = coverUseCount.get(a.coverImageUrl) || [];
      list.push(a.slug);
      coverUseCount.set(a.coverImageUrl, list);
    }
  }

  type Finding = { level: 'KRITIS' | 'SEDANG'; slug: string; message: string };
  const findings: Finding[] = [];

  for (const a of articles) {
    const content = a.contentMarkdown || '';
    const prose = stripMarkdown(content);
    const words = countWords(prose);
    const expectedMinutes = Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));

    // 1. Validasi Batas Minimal Kata
    if (words < MIN_ABSOLUTE_WORDS) {
      findings.push({ level: 'KRITIS', slug: a.slug, message: `konten dangkal absolut: ${words} kata (<${MIN_ABSOLUTE_WORDS} kata)` });
    } else if (words < MIN_THIN_WORDS) {
      findings.push({ level: 'SEDANG', slug: a.slug, message: `artikel ringkas/berita: ${words} kata (<${MIN_THIN_WORDS} kata, pertimbangkan pengayaan)` });
    } else if (words < MIN_GUIDE_WORDS) {
      findings.push({ level: 'SEDANG', slug: a.slug, message: `perlu pendalaman untuk pilar panduan: ${words} kata (<${MIN_GUIDE_WORDS} kata)` });
    }

    // 2. Validasi Keselarasan Reading Time
    if (Math.abs((a.readingTime || 0) - expectedMinutes) > 1) {
      findings.push({ level: 'KRITIS', slug: a.slug, message: `readingTime ${a.readingTime} mnt vs aktual ±${expectedMinutes} mnt (${words} kata)` });
    }

    // 3. Validasi Konsistensi Sponsor
    if (a.isSponsored && (!a.sponsorName || !a.sponsorUrl)) {
      findings.push({ level: 'KRITIS', slug: a.slug, message: 'artikel ditandai isSponsored: true tetapi sponsorName atau sponsorUrl kosong' });
    }
    if (!a.isSponsored && (a.sponsorName || a.sponsorUrl)) {
      findings.push({ level: 'KRITIS', slug: a.slug, message: 'sponsorName atau sponsorUrl terisi tetapi isSponsored: false' });
    }

    // 4. Deteksi Pola Kata Terlarang (Bypass, Hacking, Example.com)
    for (const pattern of PROHIBITED_PATTERNS) {
      if (pattern.regex.test(content) || pattern.regex.test(a.title)) {
        findings.push({ level: 'KRITIS', slug: a.slug, message: `terdeteksi pelanggaran kebijakan: ${pattern.label}` });
      }
    }

    // 5. Validasi Tautan WikiLink
    const wikiLinks = extractWikiLinks(content);
    for (const term of wikiLinks) {
      const normalized = term.toLowerCase();
      if (!validWikiTargets.has(normalized)) {
        findings.push({ level: 'SEDANG', slug: a.slug, message: `WikiLink target tak terdaftar di database: [[${term}]] (telah di-fallback ke teks biasa)` });
      }
    }

    // 6. Kelengkapan Aset & Metadata
    if (!a.coverImageUrl) {
      findings.push({ level: 'SEDANG', slug: a.slug, message: 'tanpa cover image' });
    }
    if (a._count.sources === 0 && words >= MIN_THIN_WORDS) {
      findings.push({ level: 'SEDANG', slug: a.slug, message: 'tanpa sumber primer referensi' });
    }
    if (!hasCodeOrDiagram(content) && words >= MIN_THIN_WORDS) {
      findings.push({ level: 'SEDANG', slug: a.slug, message: 'tanpa blok kode atau diagram teknis' });
    }
    if (!a.isIndexable || !a.category.isIndexable) {
      findings.push({ level: 'SEDANG', slug: a.slug, message: 'non-indexable (dikecualikan dari sitemap)' });
    }
  }

  for (const [url, slugs] of coverUseCount) {
    if (slugs.length > 1) {
      findings.push({ level: 'SEDANG', slug: slugs.join(', '), message: `cover duplikat dipakai ${slugs.length}x: ${url.slice(0, 80)}` });
    }
  }

  const indexable = articles.filter((a) => a.isIndexable && a.category.isIndexable);

  console.log('=== AUDIT KONTEN ADSENSE (STRICT CHECK) ===');
  console.log(`Artikel PUBLISHED: ${articles.length} (indexable: ${indexable.length})`);
  console.log(`Ambang: panduan ≥${MIN_GUIDE_WORDS} kata, tipis <${MIN_THIN_WORDS} kata, absolut <${MIN_ABSOLUTE_WORDS} kata`);
  console.log('');

  const kritis = findings.filter((f) => f.level === 'KRITIS');
  const sedang = findings.filter((f) => f.level === 'SEDANG');

  if (findings.length === 0) {
    console.log('✅ Nol temuan. Syarat konten untuk pengajuan ulang TERPENUHI.');
  } else {
    console.log(`KRITIS: ${kritis.length} | SEDANG: ${sedang.length}`);
    for (const f of [...kritis, ...sedang]) {
      console.log(`[${f.level}] ${f.slug} — ${f.message}`);
    }
    if (kritis.length > 0) {
      console.log('\n❌ Belum layak ajukan ulang: masih ada temuan KRITIS.');
      process.exitCode = 1;
    } else {
      console.log('\n✅ Nol temuan KRITIS. Layak diajukan ke Google AdSense!');
    }
  }
  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error('Audit gagal:', err);
  await prisma.$disconnect();
  process.exit(1);
});
