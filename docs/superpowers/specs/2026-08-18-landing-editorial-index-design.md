# SlashJournal Landing Editorial Index Design

Date: 2026-08-18
Status: Approved design direction, pending implementation plan

## Purpose

Increase useful content density on the SlashJournal landing page while preserving the Technical Reading Desk identity defined in `2026-08-18-public-reading-experience-design.md` and the visual constraints in `DESIGN.md`.

The landing page should let engineers discover a lead article, six newly published articles, five popular references, and five additional recent references without becoming a generic news portal.

## Content Model

The landing article index uses `publishedAt` as the primary publication order and falls back to `createdAt` only for legacy published rows without `publishedAt`.

Article groups:

- Lead: one most recently published article.
- Latest: the next six most recently published articles after the lead.
- Popular: up to five articles ordered by `viewCount` descending, excluding the lead.
- More recent: up to five recently published articles excluding every article already used by the lead, latest, or popular groups.

All groups may contain fewer items when the database has insufficient published articles. The UI must not invent placeholder articles. Duplicate article IDs must never appear in more than one of these groups.

Sponsored articles remain eligible and retain explicit sponsor labeling.

## Layout

The existing thesis-led hero remains unchanged, with the lead article beside it on large screens and below it on mobile.

The primary content area becomes a two-column Editorial Index:

- Main column: six latest articles rendered as editorial rows. Images may appear for the first two or three rows, then become text-led to control page weight.
- Reference rail: five popular articles followed by five additional recent articles.
- The in-feed ad remains in the main latest stream after the second article.
- The reference rail has no article images.
- The rail may be sticky at large breakpoints but must remain within its section.

On mobile, the reference rail follows the six latest articles in normal document flow.

## Reference Rail

Heading: `Pilihan untuk dibaca`.

Popular subsection:

- Label: `Paling banyak dibaca`.
- Items use real rank numbers `1` through `5` because the order encodes descending `viewCount`.
- Each item shows title, category, and view count.

More recent subsection:

- Label: `Baru lainnya`.
- Items show title, category, and publication date.
- Items are not numbered because publication metadata already communicates their order.

A short vertical hairline joins the two subsection labels as a restrained call-stack reference. It uses Cloud, not Ember. Ember remains limited to active labels and interaction punctuation.

## Visual Rules

- Preserve Obsidian, Graphite, Fog, Cloud, Paper, Snow, and Ember tokens from `DESIGN.md`.
- Preserve DM Sans as the Cosmica substitute and JetBrains Mono for counts, dates, and rank numbers.
- Preserve the slash rail as the landing page's sole signature element.
- Do not add gradients, decorative statistics, colored category systems, or uniform news cards.
- Use 36px radius only for the lead article or major cohesive surfaces.
- Latest articles and rail references use hairline-separated rows.
- Hover states may move one arrow by a few pixels; no scattered entrance animation is added.

## Existing Sections

Keep channel paths, series, glossary, banner ad, and newsletter sections. Move series and glossary below the expanded Editorial Index so article discovery remains the primary job.

## Accessibility And Responsive Behavior

- Preserve one H1 and logical section headings.
- Use semantic ordered list markup for popular ranks.
- Use semantic list markup for additional recent references.
- Reference links retain visible focus indicators.
- Titles wrap without truncating essential information.
- At 320px, all columns stack with no horizontal overflow.
- At 768px, latest article rows remain single-column.
- At 1024px and 1440px, the main stream and reference rail display side by side.
- Reduced-motion rules already provided globally remain in effect.

## Data And Performance

- Prefer two focused article queries: one recent query and one popular query.
- Fetch only fields needed by landing presentation plus category information.
- Use a `Set<string>` during grouping to guarantee uniqueness.
- Do not add database schema changes or new dependencies.
- Keep existing ad, category, series, glossary, and subscription behavior.

## Acceptance Criteria

- Landing page can display one lead, six latest, five popular, and five additional recent articles when enough published articles exist.
- No article is duplicated across the four groups.
- Popular order matches descending `viewCount`.
- Recent order matches descending publication time.
- The main article stream and reference rail stack correctly on mobile.
- Existing channel, series, glossary, ads, and newsletter sections remain functional.
- `npx tsc --noEmit` and `npm run build` pass.
- Homepage responds with HTTP 200 after implementation.

## Self-Review

- Counts and deduplication rules are explicit.
- Behavior for insufficient content is explicit.
- Numbering is used only where ranking is real.
- The design borrows reference-site content hierarchy without adopting their crowded visual language.
- No backend, schema, or dependency changes are required.
