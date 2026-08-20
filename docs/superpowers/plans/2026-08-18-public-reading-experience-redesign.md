# SlashJournal Public Reading Experience Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild SlashJournal's public shell and public page presentation as a focused Technical Reading Desk while preserving all existing data, routes, and interactive behavior.

**Architecture:** Keep the existing Next.js App Router and Prisma queries. Simplify the global `Navbar` and `Footer`, add only small shared presentation primitives where repetition is real, and restyle public pages around editorial rows, readable document columns, and restrained major surfaces. Functional components such as auth, search, bookmarks, comments, ads, Mermaid, code tabs, and WikiLinks remain in place.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS 3, `lucide-react`, Prisma, existing DM Sans and JetBrains Mono fonts.

## Global Constraints

- Use the existing tokens from `DESIGN.md`; do not introduce a new palette.
- Display, headings, body, and interface use DM Sans; JetBrains Mono is reserved for code, keyboard hints, counts, and compact technical metadata.
- Use 36px radius for major cards and reading surfaces, 14px for buttons and fields, and 12px for badges and small controls.
- Hairline borders provide structure; ordinary content cards have no drop shadows.
- Ember `#ff5a00` is used only as functional punctuation and never as the sole state indicator.
- Remove the `/feed.xml` button, quick-topic subnavigation, live architecture status, correction strip, `ARCH HUB` badge, platform version language, and oversized mega menus from the header.
- Keep the RSS route, search, theme switching, auth, role-aware admin access, bookmarks, ads, sponsored labels, comments, indexability metadata, and legal requirements functional.
- Do not add a new component library or icon package.
- Verify at 320px, 768px, 1024px, and 1440px.
- Respect `prefers-reduced-motion: reduce`.

---

### Task 1: Establish Public Shell And Accessibility Foundation

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/styles/globals.css`
- Modify: `src/components/layout/Navbar.tsx`
- Modify: `src/components/layout/Footer.tsx`
- Modify: `src/components/layout/ThemeToggle.tsx`
- Test: manual keyboard and responsive verification of the root shell

**Interfaces:**
- Consumes: existing `AuthContext`, `ThemeContext`, command-palette custom event, and route links.
- Produces: one compact public header, one footer, a skip link targeting `#main-content`, and a stable `main` landmark for all non-admin pages.

- [ ] **Step 1: Inspect existing shell behavior before editing**

  Confirm that `Navbar` owns auth actions and dispatches `open-command-palette`, `ThemeToggle` owns theme changes, and `layout.tsx` is the only global shell mount. Preserve those interfaces while removing only redundant navigation UI.

- [ ] **Step 2: Add the document landmark and skip link**

  In `src/app/layout.tsx`, render the public children inside:

  ```tsx
  <a href="#main-content" className="skip-link">Lewati ke konten utama</a>
  <div className="flex-1">
    <main id="main-content">{children}</main>
  </div>
  ```

  Keep the admin layout behavior compatible. If the existing admin page already renders a `main`, use the smallest conditional/layout adjustment needed to avoid nested or duplicate main landmarks.

- [ ] **Step 3: Replace `Navbar` with the one-row navigation contract**

  Keep the component client-side because it uses pathname, auth, theme, menu state, and the command palette. The desktop visible destinations are:

  ```tsx
  <Link href="/">Tulisan</Link>
  <Link href="/series">Seri</Link>
  <Link href="/glossary">Glosarium</Link>
  ```

  Keep search, `ThemeToggle`, account behavior, and mobile menu. Remove `Rss`, the entire subnav topic array/strip, flyout timers, both mega menus, live status, correction link, and all internal implementation labels. The mobile menu must still expose About, Contact, and Bookmarks where applicable.

- [ ] **Step 4: Simplify `Footer`**

  Keep links to Tulisan, Seri, Glosarium, About, Contact, Privacy, Terms, Cookies, and `/feed.xml`. Use the plain footer copy specified in the design document. Remove `Sparkles`, `ShieldCheck`, `Heart`, promotional claims, and the visually prominent RSS button treatment. RSS should be a normal secondary text link.

- [ ] **Step 5: Add shell CSS for focus, skip link, and reduced motion**

  Add focused global selectors with no broad element overrides:

  ```css
  .skip-link { position: fixed; left: 1rem; top: 1rem; z-index: 60; transform: translateY(-200%); }
  .skip-link:focus { transform: translateY(0); }
  :where(a, button, input, textarea, select):focus-visible { outline: 2px solid var(--ember-color); outline-offset: 3px; }
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { scroll-behavior: auto !important; transition-duration: 0.01ms !important; animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; }
  }
  ```

  Ensure the default root visual state is light as required by `DESIGN.md`; preserve user-selected dark mode after hydration.

