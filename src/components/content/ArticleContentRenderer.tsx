import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MermaidDiagram } from '@/components/wiki/MermaidDiagram';
import { MultiTabCode } from '@/components/wiki/MultiTabCode';
import { WikiLinkPopover } from '@/components/wiki/WikiLinkPopover';
import { Info, Sparkles, AlertTriangle, AlertCircle, ExternalLink, ChevronDown } from 'lucide-react';
import { slugify } from '@/lib/utils';

export interface GlossaryItem {
  term: string;
  slug: string;
  shortDef?: string | null;
  category?: string | null;
}

export interface ArticleContentRendererProps {
  content: string;
  glossary?: GlossaryItem[];
  className?: string;
}

export function ArticleContentRenderer({
  content,
  glossary = [],
  className = '',
}: ArticleContentRendererProps) {
  if (!content) return null;

  // Normalize Windows CRLF to standard LF
  const normalized = content.replace(/\r\n/g, '\n');

  // Step 1: Tokenize blocks separating Fenced Code Blocks, Details accordions, etc.
  const tokens = tokenizeMarkdownBlocks(normalized);

  return (
    <div className={`article-prose min-w-0 max-w-full space-y-6 ${className}`}>
      {tokens.map((token, idx) => renderToken(token, idx, glossary))}
    </div>
  );
}

// ==========================================
// Tokenization & Parsing
// ==========================================

interface MarkdownToken {
  type:
    | 'mermaid'
    | 'tabs'
    | 'code'
    | 'heading'
    | 'callout'
    | 'blockquote'
    | 'table'
    | 'unordered_list'
    | 'ordered_list'
    | 'hr'
    | 'image'
    | 'details'
    | 'paragraph';
  content: string;
  summary?: string;
  level?: number;
  language?: string;
  calloutType?: 'NOTE' | 'TIP' | 'IMPORTANT' | 'WARNING' | 'CAUTION';
  tableData?: { headers: string[]; rows: string[][] };
  listItems?: string[];
  caption?: string;
  alt?: string;
  src?: string;
}

