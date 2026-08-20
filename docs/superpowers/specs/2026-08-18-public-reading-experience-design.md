# SlashJournal Public Reading Experience Redesign

Date: 2026-08-18
Status: Approved design direction, pending implementation plan

## Purpose

Redesign SlashJournal's public-facing experience as a focused technical reading desk for engineers and system architects. The interface should help readers choose a channel, find a relevant article, and read long technical content without competing product-style UI.

The redesign must remain faithful to `DESIGN.md`: zinc-neutral surfaces, DM Sans as the Cosmica substitute, JetBrains Mono for technical data, generous radii on major surfaces, hairline borders instead of card shadows, and Ember used only as punctuation.

## Scope

The redesign covers the shared public shell and all public routes:

- Landing page
- Article detail
- Category and tag archives
- Series index and detail
- Glossary index and detail
- Search
- Bookmarks
- About and contact
- Privacy, terms, and cookie policy
- Documentation reader pages where the global public shell appears

Admin pages, database schemas, publishing workflows, API behavior, authentication rules, search behavior, ads, bookmarks, comments, RSS generation, and content indexing rules are outside the visual redesign unless a small compatibility adjustment is required.

## Audience And Primary Job

Audience: Indonesian-speaking engineers and system architects looking for production-tested explanations of distributed systems, backend architecture, interface engineering, and related terminology.

Primary job: move a reader from arrival to the right article or learning path with minimal navigation overhead.

## Design Direction

Name: Technical Reading Desk

The visual metaphor is a disciplined engineer's reading desk rather than a SaaS dashboard. Content has priority over controls. Navigation is short, metadata is quiet, and repeated cards are replaced with editorial lists where comparison matters.

The signature device is the slash rail: the `//` mark acts as the brand monogram and a restrained structural marker in the landing hero and selected states. It must not become a repeated decorative motif.

## Design Tokens

Use the existing tokens from `DESIGN.md` rather than introducing a new palette.

| Role | Token | Value |
| --- | --- | --- |
| Primary ink | Obsidian | `#09090b` |
| Body ink | Graphite | `#18181b` |
| Secondary text | Fog | `#71717a` |
| Structural border | Cloud | `#ececee` |
| Canvas | Paper | `#f4f4f5` |
| Reading surface | Snow | `#ffffff` |
| Functional accent | Ember | `#ff5a00` |

Typography remains single-family to comply with `DESIGN.md`:

- Display, headings, body, and interface: DM Sans as the Cosmica substitute.
- Code, keyboard hints, counts, and compact technical metadata: JetBrains Mono.
- Display headings use weights 600-700, normal letter spacing, and controlled line lengths.
- Body copy uses 15-18px depending on context and a relaxed reading line height.
- Compact labels remain 11-13px, but labels must not carry essential information by themselves.

Geometry:

- 36px radius for major cards and reading surfaces.
- 14px radius for buttons and fields.
- 12px radius for badges and small controls.
- Full pills only for genuinely pill-like compact actions.
- Hairline borders provide structure; ordinary content cards have no drop shadows.

## Shared Header

Replace the current two-tier header and mega menus with one sticky navigation row.

Desktop order:

1. SlashJournal brand link
2. Tulisan
3. Seri
4. Glosarium
5. Search trigger
6. Theme toggle
7. Account action

Mobile order:

1. Compact brand
2. Search icon
3. Theme toggle
4. Menu icon

The mobile menu contains the same primary destinations plus About, Contact, and Bookmarks when relevant.

Remove from the header:

- `/feed.xml` button
- Quick-topic subnavigation strip
- Live architecture status
- Direct correction link in the status strip
- `ARCH HUB` badge
- Platform version and system-status language
- Mega-menu descriptions and internal implementation claims
- Duplicate bookmark entry for signed-in users when it is already available in the account menu

RSS remains available as a plain secondary link in the footer. Search, theme switching, auth, role-based admin access, and bookmarks remain functional.

