import { PrismaClient } from '@prisma/client';

/**
 * Audit mutu konten pra-pengajuan AdSense ("Konten tanpa manfaat").
 * Penggunaan: npx tsx scripts/audit-content.ts
 * Syarat lolos: nol temuan KRITIS.
 */

const MIN_GUIDE_WORDS = 1200;
const MIN_THIN_WORDS = 800;
const WORDS_PER_MINUTE = 200;

const prisma = new PrismaClient();

function stripMarkdown(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, ' ') // blok kode dihitung terpisah
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

async function main() {
  const articles = await prisma.article.findMany({
    where: { status: 'PUBLISHED' },
    select: {
      slug: true,
      title: true,
      contentMarkdown: true,
      readingTime: true,
      coverImageUrl: true,
      coverImageSourceType: true,
      isIndexable: true,
      category: { select: { slug: true, isIndexable: true } },
      _count: { select: { sources: true } },
    },
    orderBy: { publishedAt: 'asc' },
  });

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
    const prose = stripMarkdown(a.contentMarkdown || '');
    const words = countWords(prose);
    const expectedMinutes = Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));

    if (words < MIN_THIN_WORDS) {
      findings.push({ level: 'KRITIS', slug: a.slug, message: `tipis: ${words} kata (<${MIN_THIN_WORDS})` });
    } else if (words < MIN_GUIDE_WORDS) {
      findings.push({ level: 'SEDANG', slug: a.slug, message: `perlu pendalaman: ${words} kata (<${MIN_GUIDE_WORDS})` });
    }
    if (Math.abs((a.readingTime || 0) - expectedMinutes) > 1) {
      findings.push({ level: 'KRITIS', slug: a.slug, message: `readingTime ${a.readingTime} mnt vs aktual ±${expectedMinutes} mnt (${words} kata)` });
    }
    if (!a.coverImageUrl) {
      findings.push({ level: 'SEDANG', slug: a.slug, message: 'tanpa cover' });
    }
    if (a._count.sources === 0 && words >= MIN_THIN_WORDS) {
      findings.push({ level: 'SEDANG', slug: a.slug, message: 'tanpa sumber primer' });
    }
    if (!hasCodeOrDiagram(a.contentMarkdown || '') && words >= MIN_THIN_WORDS) {
      findings.push({ level: 'SEDANG', slug: a.slug, message: 'tanpa kode/diagram runnable' });
    }
    if (!a.isIndexable || !a.category.isIndexable) {
      findings.push({ level: 'SEDANG', slug: a.slug, message: 'non-indexable (excluded dari sitemap — benar untuk jurnal-personal)' });
    }
  }

  for (const [url, slugs] of coverUseCount) {
    if (slugs.length > 1) {
      findings.push({ level: 'SEDANG', slug: slugs.join(', '), message: `cover duplikat dipakai ${slugs.length}x: ${url.slice(0, 80)}` });
    }
  }

  const indexable = articles.filter((a) => a.isIndexable && a.category.isIndexable);

  console.log('=== AUDIT KONTEN ADSENSE ===');
  console.log(`Artikel PUBLISHED: ${articles.length} (indexable: ${indexable.length})`);
  console.log(`Ambang: panduan ≥${MIN_GUIDE_WORDS} kata, tipis <${MIN_THIN_WORDS} kata, ${WORDS_PER_MINUTE} kata/mnt`);
  console.log('');
  if (findings.length === 0) {
    console.log('✅ Nol temuan. Syarat konten untuk pengajuan ulang TERPENUHI.');
  } else {
    const kritis = findings.filter((f) => f.level === 'KRITIS');
    const sedang = findings.filter((f) => f.level === 'SEDANG');
    console.log(`KRITIS: ${kritis.length} | SEDANG: ${sedang.length}`);
    for (const f of [...kritis, ...sedang]) {
      console.log(`[${f.level}] ${f.slug} — ${f.message}`);
    }
    if (kritis.length > 0) {
      console.log('\n❌ Belum layak ajukan ulang: masih ada temuan KRITIS.');
      process.exitCode = 1;
    } else {
      console.log('\n⚠️  Layak dengan catatan: selesaikan temuan SEDANG bila memungkinkan.');
    }
  }
  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error('Audit gagal:', err);
  await prisma.$disconnect();
  process.exit(1);
});
