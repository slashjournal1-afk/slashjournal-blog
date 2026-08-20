# Minimal Editorial Blog — Premium Design System & UI/UX Direction

> A refined, minimal, elegant, editorial-first design system for a professional article/blog website. The interface should feel calm, premium, contemporary, highly readable, and intentionally designed — with visual sophistication coming from typography, spacing, composition, and restraint rather than decoration.

## 1. Design Intent

**Theme:** Minimal light editorial / modern digital publication

This website is an **article and blog platform**, not a SaaS dashboard, marketplace, product landing page, or generic AI template.

The primary product is the **content itself**. The interface must make discovering, scanning, opening, and reading articles feel effortless.

Visual character:

- modern
- clean
- editorial
- premium but understated
- human
- credible
- highly readable
- structured
- distinctive without being decorative

Avoid a template-generated appearance. Distinctiveness should come from typography, editorial composition, spacing, image direction, hierarchy, and information architecture—not from visual gimmicks.

---

# 2. Core UX Principles

## 2.1 Content comes first

Articles are the primary product.

Do not let decoration compete with:

- headline
- summary/dek
- author
- date
- reading time
- article body
- images
- captions
- related stories

Every visual decision should answer:

> Does this make discovering or reading the article easier?

If not, remove it.

## 2.2 Typography before decoration

Create visual hierarchy through:

- type scale
- font pairing
- weight
- spacing
- alignment
- line length
- editorial composition

Do not depend on gradients, blobs, glow effects, excessive shadows, or oversized UI components to create visual interest.

## 2.3 Editorial rhythm

The page should feel composed like a modern digital magazine.

Use:

- strong headline moments
- narrow reading measure
- generous whitespace
- subtle rules
- intentional image placement
- varied article layouts
- clear section breaks

Whitespace is an active design element.

## 2.4 Human hierarchy

A typical article page should naturally read:

1. publication/navigation
2. category
3. headline
4. dek / summary
5. author + publication metadata
6. hero image
7. article content
8. related content
9. footer

Do not turn every item into a separate card.

---

# 3. Global Visual Direction

Use a restrained editorial system with:

- warm white canvas
- near-black typography
- muted gray supporting text
- one restrained accent
- subtle horizontal rules
- minimal shadows
- medium image radius
- generous whitespace
- strong typographic hierarchy

The page should still look excellent if every decorative effect is removed.

## Visual density

**Density:** relaxed editorial

Recommended rhythm:

- compact metadata
- medium navigation spacing
- generous article spacing
- generous section spacing
- narrow text column
- wider media column
- clear separation between content groups

---

# 4. Color System

Use a mostly neutral palette.

| Name | Value | Token | Usage |
|---|---|---|---|
| Ink | `#171717` | `--color-ink` | Headlines and primary text |
| Charcoal | `#2A2A2A` | `--color-charcoal` | Body and navigation |
| Graphite | `#525252` | `--color-graphite` | Secondary text |
| Stone | `#737373` | `--color-stone` | Metadata and captions |
| Silver | `#A3A3A3` | `--color-silver` | Disabled/subtle UI |
| Rule | `#E5E5E5` | `--color-rule` | Dividers and borders |
| Surface | `#F7F6F3` | `--color-surface` | Soft editorial canvas |
| Paper | `#FFFFFF` | `--color-paper` | Content surface |
| Accent | `#00A86B` | `--color-accent` | Restrained brand accent and active states |

The emerald accent is intentionally controlled: crisp enough to establish brand identity, but never dominant enough to overpower editorial content.

Use it sparingly for:

- category labels
- active navigation
- links
- reading progress
- small editorial markers
- selected states

Do not use it for giant backgrounds, every button, every icon, or decorative shapes.

---

# 5. Typography

Typography is the primary visual identity.

## Display / Article Headlines

Preferred:

- `Newsreader`
- `Fraunces`
- `DM Serif Display`
- `Source Serif 4`

## UI / Body

Preferred:

- `Inter`
- `DM Sans`
- `Manrope`
- `IBM Plex Sans`

Recommended pairing:

**Newsreader + Inter**

The serif display font creates editorial character while the sans-serif keeps navigation, metadata, and body UI clean.

If the brand requires an all-sans system, use one high-quality sans family consistently.

Do not use novelty fonts.

