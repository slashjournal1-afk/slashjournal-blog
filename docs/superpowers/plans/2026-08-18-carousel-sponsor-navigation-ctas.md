# SlashJournal Carousel, Sponsor, And Navigation CTA Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add carousel thumbnails, sponsor and author conversion paths, and category-first navbar navigation while preserving existing routes and behavior.

**Architecture:** Extend the existing client `TrendingCarousel` with a thumbnail control strip. Keep sponsor and author conversion inside the existing `BannerAd`, `ContactPage`, and `Footer` surfaces using query-string subject links. Add a compact secondary navigation row to `Navbar` on desktop and expose the same links inside the mobile menu.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS 3, existing Lucide icons and SlashJournal design tokens.

## Global Constraints

- Use existing `DESIGN.md` tokens and radii.
- Keep touch targets at least 44px.
- Thumbnail controls are native buttons.
- Form select remains associated with its visible label.
- Links use descriptive action text.
- Focus indicators remain visible.
- Reduced motion disables carousel autoplay and transition-heavy effects.
- No horizontal page overflow at 320px.
- Preserve existing auth, search, theme, bookmark, ads, and contact behavior.
- Verification is `npx tsc --noEmit` only; do not run `npm run build`.

---

### Task 1: Add Trending Carousel Thumbnail Rail

**Files:**
- Modify: `src/components/content/TrendingCarousel.tsx`
- Test: `npx tsc --noEmit`

**Interfaces:**
- Consumes: existing `TrendingArticle[]`, `activeIndex`, and `moveTo` behavior.
- Produces: clickable thumbnail buttons with active state, accessible names, stable image fallback, and contained mobile overflow.

- [ ] **Step 1: Add the thumbnail strip below the carousel content**

  Render a `div` with `role="tablist"` below the main grid and before the dot indicators. Each article gets a native button with:

  ```tsx
  <button
    type="button"
    role="tab"
    aria-selected={index === activeIndex}
    aria-label={`Tampilkan artikel trending ${index + 1}: ${article.title}`}
    onClick={() => moveTo(index)}
    className={index === activeIndex ? 'border-[var(--ember-color)] opacity-100' : 'border-[var(--border-color)] opacity-60'}
  >
    <span className="relative block aspect-[16/9] overflow-hidden rounded-[12px]">...</span>
    <span>{article.title}</span>
  </button>
  ```

  Use `next/image` for `coverImageUrl`; use an `//` fallback block when null. Keep the text short with CSS line clamp only for the thumbnail label; the active article title remains fully visible in the main panel.

- [ ] **Step 2: Contain mobile thumbnail scrolling**

  Use `overflow-x-auto` on the strip wrapper and `min-w-[148px]` on thumbnail buttons at mobile widths. The strip must not set overflow on `body` or the page container. At `lg`, render thumbnails in a normal grid/row without needing horizontal scroll.

- [ ] **Step 3: Clarify active state and keep dots**

  Active thumbnail must have full opacity, Ember border, and selected state. Inactive thumbnails use muted opacity and recover on hover/focus. Preserve the existing dot indicators below the thumbnail row as a second position cue.

- [ ] **Step 4: Run type verification**

  Run: `npx tsc --noEmit`

  Expected: no errors.

---

### Task 2: Add Sponsor And Author Conversion CTAs

**Files:**
- Modify: `src/components/ads/BannerAd.tsx`
- Modify: `src/app/(public)/contact/page.tsx`
- Modify: `src/components/layout/Footer.tsx`
- Test: `npx tsc --noEmit`

**Interfaces:**
- Consumes: existing ad slot props, contact form state, and footer links.
- Produces: sponsor CTA at `/contact?subject=sponsor`, author CTA at `/contact?subject=author`, and a subject-aware contact form.

- [ ] **Step 1: Rewrite inactive `BannerAd` copy and link**

  Keep the inactive ad container and active sponsor rendering contract. Change inactive copy to:

  ```tsx
  <span>Ruang sponsor</span>
  <h3>Tampilkan produk Anda di hadapan engineer</h3>
  <p>Pilih penempatan banner, native placement, atau advertorial teknis yang relevan dengan pembaca SlashJournal.</p>
  <a href="/contact?subject=sponsor">Klik di sini untuk pasang iklan</a>
  ```

  Preserve active ad disclosure, target URL, and `rel="noopener noreferrer nofollow"`.

