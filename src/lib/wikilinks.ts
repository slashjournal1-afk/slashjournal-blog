import { prisma } from './db';
import { slugify } from './utils';

export interface PopoverMetadata {
  term: string;
  slug: string;
  category: string;
  shortDef: string;
  type: 'glossary' | 'article';
}

/**
 * Resolves all [[WikiLinks]] in a markdown string and returns metadata for hover popovers
 */
export async function extractAndResolveWikiLinks(markdown: string): Promise<Map<string, PopoverMetadata>> {
  const regex = /\[\[(.*?)\]\]/g;
  const matches = [...markdown.matchAll(regex)];
  const resolved = new Map<string, PopoverMetadata>();

  if (matches.length === 0) return resolved;

  // Extract raw targets
  const targets = matches.map((m) => {
    const rawContent = m[1].trim();
    const parts = rawContent.split('|');
    return {
      raw: rawContent,
      target: parts[0].trim(),
      slug: slugify(parts[0].trim()),
    };
  });

  const slugs = targets.map((t) => t.slug);

  // Fetch glossary definitions
  const glossaryItems = await prisma.glossaryTerm.findMany({
    where: { slug: { in: slugs } },
    select: { term: true, slug: true, category: true, shortDef: true },
  });

  glossaryItems.forEach((g) => {
    resolved.set(g.slug, {
      term: g.term,
      slug: g.slug,
      category: g.category,
      shortDef: g.shortDef,
      type: 'glossary',
    });
  });

  // Fetch articles if not in glossary
  const articleItems = await prisma.article.findMany({
    where: { slug: { in: slugs }, status: 'PUBLISHED' },
    select: { title: true, slug: true, excerpt: true, category: { select: { name: true } } },
  });

  articleItems.forEach((d) => {
    if (!resolved.has(d.slug)) {
      resolved.set(d.slug, {
        term: d.title,
        slug: d.slug,
        category: d.category.name,
        shortDef: d.excerpt,
        type: 'article',
      });
    }
  });

  return resolved;
}

export const parseWikiLinks = extractAndResolveWikiLinks;