- [ ] **Step 6: Run the type/build check for the shell**

  Run: `npx tsc --noEmit`

  Expected: no TypeScript errors.

---

### Task 2: Add Shared Editorial Presentation Primitives

**Files:**
- Create: `src/components/layout/PageIntro.tsx`
- Create: `src/components/layout/SectionHeading.tsx`
- Create: `src/components/content/ArticleMeta.tsx`
- Create: `src/components/content/ArticleRow.tsx`
- Modify: `src/styles/globals.css`
- Test: TypeScript compilation and visual use on the landing page in Task 3

**Interfaces:**
- Consumes: article/category/author values already returned by public page queries.
- Produces: small typed components with stable class ownership used by landing, archive, search, and series pages.

- [ ] **Step 1: Define typed component props**

  Use explicit props rather than `any`:

  ```ts
  export type PageIntroProps = {
    eyebrow?: string;
    title: string;
    description?: string;
    count?: string;
  };

  export type ArticleMetaProps = {
    category?: string;
    date: string;
    readingTime?: number;
    viewCount?: number;
  };

  export type ArticleRowProps = {
    href: string;
    title: string;
    excerpt?: string | null;
    category?: string | null;
    date: string;
    readingTime?: number | null;
    imageUrl?: string | null;
    sponsored?: boolean;
    sponsorName?: string | null;
  };
  ```

- [ ] **Step 2: Implement `PageIntro` and `SectionHeading`**

  `PageIntro` renders an unframed title block with optional Ember eyebrow and count. `SectionHeading` renders a title, optional supporting copy, and an optional action link. Neither component should add a surrounding card or decorative gradient.

- [ ] **Step 3: Implement `ArticleMeta`**

  Render category, date, reading time, and optional views as text with accessible separators. Use JetBrains Mono only for compact counts or metadata if it improves scanning. Do not rely on icon color alone.

- [ ] **Step 4: Implement `ArticleRow`**

  Render a real anchor with optional fixed-aspect-ratio image, metadata, title, excerpt, and a `Baca` affordance. Use a 36px surface only when the row is explicitly passed a featured variant; the default row is a border-separated editorial item.

- [ ] **Step 5: Run TypeScript verification**

  Run: `npx tsc --noEmit`

  Expected: no errors and no implicit `any` introduced by the new components.

---

### Task 3: Rebuild The Landing Page As Technical Reading Desk

**Files:**
- Modify: `src/app/(public)/page.tsx`
- Modify: `src/components/ads/InFeedAd.tsx`
- Modify: `src/components/ads/BannerAd.tsx`
- Test: landing route at 320px and 1440px with populated and empty data states

**Interfaces:**
- Consumes: existing article, category, series, glossary, and ad-slot queries.
- Produces: thesis-led hero, channel paths, featured article, editorial latest-writing list, series/glossary split, and quiet newsletter closing section.

- [ ] **Step 1: Preserve the existing data queries and identify display data**

  Keep the current Prisma query contracts. Continue deriving `featuredLead` and the remaining article collection, but remove data that exists only for deleted feature panels if it is no longer used in the JSX.

- [ ] **Step 2: Replace the hero markup**

  Build the approved composition:

  ```tsx
  <section className="reading-hero">
    <div className="reading-hero__thesis">
      <span className="slash-rail" aria-hidden="true">//</span>
      <p className="eyebrow">Catatan produksi untuk sistem nyata</p>
      <h1>Memahami sistem yang harus tetap berjalan.</h1>
      <p>...</p>
      <Link href="#latest-writing">Jelajahi tulisan</Link>
      <Link href="/series">Lihat seri panduan</Link>
    </div>
    <div className="reading-hero__lead">{featuredLead && <... />}</div>
  </section>
  ```

  Use real article title, excerpt, category, date, and reading time. Do not include platform version, status, topic chips, ambient glow, or feature dashboard content.

- [ ] **Step 3: Replace stats and feature panels with channel paths**

  Render each database category as a purposeful reading path with its count and topic scope. Keep the actual route links. Use channel-specific icons only as supporting marks.

- [ ] **Step 4: Replace the article grid with featured-plus-rows**

  Use `ArticleRow` for remaining articles. Keep sponsored disclosure and insert `InFeedAd` at the existing position. Update ad wrappers to be visually labeled interruptions and not indistinguishable article cards.

