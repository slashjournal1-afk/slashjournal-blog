# SlashJournal Landing Editorial Index Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand the SlashJournal landing page into an editorial index with one lead article, six latest articles, five popular references, and five additional recent references without duplicate content.

**Architecture:** Keep the landing page as a server component and use two focused Prisma article queries in parallel with the existing category, series, glossary, and ad queries. Group records with a `Set<string>` in the page boundary, then render the main stream through the existing `ArticleRow` and the new `ReferenceRail` presentation component.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Prisma 6, Tailwind CSS 3, existing SlashJournal design tokens, `lucide-react` only where an icon is useful.

## Global Constraints

- Use `publishedAt` as the primary publication order and fall back to `createdAt` only for legacy published rows without `publishedAt`.
- Lead: one most recently published article.
- Latest: the next six most recently published articles after the lead.
- Popular: up to five articles ordered by `viewCount` descending, excluding the lead.
- More recent: up to five recently published articles excluding every article already used by the lead, latest, or popular groups.
- All groups may contain fewer items when the database has insufficient published articles.
- Duplicate article IDs must never appear in more than one group.
- Sponsored articles remain eligible and retain explicit sponsor labeling.
- Preserve Obsidian, Graphite, Fog, Cloud, Paper, Snow, and Ember tokens from `DESIGN.md`.
- Use semantic ordered list markup for popular ranks and semantic list markup for additional recent references.
- Do not add database schema changes, dependencies, gradients, decorative statistics, or uniform news cards.
- Keep channel paths, series, glossary, banner ad, in-feed ad, and newsletter behavior functional.
- Verify at 320px, 768px, 1024px, and 1440px.

---

### Task 1: Add The Reference Rail Component

**Files:**
- Create: `src/components/content/ReferenceRail.tsx`
- Modify: `src/styles/globals.css` only if a focused rail utility is needed
- Test: `npx tsc --noEmit`

**Interfaces:**
- Consumes: article view models with `id`, `slug`, `title`, `category.name`, `viewCount`, and `publishedAt`/`createdAt`.
- Produces: `ReferenceRail` with `popular` and `recent` arrays, semantic list markup, rank numbers only for popular items, and no images.

- [ ] **Step 1: Define the exact view model**

  Add a local exported type:

  ```ts
  export type ReferenceArticle = {
    id: string;
    slug: string;
    title: string;
    viewCount: number;
    publishedAt: Date | null;
    createdAt: Date;
    category: { name: string };
  };
  ```

  The component should not depend on the full Prisma `Article` type.

- [ ] **Step 2: Render the reference rail structure**

  Implement:

  ```tsx
  export function ReferenceRail({ popular, recent }: { popular: ReferenceArticle[]; recent: ReferenceArticle[] }) {
    return (
      <aside aria-labelledby="reference-rail-title" className="lg:sticky lg:top-24">
        <h2 id="reference-rail-title">Pilihan untuk dibaca</h2>
        <section aria-labelledby="popular-title">
          <h3 id="popular-title">Paling banyak dibaca</h3>
          <ol>{popular.map((article, index) => <li key={article.id}>...</li>)}</ol>
        </section>
        <section aria-labelledby="recent-reference-title">
          <h3 id="recent-reference-title">Baru lainnya</h3>
          <ul>{recent.map((article) => <li key={article.id}>...</li>)}</ul>
        </section>
      </aside>
    );
  }
  ```

  Popular rows show rank, title, category, and `viewCount` as `{number} pembaca`. Recent rows show title, category, and formatted date. Every row is a real `Link` to `/${article.slug}`.

- [ ] **Step 3: Apply the restrained call-stack divider**

  Use a border-left or equivalent Cloud hairline around the two subsection blocks. Do not use Ember for the divider and do not add decorative numbering to the recent subsection.

- [ ] **Step 4: Compile the new component**

  Run: `npx tsc --noEmit`

  Expected: no TypeScript errors.

---

### Task 2: Expand Landing Queries And Deduplicate Groups

**Files:**
- Modify: `src/app/(public)/page.tsx`
- Test: `npx tsc --noEmit`

**Interfaces:**
- Consumes: existing landing queries and `ReferenceRail`'s `ReferenceArticle` shape.
- Produces: `lead`, `latest`, `popular`, and `moreRecent` arrays with unique IDs and correct ordering.

- [ ] **Step 1: Replace the single nine-row article query with focused queries**

  Use a shared `publishedWhere` and parallel queries:

  ```ts
  const publishedWhere = { status: 'PUBLISHED' as const };
  const articleSelect = {
    id: true,
    slug: true,
    title: true,
    excerpt: true,
    coverImageUrl: true,
    isSponsored: true,
    sponsorName: true,
    readingTime: true,
    viewCount: true,
    publishedAt: true,
    createdAt: true,
    category: { select: { name: true, slug: true } },
    author: { select: { displayName: true } },
  } as const;

  const [recentArticles, popularArticles, categories, seriesList, glossaryTerms, leaderboardAd, inFeedAd] = await Promise.all([
    prisma.article.findMany({ where: publishedWhere, select: articleSelect, orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }], take: 12 }),
    prisma.article.findMany({ where: publishedWhere, select: articleSelect, orderBy: [{ viewCount: 'desc' }, { publishedAt: 'desc' }], take: 12 }),
    // preserve the existing category, series, glossary, and ad queries
  ]);
  ```

  The exact Prisma type for `status` may require the existing string style used in this project; preserve compilation rather than introducing an enum conversion.

