# SlashJournal Carousel, Sponsor, And Navigation CTA Design

Date: 2026-08-18
Status: Approved design direction, pending implementation plan

## Purpose

Improve discovery and conversion paths on SlashJournal without changing its zinc-neutral identity or adding backend dependencies.

The change covers:

- Trending carousel thumbnail navigation
- Sponsor advertising CTA
- Author application CTA
- Category-first navbar and subnavigation
- Contact form deep-link subject selection

## Trending Carousel

The existing full-section carousel keeps its active article presentation, autoplay, previous/next controls, and dot indicators. Add a thumbnail strip for the other trending articles below the active content.

Thumbnail behavior:

- Every trending article is represented by a thumbnail button.
- Active thumbnail uses full opacity, an Ember border, and `aria-current`/selected state.
- Inactive thumbnails use muted opacity and become full opacity on hover/focus.
- Thumbnail click changes the active article and resets autoplay.
- Each thumbnail has an accessible name including its article title and position.
- Images use stable aspect ratios and `next/image`; missing images use the existing `//` fallback.
- On mobile the strip scrolls horizontally within its own container and does not create page-level horizontal overflow.
- Existing dot indicators remain and continue to communicate position.
- Autoplay remains 6 seconds, pauses on hover/focus, and is disabled for reduced motion.

## Sponsor CTA

The inactive `BannerAd` state becomes a clearly framed commercial invitation rather than an implied empty ad slot.

Copy:

- Eyebrow: `Ruang sponsor`
- Title: `Tampilkan produk Anda di hadapan engineer`
- Description: `Pilih penempatan banner, native placement, atau advertorial teknis yang relevan dengan pembaca SlashJournal.`
- Action: `Klik di sini untuk pasang iklan`

The action links to `/contact?subject=sponsor`. The active sponsor ad keeps its sponsor label, target URL, and disclosure. No ad slot schema or API behavior changes.

## Author CTA

Add a visible author invitation in the contact page information column and footer support links.

Copy:

- Eyebrow: `Kontributor`
- Title: `Punya pengalaman produksi untuk dibagikan?`
- Description: `Kirim proposal tulisan tentang sistem, database, backend, atau rekayasa antarmuka.`
- Action: `Daftar menjadi penulis`

The action links to `/contact?subject=author`. This is an application/contact path, not automatic role creation. Existing admin approval and author roles remain unchanged.

## Contact Deep Links

The client contact page reads `subject` from the URL query string on initial render. Supported values:

- `correction`
- `sponsor`
- `author`
- `privacy`
- `general`

Unknown or absent values fall back to `correction`. The select remains user-editable. Submission behavior remains the existing client-side confirmation flow.

## Navbar And Subnav

Desktop header becomes two compact rows:

Primary row:

- SlashJournal brand
- Tulisan
- Kategori
- Seri
- Glosarium
- Search
- Theme
- Account/auth

Secondary row:

- Semua kanal
- Rekayasa Sistem
- Desain & Antarmuka
- Jurnal Personal
- Seri Panduan
- Jadi Penulis

The category menu is a normal link to `/category/rekayasa-sistem` only if a separate menu trigger is not needed; otherwise use a keyboard-accessible disclosure containing the three categories. The implementation should prefer the simpler always-visible subnav because it avoids hover-only navigation.

Subnav behavior:

- Sticky with the header as one combined shell.
- Horizontal overflow is contained on mobile with a scrollable strip.
- Active category/section gets text weight and background contrast; Ember is not the only state signal.
- `Jadi Penulis` links to `/contact?subject=author`.
- No RSS, implementation-specific topic chips, live status, or internal tooling labels are added.

Mobile menu includes the same destinations in a vertical list. The subnav may remain inside the menu rather than rendering a second viewport-wide row.

## Visual And Accessibility Rules

- Use existing `DESIGN.md` tokens and radii.
- Keep touch targets at least 44px.
- All icon-only carousel buttons have Indonesian accessible labels.
- Thumbnail controls are native buttons.
- Form select remains associated with its visible label.
- Links use descriptive action text.
- Focus indicators remain visible.
- Reduced motion disables carousel autoplay and transition-heavy effects.
- No horizontal page overflow at 320px.

## Acceptance Criteria

- Carousel shows clickable thumbnails, active styling, dot indicators, and working previous/next controls.
- Sponsor empty slot links to `/contact?subject=sponsor`.
- Author CTA links to `/contact?subject=author` from contact and footer/navigation surfaces.
- Contact form selects the correct subject from both deep links.
- Navbar exposes category navigation and a subnav with the three categories, series, and author CTA.
- Mobile navigation remains usable and does not create horizontal page overflow.
- Existing auth, search, theme, bookmark, ads, and contact behavior remains functional.
- `npx tsc --noEmit` passes.
- `npm run build` is intentionally not part of this verification request.

## Self-Review

- Every CTA maps to an existing contact route and does not pretend to create an account automatically.
- The carousel thumbnail strip serves navigation and active-state comprehension, not decoration.
- Category subnav represents real content structure and excludes internal implementation topics.
- Scope contains no schema, dependency, or backend changes.
