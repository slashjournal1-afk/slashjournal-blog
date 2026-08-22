# Navbar, Article Discovery, and Mobile Reflow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a professional two-level public navbar, contextual article discovery lists, and source-level mobile reflow fixes for article detail pages.

**Architecture:** Keep public navigation data static in `Navbar.tsx`. Add a cached server-side discovery loader in `content-loaders.ts` using the existing Prisma article model and public eligibility predicate. Render discovery with a focused server component and fix overflow in the article page and shared rich-content styles only where the rendered content requires it.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript 5, Tailwind CSS 3, Prisma 6, Lucide React.

## Global Constraints

- Preserve Awesomic Zinc & Ember tokens, hairline borders, and existing typography.
- Do not add dependencies or modify the Prisma schema.
- Public discovery must use `status: 'PUBLISHED'`, `isIndexable: true`, and `category.isIndexable: true`.
- Trending means articles published in the previous 30 days ordered by lifetime views.
- Recommendations rank same series, shared tags, same category, then recency.
- Solve mobile overflow at responsible containers; do not hide it globally with page-level clipping.
- Verify at 320px, 768px, 1024px, and 1440px.

---

### Task 1: Add the article discovery loader

**Files:**
- Modify: `src/lib/content-loaders.ts`
- Modify: `src/app/(public)/[slug]/page.tsx`

**Interfaces:**
- Produce `getArticleDiscovery(context)` returning `{ recommendations, trending, popular }` compact article arrays.
- Consume the current article's `id`, `categoryId`, optional `seriesId`, and tag IDs.

- [ ] Add shared public eligibility and compact article selection in `content-loaders.ts`, preserving the existing article loader behavior.
- [ ] Start recommendation, trending, and popular candidate queries in parallel with `Promise.all`.
- [ ] Rank recommendation candidates in memory by series, shared tag count, category, and publication date.
- [ ] Deduplicate current article and already-selected IDs in recommendation, trending, popular order.
- [ ] Update `getRelatedArticles` to apply article and category indexability filters, or remove its use when the new discovery band replaces it.
- [ ] Update the article page data fetch to request discovery in parallel with glossary and ad data.

Verification: `npx tsc --noEmit` must report no TypeScript errors.

### Task 2: Upgrade the public navbar

**Files:**
- Modify: `src/components/layout/Navbar.tsx`

**Interfaces:**
- Preserve existing auth, search, theme, account, and mobile menu behavior.
- Add a secondary navigation row using existing routes only.

- [ ] Keep the primary masthead controls and add a compact secondary `nav` row for channels and discovery.
- [ ] Mark active links with text weight and Ember underline while retaining non-color state.
- [ ] Make the secondary row locally horizontally scrollable on mobile without widening the document.
- [ ] Keep mobile controls at least 44px high and close open menus on pathname changes.
- [ ] Do not add a dead `Terpopuler` route; use an existing route/anchor only if one exists, otherwise omit it.

Verification: inspect the rendered markup and run `npx tsc --noEmit`.

### Task 3: Render the three-column discovery band

**Files:**
- Create: `src/components/content/ArticleDiscoveryBand.tsx`
- Modify: `src/app/(public)/[slug]/page.tsx`

**Interfaces:**
- Consume the loader result from Task 1.
- Render up to three entries per section with semantic headings and lists.

- [ ] Build a server component with three equal desktop columns and stacked mobile sections.
- [ ] Render recommendation date, trending date/views, and popular ranking/views as distinct metadata.
- [ ] Omit an empty section with a plain-language empty state; omit the entire band when all arrays are empty.
- [ ] Remove or replace the old same-purpose `Lanjutkan Membaca` output so recommendations are not duplicated.
- [ ] Keep previous/next series chapter navigation near the article body.

Verification: `npx tsc --noEmit` and manual link/heading inspection.

### Task 4: Fix article-detail mobile reflow

**Files:**
- Modify: `src/app/(public)/[slug]/page.tsx`
- Modify: `src/components/content/ArticleContentRenderer.tsx`
- Modify: `src/components/wiki/MultiTabCode.tsx`
- Modify: `src/components/wiki/MermaidDiagram.tsx`
- Modify: any shared style file identified by the existing renderer classes

**Interfaces:**
- Preserve Markdown, WikiLinks, code tabs, Mermaid, comments, reactions, ads, and bookmark behavior.

- [ ] Add `min-w-0`, fluid width, and wrapping to article grid/metadata/content containers.
- [ ] Make breadcrumb and metadata rows wrap or stack at narrow widths.
- [ ] Bound images, SVGs, diagrams, and embeds to their parent width.
- [ ] Give code blocks, tables, and other intentionally wide technical content local overflow containers.
- [ ] Ensure tags, comments, reactions, newsletter form, and chapter navigation can wrap without fixed-width overflow.
- [ ] Do not add global `overflow-x-hidden` as a substitute for fixing the overflowing child.

Verification: inspect at 320px and 400% zoom equivalent, then run lint/typecheck/build.

### Task 5: Run full verification and review the diff

**Files:**
- Verify: all files above

- [ ] Run `npx tsc --noEmit`.
- [ ] Run `npm run lint`.
- [ ] Run `npm run build`.
- [ ] Review `git diff` for unrelated changes, duplicated discovery UI, invalid routes, and global overflow clipping.
- [ ] Check `git status --short` and report pre-existing untracked files without modifying them.
