# SlashJournal Trending Carousel And Demo Content Design

Date: 2026-08-18
Status: Approved design direction, pending implementation plan

## Purpose

Populate the development database with a useful set of realistic technical articles and replace the landing hero's static lead article treatment with a full-section trending carousel.

The audience remains Indonesian-speaking engineers and system architects. The landing hero's job is to surface the most-read current references immediately, then send the reader into the expanded Editorial Index below.

## Demo Articles

Add exactly 12 stable demo articles to `prisma/seed.ts`. Use `upsert` by slug so repeated seeding updates no existing content and never creates duplicate rows.

Topics must cover the existing SlashJournal subject:

- PostgreSQL index strategy
- Transaction isolation
- Distributed rate limiting
- Queue retry semantics
- Outbox pattern
- Observability and tracing
- Next.js rendering performance
- Edge caching
- Accessible design tokens
- API versioning
- Circuit breaker recovery
- Database connection pooling

Each article must include a real Indonesian title, excerpt, two or more markdown paragraphs, a category, 3-8 minute reading time, a stable published date, a varied view count, an author, and at least one existing tag. Articles can reuse existing categories and series. They must be normal editorial articles, not sponsored articles, unless a specific demo article is explicitly marked and labeled.

Use existing remote Unsplash images only when a suitable image is already used by the seed or a stable image URL is chosen. The UI must also work when `coverImageUrl` is null.

## Seed Behavior

- Keep existing users, categories, series, glossary, ad slots, tags, comments, bookmarks, and feedback behavior.
- Add the 12 article records after the existing article creation block and before tag-link finalization, or refactor the article seed section into a small local helper without changing its output.
- Add stable tag links with `articleTag.upsert`.
- Use dates relative to a fixed reference or explicit ISO dates so the trending order is deterministic during development.
- Do not reset or delete the database.
- Running `npm run prisma:seed` twice must complete successfully and preserve exactly one row per dummy slug.

## Trending Data

The landing server page fetches up to five published articles ordered by:

1. `viewCount` descending
2. `publishedAt` descending

The query selects only fields required by the hero: `id`, `slug`, `title`, `excerpt`, `coverImageUrl`, `viewCount`, `publishedAt`, `createdAt`, `readingTime`, `category.name`, and `isSponsored`/sponsor fields if the shared card requires them.

The existing article index query remains responsible for latest/popular reference groups below the hero. Avoid fetching the same full article payload twice if the page can share a focused selection or derive the lead data cleanly.

## Carousel Composition

Create a focused client component at `src/components/content/TrendingCarousel.tsx`.

Props:

```ts
type TrendingArticle = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImageUrl: string | null;
  viewCount: number;
  publishedAt: Date | null;
  createdAt: Date;
  readingTime: number;
  category: { name: string };
};

type TrendingCarouselProps = {
  articles: TrendingArticle[];
};
```

Layout:

- Full-width section within the page max-width container.
- Light Snow/Paper surface with 36px radius and hairline border, consistent with `DESIGN.md`.
- Left or upper media area with stable `aspect-ratio`.
- Text area with `TRENDING` eyebrow, category, title, excerpt, reading time, view count, and a `Baca artikel` link.
- Current position shown as `01 / 05` or the correct available total.
- Dot indicators and previous/next icon buttons.
- No large gradient overlay, decorative blobs, or unrelated metrics.

Behavior:

- Initial slide is the first result from the server query.
- Autoplay advances every 6 seconds.
- Pause on pointer enter and focus within the carousel.
- Resume after pointer leave only when reduced motion is not requested and the component has not been manually paused.
- Previous, next, and dot controls reset the autoplay timer.
- Keyboard users can focus every control and activate it with native button behavior.
- `aria-live="polite"` announces the active article title without making the entire carousel assertive.
- `prefers-reduced-motion: reduce` disables autoplay and transition transforms.
- If zero articles are returned, render a useful editorial empty state with links to `/series` and `/glossary`.
- If an article has no image, render a quiet Paper media block with its category initial or `//`; do not request a new image client-side.

## Visual Direction

The bold risk is scale: the hero becomes a newsroom-like full section rather than a compact card beside the thesis. Restraint comes from keeping the palette monochrome, using one Ember marker, and limiting motion to the carousel itself.

Signature element: the existing `//` slash rail appears beside the `TRENDING` marker and nowhere else inside the carousel.

Typography remains DM Sans for display/body and JetBrains Mono for the position counter, view count, and eyebrow metadata.

## Responsive Behavior

- At 320px, one column: media first, text second, controls below.
- At 768px, maintain one column but give the media an editorial landscape ratio.
- At 1024px and 1440px, use a two-column media/text composition.
- Buttons maintain at least 44px touch targets.
- Article titles wrap naturally with no truncation of the active slide.
- Carousel content must not create horizontal overflow.

## Accessibility

- Use a named region, such as `aria-roledescription="carousel"` and `aria-label="Artikel trending"`, only where supported by the surrounding semantics.
- Give previous/next controls explicit Indonesian accessible names.
- Give dot controls names such as `Tampilkan artikel trending 2` and expose the selected state.
- Do not depend on Ember or image differences alone to communicate the active slide.
- Keep visible focus rings from the global design system.
- Keep the article link as a native anchor.

## Acceptance Criteria

- `npm run prisma:seed` inserts or updates exactly 12 stable dummy article slugs without duplicates.
- The landing hero displays up to five trending articles ordered by view count.
- The carousel auto-advances every 6 seconds, pauses on interaction, and disables autoplay for reduced motion.
- Previous, next, and dot controls work with mouse, touch, and keyboard.
- The carousel works with missing cover images and with zero articles.
- Existing Editorial Index, channel paths, series, glossary, ads, newsletter, auth, and search remain functional.
- `npx tsc --noEmit` and `npm run build` pass.
- Homepage responds with HTTP 200 after seeding and implementation.

## Self-Review

- Seed count, slug idempotency, and deterministic ordering are explicit.
- Carousel state and accessibility behavior are explicit.
- The full-section hero is a subject-specific risk tied to a technical publication's trending index, not a generic marketing hero.
- No schema changes or new packages are required.