The header should use a solid or lightly translucent Paper/Snow surface with one hairline bottom border. It must not resize when scrolling.

## Landing Page

### Hero

The hero is a two-column editorial composition on desktop and a single-column sequence on mobile.

Left side:

- Slash rail marker
- One clear H1: a production-engineering thesis rather than a product feature claim
- Short explanation of what readers will find
- Primary action to browse recent writing
- Secondary text link to explore series

Right side:

- The newest or selected lead article
- Cover image when available
- Category, date, and reading time
- Title and concise excerpt
- One clear reading action

Do not wrap the entire hero in a decorative card. The featured article may use a major 36px surface. Remove ambient glows, gradients, animated status dots, feature dashboards, system version badges, and fast-topic chips.

### Channel Paths

Show the three real content channels as distinct reading paths, not three identical feature cards. Each item contains:

- Channel name
- One-sentence scope
- Article count
- Two or three representative topics
- Direct link

The journal channel may state its indexing/privacy distinction in plain language, without exposing a `noindex` implementation badge in the primary navigation.

### Latest Writing

Use a prioritized editorial list:

- First item may be visually larger or image-led.
- Remaining items use compact rows with title, excerpt, category, date, and reading time.
- Images appear only when they materially help identify the article.
- Sponsored labeling remains explicit and Ember-backed.
- Preserve the in-feed ad slot, but style it as a clearly labeled interruption rather than an article card.

### Series And Glossary

Use one split section:

- Series presents ordered learning paths and chapter counts.
- Glossary presents a small alphabetical sample and a direct route to the full index.

Numbering is permitted only for chapters inside a real ordered series.

### Removed Landing Content

Remove or consolidate:

- Decorative stats strip
- Internal platform architecture panel
- Generic engineering-principles feature grid
- Claims such as `Zero AI-Sloop Guarantee`, Awwwards references, and visual-system self-description
- Nature image used only as a decorative divider
- Duplicate calls to the same destination

Keep newsletter signup only if the endpoint is active. Present it as a quiet closing section rather than the main hero action.

## Article Detail

The article page should feel like a reading surface, not an application dashboard.

Header content:

- Compact breadcrumb
- Category or sponsored label
- Title
- Excerpt
- Author, publish date, reading time, and view count
- Bookmark action

Use a centered readable title width and a body line length around 68-76 characters. Cover imagery remains full-width within the article container when available.

Body layout:

- Main reading column receives visual priority.
- Table of contents may remain sticky on wide screens.
- Author credibility content moves below the article unless the sidebar has enough width without compressing the prose.
- Ads remain clearly separated and labeled.
- Existing Mermaid, code tabs, WikiLink popovers, feedback, tags, and comments remain functional.

The executive summary should be a restrained callout using a left Ember rule or small label. Avoid a nested-card appearance.

On mobile, sidebar content enters the normal document flow after the article. Sticky behavior is disabled.

## Archive And Directory Pages

Category, tag, search, and bookmark pages share one archive pattern:

- Unframed page header with title, description, and optional count
- Hairline divider
- Editorial result rows or a restrained two-column list on large screens
- Consistent empty state with a useful next action

Category privacy/indexing notices remain available but use plain-language notice styling rather than a large feature panel.

Series pages preserve chapter order. A series overview may use a 36px surface because it represents one cohesive learning object, but individual chapters should be rows instead of cards inside cards.

Glossary pages use alphabetical anchors and compact definition rows. Letter markers encode the real alphabetical structure and therefore remain appropriate.

Search keeps the visible search form. Results are separated into articles and glossary terms with counts and clear empty states.

## Informational Pages

About, contact, privacy, terms, and cookie policy share a focused document layout:

- Narrow readable column
- Unframed title and introduction
- Logical heading hierarchy
- Hairline section separators where useful
- Forms use visible labels, direct action text, and specific error messages

Legal content must not be hidden in accordions merely to shorten the page.

