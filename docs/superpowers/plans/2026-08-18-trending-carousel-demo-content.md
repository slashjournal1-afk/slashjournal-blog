# SlashJournal Trending Carousel And Demo Content Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Seed 12 realistic, idempotent technical demo articles and replace the landing hero with an accessible full-section carousel of up to five trending articles.

**Architecture:** Keep seeding in the existing `prisma/seed.ts` using stable slug-based `upsert` records and existing users/categories/series/tags. Keep the landing page server-rendered for data fetching, pass a focused trending view model to a small `TrendingCarousel` client component, and preserve the Editorial Index below it.

**Tech Stack:** Next.js 15, React 19, TypeScript, Prisma 6, Tailwind CSS 3, `lucide-react`, existing DM Sans/JetBrains Mono fonts.

## Global Constraints

- Add exactly 12 stable demo article slugs and use `upsert` so repeated seed runs do not duplicate rows.
- Use explicit deterministic published dates and varied view counts.
- Keep existing users, categories, series, glossary, ads, tags, comments, bookmarks, and feedback behavior.
- Do not reset/delete the database or add schema changes.
- Trending order is `viewCount` descending, then `publishedAt` descending.
- Carousel autoplay is 6 seconds, pauses on pointer/focus interaction, and is disabled for reduced motion.
- Use native links and buttons, visible focus, semantic labels, stable media aspect ratios, and no horizontal overflow.
- Keep the existing zinc/Ember design tokens and do not introduce gradients or unrelated metrics.
- `npx tsc --noEmit`, `npm run prisma:seed`, and `npm run build` must pass.

---

### Task 1: Add Idempotent Demo Article Dataset

**Files:**
- Modify: `prisma/seed.ts`
- Test: `npm run prisma:seed` twice and query article count by dummy slug

**Interfaces:**
- Consumes: existing `admin`, `catRekayasa`, `catDesain`, `catJournal`, `seriesScale`, `seriesUI`, `tagSystem`, `tagPostgres`, `tagNext`, and `tagUI` variables.
- Produces: 12 published articles and stable article IDs available to the landing trending query.

- [ ] **Step 1: Define the stable demo article data**

  Add a local array after the existing `art1`-`art4` creation block and before tag-link finalization. Use these exact slugs and topic directions:

  ```ts
  const demoArticles = [
    { slug: 'strategi-index-postgresql-untuk-query-produksi', topic: 'PostgreSQL index strategy' },
    { slug: 'memahami-isolasi-transaksi-postgresql', topic: 'transaction isolation' },
    { slug: 'rate-limiting-terdistribusi-dengan-token-bucket', topic: 'distributed rate limiting' },
    { slug: 'retry-queue-yang-tidak-menggandakan-pekerjaan', topic: 'queue retry semantics' },
    { slug: 'outbox-pattern-untuk-event-yang-konsisten', topic: 'outbox pattern' },
    { slug: 'membaca-trace-terdistribusi-saat-latensi-naik', topic: 'observability and tracing' },
    { slug: 'memilih-strategi-rendering-nextjs-untuk-halaman-data', topic: 'Next.js rendering performance' },
    { slug: 'edge-cache-dan-batas-konsistensi-data', topic: 'edge caching' },
    { slug: 'design-token-yang-tetap-terbaca-oleh-semua-orang', topic: 'accessible design tokens' },
    { slug: 'versioning-api-tanpa-memecah-klien-lama', topic: 'API versioning' },
    { slug: 'circuit-breaker-yang-tahu-kapan-harus-pulih', topic: 'circuit breaker recovery' },
    { slug: 'connection-pooling-postgresql-di-bawah-beban', topic: 'database connection pooling' },
  ];
  ```

  Replace the abbreviated `topic` values with complete Indonesian title, excerpt, contentMarkdown, category, readingTime, viewCount, publishedAt, coverImageUrl, and tag arrays in the actual implementation. Each `contentMarkdown` must contain at least two paragraphs and at least one concrete technical detail.

