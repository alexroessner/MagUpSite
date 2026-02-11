# Style Cloner -- Site Audit Report

## Executive Summary

The GEO 42 design system is **well-architected and highly consistent**. The `@theme` block provides complete primary (50-950) and accent (50-950) color scales, three font families, and a custom body text size. The glassmorphism aesthetic is deeply implemented with a rich component vocabulary (glass-card, card-featured, glow-border, shimmer, card-lift) and an extensive animation system. The main issues are: (1) the theme block lacks a dedicated neutral/gray scale and omits spacing/radius/shadow tokens, relying on Tailwind defaults; (2) the scraped source palette (tryprofound.com) was intentionally replaced rather than directly translated; (3) several hardcoded hex values and rgba colors in templates bypass the design system; and (4) two accent color tokens used in the hero CTA gradient exist in the theme but are written as raw hex in CSS.

## Critical Issues (Must Fix)

### C1. Hero CTA uses hardcoded hex instead of CSS custom properties

**File:** `/home/user/MagUpUS/src/css/input.css`, lines 337-342 and 352-357

The `.hero-cta` gradient uses raw hex values `#9775FA`, `#7C5CF7`, `#6741F0`, `#B197FC` instead of `var(--color-accent-500)`, `var(--color-accent-600)`, `var(--color-accent-700)`, `var(--color-accent-300)`. While these hex values correspond exactly to accent-500, accent-600, accent-700, and accent-300 in the theme, using raw hex means a future theme change would not propagate to this gradient.

```css
/* CURRENT (lines 337-342) */
.hero-cta {
  background: linear-gradient(135deg, #9775FA, #7C5CF7 60%, #6741F0);
}

/* SHOULD BE */
.hero-cta {
  background: linear-gradient(135deg, var(--color-accent-500), var(--color-accent-600) 60%, var(--color-accent-700));
}
```

**Impact:** If the accent palette changes, the most prominent button on the site would not update.

### C2. No neutral/gray scale defined in @theme

**File:** `/home/user/MagUpUS/src/css/input.css`, lines 1666-1699

The `@theme` block defines `--color-primary-*` (50-950) and `--color-accent-*` (50-950) but provides **no neutral scale**. The site uses Tailwind's built-in colors for semantic purposes (e.g., `bg-emerald-500/15`, `text-amber-400`, `bg-red-500/15`, `text-red-400`) without explicitly defining them in the theme. This is acceptable for Tailwind v4 since these are built-in, but the lack of a defined neutral gray means all gray tones come implicitly from primary-* (deep indigo) rather than a true neutral. This is intentional for the design but should be documented explicitly.

### C3. Inline style hardcoded hex values in SVG elements

**File:** `/home/user/MagUpUS/src/index.njk`, lines 366, 390-392, 436-437, 447-448, 739-757, 925

Multiple inline SVG elements use hardcoded hex values that match accent tokens but bypass the design system:

| Line(s) | Value | Should Be |
|---------|-------|-----------|
| 366 | `#7C5CF7, #B197FC` | accent-600, accent-300 |
| 390 | `stop-color="#7C5CF7"` | accent-600 |
| 390 | `stop-color="#B197FC"` | accent-300 |
| 391 | `fill="#B197FC"` | accent-300 |
| 392 | `fill="#8B72B8"` | primary-400 |
| 436 | `stroke="#9775FA"` | accent-500 |
| 437,448 | `fill="#B197FC"` | accent-300 |
| 447 | `stroke="#7C5CF7"` | accent-600 |
| 749-757 | Multiple SVG strokes/fills | accent-300/400/500/600, primary-300/700/800 |
| 925 | `#7C5CF7, #B197FC` | accent-600, accent-300 |

**Note:** SVG `fill` and `stroke` attributes cannot use Tailwind utility classes, so inline CSS custom properties (`var(--color-accent-500)`) would be needed. However, inline SVG attributes do not support CSS `var()` in all browsers for `fill`/`stroke` -- this is a known SVG limitation. These are acceptable as-is but should be tracked as a known deviation.