---

# 6. Type Scale

| Role | Desktop | Mobile | Weight | Line Height |
|---|---:|---:|---:|---:|
| Display | 72px | 44px | 500–600 | 0.98–1.05 |
| Article title | 64px | 40px | 500–600 | 1.02–1.08 |
| H1 | 48px | 34px | 600 | 1.08 |
| H2 | 36px | 28px | 600 | 1.15 |
| H3 | 25px | 22px | 600 | 1.25 |
| H4 | 20px | 18px | 600 | 1.3 |
| Body large | 20px | 18px | 400 | 1.7 |
| Body | 17px | 17px | 400 | 1.7 |
| UI | 14px | 14px | 500 | 1.4 |
| Metadata | 13px | 12px | 500 | 1.4 |
| Caption | 12px | 12px | 400 | 1.5 |

Article body should generally remain around **65–75 characters per line**.

Never stretch article paragraphs across the full desktop viewport.

---

# 7. Spacing System

Base unit:

`4px`

| Token | Value |
|---|---:|
| `--space-1` | 4px |
| `--space-2` | 8px |
| `--space-3` | 12px |
| `--space-4` | 16px |
| `--space-5` | 20px |
| `--space-6` | 24px |
| `--space-8` | 32px |
| `--space-10` | 40px |
| `--space-12` | 48px |
| `--space-16` | 64px |
| `--space-20` | 80px |
| `--space-24` | 96px |
| `--space-32` | 128px |

Spacing must follow hierarchy. Do not give every component identical padding.

---

# 8. Layout System

## Page container

Desktop maximum width:

`1280px`

Horizontal padding:

- Desktop: 32–48px
- Tablet: 24–32px
- Mobile: 20px

## Article reading column

Recommended maximum:

`680–760px`

The article should be centered or positioned inside a wider editorial grid.

## Editorial grid

Use a flexible 12-column grid on larger screens.

Typical long-form arrangement:

- optional share/navigation rail: 1–2 columns
- article body: 7–8 columns
- optional context rail: 2–3 columns

Do not force a sidebar on every article.

---

# 9. Header / Navigation

The header should feel like a publication masthead.

## Desktop

Recommended:

**Logo / publication name** — left

**Topics / sections** — center or left-center

**Search + optional subscribe** — right

Header height:

`68–80px`

Background:

`#FFFFFF` or transparent over the editorial canvas.

A subtle bottom rule is acceptable.

Avoid:

- oversized SaaS CTA buttons
- giant pill navigation
- excessive menu items
- glassmorphism
- gradient headers

## Mobile

Use:

- logo
- search
- compact menu

Do not squeeze desktop navigation into mobile.

---

# 10. Homepage

The homepage should feel like the front page of a modern publication.

## 10.1 Featured story

Do not use a generic centered marketing hero.

Use a **featured-story composition**.

Recommended:

Left:

- category
- large editorial headline
- 1–2 sentence summary
- author/date
- reading time

Right:

- large featured image

The composition may be slightly asymmetric.

Image ratio:

`4:3` or `3:2`

## 10.2 Secondary stories

Use varied editorial compositions rather than one repeated card grid.

Examples:

- one large story + two smaller stories
- two-column story pair
- horizontal story list
- three-story editorial row

Each story should contain only what is useful:

- image
- category
- title
- optional excerpt
- metadata

## 10.3 Latest articles

Use a list/grid hybrid.

Desktop example:

| Thumbnail | Article information | Metadata |
|---|---|---|
| Image | Category + title + excerpt | Date / reading time |

Separate rows with subtle rules.

This should feel like a publication index, not a SaaS feature grid.

---

# 11. Article Detail Page

The article page is the most important screen.

## 11.1 Article header

Use generous top spacing.

Order:

1. Category
2. Article title
3. Dek / summary
4. Author
5. Publication date
6. Reading time
7. Hero image

The title is the strongest visual element.

Never put the main title inside a generic card.

## 11.2 Hero image

Recommended:

- `16:9`
- `3:2`
- wide editorial crop

Radius:

`16–20px`

Do not automatically add gradients or text overlays.

## 11.3 Article body

Recommended:

- 17–20px text
- 1.65–1.8 line height
- 680–760px maximum width
- dark charcoal text
- generous paragraph spacing