- [ ] **Step 2: Build unique groups with a Set**

  Add a small pure grouping block after the query:

  ```ts
  const used = new Set<string>();
  const lead = recentArticles[0] ?? null;
  if (lead) used.add(lead.id);

  const latest = recentArticles.slice(1).filter((article) => {
    if (used.has(article.id) || latest.length >= 6) return false;
    used.add(article.id);
    return true;
  });

  const popular = popularArticles.filter((article) => {
    if (used.has(article.id) || popular.length >= 5) return false;
    used.add(article.id);
    return true;
  });

  const moreRecent = recentArticles.filter((article) => {
    if (used.has(article.id) || moreRecent.length >= 5) return false;
    used.add(article.id);
    return true;
  });
  ```

  Because `latest`, `popular`, and `moreRecent` cannot be referenced during their own initializer, implement the same logic with mutable local arrays declared before the filters or a helper function:

  ```ts
  const latest = [];
  for (const article of recentArticles.slice(1)) {
    if (latest.length === 6 || used.has(article.id)) continue;
    latest.push(article);
    used.add(article.id);
  }
  ```

  Use this valid loop form for all three groups.

- [ ] **Step 3: Preserve the lead and latest article props**

  Keep `ArticleRow` props for excerpt, cover image, sponsored state, sponsor name, category, date, and reading time. Do not pass full Prisma records through a new client component.

- [ ] **Step 4: Compile after query changes**

  Run: `npx tsc --noEmit`

  Expected: no TypeScript errors.

---

### Task 3: Replace The Landing Latest/Sidebar Area

**Files:**
- Modify: `src/app/(public)/page.tsx`
- Test: homepage visual check at 320px, 768px, 1024px, and 1440px

**Interfaces:**
- Consumes: `lead`, `latest`, `popular`, `moreRecent`, existing `InFeedAd`, `SectionHeading`, and `ArticleRow`.
- Produces: the two-column Editorial Index with six latest rows and a reference rail.

- [ ] **Step 1: Import `ReferenceRail`**

  Add:

  ```tsx
  import { ReferenceRail } from '@/components/content/ReferenceRail';
  ```

- [ ] **Step 2: Replace the current `latest` plus series/glossary grid**

  Use an editorial index section:

  ```tsx
  <section id="latest-writing" className="grid gap-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]">
    <div>
      <SectionHeading title="Tulisan terbaru" description="Naskah baru dan pembaruan dari ruang kerja editorial." />
      <div className="mt-2">
        {latest.map((article, index) => (
          <React.Fragment key={article.id}>
            <ArticleRow
              href={`/${article.slug}`}
              title={article.title}
              excerpt={article.excerpt}
              category={article.category.name}
              date={formatDate(article.publishedAt || article.createdAt)}
              readingTime={article.readingTime}
              imageUrl={index < 3 ? article.coverImageUrl : null}
              sponsored={article.isSponsored}
              sponsorName={article.sponsorName}
            />
            {index === 1 && <InFeedAd ad={inFeedAd} className="my-6" />}
          </React.Fragment>
        ))}
      </div>
    </div>
    <ReferenceRail popular={popular} recent={moreRecent} />
  </section>
  ```

  Keep the existing series/glossary aside in a separate section after the Editorial Index. This makes the reference rail serve article discovery while series/glossary retain their learning-directory role.

- [ ] **Step 3: Add a useful low-content state**

  If no latest articles exist, render a `role="status"` message with links to `/series` and `/glossary`. Do not render an empty heading or an empty list with no explanation.

- [ ] **Step 4: Verify the visible group counts against available content**

  Use the database's actual published rows. When at least 17 unique published articles exist, the homepage must show 1 lead, 6 latest, 5 popular, and 5 recent references. When fewer exist, it must show each available group without duplicates.

---

### Task 4: Verify Build, Runtime, And Accessibility

**Files:**
- Modify: only files required by verification findings
- Test: TypeScript, production build, homepage HTTP response, manual responsive and keyboard checks

**Interfaces:**
- Consumes: completed Editorial Index implementation.
- Produces: verified landing page and preserved existing routes.

- [ ] **Step 1: Run TypeScript verification**

  Run: `npx tsc --noEmit`

  Expected: no errors.

- [ ] **Step 2: Run the production build**

  Run: `npm run build`

  Expected: Prisma generation, Next compilation, type checking, and page generation succeed.

- [ ] **Step 3: Start the development server and check homepage response**

  Run: `npm run dev`

  Then request `http://localhost:3000/` and confirm HTTP `200` with the landing page HTML. Stop the dev server after verification.

- [ ] **Step 4: Check responsive layout**

  Inspect the homepage at 320px, 768px, 1024px, and 1440px. Confirm the rail stacks below latest articles on mobile, sits beside them at large widths, and never creates horizontal overflow.

- [ ] **Step 5: Check semantics and keyboard states**

  Confirm one H1, one `ol` for popular references, one `ul` for recent references, visible focus on all rail links, and no truncated essential titles.

- [ ] **Step 6: Check preserved sections and routes**

  Confirm channel links, series links, glossary links, banner ad, in-feed ad, newsletter form, article links, RSS, search, and auth remain available after the landing change.

## Self-Review

- Every requirement in the landing Editorial Index spec maps to a task.
- Query ordering, fallback behavior, and deduplication are explicit.
- The plan avoids database migrations and new dependencies.
- The reference rail is a focused presentation component, not a second data-fetching layer.
- The plan preserves the existing series/glossary sections instead of collapsing all discovery into one overloaded block.