- [ ] **Step 2: Upsert each article by slug**

  Use a loop with this shape:

  ```ts
  const seededDemoArticles = [];
  for (const item of demoArticles) {
    const article = await prisma.article.upsert({
      where: { slug: item.slug },
      update: {
        title: item.title,
        excerpt: item.excerpt,
        contentMarkdown: item.contentMarkdown,
        categoryId: item.categoryId,
        seriesId: item.seriesId,
        seriesOrder: item.seriesOrder,
        status: 'PUBLISHED',
        readingTime: item.readingTime,
        viewCount: item.viewCount,
        coverImageUrl: item.coverImageUrl,
        authorId: admin.id,
        publishedAt: item.publishedAt,
      },
      create: {
        slug: item.slug,
        title: item.title,
        excerpt: item.excerpt,
        contentMarkdown: item.contentMarkdown,
        categoryId: item.categoryId,
        seriesId: item.seriesId,
        seriesOrder: item.seriesOrder,
        status: 'PUBLISHED',
        readingTime: item.readingTime,
        viewCount: item.viewCount,
        coverImageUrl: item.coverImageUrl,
        coverImageSourceType: item.coverImageSourceType,
        authorId: admin.id,
        publishedAt: item.publishedAt,
      },
    });
    seededDemoArticles.push(article);
  }
  ```

  Keep existing manually authored seed article updates unchanged. Do not overwrite sponsor fields on existing sponsored records.

- [ ] **Step 3: Link each demo article to existing tags**

  For each dataset item, add its tag IDs to the existing `tagLinks` array or perform `prisma.articleTag.upsert` immediately after the article upsert. Use the compound key `articleId_tagId` so rerunning the seed remains idempotent.

- [ ] **Step 4: Run the seed twice**

  Run: `npm run prisma:seed`

  Expected: success and a log showing the demo article block completed.

  Run the same command a second time.

  Expected: success with no unique constraint error or duplicate slug creation.

- [ ] **Step 5: Verify the exact dummy slug count**

  Use a one-off Prisma/TS check or Prisma Studio to confirm the 12 exact dummy slugs each resolve to one row. Do not delete unrelated data.

---

### Task 2: Build The Accessible Trending Carousel

**Files:**
- Create: `src/components/content/TrendingCarousel.tsx`
- Test: `npx tsc --noEmit`

**Interfaces:**
- Consumes: `TrendingArticle[]` from the server page.
- Produces: full-section carousel with autoplay, pause/resume, previous/next, dot controls, reduced-motion support, and empty/image fallback states.

- [ ] **Step 1: Define the serializable article props**

  Use a client-safe type where dates arrive as serialized strings if Next serialization requires it:

  ```ts
  export type TrendingArticle = {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    coverImageUrl: string | null;
    viewCount: number;
    publishedAt: string | null;
    createdAt: string;
    readingTime: number;
    category: { name: string };
  };
  ```

- [ ] **Step 2: Implement local carousel state and timer**

  Use `useState` for the active index, `useRef` for the timer, and `useEffect` to start/clear a 6000ms interval. Track `isHovered`, `isFocused`, and `isReducedMotion`. Use a `matchMedia('(prefers-reduced-motion: reduce)')` listener and clean it up on unmount.

  The timer must not start when there are zero/one articles, reduced motion is enabled, or the user is hovering/focusing the region. Manual previous/next/dot interaction clears and restarts the timer when allowed.

- [ ] **Step 3: Implement controls with native semantics**

  Render buttons with labels `Artikel sebelumnya`, `Artikel berikutnya`, and `Tampilkan artikel trending N`. Use `aria-current="true"` or `aria-pressed` on the active dot. Keep touch targets at least 44px.

- [ ] **Step 4: Implement media and empty fallbacks**

  Use `next/image` with `fill`, fixed aspect-ratio parent, and empty alt text when the image is decorative beside the visible title. When `coverImageUrl` is null, render a Paper block with `//` and the category initial.

  When `articles.length === 0`, render a `role="status"` section with links to `/series` and `/glossary` instead of controls.