- [ ] **Step 5: Add the series/glossary split and quiet subscription close**

  Keep real series order/counts and glossary terms. Present chapters as rows, terms as compact definition links, and newsletter signup below the reading paths with a visible label and direct submit action.

- [ ] **Step 6: Remove the nature image and self-referential dark feature section**

  Do not replace these with another decorative block. End the page after the useful reading/discovery content and any active subscription section.

- [ ] **Step 7: Verify landing page behavior**

  Run: `npm run build`

  Expected: build succeeds. Manually inspect `/` at 320px and 1440px for wrapping, no horizontal overflow, one H1, and visible focus states.

---

### Task 4: Refine Article Detail For Reading Focus

**Files:**
- Modify: `src/app/(public)/[slug]/page.tsx`
- Modify: `src/components/wiki/DocFeedback.tsx`
- Modify: `src/components/wiki/BookmarkButton.tsx`
- Modify: `src/components/ads/SidebarStickyAd.tsx`
- Test: published article with cover image, without cover image, with headings, code, Mermaid, WikiLinks, ads, comments, and mobile sidebar flow

**Interfaces:**
- Consumes: existing article detail query and all current functional reader components.
- Produces: readable article title/body layout, compact breadcrumb, restrained TL;DR, responsive TOC/sidebar, and preserved reader interactions.

- [ ] **Step 1: Keep article data and metadata behavior unchanged**

  Preserve `generateMetadata`, indexability robots, view increment, glossary lookup, headings extraction, ad queries, comments, and all existing functional component props.

- [ ] **Step 2: Rework the article header hierarchy**

  Use an unframed breadcrumb and a readable title column. Keep sponsored badge, category, series information, author, date, reading time, views, and bookmark. Remove unnecessary Sparkles-led dashboard language and make the TL;DR a left-Ember-rule callout.

- [ ] **Step 3: Set readable body geometry**

  Ensure the article body is approximately 68-76 characters per line on wide screens, with headings separated by whitespace and hairlines only where they encode structure. Maintain Mermaid, tabbed code, WikiLinks, tags, feedback, and comments.

- [ ] **Step 4: Move sidebar content below the article on mobile**

  Keep sticky TOC and ad behavior only at wide breakpoints. Use normal flow below the prose at mobile widths. Do not allow the sidebar to compress the main reading column.

- [ ] **Step 5: Verify reader interactions**

  Run: `npx tsc --noEmit`

  Expected: no errors. Manually verify keyboard focus for bookmark, TOC links, WikiLinks, feedback, comment fields, and mobile menu.

---

### Task 5: Apply Shared Archive Patterns To Categories, Tags, Search, And Bookmarks

**Files:**
- Modify: `src/app/(public)/category/[slug]/page.tsx`
- Modify: `src/app/(public)/tag/[slug]/page.tsx`
- Modify: `src/app/(public)/search/page.tsx`
- Modify: `src/app/(public)/bookmarks/page.tsx`
- Test: populated and empty states for each route family

**Interfaces:**
- Consumes: existing route params, Prisma queries, auth/bookmark behavior, and `ArticleRow`.
- Produces: unframed archive intros, divider-based result lists, explicit counts, and useful empty states.

- [ ] **Step 1: Replace category and tag feature headers**

  Use `PageIntro` with category/tag name, description, count, and a plain-language privacy notice when needed. Remove the oversized header card and preserve category icon/supporting mark.

- [ ] **Step 2: Replace category/tag card grids**

  Use a prioritized list or restrained two-column list of `ArticleRow` instances. Preserve in-feed and leaderboard ad placement, sponsored labels, article links, dates, and reading times.

- [ ] **Step 3: Refine search layout and form**

  Keep the visible GET form with a real label or accessible name. Use one result count line, then separate article and glossary sections with divider rules and direct empty-state copy. Preserve query semantics exactly.

- [ ] **Step 4: Refine bookmarks without changing auth**

  Keep the existing authenticated bookmark query and actions. Use the same archive intro/list pattern and provide an actionable signed-out or empty state.

- [ ] **Step 5: Verify result routes**

  Run: `npx tsc --noEmit`

  Expected: no errors. Manually inspect one populated and one empty route at mobile and desktop widths.

---

### Task 6: Refine Series And Glossary Directories

**Files:**
- Modify: `src/app/(public)/series/page.tsx`
- Modify: `src/app/(public)/series/[slug]/page.tsx`
- Modify: `src/app/(public)/glossary/page.tsx`
- Modify: `src/app/(public)/glossary/[slug]/page.tsx`
- Test: ordered series and alphabetical glossary navigation