Keep paragraphs comfortable for web reading.

## 11.4 Headings

H2:

- 32–36px
- strong vertical separation
- no boxed container

H3:

- 23–26px

Use headings to create reading rhythm.

## 11.5 Pull quote

Use editorial typography, not a card.

Large serif quote with optional thin accent rule.

Do not use giant colored backgrounds.

## 11.6 Article images

Images can intentionally extend wider than the body text.

Pattern:

`narrow text → wider image → narrow text`

This creates visual rhythm without turning the article into a gallery.

## 11.7 Captions

Use:

- 12–13px
- muted gray
- concise wording

Place directly beneath the image.

---

# 12. Reading Experience

## Reading progress

A very thin progress indicator may sit at the top of the viewport.

Height:

`2–3px`

Use the brand accent.

Keep it unobtrusive.

## Sharing

Desktop:

A small share rail beside the article is acceptable.

Mobile:

Place sharing after the article header or near the end.

Avoid oversized floating social buttons.

## Table of contents

For long articles only.

Desktop:

A compact sticky side rail is acceptable.

Mobile:

Use a collapsible section near the beginning.

Do not add a table of contents to short articles.

---

# 13. Article Cards

Article cards should not look like generic SaaS cards.

## Default teaser

Preferred grouping:

**image + typography + whitespace**

rather than:

**rounded rectangle + shadow + everything inside**

A teaser may contain:

- image
- category
- headline
- excerpt
- metadata

Use containers only when they improve scanning or separation.

## Compact article

Use horizontal rows for dense indexes.

## Minimal article

For editorial lists, category + title + date may be enough.

---

# 14. Categories

Category navigation should feel like publication taxonomy.

Prefer text links:

`Design   Technology   Business   Culture   Ideas`

Active category can use:

- darker text
- small underline
- restrained accent

Do not convert every category into a pill.

---

# 15. Search

Search should feel like a real content discovery tool.

Use:

- large search input
- clear placeholder
- keyboard-friendly interaction
- search icon
- result count
- query highlighting

Results should prioritize:

1. title relevance
2. category
3. date
4. excerpt

Use editorial list results rather than decorative card grids.

---

# 16. Author Component

Author information should feel human.

Show:

- avatar
- name
- role/descriptor
- optional social link

For article headers, use a compact inline author row.

Avoid giant profile cards.

---

# 17. Related Articles

At the end of an article:

**Continue Reading**

or

**You May Also Like**

Use approximately three relevant articles.

Each item:

- image
- category
- title
- date

Keep this section visually lighter than the article itself.

---

# 18. Newsletter

Newsletter signup should feel editorial, not like a SaaS conversion block.

Recommended:

- short editorial statement
- email field
- simple submit action

A two-column desktop composition is acceptable:

large editorial statement on the left, compact form on the right.

Avoid:

- giant gradients
- oversized CTA buttons
- excessive marketing copy
- fake urgency

---

# 19. Footer

Keep the footer calm and useful.

Structure:

Publication name / short description

Navigation groups:

- Topics
- About
- Contact
- Social
- Legal

Bottom row:

copyright + legal links

Use a subtle divider.

The footer should not visually overpower the article.

---

# 20. Borders, Radius & Shadows

## Border radius

Use radius intentionally.

| Element | Radius |
|---|---:|
| Article images | 16–20px |
| Feature media | 20–24px |
| Inputs | 10–12px |
| Buttons | 10–12px |
| Small tags | 6–8px |
| Avatars | 50% |

Do not make every component 32–40px rounded.

The publication should feel sophisticated rather than bubbly.

## Shadows

Default:

**No shadow.**

Use borders and spacing for hierarchy.

Only floating UI that genuinely requires elevation may use:

`0 8px 30px rgba(0,0,0,0.08)`

---

# 21. Buttons

Buttons should be simple.

## Primary

Background:

`#171717`

Text:

`#FFFFFF`

Radius:

`10–12px`

Padding:

`12px 18px`

## Secondary

Background:

`#FFFFFF`

Border:

`1px solid #D4D4D4`

Text:

`#262626`

## Text action

For low-priority actions, use plain text with a small arrow/icon.

Do not turn every interaction into a button.

---

# 22. Images & Art Direction

Photography is a major part of the publication identity.

Prefer:

- documentary photography
- editorial portraits
- architecture
- product photography
- real environments
- authentic human moments
- detailed close-ups
- carefully cropped editorial images

Avoid:

- generic stock-photo handshakes
- fake office scenes
- random 3D renders
- floating objects
- generic AI illustrations
- unrelated decorative graphics

Images should support the article topic.

## Image treatment

Prefer natural images.

Do not automatically:

- add gradients
- add overlays
- use duotone
- add excessive borders
- place text over every image

---

# 23. Motion & Interaction

Motion should support comprehension.

Use:

- subtle image zoom on hover
- underline transitions
- opacity transitions
- small arrow movement
- reading progress
- gentle navigation transitions

Duration:

`150–250ms`

Use ease-out.

Avoid:

- excessive parallax
- bouncing cards
- rotating text
- scroll-jacking
- dramatic entrance animations
- continuous floating animations

The content must remain comfortable to read.

---

# 24. Responsive Behavior

## Desktop

Use the full editorial grid.

Allow controlled asymmetric compositions.

Keep article body narrow.

## Tablet

Collapse complex side rails.

Reduce headline scale.

Maintain generous whitespace.

## Mobile

Prioritize reading.

Order:

1. navigation
2. category
3. title
4. summary
5. author/meta
6. hero image
7. article

Do not place dense content columns side-by-side.

Article body should use nearly the full width with approximately 20px side padding.

Mobile typography should remain comfortable rather than simply shrinking desktop values.

---

# 25. Accessibility

Accessibility is part of the design.

Required:

- WCAG-friendly contrast
- visible keyboard focus
- semantic headings
- descriptive image alt text
- accessible buttons
- adequate touch targets
- no information conveyed by color alone
- readable line lengths
- logical tab order

Minimum interactive target:

`44 × 44px`

---

# 26. Content Hierarchy Rules

Every article card should have one primary title.

Avoid multiple visually equal headlines in the same region.

Recommended hierarchy:

**category → headline → excerpt → metadata**

Metadata must never compete with the headline.

---

# 27. Editorial Grid Patterns

Use several layout patterns instead of one repeated card grid.

## Pattern A — Featured Story

```text
┌──────────────────────────────┬──────────────────────┐
│ CATEGORY                     │                      │
│                              │                      │
│ Large editorial headline     │     FEATURE IMAGE    │
│                              │                      │
│ Summary                      │                      │
│ Author · Date · Reading time │                      │
└──────────────────────────────┴──────────────────────┘
```

## Pattern B — Story List

```text
┌──────────┬──────────────────────────────────────────┐
│ IMAGE    │ CATEGORY                                 │
│          │ Article title                            │
│          │ Short description                        │
│          │ Date · Reading time                      │
└──────────┴──────────────────────────────────────────┘
```

## Pattern C — Editorial Grid

```text
┌──────────────────────┬───────────────┬───────────────┐
│                      │               │               │
│   LARGE STORY        │   STORY       │   STORY       │
│                      │               │               │
└──────────────────────┴───────────────┴───────────────┘
```

## Pattern D — Long-form Article

```text
             CATEGORY
       LARGE ARTICLE TITLE
              DEK
         AUTHOR + META

        ┌───────────────┐
        │   HERO IMAGE  │
        └───────────────┘

              BODY
              BODY
              BODY

        ─── PULL QUOTE ───

              BODY
              BODY
```

---

# 28. Avoid Repetition

Do not use the same layout for every section.

A polished editorial site should create variation through **composition**, not decoration.

A useful rhythm can be:

1. featured split story
2. horizontal story list
3. three-story editorial group
4. pull quote / editorial statement
5. latest stories
6. newsletter
7. footer

Every section must have a clear editorial purpose.

---

# 29. Generic / AI-Looking Design Rules

The interface must not resemble a generic AI-generated website.

Avoid automatically using:

- purple/blue gradients
- glassmorphism
- floating translucent blobs
- excessive rounded cards
- glowing CTA buttons
- random abstract 3D objects
- fake dashboard screenshots
- excessive icon grids
- repeated feature cards
- repeated pill badges
- oversized centered hero text
- meaningless statistics
- gradient typography
- excessive drop shadows
- unnecessary dark sections
- every section inside a container card
- arbitrary asymmetry without purpose
- decorative shapes unrelated to content