function tokenizeMarkdownBlocks(rawText: string): MarkdownToken[] {
  const tokens: MarkdownToken[] = [];
  
  // Split on code blocks and details blocks first
  const blockRegex = /(```(?:[a-zA-Z0-9_-]+)?[\s\S]*?```|<\s*details[\s\S]*?<\/\s*details\s*>)/gi;
  const rawSegments = rawText.split(blockRegex);

  for (const segment of rawSegments) {
    if (!segment) continue;

    const trimmedSeg = segment.trim();

    // Check if segment is a details accordion block
    if (/^<\s*details[\s\S]*?<\/\s*details\s*>$/i.test(trimmedSeg)) {
      const summaryMatch = trimmedSeg.match(/<\s*summary[^>]*>([\s\S]*?)<\s*\/\s*summary>/i);
      const summaryText = summaryMatch ? summaryMatch[1].trim() : 'Detail Informasi';

      let body = trimmedSeg
        .replace(/^<\s*details[^>]*>/i, '')
        .replace(/<\s*\/\s*details\s*>$/i, '');
      if (summaryMatch) {
        body = body.replace(summaryMatch[0], '');
      }

      tokens.push({
        type: 'details',
        summary: summaryText,
        content: body.trim(),
      });
      continue;
    }

    // Check if segment is a code block
    if (segment.startsWith('```')) {
      const firstLineEnd = segment.indexOf('\n');
      let lang = 'text';
      let code = '';

      if (firstLineEnd !== -1) {
        lang = segment.slice(3, firstLineEnd).trim().toLowerCase();
        code = segment.slice(firstLineEnd + 1).replace(/```$/, '').trim();
      } else {
        code = segment.slice(3).replace(/```$/, '').trim();
      }

      if (lang === 'mermaid') {
        tokens.push({ type: 'mermaid', content: code });
      } else if (lang === 'tabs') {
        tokens.push({ type: 'tabs', content: code });
      } else {
        tokens.push({
          type: 'code',
          content: code,
          language: lang || 'typescript',
        });
      }
      continue;
    }

    // Segment is regular markdown text, split by double newlines into blocks
    const chunks = segment.split(/\n{2,}/);

    for (const chunk of chunks) {
      const trimmed = chunk.trim();
      if (!trimmed) continue;

      // 1. Horizontal Rule (---, ***, ___)
      if (/^(\-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
        tokens.push({ type: 'hr', content: '' });
        continue;
      }

      // 2. Headings (##, ###, ####)
      const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
      if (headingMatch && !trimmed.includes('\n')) {
        tokens.push({
          type: 'heading',
          level: headingMatch[1].length,
          content: headingMatch[2].trim(),
        });
        continue;
      }

      // 3. Callout / Alert Box (> [!NOTE], > [!TIP], > [!IMPORTANT], > [!WARNING], > [!CAUTION])
      const calloutMatch = trimmed.match(/^>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/i);
      if (calloutMatch) {
        const calloutType = calloutMatch[1].toUpperCase() as 'NOTE' | 'TIP' | 'IMPORTANT' | 'WARNING' | 'CAUTION';
        // Clean out all '> ' markers
        const lines = trimmed.split('\n');
        const contentLines = lines.slice(1).map((l) => l.replace(/^>\s?/, ''));
        tokens.push({
          type: 'callout',
          calloutType,
          content: contentLines.join('\n').trim(),
        });
        continue;
      }

      // 4. Standard Blockquote (> text)
      if (trimmed.startsWith('> ') || trimmed.startsWith('>')) {
        const lines = trimmed.split('\n');
        const quoteContent = lines.map((l) => l.replace(/^>\s?/, '')).join('\n').trim();
        tokens.push({
          type: 'blockquote',
          content: quoteContent,
        });
        continue;
      }

      // 5. Table (detected by pipe structure)
      if (trimmed.startsWith('|') && trimmed.includes('\n|') && trimmed.includes('---')) {
        const tableParsed = parseMarkdownTable(trimmed);
        if (tableParsed) {
          tokens.push({
            type: 'table',
            content: trimmed,
            tableData: tableParsed,
          });
          continue;
        }
      }

      // 6. Ordered List (1. item, 2. item)
      if (/^\d+\.\s+/.test(trimmed)) {
        const items = parseListItems(trimmed, true);
        if (items.length > 0) {
          tokens.push({
            type: 'ordered_list',
            content: trimmed,
            listItems: items,
          });
          continue;
        }
      }

      // 7. Unordered List (- item, * item, + item)
      if (/^[\-\*\+]\s+/.test(trimmed)) {
        const items = parseListItems(trimmed, false);
        if (items.length > 0) {
          tokens.push({
            type: 'unordered_list',
            content: trimmed,
            listItems: items,
          });
          continue;
        }
      }

      // 8. Image Block (![alt](url) with optional caption on next line or <img ...>)
      const imageBlockMatch = trimmed.match(/^!\[(.*?)\]\((.*?)(?:\s+"(.*?)")?\)(?:\s*\n+[\*\_]?(.*?)[\*\_]?)?$/s);
      const htmlImgMatch = trimmed.match(/^<img\s+[^>]*src=["']([^"']+)["'][^>]*alt=["']?([^"']*)["']?[^>]*\/?>/i);

      if (imageBlockMatch) {
        tokens.push({
          type: 'image',
          alt: imageBlockMatch[1],
          src: imageBlockMatch[2],
          caption: imageBlockMatch[4] || imageBlockMatch[3] || undefined,
          content: trimmed,
        });
        continue;
      } else if (htmlImgMatch) {
        tokens.push({
          type: 'image',
          src: htmlImgMatch[1],
          alt: htmlImgMatch[2] || '',
          content: trimmed,
        });
        continue;
      }

      // 9. Standard Paragraph
      tokens.push({
        type: 'paragraph',
        content: trimmed,
      });
    }
  }

  return tokens;
}

function parseMarkdownTable(text: string): { headers: string[]; rows: string[][] } | null {
  const lines = text.trim().split('\n').map((l) => l.trim()).filter(Boolean);
  if (lines.length < 2) return null;

  // First line: Headers
  const headerLine = lines[0];
  const headers = headerLine
    .split('|')
    .slice(1, -1)
    .map((h) => h.trim());

  if (headers.length === 0) return null;

  // Second line: Separator line (must contain ---)
  const sepLine = lines[1];
  if (!sepLine.includes('---')) return null;

  // Remaining lines: Data rows
  const rows: string[][] = [];
  for (let i = 2; i < lines.length; i++) {
    const line = lines[i];
    if (!line.startsWith('|')) continue;
    const cells = line
      .split('|')
      .slice(1, -1)
      .map((c) => c.trim());
    if (cells.length > 0) {
      rows.push(cells);
    }
  }

  return { headers, rows };
}

function parseListItems(text: string, isOrdered: boolean): string[] {
  const lines = text.split('\n');
  const items: string[] = [];
  let currentItem = '';

  for (const line of lines) {
    const match = isOrdered ? line.match(/^\d+\.\s+(.*)/) : line.match(/^[\-\*\+]\s+(.*)/);
    if (match) {
      if (currentItem) items.push(currentItem);
      currentItem = match[1].trim();
    } else if (currentItem) {
      // Continuation of previous item
      currentItem += ' ' + line.trim();
    }
  }
  if (currentItem) items.push(currentItem);

  return items;
}

// ==========================================
// Block Component Renderers
// ==========================================

function renderToken(token: MarkdownToken, idx: number, glossary: GlossaryItem[]) {
  switch (token.type) {
    case 'mermaid':
      return (
        <div key={idx} className="my-8">
          <MermaidDiagram chart={token.content} />
        </div>
      );

    case 'tabs':
      return (
        <div key={idx} className="my-8">
          <MultiTabCode rawCode={token.content} />
        </div>
      );

    case 'code':
      return (
        <div key={idx} className="my-8">
          <MultiTabCode
            rawCode={token.content}
            defaultLanguage={token.language || 'typescript'}
            title={token.language ? token.language.toUpperCase() : 'Snippet'}
          />
        </div>
      );

    case 'heading': {
      const text = token.content;
      const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');

      if (token.level === 1 || token.level === 2) {
        return (
          <h2
            key={idx}
            id={id}
            className="mt-14 border-t border-[var(--border-color)] pt-8 font-display text-2xl font-medium tracking-tight text-[var(--text-primary)] first:mt-0 first:border-t-0 sm:text-[28px]"
          >
            {renderInlineFormattedText(text, glossary)}
          </h2>
        );
      }

      if (token.level === 3) {
        return (
          <h3
            key={idx}
            id={id}
            className="mt-10 font-display text-xl font-medium tracking-tight text-[var(--text-primary)] sm:text-[22px]"
          >
            {renderInlineFormattedText(text, glossary)}
          </h3>
        );
      }

      return (
        <h4
          key={idx}
          id={id}
          className="mt-8 font-display text-lg font-semibold tracking-tight text-[var(--text-primary)]"
        >
          {renderInlineFormattedText(text, glossary)}
        </h4>
      );
    }

    case 'callout': {
      const type = token.calloutType || 'NOTE';
      const config = {
        NOTE: {
          label: 'Catatan Arsitektur',
          icon: <Info className="w-4 h-4 text-blue-500 shrink-0" />,
          containerClass: 'bg-blue-50/50 dark:bg-blue-950/20 border-l-4 border-blue-500 text-blue-950 dark:text-blue-200',
          labelClass: 'text-blue-600 dark:text-blue-400',
        },
        TIP: {
          label: 'Tips Kinerja & Best Practice',
          icon: <Sparkles className="w-4 h-4 text-emerald-500 shrink-0" />,
          containerClass: 'bg-emerald-50/50 dark:bg-emerald-950/20 border-l-4 border-emerald-500 text-emerald-950 dark:text-emerald-200',
          labelClass: 'text-emerald-600 dark:text-emerald-400',
        },
        IMPORTANT: {
          label: 'Penting',
          icon: <AlertCircle className="w-4 h-4 text-[var(--accent)] shrink-0" />,
          containerClass: 'bg-emerald-50/40 dark:bg-zinc-900/40 border-l-4 border-[var(--accent)] text-[var(--text-primary)]',
          labelClass: 'text-[var(--accent)]',
        },
        WARNING: {
          label: 'Peringatan Sistem',
          icon: <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />,
          containerClass: 'bg-amber-50/50 dark:bg-amber-950/20 border-l-4 border-amber-500 text-amber-950 dark:text-amber-200',
          labelClass: 'text-amber-600 dark:text-amber-400',
        },
        CAUTION: {
          label: 'Perhatian Kritis',
          icon: <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />,
          containerClass: 'bg-rose-50/50 dark:bg-rose-950/20 border-l-4 border-rose-500 text-rose-950 dark:text-rose-200',
          labelClass: 'text-rose-600 dark:text-rose-400',
        },
      }[type];

      return (
        <div
          key={idx}
          className={`my-6 rounded-r-2xl p-5 text-[15px] leading-relaxed shadow-xs ${config.containerClass}`}
        >
          <div className="flex items-center gap-2 mb-2">
            {config.icon}
            <span className={`text-[11px] font-bold uppercase tracking-wider ${config.labelClass}`}>
              {config.label}
            </span>
          </div>
          <div className="pl-6 space-y-2">
            {token.content.split('\n').map((line, lIdx) => (
              <p key={lIdx} className="leading-relaxed">
                {renderInlineFormattedText(line, glossary)}
              </p>
            ))}
          </div>
        </div>
      );
    }

    case 'blockquote':
      return (
        <blockquote
          key={idx}
          className="my-8 border-l-2 border-[var(--accent)] py-2 pl-6 font-display text-xl italic leading-relaxed text-[var(--text-primary)] sm:text-2xl"
        >
          {token.content.split('\n').map((line, lIdx) => (
            <p key={lIdx} className="mb-2 last:mb-0">
              {renderInlineFormattedText(line, glossary)}
            </p>
          ))}
        </blockquote>
      );

    case 'table': {
      const tableData = token.tableData;
      if (!tableData) return null;

      return (
        <div
          key={idx}
          className="my-8 overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] shadow-xs"
        >
          <div className="max-w-full overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead className="border-b border-[var(--border-color)] bg-[var(--bg-card-muted)] text-[12px] uppercase tracking-wider text-[var(--text-muted)]">
                <tr>
                  {tableData.headers.map((h, hIdx) => (
                    <th key={hIdx} className="px-5 py-3.5 font-semibold text-[var(--text-primary)]">
                      {renderInlineFormattedText(h, glossary)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {tableData.rows.map((row, rIdx) => (
                  <tr
                    key={rIdx}
                    className="transition-colors hover:bg-[var(--bg-card-muted)]/50"
                  >
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="px-5 py-3.5 text-[var(--text-secondary)]">
                        {renderInlineFormattedText(cell, glossary)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    case 'ordered_list':
      return (
        <ol key={idx} className="my-5 list-decimal space-y-2.5 pl-6 text-[17px] leading-[1.75] text-[var(--text-secondary)]">
          {token.listItems?.map((item, itemIdx) => (
            <li key={itemIdx} className="pl-1">
              {renderInlineFormattedText(item, glossary)}
            </li>
          ))}
        </ol>
      );

    case 'unordered_list':
      return (
        <ul key={idx} className="my-5 list-disc space-y-2.5 pl-6 text-[17px] leading-[1.75] text-[var(--text-secondary)]">
          {token.listItems?.map((item, itemIdx) => (
            <li key={itemIdx} className="pl-1">
              {renderInlineFormattedText(item, glossary)}
            </li>
          ))}
        </ul>
      );

    case 'hr':
      return <hr key={idx} className="my-10 border-0 h-px bg-[var(--border-color)]" />;

    case 'image': {
      const captionText = token.caption || token.alt;
      return (
        <figure key={idx} className="my-8 group">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[24px] bg-[var(--bg-card-muted)] border border-[var(--border-color)] shadow-xs transition-all hover:shadow-md">
            <Image
              src={token.src || ''}
              alt={token.alt || 'Gambar Konten'}
              fill
              unoptimized={Boolean(
                token.src?.startsWith('/uploads') ||
                token.src?.startsWith('data:') ||
                token.src?.includes('unsplash.com') ||
                token.src?.includes('supabase.co')
              )}
              sizes="(min-width: 1024px) 860px, 100vw"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.01]"
            />
          </div>
          {captionText && (
            <figcaption className="mt-3 text-center text-xs sm:text-[13px] font-medium text-[var(--text-muted)] italic leading-relaxed px-4">
              {renderInlineFormattedText(captionText, glossary)}
            </figcaption>
          )}
        </figure>
      );
    }

    case 'details': {
      const summaryText = token.summary || 'Detail Tambahan';
      const bodyLines = token.content.split('\n');

      return (
        <details
          key={idx}
          className="group my-6 rounded-[20px] bg-white dark:bg-[#18181b] border border-[#ececee] dark:border-[#27272a] shadow-xs overflow-hidden transition-all open:border-[var(--accent)] open:shadow-sm"
        >
          <summary className="flex items-center justify-between p-4 sm:p-5 cursor-pointer font-bold text-sm sm:text-[15px] text-[var(--text-primary)] hover:bg-[var(--bg-card-muted)] select-none transition-colors list-none [&::-webkit-details-marker]:hidden">
            <span className="flex items-center gap-2">
              {renderInlineFormattedText(summaryText, glossary)}
            </span>
            <ChevronDown className="w-4 h-4 text-[#71717a] shrink-0 group-open:rotate-180 transition-transform duration-200" />
          </summary>
          <div className="border-t border-[#ececee] dark:border-[#27272a] p-5 sm:p-6 text-[15px] leading-relaxed text-[var(--text-secondary)] space-y-3 bg-[#fafafa]/60 dark:bg-[#141416]/60">
            {bodyLines.map((line, lIdx) => {
              if (!line.trim()) return null;
              return (
                <p key={lIdx} className="leading-relaxed">
                  {renderInlineFormattedText(line, glossary)}
                </p>
              );
            })}
          </div>
        </details>
      );
    }

    case 'paragraph':
    default:
      return (
        <p key={idx} className="text-[17px] leading-[1.75] text-[var(--text-secondary)]">
          {renderInlineFormattedText(token.content, glossary)}
        </p>
      );
  }
}

// ==========================================
// Inline Markdown & WikiLink Parser
// ==========================================

export function renderInlineFormattedText(text: string, glossary: GlossaryItem[] = []): React.ReactNode {
  if (!text) return null;

  // Step 1: Split text by WikiLinks [[term|Label]] or [[term]]
  const wikiLinkRegex = /(\[\[.*?\]\])/g;
  const parts = text.split(wikiLinkRegex);

  return parts.map((part, i) => {
    // Check if part is a WikiLink
    if (part.startsWith('[[') && part.endsWith(']]')) {
      const rawContent = part.slice(2, -2).trim();
      const [target, customLabel] = rawContent.split('|').map((s) => s.trim());
      const slug = slugify(target);
      const label = customLabel || target;

      const found = glossary.find(
        (g) => g.slug === slug || g.term.toLowerCase() === target.toLowerCase()
      );

      return (
        <WikiLinkPopover
          key={i}
          conceptName={found ? found.term : label}
          slug={found ? found.slug : slug}
          shortDef={found?.shortDef || undefined}
          category={found?.category || undefined}
        />
      );
    }

    // Parse standard inline markdown formatting (bold, italic, code, links, HTML tags)
    return <span key={i}>{parseStandardInline(part)}</span>;
  });
}

function parseStandardInline(text: string): React.ReactNode {
  if (!text) return null;

  // Regex capturing:
  // 1. Inline code: `code` or <code>code</code>
  // 2. Links: [label](url)
  // 3. Bold: **bold**, __bold__, <strong>bold</strong>, <b>bold</b>
  // 4. Italic: *italic*, _italic_, <em>italic</em>, <i>italic</i>
  // 5. Underline: <u>text</u>
  // 6. Keyboard: <kbd>text</kbd>
  // 7. Strikethrough: ~~del~~, <del>del</del>, <s>del</s>
  // 8. Highlight: <mark>text</mark>
  const inlineRegex = /(<code>[\s\S]*?<\/code>|`[^`]+`|\[[^\]]+\]\([^\)]+\)|<strong>[\s\S]*?<\/strong>|<b>[\s\S]*?<\/b>|\*\*[^*]+\*\*|__[^_]+__|<em>[\s\S]*?<\/em>|<i>[\s\S]*?<\/i>|(?<!\*)\*[^*]+\*(?!\*)|(?<!_)_[^_]+_(?!_)|<del>[\s\S]*?<\/del>|<s>[\s\S]*?<\/s>|~~[^~]+~~|<u>[\s\S]*?<\/u>|<kbd>[\s\S]*?<\/kbd>|<mark>[\s\S]*?<\/mark>)/gi;
  const segments = text.split(inlineRegex);

  return segments.map((seg, idx) => {
    if (!seg) return null;

    // 1. Inline Code: `...` or <code>...</code>
    if (
      (seg.startsWith('`') && seg.endsWith('`') && seg.length >= 2) ||
      (/^<code[^>]*>[\s\S]*<\/code>$/i.test(seg))
    ) {
      const clean = seg.startsWith('`') ? seg.slice(1, -1) : seg.replace(/^<code[^>]*>|<\/code>$/gi, '');
      return (
        <code
          key={idx}
          className="rounded-[6px] bg-[var(--bg-card-muted)] px-1.5 py-0.5 font-mono text-[13.5px] font-medium text-[var(--accent)] border border-[var(--border-color)]"
        >
          {clean}
        </code>
      );
    }

    // 2. Link: [label](url)
    const linkMatch = seg.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
      const [, label, href] = linkMatch;
      const isExternal = href.startsWith('http') || href.startsWith('//');
      return (
        <Link
          key={idx}
          href={href}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          className="font-medium text-[var(--accent)] underline decoration-[var(--accent-line)] underline-offset-4 hover:decoration-[var(--accent)] transition-colors inline-flex items-center gap-0.5"
        >
          <span>{label}</span>
          {isExternal && <ExternalLink className="w-3 h-3 inline ml-0.5" />}
        </Link>
      );
    }

    // 3. Bold: **...**, __...__, <strong>...</strong>, <b>...</b>
    if (
      (seg.startsWith('**') && seg.endsWith('**') && seg.length >= 4) ||
      (seg.startsWith('__') && seg.endsWith('__') && seg.length >= 4) ||
      (/^<strong[^>]*>[\s\S]*<\/strong>$/i.test(seg)) ||
      (/^<b[^>]*>[\s\S]*<\/b>$/i.test(seg))
    ) {
      const clean = seg.replace(/^\*\*|^\*|^\_\_|^<strong[^>]*>|^<b[^>]*>|\*\*$|\*$|\_\_$|<\/strong>$|<\/b>$/gi, '');
      return (
        <strong key={idx} className="font-semibold text-[var(--text-primary)]">
          {clean}
        </strong>
      );
    }

    // 4. Italic: *...*, _..._, <em>...</em>, <i>...</i>
    if (
      (seg.startsWith('*') && seg.endsWith('*') && seg.length >= 2) ||
      (seg.startsWith('_') && seg.endsWith('_') && seg.length >= 2) ||
      (/^<em[^>]*>[\s\S]*<\/em>$/i.test(seg)) ||
      (/^<i[^>]*>[\s\S]*<\/i>$/i.test(seg))
    ) {
      const clean = seg.replace(/^\*|^\_|^\<em[^>]*>|^<i[^>]*>|\*$|\_$|<\/em>$|<\/i>$/gi, '');
      return (
        <em key={idx} className="italic text-[var(--text-secondary)]">
          {clean}
        </em>
      );
    }

    // 5. Underline: <u>...</u>
    if (/^<u[^>]*>[\s\S]*<\/u>$/i.test(seg)) {
      const clean = seg.replace(/^<u[^>]*>|<\/u>$/gi, '');
      return (
        <span key={idx} className="underline underline-offset-4 decoration-[var(--accent-line)]">
          {clean}
        </span>
      );
    }

    // 6. Keyboard badge: <kbd>...</kbd>
    if (/^<kbd[^>]*>[\s\S]*<\/kbd>$/i.test(seg)) {
      const clean = seg.replace(/^<kbd[^>]*>|<\/kbd>$/gi, '');
      return (
        <kbd
          key={idx}
          className="px-1.5 py-0.5 rounded bg-white dark:bg-[#27272a] border border-[#d4d4d8] dark:border-[#3f3f46] text-[#09090b] dark:text-white text-[11px] font-mono font-semibold shadow-2xs"
        >
          {clean}
        </kbd>
      );
    }

    // 7. Strikethrough: ~~...~~, <del>...</del>, <s>...</s>
    if (
      (seg.startsWith('~~') && seg.endsWith('~~') && seg.length >= 4) ||
      (/^<del[^>]*>[\s\S]*<\/del>$/i.test(seg)) ||
      (/^<s[^>]*>[\s\S]*<\/s>$/i.test(seg))
    ) {
      const clean = seg.replace(/^~~|^<del[^>]*>|^<s[^>]*>|~~$|<\/del>$|<\/s>$/gi, '');
      return (
        <del key={idx} className="line-through opacity-70 text-[var(--text-muted)]">
          {clean}
        </del>
      );
    }

    // 8. Highlight / Mark: <mark>...</mark>
    if (/^<mark[^>]*>[\s\S]*<\/mark>$/i.test(seg)) {
      const clean = seg.replace(/^<mark[^>]*>|<\/mark>$/gi, '');
      return (
        <mark key={idx} className="bg-amber-100 dark:bg-amber-950/50 text-amber-900 dark:text-amber-200 px-1 py-0.5 rounded">
          {clean}
        </mark>
      );
    }

    return seg;
  });
}
