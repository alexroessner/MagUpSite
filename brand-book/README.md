# GEO 42 Brand Book

> **The single source of truth for all GEO 42 visual identity, design tokens, and component patterns.**
>
> Use this brand book to produce pitch decks, internal documents, summaries, social media assets, and any new materials that must match the GEO 42 website aesthetic.

---

## Quick Start for Agents

If you are an AI agent tasked with creating new GEO 42 materials, start here:

1. **Colors** → [`01-colors.md`](./01-colors.md) — Every hex value, gradient, glass transparency, and glow effect
2. **Typography** → [`02-typography.md`](./02-typography.md) — Font families, weights, sizes, spacing, text hierarchy
3. **Components** → [`03-components.md`](./03-components.md) — Glass cards, buttons, badges, KPI cards, logos, dividers
4. **Dashboards** → [`04-dashboard-elements.md`](./04-dashboard-elements.md) — Charts, tables, heatmaps, progress bars, gauges, data feeds
5. **Layouts** → [`05-layout-patterns.md`](./05-layout-patterns.md) — Section templates, grid patterns, page structure, responsive rules
6. **Animations** → [`06-animations.md`](./06-animations.md) — Motion specs, easing curves, scroll reveals, hover/tap interactions
7. **Voice** → [`07-brand-voice.md`](./07-brand-voice.md) — Tone, messaging framework, CTA patterns, key data points, terminology
8. **Icons** → [`08-icons-assets.md`](./08-icons-assets.md) — All SVG icons, platform icons, arrows, asset file locations

---

## Brand at a Glance

| Property | Value |
|----------|-------|
| **Brand** | GEO 42 |
| **Tagline** | The Answer Engine for Enterprise Brands |
| **Primary Color** | `#110B30` (deep purple) |
| **Accent Color** | `#9775FA` (vivid violet) |
| **Heading Font** | Space Grotesk |
| **Body Font** | Inter |
| **Mono Font** | JetBrains Mono |
| **Visual Style** | Dark glassmorphism with purple glow aesthetic |
| **CTA Phrase** | "See It in Action" |
| **Contact** | hello@geo42.ai |

---

## Design System Summary

### Visual DNA

- **Dark-mode only** — Never use light/white backgrounds for primary surfaces
- **Glassmorphism** — Frosted translucent cards with backdrop blur and subtle purple borders
- **Purple glow** — Radial glows, text shadows, animated border sweeps, particle effects
- **Gradient dividers** — Section transitions use gradient fades, never hard borders
- **Motion-rich** — Scroll reveals, counter animations, stagger effects, hover lifts

### Key Components

| Component | Class | Purpose |
|-----------|-------|---------|
| Glass Card | `.glass-card` | Default content surface |
| Featured Card | `.card-featured` | Highlighted/premium content |
| Glow Border | `.glow-border` | Animated accent border on focus/hover |
| Card Lift | `.card-lift` | Hover lift + tap press interaction |
| Hero CTA | `.hero-cta` | Primary conversion button (gradient pill) |
| KPI Card | `.kpi-glow` | Data metric display with glow shadow |
| Section Divider | `.section-divider` | Gradient fade between sections |
| Text Display | `.text-display` | Large heading treatment |
| Text Glow | `.text-glow` | Purple halo on headings |
| Gradient Text | `.gradient-text` | Multi-color gradient fill on text |

### Source Files

| File | Purpose |
|------|---------|
| `src/css/input.css` | All CSS classes, @theme tokens, animations, responsive rules |
| `src/js/animations.js` | Scroll reveals, counters, typewriter, carousel, particles |
| `src/_data/pageContent.json` | Structured content data |
| `whitelabel.config.js` | Brand identity configuration |
| `src/index.njk` | Homepage — all component patterns in use |
| `src/style-guide.njk` | Live style guide page with component demos |
| `src/_includes/base.njk` | Base layout — header, footer, meta, JSON-LD |
| `src/images/og-image.svg` | Social preview image (1200×630) |

---

## How to Use This Brand Book

### For Pitch Decks

1. Use **dark backgrounds** (`#110B30` or `#08051A`)
2. Headlines in **Space Grotesk 800** with gradient text effect
3. Body in **Inter 400** at `primary-300` color
4. Cards use glassmorphism: translucent dark panels with subtle purple borders
5. Data visualizations use accent purple bars with the `#7C5CF7 → #B197FC` gradient
6. CTA slides use the ambient glow background pattern
7. Dashboard screenshots/mockups use elements from [`04-dashboard-elements.md`](./04-dashboard-elements.md)

### For Internal Documents

1. Use glass card patterns for callout boxes
2. KPI cards for metric summaries
3. Progress bars for project tracking
4. Pipeline steps for process flows
5. Status badges (Cited/Partial/None) for data tables

### For Social Media

1. Use the OG image template (`src/images/og-image.svg`) as a base
2. Accent gradient line at top and bottom
3. Space Grotesk for headlines, gradient text for emphasis
4. Purple glow behind key text

### For Another Agent

If you are an agent building new pages, materials, or documents:

1. Read the relevant section file for exact CSS/HTML to copy
2. Every component includes ready-to-paste code snippets
3. Follow the color hierarchy strictly — see [`01-colors.md`](./01-colors.md) for the full token table
4. Match the typography scale — see [`02-typography.md`](./02-typography.md) for exact sizes
5. Use the section pattern from [`05-layout-patterns.md`](./05-layout-patterns.md) for new sections
6. Respect animation specs from [`06-animations.md`](./06-animations.md) — especially the core easing curve
7. Match the brand voice from [`07-brand-voice.md`](./07-brand-voice.md) — benefit-first, data-driven, direct

---

## Pending Client Assets (D1–D6)

These items are documented in [`07-brand-voice.md`](./07-brand-voice.md) and require client input:

- **D1**: Named case studies with real brand names
- **D2**: Client testimonials / quotes
- **D3**: Team member bios and photos
- **D4**: Pricing tiers
- **D5**: Detailed methodology writeups
- **D6**: Client logo SVG files (currently text-only marquee)