Modern does not mean effects everywhere.

Distinctiveness should come from:

- typography
- editorial composition
- image art direction
- spacing
- grid
- content hierarchy
- restrained color
- intelligent information architecture

---

# 30. Do / Don't

## Do

- Use typography as the primary design tool.
- Keep article content narrow and highly readable.
- Use a strong editorial serif for major headlines when appropriate.
- Create hierarchy with scale and whitespace.
- Use real editorial imagery.
- Use subtle borders.
- Use one restrained accent color.
- Let sections breathe.
- Use asymmetry only when it improves composition.
- Keep navigation simple.
- Use cards selectively.
- Keep metadata visually quiet.
- Treat mobile as a first-class reading experience.
- Make every section purposeful.

## Don't

- Do not make the website look like a SaaS dashboard.
- Do not turn every article into a floating rounded card.
- Do not use gradients merely to make the interface look modern.
- Do not use random decorative shapes.
- Do not overuse glass effects.
- Do not use huge pills everywhere.
- Do not add statistics just to fill space.
- Do not use generic AI illustrations.
- Do not overuse shadows.
- Do not use many accent colors.
- Do not center everything.
- Do not make every section symmetrical.
- Do not make every section dark.
- Do not sacrifice readability for novelty.
- Do not prioritize decoration over content hierarchy.

---

# 31. Design Quality Checklist

### Layout

- [ ] Is the page visually balanced?
- [ ] Is there a clear primary focal point?
- [ ] Are margins consistent?
- [ ] Does whitespace feel intentional?
- [ ] Is the grid helping the content?

### Typography

- [ ] Is the article title immediately dominant?
- [ ] Is body text comfortable?
- [ ] Are line lengths controlled?
- [ ] Is metadata quiet enough?
- [ ] Is the hierarchy obvious?

### Content

- [ ] Can users understand the article immediately?
- [ ] Are categories meaningful?
- [ ] Is article metadata useful?
- [ ] Are related articles genuinely relevant?

### Visuals

- [ ] Do images support the topic?
- [ ] Are crops intentional?
- [ ] Is there unnecessary decoration?
- [ ] Are cards used only where useful?

### Interaction

- [ ] Are buttons understandable?
- [ ] Are hover states subtle?
- [ ] Is keyboard focus visible?
- [ ] Is mobile navigation usable?
- [ ] Is reading progress unobtrusive?

### Overall

- [ ] Does this look like a real publication?
- [ ] Does it feel intentionally designed rather than assembled from a template?
- [ ] Is there a clear visual identity?
- [ ] Would it still look good without decorative effects?
- [ ] Is content always more important than UI?

---