## Footer

Use a quieter two-level footer.

Primary row:

- Brand and one-sentence editorial purpose
- Reading links: Tulisan, Seri, Glosarium, About
- Support and legal links: Contact, Privacy, Terms, Cookies

Secondary row:

- Copyright
- Plain RSS link

Remove decorative or promotional copy about awards, visual implementation details, and "designed with precision" claims. The footer should close the reading experience rather than advertise the design system.

## Interaction And Motion

Motion is limited to one orchestrated entrance on the landing hero and small state changes:

- Hero content may fade and translate a short distance on initial load.
- Links and article rows use color and small arrow movement on hover.
- Images may scale no more than a subtle amount inside a clipped frame.
- Menus use short opacity/translate transitions.

When `prefers-reduced-motion: reduce` is active, remove non-essential transitions and transforms.

## Accessibility

- Provide a skip-to-content link.
- Use exactly one `main` landmark and logical headings per page.
- All icon-only controls require accessible names and tooltips where their purpose is not obvious.
- Menus must support keyboard operation, Escape to close, and visible focus.
- Focus indicators use a clear Obsidian or Snow outline with sufficient contrast.
- Minimum touch target is 44px for primary mobile controls.
- Search, newsletter, contact, auth, and comment fields retain visible or programmatic labels.
- Content must reflow without horizontal scrolling at 320px and at high zoom.
- Ember is never the only indication of state.

## Responsive Behavior

Target verification widths: 320px, 768px, 1024px, and 1440px.

- Header remains one row; mobile navigation becomes a compact drawer or anchored panel.
- Hero stacks with thesis first and featured article second.
- Article lists collapse to one column.
- Article sidebars join document flow below the main content.
- Long titles wrap naturally without viewport-scaled font sizing.
- Stable aspect ratios are defined for all article imagery.

## Data And Functional Constraints

- Keep current Prisma queries and route contracts unless a presentation need requires selecting an already available field.
- Do not remove the RSS route; remove only its prominence from the header.
- Keep sponsored disclosure and ad placement behavior.
- Keep indexability metadata and privacy/legal requirements.
- Keep role-aware admin access in the authenticated account menu.
- Preserve dark mode, but the default visual reference remains the light theme from `DESIGN.md`.
- Do not introduce a new component library or icon package.

## Component Direction

Prefer a small shared set of presentation components only where repetition is real:

- `SiteHeader`
- `MobileNav`
- `SiteFooter`
- `PageIntro`
- `ArticleRow`
- `ArticleMeta`
- `SectionHeading`

Existing functional components such as auth, search palette, bookmark, comments, ads, Mermaid, code tabs, and WikiLinks should be restyled in place rather than rewritten.

## Verification And Acceptance Criteria

Implementation is complete when:

- The header contains no RSS button, live-status strip, quick-topic strip, or oversized mega menu.
- Every public route uses the revised shared header and footer.
- Landing hero prioritizes the site's editorial thesis and a real article.
- Landing page no longer resembles a feature dashboard or a uniform card grid.
- Article prose remains readable at all target widths and existing interactive content works.
- Category, series, glossary, search, and informational pages share consistent hierarchy and spacing.
- RSS generation, search, auth, bookmarks, ads, comments, and sponsored disclosure continue to work.
- Keyboard navigation and visible focus are verified manually.
- Reduced-motion behavior is present.
- `npm run build` succeeds.
- Browser screenshots at mobile and desktop show no overlap, clipping, horizontal scroll, or incoherent nested cards.

## Self-Review

- No placeholders or unresolved design decisions remain.
- The scope is visual and navigational; backend behavior is explicitly preserved.
- The design follows `DESIGN.md` even where the broader design brief might otherwise suggest multiple font families or sharper editorial geometry.
- The signature slash rail is limited enough to remain distinctive rather than decorative noise.
- Numbering is used only for ordered series content and alphabetical markers are used only for the glossary's real structure.