**Interfaces:**
- Consumes: existing series/glossary queries and route contracts.
- Produces: ordered series rows, alphabetically grouped glossary rows, and consistent page intros.

- [ ] **Step 1: Use `PageIntro` for series and glossary indexes**

  Remove repeated icon-in-card headers. Keep the title, explanation, and direct user job.

- [ ] **Step 2: Preserve meaningful numbering in series**

  Keep numeric chapter markers only because series order is real. Render chapters as border-separated rows, not cards nested inside series cards. Keep `Lihat Panduan Lengkap` as the single series action.

- [ ] **Step 3: Preserve meaningful alphabet markers in glossary**

  Keep quick-jump anchors and letter grouping. Render terms as compact definition rows with category and full-definition links.

- [ ] **Step 4: Apply the same document styling to detail pages**

  Ensure series detail and glossary detail use the same readable title width, heading hierarchy, link states, and mobile spacing as article detail.

- [ ] **Step 5: Verify ordered and alphabetical behavior**

  Run: `npx tsc --noEmit`

  Expected: no errors. Check that series chapter order and glossary anchors still resolve correctly.

---

### Task 7: Refine About, Contact, And Legal Pages

**Files:**
- Modify: `src/app/(public)/about/page.tsx`
- Modify: `src/app/(public)/contact/page.tsx`
- Modify: `src/app/(public)/privacy-policy/page.tsx`
- Modify: `src/app/(public)/terms/page.tsx`
- Modify: `src/app/(public)/cookie-policy/page.tsx`
- Test: heading hierarchy, form labels, legal link reachability, and mobile reflow

**Interfaces:**
- Consumes: existing page content, contact form action, metadata, and legal copy.
- Produces: narrow document layouts with consistent page intros and form treatment.

- [ ] **Step 1: Normalize document page containers**

  Use a max-width readable column, `PageIntro`, logical headings, and hairline section separators. Do not introduce accordions or new content claims.

- [ ] **Step 2: Preserve contact form contracts**

  Keep existing method/action fields and labels. Use direct button copy such as `Kirim pesan` or the existing user-recognizable action. Keep error/success states specific and accessible.

- [ ] **Step 3: Verify legal navigation**

  Confirm footer links reach every legal page and that no legal content is hidden by the new layout.

- [ ] **Step 4: Verify document pages**

  Run: `npx tsc --noEmit`

  Expected: no errors. Manually inspect headings and form focus at 320px and 1440px.

---

### Task 8: Final Visual, Accessibility, And Build Verification

**Files:**
- Modify: any files required by verification findings only
- Test: full public route matrix and production build

**Interfaces:**
- Consumes: all completed public shell and page changes.
- Produces: verified public reading experience meeting the design spec.

- [ ] **Step 1: Run the production build**

  Run: `npm run build`

  Expected: Prisma generation and Next.js build complete successfully.

- [ ] **Step 2: Start the dev server**

  Run: `npm run dev`

  Expected: a local URL is available for browser verification. Use another port if the default is occupied.

- [ ] **Step 3: Verify route matrix**

  Check `/`, one article, one category, one tag, `/series`, one series detail, `/glossary`, one glossary detail, `/search`, `/bookmarks`, `/about`, `/contact`, `/privacy-policy`, `/terms`, `/cookie-policy`, and one docs route.

- [ ] **Step 4: Verify responsive layout**

  Capture or inspect at 320px, 768px, 1024px, and 1440px. Confirm no horizontal overflow, title clipping, overlapping controls, unstable image geometry, or nested-card clutter.

- [ ] **Step 5: Verify keyboard and reduced motion**

  Tab through the header, skip link, mobile menu, search, links, article actions, and forms. Confirm visible focus, Escape menu close, and reduced-motion behavior.

- [ ] **Step 6: Verify functional preservation**

  Confirm RSS still responds at `/feed.xml`, search submits and returns results, auth modal opens, theme toggle works, bookmarks retain their behavior, sponsored labels remain explicit, ads remain labeled, and article interactive blocks render.

- [ ] **Step 7: Fix only verification findings and rerun build**

  Apply the smallest scoped fix for each finding, then rerun `npm run build` and the affected route checks. Do not add unrelated cleanup.

## Self-Review

- Shell, landing, article, archive, directory, information, accessibility, and verification requirements from the design spec each have an explicit task.
- No task removes the RSS route or changes backend behavior.
- Shared primitives are limited to repeated presentation patterns and do not replace functional components.
- Series numbering and glossary letter markers are preserved only where their structure is semantically real.
- Every task has concrete file paths, interfaces, commands, and expected outcomes.