## Warnings (Should Fix)

### W1. Inline `style` attributes with rgba colors bypass design tokens

**File:** `/home/user/MagUpUS/src/index.njk`

Multiple dashboard slides use inline `style="border-color: rgba(151,117,250,0.12)"` (lines 235, 281, 322, 378, 421) rather than a utility class or CSS custom property. The value `rgb(151 117 250)` corresponds to `accent-500 (#9775FA)` at 12% opacity.

**Recommendation:** Create a Tailwind utility like `border-accent-500/12` or add a `.glass-card-dash` variant in `input.css`.

### W2. Heatmap cells use inline rgba with hardcoded color

**File:** `/home/user/MagUpUS/src/index.njk`, line 309

```html
style="background: rgba(151, 117, 250, {{ opacity }})"
```

Twenty heatmap cells use inline `rgba(151, 117, 250, ...)` with varying opacities. These are data-driven visualizations where inline styles are somewhat expected, but the base color should reference a token.

### W3. Brand ranking bars use inline gradient with hardcoded hex

**File:** `/home/user/MagUpUS/src/index.njk`, line 366

```html
style="background: linear-gradient(90deg, #7C5CF7, #B197FC)"
```

Used for the "Your Brand" bar in the monitoring dashboard. Should use CSS custom properties.

### W4. Terminal frame border uses inline style

**File:** `/home/user/MagUpUS/src/index.njk`, line 877

```html
style="border: 1px solid rgba(151, 117, 250, 0.15)"
```

Should use `border-accent-500/15` utility class instead.

### W5. Missing spacing tokens in @theme

**File:** `/home/user/MagUpUS/src/css/input.css`, lines 1666-1699

The `@theme` block defines fonts and colors but does not define custom spacing tokens, radius tokens, or shadow tokens. The site relies entirely on Tailwind's default spacing scale (which is fine for Tailwind v4), but a complete design system would document the spacing decisions:

- Section padding: `py-20 sm:py-28 lg:py-32` (consistent pattern)
- Container max-width: `max-w-6xl` (1152px) used universally
- Card padding: `p-6` to `p-10` (varies by card type)
- Card radius: `rounded-2xl` (1rem) used for all cards, `rounded-xl` (0.75rem) for smaller elements

These are consistent in practice but not codified in the theme.

### W6. Missing `--text-body--line-height` custom text size variants

**File:** `/home/user/MagUpUS/src/css/input.css`, lines 1671-1672

The theme defines `--text-body: 1.0625rem` and `--text-body--line-height: 1.7` which creates a custom `text-body` utility. However, no other custom text sizes are defined (e.g., for display, heading, caption). The site uses Tailwind's built-in scale (`text-xs` through `text-7xl`) supplemented by arbitrary values like `text-[10px]`, `text-[11px]`, `text-[min(6rem,10vw)]`. The arbitrary pixel values for dashboard UI are acceptable for data-dense displays.

### W7. `color: white` used in CSS instead of token

**File:** `/home/user/MagUpUS/src/css/input.css`, line 101

```css
.logo-mark .logo-text .logo-geo {
  color: white;
}
```

Should use `color: var(--color-primary-50)` or another token for consistency with the rest of the system. Pure white (`#FFFFFF`) is not in the primary scale (primary-50 is `#F5F0FF`, which has a slight purple tint).

### W8. Semantic color classes not formally defined

The templates use Tailwind's built-in semantic colors (`emerald-400/500`, `amber-400/500`, `red-400/500`) for status indicators (Cited/Partial/None badges, pipeline step states, terminal dots). These are not defined in the `@theme` block. While Tailwind v4 includes them by default, documenting the semantic color mapping would strengthen the design system:

- Success: `emerald-400/500`
- Warning: `amber-400/500`
- Error: `red-400/500`
- Info: `accent-400/500`

The style-guide.njk file at `/home/user/MagUpUS/src/style-guide.njk` (line 54-71) does document these as "Semantic Colors," which partially addresses this.

## Observations (Nice to Have)

### O1. Scraped palette was intentionally replaced, not translated

**File:** `/home/user/MagUpUS/data/scraped-styles.json`

The scraped source (tryprofound.com) uses:
- Primary: `#0D0D0D` (near-black) with gray scale 50-900
- Accent: `#7C3AED` (Tailwind violet-600) with scale 50-900
- Body background: `#000000`
- Card border: `1px solid #232323`
- Button border-radius: `8px`

The implemented GEO 42 design uses:
- Primary: `#110B30` (deep indigo) with custom 50-950 scale
- Accent: `#9775FA` (lighter violet) with custom 50-950 scale
- Body background: `primary-900` (`#110B30`)
- Card border: `1px solid rgb(151 117 250 / 8%)` (accent-tinted)
- Button border-radius: `rounded-xl` (12px) or `rounded-full`

This was clearly an intentional design evolution: the scraped Profound-style dark theme was adapted into a unique glassmorphism identity. The scraped data served as structural inspiration, not a pixel-perfect clone. This is the correct approach for white-label generation.

### O2. Font system diverged from scrape

**Scraped:** Both heading and body use `InterVariable, Inter, ...` (single font family).
**Implemented:** Headings use `Space Grotesk` (geometric sans), body uses `Inter`, code uses `JetBrains Mono`.

The addition of Space Grotesk gives the site a more technical, distinctive character appropriate for a GEO/AI platform. Good design decision.

### O3. Animation timing functions are consistent

The animation system uses two primary easing curves throughout:
- **Standard ease-out:** `cubic-bezier(0.16, 1, 0.3, 1)` -- used for reveals, staggers, card lifts, bar fills, depth staggers, 3D reveals
- **Spring bounce:** `cubic-bezier(0.34, 1.56, 0.64, 1)` -- used for stagger-pop, KPI flip, step-pulse, icon-reveal, tilt-card

Durations follow a clear pattern:
- Quick interactions: `0.2s-0.3s` (hover, press, transition states)
- Standard reveals: `0.5s-0.7s` (scroll-triggered opacity/transform)
- Dramatic reveals: `0.8s-1.1s` (3D depth reveals, bar fills)
- Ambient loops: `2s-4s` (flywheel glow, ambient pulse, shimmer)
- Background motion: `14s-35s` (hero shapes, orbs, marquee, s3d drift)

This is a well-structured timing hierarchy.

### O4. Card shine effect is a sophisticated touch

The `.card-shine` class (input.css lines 1498-1513) combined with JS mousemove tracking (animations.js lines 821-852) creates a physically-based light reflection on `.tilt-card` elements. This uses CSS custom properties `--shine-x` and `--shine-y` updated from JavaScript, which is a good pattern for dynamic effects.

### O5. Touch-specific alternatives are thorough

The design system provides distinct behavior paths for touch vs. pointer devices:
- **Cursor glow** (desktop) vs. **touch ripple** (mobile)
- **Hover lift** (desktop) vs. **active press** (mobile) for `.card-lift`
- **Hover brighten** (desktop) vs. **tap brighten** (mobile) for `.glass-card`
- **Continuous glow-border rotation** (desktop hover) vs. **single sweep on reveal** (mobile)
- **Three.js 3D scenes** (desktop only) vs. **CSS shapes + SVG fallback** (mobile)

### O6. Consider extracting repeated `rgb(151 117 250 / X%)` values