# 32. CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink: #171717;
  --color-charcoal: #2a2a2a;
  --color-graphite: #525252;
  --color-stone: #737373;
  --color-silver: #a3a3a3;
  --color-rule: #e5e5e5;
  --color-surface: #f7f6f3;
  --color-paper: #ffffff;
  --color-accent: #00A86B;

  /* Typography */
  --font-display: "Newsreader", Georgia, serif;
  --font-sans: "Inter", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;

  --text-display: 72px;
  --text-article-title: 64px;
  --text-h1: 48px;
  --text-h2: 36px;
  --text-h3: 25px;
  --text-h4: 20px;
  --text-body-lg: 20px;
  --text-body: 17px;
  --text-ui: 14px;
  --text-meta: 13px;
  --text-caption: 12px;

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
  --space-24: 96px;
  --space-32: 128px;

  /* Layout */
  --page-max-width: 1280px;
  --article-max-width: 740px;

  /* Radius */
  --radius-image: 14px;
  --radius-feature: 16px;
  --radius-control: 9px;
  --radius-tag: 5px;

  /* Elevation */
  --shadow-floating: 0 8px 30px rgba(0, 0, 0, 0.08);
}
```

---

# 33. Tailwind v4 Reference

```css
@theme {
  --color-ink: #171717;
  --color-charcoal: #2a2a2a;
  --color-graphite: #525252;
  --color-stone: #737373;
  --color-silver: #a3a3a3;
  --color-rule: #e5e5e5;
  --color-surface: #f7f6f3;
  --color-paper: #ffffff;
  --color-accent: #00A86B;

  --font-display: "Newsreader", Georgia, serif;
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;

  --radius-image: 14px;
  --radius-feature: 16px;
  --radius-control: 9px;
  --radius-tag: 5px;
}
```

---

# 34. Agent / AI Implementation Brief

When implementing this design, behave like a **senior editorial product designer**, not a generic landing-page generator.

Build a real article publication interface.

Prioritize:

1. content hierarchy
2. reading comfort
3. editorial composition
4. typography
5. responsive behavior
6. image art direction
7. information architecture
8. subtle interaction

Do not add UI elements merely because there is empty space.

Do not invent fake product features, statistics, dashboards, testimonials, or decorative sections.

If content is missing, prefer whitespace over fabricated content.

If an image is unavailable, use a simple placeholder or omit it rather than inserting unrelated decoration.

Every component must have a functional editorial purpose.

The result should feel:

**modern, clean, premium, editorial, credible, distinctive, readable, human-designed.**

It should not feel:

**AI-generated, template-heavy, SaaS-like, dashboard-like, over-designed, or visually noisy.**

---

# 35.1 Minimal Editorial Refinement — Final Visual Direction

This refinement layer takes priority when any earlier rule creates visual excess. The goal is a **quiet, premium, modern publication** that feels closer to a carefully art-directed digital magazine than a template-based blog.

## A. The "Quiet Luxury" Rule

The interface should communicate quality without trying to look expensive.

Use:

- generous whitespace
- precise typography
- restrained contrast
- thin dividers
- editorial image crops
- subtle emerald accents
- clear alignment
- deliberate negative space

Avoid visual elements whose only purpose is to make the page look "fancier."

> Remove the decoration. If the page becomes better, the decoration was unnecessary.

## B. Visual Priority

Every viewport should have one obvious primary focus.

For a homepage:

1. featured article
2. secondary stories
3. latest articles
4. supporting editorial content

For an article:

1. headline
2. dek
3. author / metadata
4. hero image
5. article body
6. related stories

Never allow navigation, newsletter blocks, badges, or decorative elements to compete with the article.

## C. Reduce Card Dependency

The default visual language is **open editorial layout**, not boxed UI.

Prefer:

`image → typography → whitespace → divider`

over:

`rounded card → shadow → badge → icon → button`

Use a card only when it provides a clear structural benefit, such as:

- grouping unrelated stories
- separating a search result
- containing a functional form
- highlighting a compact utility module

Cards should have:

- white or near-white surface
- 1px border when separation is necessary
- minimal radius
- no default shadow
- no decorative gradient

## D. Premium Grid Behavior

Use a disciplined grid with intentional asymmetry.

Desktop:

- maximum content width: 1240–1280px
- 12-column editorial grid
- generous 32–48px outer padding
- 24–32px column gaps
- article body around 700–760px
- supporting content may occupy the surrounding grid

The asymmetry should come from **content proportions**, not random positioning.

Good:

- 5/7 featured split
- 7/5 image-to-copy variation
- large story beside two compact stories
- narrow reading column with wider image

Avoid:

- arbitrary offset elements
- overlapping text
- decorative floating cards
- layouts that make alignment difficult to scan

## E. Header Should Disappear While Reading

The header is a publication masthead, not a marketing banner.

Desktop:

- 72px approximate height
- thin bottom rule
- publication name / logo
- 3–6 key topics maximum
- search as a quiet icon or compact field
- optional subscribe action as text or restrained button

Mobile:

- 60–64px approximate height
- logo / publication name
- search
- menu

The header should never consume excessive vertical space.

## F. Homepage Hero: Editorial, Not Marketing

The homepage opening section must immediately communicate that this is a blog/publication.

Do not use:

- centered oversized marketing headline
- giant CTA
- gradient hero background
- floating product mockups
- decorative blobs
- fake statistics

Instead, use a featured article with:

- small uppercase or compact category
- strong serif headline
- concise dek
- quiet metadata
- one high-quality editorial image

The image should carry visual weight while the typography carries meaning.

## G. Article Page: Maximum Reading Comfort

The article page should become visually quieter as the user moves from header into body content.

Recommended rhythm:

`headline → dek → metadata → hero → intro → body → wider image → body → pull quote → body → related`

The body should feel almost paper-like:

- warm white or white background
- dark text
- no persistent decorative sidebars
- no excessive borders
- no repeated cards
- no visual interruptions between paragraphs

Paragraph spacing should be consistent, but not so large that the article feels fragmented.

## H. Typography Refinement

Typography should create most of the site's personality.

Recommended:

**Display:** Newsreader

**UI / Body:** Inter

Use serif typography selectively for:

- article titles
- major editorial statements
- pull quotes
- selected feature headlines

Use sans-serif typography for:

- navigation
- metadata
- categories
- buttons
- forms
- search
- utility UI
- article body if readability testing favors it

Do not mix more than two primary type families.

Avoid excessive bold text. Use weight changes sparingly.

## I. Emerald Brand Accent

Use `#00A86B` as a **signal**, not a surface.