- [ ] **Step 2: Read the contact subject query**

  In the client contact page, initialize subject from `window.location.search` in a mount-safe effect or accept the query through a server wrapper and pass it to a client form. Supported values are `correction`, `sponsor`, `author`, `privacy`, and `general`; unknown values use `correction`.

  The minimal client approach is:

  ```tsx
  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get('subject');
    if (value && subjectOptions.some((option) => option.value === value)) setSubject(value);
  }, []);
  ```

  Keep the select's `id="contact-subject"` and its visible label.

- [ ] **Step 3: Add the author invitation to contact**

  Add a bordered information block in the contact page side column with `Kontributor`, the approved author copy, and a native link to `/contact?subject=author`. Keep sponsor and privacy information available.

- [ ] **Step 4: Add author CTA to footer**

  Add `Daftar menjadi penulis` to the footer support/participation links, pointing to `/contact?subject=author`. Keep the footer compact and do not add a new column unless the existing layout requires it for wrapping.

- [ ] **Step 5: Run type verification**

  Run: `npx tsc --noEmit`

  Expected: no errors.

---

### Task 3: Add Category Navbar And Subnav

**Files:**
- Modify: `src/components/layout/Navbar.tsx`
- Test: `npx tsc --noEmit`

**Interfaces:**
- Consumes: existing pathname, auth, search, theme, account, and mobile menu state.
- Produces: primary links plus category/series/author subnav with active states and mobile equivalents.

- [ ] **Step 1: Define navigation arrays**

  Keep primary links for Tulisan, Seri, and Glosarium, then add:

  ```ts
  const subnavLinks = [
    { label: 'Semua kanal', href: '/' },
    { label: 'Rekayasa Sistem', href: '/category/rekayasa-sistem' },
    { label: 'Desain & Antarmuka', href: '/category/desain-antarmuka' },
    { label: 'Jurnal Personal', href: '/category/jurnal-personal' },
    { label: 'Seri Panduan', href: '/series' },
    { label: 'Jadi Penulis', href: '/contact?subject=author' },
  ];
  ```

- [ ] **Step 2: Add desktop secondary navigation row**

  Render a second bordered row inside the sticky header under the primary row. Use `overflow-x-auto` and `no-scrollbar` on the row. Active state must use font weight/background contrast in addition to Ember text where appropriate. Keep it compact and avoid internal implementation topics.

- [ ] **Step 3: Add Kategori to primary navigation**

  Add a `Kategori` link targeting `/category/rekayasa-sistem` or use `href="#category-nav"` only if it genuinely toggles a disclosure. Prefer a normal `/category/rekayasa-sistem` link with the subnav providing all category choices, avoiding hover-only behavior.

- [ ] **Step 4: Add subnav links to the mobile menu**

  Render the subnav links after the existing mobile primary/direct links with a visible `Kategori` label. Keep the menu scrollable within viewport height and ensure `/contact?subject=author` remains a normal link.

- [ ] **Step 5: Check active state for query links**

  Use `pathname` for path matching and `useSearchParams` only if needed to mark the author CTA active. Do not cause hydration mismatch by reading `window` during render.

- [ ] **Step 6: Run type verification**

  Run: `npx tsc --noEmit`

  Expected: no errors.

---

### Task 4: Final Type And Scope Verification

**Files:**
- Modify: only files required by type-check findings
- Test: `npx tsc --noEmit`

**Interfaces:**
- Consumes: completed carousel, CTA, contact, footer, and navbar changes.
- Produces: verified TypeScript state without a production build.

- [ ] **Step 1: Run the requested verification command**

  Run: `npx tsc --noEmit`

  Expected: no output and exit code 0.

- [ ] **Step 2: Review scope-sensitive searches**

  Search for `/contact?subject=sponsor`, `/contact?subject=author`, `Tampilkan produk Anda`, `Daftar menjadi penulis`, and `role="tab"` to confirm the new paths and controls are present.

- [ ] **Step 3: Do not run production build**

  The user explicitly requested `npx tsc --noEmit` only. Do not run `npm run build` in this task.

## Self-Review

- Carousel thumbnails, active indicators, sponsor CTA, author CTA, contact query handling, desktop subnav, mobile subnav, and type-only verification each have explicit tasks.
- No new route, schema, dependency, or backend role mutation is planned.
- Existing active sponsor behavior and contact confirmation flow are preserved.