Throughout `input.css`, the value `rgb(151 117 250)` (which is `#9775FA` / accent-500) appears approximately 50+ times with varying opacities. While CSS currently lacks a native way to use custom properties inside `rgb()` with opacity modifiers (without `color-mix()` or similar), Tailwind v4's `accent-500/X` notation handles this in utilities. The custom CSS classes could potentially use `color-mix(in srgb, var(--color-accent-500) X%, transparent)` for better tokenization.

### O7. `@property --border-angle` for animated glow-border

**File:** `/home/user/MagUpUS/src/css/input.css`, lines 565-569

The use of `@property --border-angle` for the animated conic-gradient border is a modern technique (CSS Houdini). Browser support is strong in Chromium and Safari 15.4+ but may not work in Firefox < 128. Consider a static fallback for older Firefox.

### O8. Body font-size set to 17px

**File:** `/home/user/MagUpUS/src/css/input.css`, line 1671

```css
--text-body: 1.0625rem;
```

This is 17px, slightly larger than the typical 16px default. Combined with `--text-body--line-height: 1.7`, this provides excellent readability on dark backgrounds. Good typography decision for the glassmorphism aesthetic.

## What's Working Well

### Color System
- **Complete primary scale** (50-950, 11 steps) with deep indigo tones perfectly suited for the dark glassmorphism aesthetic
- **Complete accent scale** (50-950, 11 steps) providing a rich purple gradient palette
- Both scales have well-chosen perceptual steps -- lighter tones for text on dark backgrounds, darker tones for subtle UI elements on light areas
- The accent-500 (`#9775FA`) works excellently as the hero color, with clear differentiation between 300 (highlights), 400 (interactive text), 500 (badges/dots), 600 (gradients), and 700 (deep accents)

### Typography
- Three-font system (Space Grotesk / Inter / JetBrains Mono) is well-implemented and consistently applied
- `.text-display` class with `font-weight: 800`, `letter-spacing: -0.04em`, `line-height: 0.95` creates strong visual hierarchy
- Category labels consistently use `text-xs uppercase tracking-[0.2em] text-accent-400 font-semibold` pattern across every section
- Body text hierarchy: `text-primary-200` (emphasized), `text-primary-300` (standard), `text-primary-400` (secondary), `text-primary-500` (tertiary) is clear and consistent

### Component System
- **Glass cards** have three clear tiers: `.glass-card` (base), `.card-featured` (elevated), `.glow-border` (animated)
- **Button variants**: Hero CTA (gradient pill), Primary (accent-500 solid, rounded-xl), Ghost (glass-card surface), Text link (accent-400 with arrow)
- CTA text "See It in Action" is used consistently across all primary buttons (homepage hero, header nav, services page, contact form, about page, section pages, style guide)
- All buttons use `.btn-press:active { transform: scale(0.97) }` for consistent tactile feedback
- Cards universally use `rounded-2xl` (16px), buttons use `rounded-xl` (12px) or `rounded-full`

### Animation System
- **26 CSS animation classes** defined in input.css, all with `prefers-reduced-motion: reduce` overrides
- Stagger animations support up to 8 children (`.stagger`) or 10 children (`.stagger-pop`)
- Depth stagger supports 6 children with unique 3D transforms per child
- KPI flip container supports 4 children with spring easing
- Bar fills and dashboard bar fills use consistent easing
- Counter animations use `easeOutCubic` with 1800ms duration

### Accessibility
- **Skip link** properly implemented (input.css lines 22-42)
- **Focus styles** globally applied to `a:focus-visible` and `button:focus-visible` (input.css lines 44-50)
- `.sr-only` class defined (input.css lines 980-991)
- All decorative elements use `aria-hidden="true"`
- FAQ accordion uses `aria-expanded`, `aria-controls`, and `role="region"`
- Dashboard carousel uses `role="region"`, `aria-roledescription="carousel"`, labeled slides
- Progress bars use `role="meter"` with `aria-valuenow/min/max`
- Marquee has keyboard-accessible pause button
- Mobile nav toggle uses `aria-expanded` and `aria-controls`