Good uses:

- category label
- active navigation
- text links
- reading progress
- tiny editorial marker
- focus state
- selected filter
- subtle button accent

Recommended accent usage:

- approximately 2–5% of visible UI area
- never as a full-page background
- never behind long paragraphs
- never on every interactive element

The brand should be recognizable even when the accent is barely visible.

## J. Image Direction

Images should feel like they belong to the same publication.

Prefer:

- natural light
- authentic environments
- documentary moments
- restrained color grading
- realistic textures
- strong subject framing
- consistent crop ratios

Avoid:

- generic stock photography
- glossy corporate imagery
- obvious AI-generated scenes
- excessive 3D objects
- fake UI screenshots
- decorative image overlays

Do not force every article image into the same treatment. Consistency should come from art direction, not identical crops.

## K. Divider System

Use dividers as a major structural tool.

Preferred:

`1px solid #E5E5E5`

Use them:

- below the masthead
- between story-list rows
- above related content
- around newsletter sections
- between major editorial modules

Do not use borders around every component.

## L. Shadow Discipline

Default elevation:

**none**

Only use a shadow when an element genuinely floats above content, such as:

- mobile navigation
- search overlay
- modal
- floating utility

Never use shadows to compensate for weak hierarchy.

## M. Interaction

Interaction should feel polished but nearly invisible.

Use:

- 150–200ms transitions
- subtle underline expansion
- slight image scale on hover
- small arrow translation
- opacity changes
- visible keyboard focus

Avoid:

- bounce
- parallax
- scroll-jacking
- animated gradients
- excessive motion
- cards jumping on hover

The page should remain calm when the user is reading.

## N. Responsive Editorial Rules

### Desktop

Use composition and negative space to create hierarchy.

### Tablet

Simplify the grid before shrinking everything.

### Mobile

Prioritize:

- title
- summary
- metadata
- hero
- article body

Remove anything non-essential.

Do not reproduce desktop complexity on mobile.

## O. Blog Identity Test

Before approving a page, ask:

- Does this immediately look like an article/blog website?
- Is the article obviously the main product?
- Can the headline be understood within two seconds?
- Does the page feel calm rather than busy?
- Is the visual identity recognizable without decorative effects?
- Does the layout resemble a publication rather than a SaaS dashboard?
- Are cards used sparingly?
- Is emerald functioning as a brand signal rather than a decoration?
- Does the article remain comfortable to read for several minutes?
- Would the page still look premium in grayscale?

If any answer is no, simplify the design before adding anything.

## P. Final Visual Formula

The intended visual formula is:

**Warm White + Near Black + Emerald Accent + Editorial Serif + Clean Sans + Strong Grid + Large Negative Space + Real Photography + Thin Rules + Minimal UI**

The desired impression:

**minimal · elegant · modern · editorial · credible · premium · calm · readable**

Not:

**SaaS · dashboard · template · flashy · card-heavy · AI-generated · over-designed**

---

# 35. Final Design Philosophy

The strongest version of this website is not the one with the most visual effects.

It is the one where:

- the right article is easy to discover
- the headline immediately communicates value
- typography feels intentional
- images feel editorially selected
- the article is exceptionally comfortable to read
- navigation disappears into the background while reading
- related content feels naturally connected
- spacing creates calm
- visual variation comes from composition
- branding is recognizable without being loud

**Design with restraint.**

**Use hierarchy instead of decoration.**

**Use typography instead of gimmicks.**

**Use editorial composition instead of generic card grids.**

**Make every pixel serve the content.**
