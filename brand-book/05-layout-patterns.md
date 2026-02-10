# GEO 42 Brand Book — Layout Patterns & Section Templates

> **Purpose**: Standardized section layouts, spacing, grid patterns, and structural conventions. Use these patterns for web pages, pitch decks, and document layouts.

---

## Global Layout

### Page Structure

```
┌─────────────────────────────────────────┐
│ Scroll Progress Bar (3px, sticky top)   │
├─────────────────────────────────────────┤
│ Sticky Glass Header                     │
├─────────────────────────────────────────┤
│                                         │
│  Main Content                           │
│  (max-w-6xl, centered, px-4 sm:px-6)   │
│                                         │
├─────────────────────────────────────────┤
│ Footer (bg-primary-950)                 │
└─────────────────────────────────────────┘
```

### Container

```html
<div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
  <!-- Content -->
</div>
```

| Property | Value |
|----------|-------|
| Max width | `72rem` (1152px) |
| Horizontal padding | `1rem` (mobile) → `1.5rem` (tablet) → `2rem` (desktop) |
| Centered | `mx-auto` |

### Full-Width Sections

Hero, CTA, and logo marquee sections break out of the container for edge-to-edge coverage. Add `fullWidth: true` to page frontmatter.

---

## Section Pattern

Every major section follows this structure:

```html
<section class="py-20 sm:py-28 lg:py-32 bg-primary-900 section-divider mesh-bg" aria-labelledby="h-section-id">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Eyebrow + Heading block -->
    <div class="text-center mb-16 reveal">
      <p class="text-accent-400 font-semibold text-xs uppercase tracking-[0.2em] mb-5">Section Label</p>
      <h2 id="h-section-id" class="text-display text-4xl sm:text-5xl lg:text-6xl text-primary-50 mb-5 text-glow">
        Section Headline
      </h2>
      <p class="text-primary-300 text-lg lg:text-xl max-w-2xl mx-auto text-pretty">
        Section description text.
      </p>
    </div>
    <!-- Content area -->
    <div class="reveal-scale">
      <!-- Cards, dashboards, etc. -->
    </div>
    <!-- Optional CTA -->
    <div class="text-center mt-10 reveal">
      <a href="/contact/" class="inline-flex items-center gap-2 text-accent-400 hover:text-accent-300 font-semibold">
        CTA text
        <svg>→ arrow</svg>
      </a>
    </div>
  </div>
</section>
```

### Section Spacing

| Breakpoint | Vertical padding |
|-----------|-----------------|
| Mobile | `5rem` (py-20) |
| Tablet | `7rem` (py-28) |
| Desktop | `8rem` (py-32) |

### Section Background Alternation

| Section Group | Background | Additional Classes |
|-------------|-----------|-------------------|
| Primary | `bg-primary-900` | `mesh-bg` (subtle radial gradients) |
| Dark | `bg-primary-950` | — |
| Hero/CTA | `bg-primary-950` | `hero-noise`, `hero-glow`, `accent-stripe` |

### Section Dividers

Sections get a `section-divider` class that renders a gradient fade line at top. Never use `border-t`.

---

## Homepage Narrative Sequence

The homepage follows a **Problem → Proof → Solution → How → Trust → Action** flow:

```
HOOK
├── Hero (noise texture, particles, typewriter)
└── Client logos (dual marquee)

PROBLEM
├── SEO vs GEO comparison (two-column cards + market data)
└── 6 Walls (3×2 card grid)

PROOF
├── Case study before/after (conversation mockup)
└── KPI stats bar (4-up counters)

SOLUTION
├── Product preview carousel (5 dashboard slides)
├── Visibility Flywheel (text + SVG diagram)
└── Services (7-pillar card grid)

HOW
└── Intelligence Dashboard deep-dive (full mock)

TRUST
├── Platform coverage (2×5 icon grid)
└── Industries (1×4 cards)

ACTION
├── FAQ accordion
└── CTA (hero-style with ambient glow)
```

---

## Grid Patterns

### 3-Column Card Grid

Services, 6 Walls sections.

```html
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
  <!-- Cards -->
</div>
```

### 4-Column KPI Grid

KPI stats, platform compact cards.

```html
<div class="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
  <!-- KPI cards -->
</div>
```

### 5-Column Platform Grid

AI platform icons.

```html
<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
  <!-- Platform cards -->
</div>
```

### 2-Column Comparison

SEO vs GEO, Before/After, Text + Visual.

```html
<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
  <!-- Left card -->
  <!-- Right card -->
</div>
```

### Text + Visual Split

Flywheel section uses a wider gap with centered alignment.

```html
<div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
  <div class="reveal-left"><!-- Text content --></div>
  <div class="reveal-right"><!-- Visual/SVG --></div>
</div>
```

---

## Hero Section Layout

```
┌──────────────────────────────────────────────────┐
│ [hero-noise texture overlay]                     │
│ [hero-glow radial purple]                        │
│ [particle-canvas animated dots]                  │
│                                                  │
│     Trust signal (eyebrow)                       │
│     "Become the"          ← gradient-text        │
│     "Answer on ChatGPT"   ← typewriter cycling   │
│                                                  │
│     Description paragraph                        │
│                                                  │
│     [See It in Action] [View Case Study]         │
│                                                  │
└──────────────────────────────────────────────────┘
```

Padding: `pt-24 pb-28` (mobile) → `pt-40 pb-48` (desktop).

---

## CTA Section Layout

```
┌──────────────────────────────────────────────────┐
│ [hero-noise] [hero-glow] [ambient-glow pulsing]  │
│                                                  │
│     "Get Started" (eyebrow)                      │
│     "Ready to Become                             │
│      the AI Answer?"                             │
│                                                  │
│     Description                                  │
│                                                  │
│     [See It in Action]  [email@geo42.ai]         │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

## Sticky Header

```
┌──────────────────────────────────────────────────┐
│ [Logo: 42 icon + GEO 42]   Nav links...  [CTA]  │
└──────────────────────────────────────────────────┘
```

- Sticks to top with `position: sticky; z-index: 50`
- Glass background: `rgba(12,10,30, 0.85)` with `blur(16px)`
- Darkens on scroll (`scrolled` class)
- Mobile: hamburger menu → slide-down nav panel

---

## Footer Layout

```
┌──────────────────────────────────────────────────┐
│ [Logo + Tagline]  [Group 1]  [Group 2]  [Contact]│
│                                                  │
│ ─────── accent gradient line ───────             │
│                                                  │
│        © 2025 GEO 42. All rights reserved.       │
└──────────────────────────────────────────────────┘
```

4-column grid on desktop, stacking on mobile. `bg-primary-950`.

---

## Angled Section Transition

Used between flywheel and adjacent sections for visual dynamism.

```css
.section-angle {
  clip-path: polygon(0 3vw, 100% 0, 100% 100%, 0 100%);
  margin-top: -3vw;
  padding-top: calc(3vw + 4rem);
}
```

---

## Responsive Breakpoints

| Breakpoint | Width | Tailwind Prefix |
|-----------|-------|----------------|
| Mobile | `<640px` | (default) |
| Tablet | `≥640px` | `sm:` |
| Desktop | `≥1024px` | `lg:` |
| Wide | `≥1280px` | `xl:` (rarely used) |

### Mobile-First Rules

- Single column cards on mobile, 2–3 columns on tablet+
- Dashboard slides: `84vw` on mobile, `560px` on tablet, `680px` on desktop
- Marquee speed: `18s` on mobile (faster), `30s` on desktop
- Blur values reduce on mobile for GPU performance
- Touch interactions (tap, swipe) replace hover interactions