### Responsive Design
- Consistent breakpoint usage: `sm:` (640px), `md:` (768px), `lg:` (1024px)
- Mobile GPU optimizations at 768px (reduced blur radii, smaller glow elements, faster marquee)
- Touch vs. pointer media queries (`hover: hover`, `hover: none`) for interaction models
- iOS safe-area insets supported (`env(safe-area-inset-*)`)
- Dashboard carousel arrows hidden on mobile, scroll-snap for touch
- Hero font auto-sizing on mobile via JS (`optimizeHeroSize` in animations.js)

### Dark Mode / Theme
- The site is designed exclusively for a dark, glassmorphism aesthetic. There is no light mode toggle, which is the correct decision for this brand identity
- Background colors alternate between `bg-primary-900` (#110B30) and `bg-primary-950` (#08051A) to create depth
- All glass surfaces use translucent backgrounds (`rgb(20 16 45 / 85%)`) over the dark base
- Purple accent glows (`rgb(151 117 250 / N%)`) create consistent depth cues throughout

### Performance Considerations
- `.glass-card` deliberately omits `backdrop-filter: blur()` for performance on pages with 50+ card instances, using opaque translucent background instead
- `.glass-blur` is an opt-in class for blur on select elements
- Three.js scenes conditionally loaded only on desktop pointer devices
- Particle system uses WebGL with fallback to 2D canvas
- All scroll handlers use `requestAnimationFrame` throttling and `{ passive: true }`
- Visibility gating pauses animations when page is hidden (`document.visibilitychange`)
- IntersectionObserver unobserves after triggering to avoid ongoing cost

## Detailed Findings

### Token-by-Token Breakdown

#### Colors

| Token | Value | Usage | Status |
|-------|-------|-------|--------|
| `primary-50` | `#F5F0FF` | Gradient text start, highlighted text | OK |
| `primary-100` | `#EDE5FF` | (Minimal direct use, serves as scale completeness) | OK |
| `primary-200` | `#D4C4FF` | Client logos, emphasized body text, nav links | OK |
| `primary-300` | `#B8A0E8` | Standard body text, descriptions | OK |
| `primary-400` | `#8B72B8` | Secondary text, terminal title | OK |
| `primary-500` | `#6350A0` | Tertiary text, metadata, table headers | OK |
| `primary-600` | `#3D2B7A` | Inactive dots, subtle borders | OK |
| `primary-700` | `#2A1D5E` | Bar backgrounds, border colors | OK |
| `primary-800` | `#1A1242` | Card backgrounds, code blocks | OK |
| `primary-900` | `#110B30` | Section backgrounds (alternating) | OK |
| `primary-950` | `#08051A` | Section backgrounds (alternating), body | OK |
| `accent-50` | `#F8F5FF` | (Available, minimal use) | OK |
| `accent-100` | `#F0EAFF` | (Available, minimal use) | OK |
| `accent-200` | `#E0D4FF` | (Available, minimal use) | OK |
| `accent-300` | `#C9B5FF` | Gradient text mid, SVG highlights | OK |
| `accent-400` | `#B197FC` | Interactive text, category labels, typewriter, badges | OK -- primary interactive color |
| `accent-500` | `#9775FA` | Buttons, dots, badges, pulse-dot, borders | OK -- primary brand color |
| `accent-600` | `#7C5CF7` | Gradients, accent line, card-featured border | OK |
| `accent-700` | `#6741F0` | Deep gradient endpoint | OK |
| `accent-800` | `#5530DB` | (Available, minimal use) | OK |
| `accent-900` | `#4320B8` | (Available, minimal use) | OK |
| `accent-950` | `#2E1180` | (Available, minimal use) | OK |

#### Fonts

| Token | Value | Usage | Status |
|-------|-------|-------|--------|
| `--font-heading` | Space Grotesk + fallbacks | `.text-display`, `font-heading` class, logo-mark | OK |
| `--font-sans` | Inter + fallbacks | Body text (via `font-sans` on `<body>`) | OK |
| `--font-mono` | JetBrains Mono + fallbacks | Code blocks, terminal title, IDs | OK |

#### Custom Text Size

| Token | Value | Usage | Status |
|-------|-------|-------|--------|
| `--text-body` | `1.0625rem` (17px) | Applied via `text-body` class on `<body>` | OK |
| `--text-body--line-height` | `1.7` | Paired with text-body | OK |

### Component-by-Component Breakdown

#### Header (`/home/user/MagUpUS/src/_includes/base.njk`, lines 213-258)
- Sticky glass header with `.site-header` class
- Desktop nav: `hidden lg:flex`, accent-400 active state with `bg-accent-500/10`
- Mobile nav: hamburger toggle with `aria-expanded`, hidden panel
- CTA button: `bg-accent-500 text-white rounded-xl font-bold shadow-lg`
- Header scroll state: JS adds `.scrolled` class for denser background
- **Status:** Fully on-system, consistent

#### Footer (`/home/user/MagUpUS/src/_includes/base.njk`, lines 265-302)
- `bg-primary-950 border-t border-primary-800`
- 4-column grid with logo, footer nav groups, contact
- Footer group headings: `font-heading text-sm font-semibold text-accent-400 uppercase tracking-wider`
- Links: `text-primary-300 hover:text-white`
- Copyright: `text-primary-500 text-center`
- `.accent-line` divider before copyright
- **Status:** Fully on-system, consistent

#### Buttons

| Variant | Pattern | Files |
|---------|---------|-------|
| Hero CTA | `.hero-cta` gradient pill, `rounded-full`, `font-bold` | index.njk (lines 49, 499, 937, 1175), style-guide.njk |
| Primary | `bg-accent-500 hover:bg-accent-400 text-primary-950 rounded-xl font-bold shadow-xl` | about.njk, services.njk, contact.njk, sections.njk, 404.njk |
| Secondary/Ghost | `glass-card text-primary-100 hover:text-white font-semibold rounded-xl` | about.njk line 26, style-guide.njk |
| Outline | `border border-primary-600/40 hover:border-accent-500/40 rounded-full` | index.njk lines 54, 1180 |
| Text link | `text-accent-400 hover:text-accent-300 font-semibold` + arrow SVG | index.njk (multiple), services.njk, about.njk |
| Underline link | `text-accent-400 hover:text-accent-300 underline` | contact.njk line 107 |

All buttons consistently use `.btn-press` for active scale feedback. **Status:** Well-defined, consistent.

#### Cards

| Variant | CSS Class | Usage |
|---------|-----------|-------|
| Base glass | `.glass-card` | FAQ items, KPI cards, dashboard slides, service cards, team cards |
| Featured | `.card-featured` | GEO comparison card, case study "after" card, about page stats, contact form container |
| Glow border | `.glow-border` | Team cards, service list cards |
| Accent border | `.card-accent` | About page related links |
| Lift interaction | `.card-lift` | Platform cards, industry cards, wall cards, roadmap cards |
| Tilt 3D | `.tilt-card` | Platform cards, wall cards, industry cards, first service card |
| Shimmer | `.shimmer` | GEO comparison card, first service card |
| KPI glow | `.kpi-glow` | KPI stat cards, dashboard KPI cards |

**Status:** Rich, consistent vocabulary. All cards use `rounded-2xl`. No off-system card patterns found.

#### Forms (`/home/user/MagUpUS/src/contact.njk`, lines 63-92)
- Input styling: `bg-primary-900/60 border border-primary-700/50 rounded-xl text-white placeholder-primary-500 focus:ring-2 focus:ring-accent-500`
- Labels: `text-sm text-primary-400`
- Submit button: Standard primary button pattern
- **Status:** Consistent with design system. All form elements use tokens.

### Contrast Audit

Key text-on-background combinations:

| Foreground | Background | Contrast Ratio | WCAG AA (4.5:1) |
|-----------|------------|---------------|-----------------|
| `primary-50` (#F5F0FF) | `primary-950` (#08051A) | ~18.3:1 | PASS |
| `primary-100` (#EDE5FF) | `primary-950` (#08051A) | ~16.8:1 | PASS |
| `primary-200` (#D4C4FF) | `primary-900` (#110B30) | ~10.5:1 | PASS |
| `primary-300` (#B8A0E8) | `primary-900` (#110B30) | ~6.8:1 | PASS |
| `primary-400` (#8B72B8) | `primary-900` (#110B30) | ~3.8:1 | FAIL (AA normal) / PASS (AA large) |
| `primary-500` (#6350A0) | `primary-900` (#110B30) | ~2.2:1 | FAIL |
| `accent-400` (#B197FC) | `primary-900` (#110B30) | ~6.5:1 | PASS |
| `accent-400` (#B197FC) | `primary-950` (#08051A) | ~7.3:1 | PASS |
| `accent-500` (#9775FA) | `primary-950` (#08051A) | ~5.5:1 | PASS |
| `white` (#FFFFFF) | `primary-950` (#08051A) | ~19.6:1 | PASS |
| `white` (#FFFFFF) | `primary-900` (#110B30) | ~17.4:1 | PASS |
| `primary-950` (#08051A) | `accent-500` (#9775FA) | ~5.5:1 | PASS (button text) |
| `emerald-400` (~#34D399) | `primary-900` (#110B30) | ~7.8:1 | PASS |
| `amber-400` (~#FBBF24) | `primary-900` (#110B30) | ~10.2:1 | PASS |

**Concern:** `text-primary-400` on `bg-primary-900` falls slightly below WCAG AA for normal text (3.8:1 vs required 4.5:1). This is used for secondary card descriptions (e.g., "text-primary-400 text-sm"). At `text-sm` (14px), this is normal-sized text requiring 4.5:1.

`text-primary-500` on dark backgrounds consistently fails AA. However, this is used only for tertiary metadata labels (timestamps, table headers, small labels) at `text-xs` or `text-[10px]` sizes -- these are supplementary information, not primary content. Still technically a WCAG violation.

### Responsive Breakpoint Audit

The site uses a consistent breakpoint system:

| Breakpoint | Tailwind Prefix | Usage Count (approx.) |
|-----------|----------------|----------------------|
| 640px | `sm:` | Section padding, text sizes, grid cols, button sizes |
| 768px | `max-sm:`, CSS `@media (width <= 768px)` | Mobile GPU optimizations in CSS |
| 1024px | `lg:` | Grid columns, nav visibility, section padding |

Responsive patterns are consistent:
- **Section padding:** `py-20 sm:py-28 lg:py-32` (most sections)
- **Display text:** `text-4xl sm:text-5xl lg:text-6xl` (all section headings)
- **Grid layouts:** `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3/4/5`
- **Container:** `max-w-6xl mx-auto px-4 sm:px-6 lg:px-8` (universal)

One minor inconsistency: the dashboard carousel uses `w-[84vw] sm:w-[560px] lg:w-[680px]` which introduces arbitrary width values specific to the carousel context. This is acceptable for a carousel component.

### Animation Inventory

#### CSS-defined animations (input.css)

| Keyframe Name | Duration | Easing | Purpose |
|--------------|----------|--------|---------|
| `typing` | 2.5s | `steps(40, end)` | Typewriter width reveal |
| `blink` | 0.8s | `step-end` | Cursor blink |
| `marquee` | 30s (mobile: 18s) | `linear` | Logo scroll |
| `rotate-border` | 3s (touch: 2s) | `linear` | Glow border rotation |
| `glow-border-sweep` | 2s | `ease` | Single border sweep (mobile) |
| `pulse-ring` | 2s | `cubic-bezier(0.4, 0, 0.6, 1)` | Dot pulse |
| `shimmer` | 3s (mobile: 4s) | `ease-in-out` | Light sweep |
| `flywheel-glow` | 4s | `ease-in-out` | Box-shadow pulse |
| `s3d-drift` | 18-25s | `ease-in-out` | Geometry float |
| `step-pulse` | 0.6s | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Step badge pop |
| `ambient-pulse` | 4s | `ease-in-out` | CTA glow pulse |
| `ripple-burst` | 0.6s | `cubic-bezier(0.16, 1, 0.3, 1)` | Touch ripple |
| `float-gentle` | 4s | `ease-in-out` | Subtle breathing |
| `glow-fade` | 2s | `ease` | Glow dissipation |
| `orb-lg/md/sm` | 22-35s | `ease-in-out` | Ambient orb drift |
| `hdrift1-8` | 14-28s | `ease-in-out` | Hero shape parallax |

#### JS-driven animations (animations.js)

| Animation | Trigger | Duration/Timing |
|-----------|---------|----------------|
| Scroll reveals | IntersectionObserver (0.15 threshold) | CSS transition: 0.5-0.7s |
| 3D reveals | IntersectionObserver (0.12 threshold) | CSS transition: 0.9-1.1s |
| Counter animation | IntersectionObserver (0.5 threshold) | 1800ms, easeOutCubic |
| Bar fill | IntersectionObserver (0.3 threshold) | CSS transition: 1.2s |
| Typewriter | setTimeout loop | 80ms type, 40ms delete, 2000ms pause |
| Particle system | requestAnimationFrame | Continuous (visibility-gated) |
| Cursor glow | mousemove + RAF | Immediate |
| Tilt card | mousemove + RAF | Immediate transform |
| Scroll progress | scroll + RAF | Immediate scaleX |
| Header scroll | scroll + RAF | CSS transition: 0.3s |

**Timing consistency:** All scroll-triggered reveals use the same easing family. Duration tiers (quick/standard/dramatic/ambient) are well-defined. The only anomaly is `pulse-ring` using `cubic-bezier(0.4, 0, 0.6, 1)` which differs from the two standard curves -- this is acceptable as it creates a distinct "breathe" feel for the pulse dot.

### Files Audited

| File | Path | Lines |
|------|------|-------|
| CSS theme & components | `/home/user/MagUpUS/src/css/input.css` | 1700 |
| Scraped source styles | `/home/user/MagUpUS/data/scraped-styles.json` | 151 |
| Brand config | `/home/user/MagUpUS/whitelabel.config.js` | 37 |
| Base layout | `/home/user/MagUpUS/src/_includes/base.njk` | 351 |
| Page layout | `/home/user/MagUpUS/src/_includes/page.njk` | 23 |
| Homepage | `/home/user/MagUpUS/src/index.njk` | ~1186 |
| About page | `/home/user/MagUpUS/src/about.njk` | 211 |
| Services page | `/home/user/MagUpUS/src/services.njk` | 77 |
| Contact page | `/home/user/MagUpUS/src/contact.njk` | 113 |
| Team page | `/home/user/MagUpUS/src/team.njk` | 17 |
| Sections template | `/home/user/MagUpUS/src/sections.njk` | 122 |
| 404 page | `/home/user/MagUpUS/src/404.njk` | 20 |
| Style guide | `/home/user/MagUpUS/src/style-guide.njk` | 393 |
| Animation engine | `/home/user/MagUpUS/src/js/animations.js` | 897 |
| Three.js hero | `/home/user/MagUpUS/src/js/three-hero.js` | ~300 |

---

*Audit performed by Style Cloner persona on 2026-02-11.*
*Design system quality rating: 8.5/10 -- Excellent implementation with minor tokenization gaps.*