- [ ] **Step 5: Implement the full-section visual composition**

  Use a 36px Snow/Paper surface, hairline border, two-column layout at `lg`, one-column layout below it, Ember `//` marker, `TRENDING` eyebrow, title, excerpt, metadata, counter, controls, and the native article link. Do not use a gradient overlay or extra decorative metrics.

- [ ] **Step 6: Compile the carousel component**

  Run: `npx tsc --noEmit`

  Expected: no TypeScript errors.

---

### Task 3: Wire Trending Data Into The Landing Hero

**Files:**
- Modify: `src/app/(public)/page.tsx`
- Test: landing route render and type checking

**Interfaces:**
- Consumes: Prisma article query and `TrendingCarousel`.
- Produces: trending hero before channel paths and Editorial Index below it.

- [ ] **Step 1: Add a focused trending query**

  Add a query to the existing `Promise.all` using the current article selection pattern, ordered by view count then publication date and limited to five:

  ```ts
  prisma.article.findMany({
    where: { status: 'PUBLISHED' },
    select: trendingArticleSelect,
    orderBy: [{ viewCount: 'desc' }, { publishedAt: 'desc' }],
    take: 5,
  })
  ```

  Select only the fields needed by `TrendingCarousel`.

- [ ] **Step 2: Replace the static thesis-plus-lead hero**

  Import `TrendingCarousel` and render it as the first major section inside the max-width page container. Keep a concise page thesis as the section eyebrow or supporting intro, but make the carousel the dominant full-section hero.

  Remove the old `ArticleRow featured` hero invocation so the lead article is not duplicated immediately below the carousel. The Editorial Index deduplication must continue using the same article ID set, including trending articles if they are also present in the later groups.

- [ ] **Step 3: Preserve the landing content order**

  Keep channel paths after the hero, then the six latest/editorial index and reference rail, then series/glossary, ads, and newsletter. Do not remove the existing discovery sections.

- [ ] **Step 4: Run type checking**

  Run: `npx tsc --noEmit`

  Expected: no errors.

---

### Task 4: Verify Seed, Carousel, Build, And Runtime

**Files:**
- Modify: only files required by verification findings
- Test: seed idempotency, type check, production build, homepage HTTP response, responsive and keyboard checks

**Interfaces:**
- Consumes: completed seed and carousel implementation.
- Produces: verified development content and landing hero.

- [ ] **Step 1: Run seed idempotency verification**

  Run `npm run prisma:seed` twice. Expected: both runs succeed and the 12 demo slugs remain unique.

- [ ] **Step 2: Run type verification**

  Run: `npx tsc --noEmit`

  Expected: no errors.

- [ ] **Step 3: Run production build**

  Run: `npm run build`

  Expected: Prisma generation, Next compilation, type checking, static generation, and route collection succeed.

- [ ] **Step 4: Check homepage runtime**

  Start: `npm run dev`

  Request `http://localhost:3000/` and confirm HTTP 200. Inspect returned HTML for `TRENDING`, carousel article content, and the Editorial Index. Stop the server afterward.

- [ ] **Step 5: Verify carousel interaction**

  At 320px, 768px, 1024px, and 1440px confirm stable image dimensions, no horizontal overflow, one-column mobile stacking, two-column desktop composition, visible focus, working previous/next/dot controls, autoplay pause on hover/focus, and no autoplay under reduced motion.

- [ ] **Step 6: Verify preserved routes**

  Confirm article links, `/series`, `/glossary`, `/search`, `/bookmarks`, `/feed.xml`, ads, newsletter, auth modal, and Editorial Index still render after seed and hero changes.

## Self-Review

- Every requirement in the approved spec maps to a task.
- Seed data has stable slugs, explicit fields, idempotent upserts, and repeat-run verification.
- Carousel behavior, fallback states, responsive composition, and accessible controls are concrete.
- No schema changes, database reset, or new dependency is planned.
- Existing landing discovery sections remain in place below the new hero.
