# Brand Interpreter -- Site Audit Report

**Auditor**: Brand Interpreter Persona
**Date**: 2026-02-11
**Scope**: Full-site brand consistency audit of GEO 42 (geo42.ai)
**Files Reviewed**: 22 files across brand-book/, src/css/, src/js/, src/_includes/, src/*.njk, whitelabel.config.js

---

## Executive Summary

The GEO 42 site demonstrates **strong overall brand coherence** -- the deep-purple + vivid-violet color system, glassmorphism card hierarchy, Space Grotesk/Inter typography pairing, and purposeful animation design all create a distinctive, technically authoritative identity. The brand book is thorough and the implementation largely follows it with precision. However, a small number of high-impact issues undermine this otherwise excellent work: the **favicon uses completely off-brand colors** (gold on black instead of violet on purple), the **style guide documents glass-card blur behavior that no longer matches implementation**, and **hero CTA buttons use `rounded-full` while the documented brand standard is `rounded-xl`**. Fixing these three items would bring the site to near-perfect brand alignment.

---

## Critical Issues (Must Fix)

### C1. Favicon uses entirely off-brand colors

**File**: `/home/user/MagUpUS/src/favicon.svg` (lines 1-4)

The favicon renders "42" in **gold (#D4A017)** on a **near-black (#0F0E0A)** background. These colors exist in neither the primary nor accent palette. Every browser tab displays a completely unrecognizable brand identity.

**Expected**: The favicon should use deep-purple background (e.g., `primary-900` / `#110B30` or `accent-600` / `#7C5CF7`) with violet text (e.g., `accent-400` / `#B197FC`), matching the logo treatment seen in the header, footer, and OG image. The OG image (`src/images/og-image.svg`, line 21-22) correctly uses `#9775FA` fill with `#B197FC` text for the "42" mark -- the favicon should mirror this.

**Impact**: The favicon is the single most frequently seen brand asset (visible in every browser tab, bookmark bar, mobile home screen, and search results). An off-brand favicon fractures recognition across all touchpoints.

---

### C2. Glass card brand book documents blur; implementation removes it

**File**: `/home/user/MagUpUS/src/css/input.css` (lines 386-401)
**Brand book**: `/home/user/MagUpUS/brand-book/01-colors.md` (lines 163-166)

The brand book (Chapter 1, Glass & Transparency Values table) specifies that `.glass-card` should have:
- `background: rgba(20,16,45, 0.60)` with `backdrop-filter: blur(20px) saturate(1.4)`

The actual CSS implementation has:
- `background: rgb(20 16 45 / 85%)` with **no backdrop-filter** (comment on line 385 says "blur removed for perf -- 50+ instances on homepage")
- A separate `.glass-blur` modifier exists (lines 397-401) to opt-in to blur, but it is only used **once** across the entire site (on the dashboard terminal frame at `src/index.njk` line 877)

**The brand book and the implementation must agree.** Either:
1. Update the brand book to document the current two-tier approach (`.glass-card` = solid translucent, `.glass-blur` = frosted), or
2. Restore blur to `.glass-card` if the "frosted glass" aesthetic is the intended brand expression.

**Additionally**: The style guide page (`src/style-guide.njk`, Glassmorphism Components section) describes glass cards as "Frosted glass surfaces with backdrop-filter blur" -- this is misleading since the base card no longer has blur.

---

### C3. Hero/CTA buttons use `rounded-full` but brand standard is `rounded-xl`

**File**: `/home/user/MagUpUS/src/index.njk` (lines 49, 54, 499, 937, 1175, 1180)
**Brand standard**: `/home/user/MagUpUS/src/style-guide.njk` (line 198), `/home/user/MagUpUS/brand-book/03-components.md`

The style guide states: "All buttons use `rounded-xl font-bold shadow-xl`." The header nav CTA correctly uses `rounded-xl` (`src/_includes/base.njk`, line 232). However, the homepage hero and CTA section buttons use `rounded-full` (pill shape):

- Hero primary CTA (line 49): `rounded-full`
- Hero secondary CTA (line 54): `rounded-full`
- Product preview CTA (line 499): `rounded-full`
- Dashboard CTA (line 937): `rounded-full`
- Final CTA section (line 1175): `rounded-full`

Other pages (about.njk line 205, services.njk line 71, 404.njk line 15, sections.njk line 89) correctly use `rounded-xl`. This creates two competing button shapes for the same action ("See It in Action").

**Impact**: The visual inconsistency means the brand's most important conversion element -- the CTA button -- looks different depending on which page the user sees it. The pill shape on the homepage contradicts the `rounded-xl` standard documented in both the style guide and the brand book.

---

## Warnings (Should Fix)

### W1. SVG elements use `system-ui` instead of Space Grotesk

**File**: `/home/user/MagUpUS/src/index.njk`

Multiple inline SVG `<text>` elements specify `font-family="system-ui"` instead of the brand heading font Space Grotesk:

- Flywheel SVG "42" text (line 756): `font-family="system-ui"`
- Flywheel "FLYWHEEL" label (line 757): `font-family="system-ui"`
- Radial progress gauge "32%" (line 391): `font-family="system-ui"`
- Radial progress "Complete" (line 392): `font-family="system-ui"`
- Dashboard mini-SVG "32%" (line 437): `font-family="system-ui"`
- Dashboard mini-SVG "35%" (line 448): `font-family="system-ui"`

The brand book (Chapter 2, Typography) specifies that KPI text, card titles, and display numbers should use Space Grotesk. While SVG text rendering has font-loading constraints, these elements will render in the system default sans-serif (typically SF Pro on macOS, Segoe UI on Windows) rather than the brand typeface.

**Fix**: Use `font-family="'Space Grotesk', system-ui, sans-serif"` in SVG text elements.

---

### W2. OG image uses off-palette hex `#E8E0FF`

**File**: `/home/user/MagUpUS/src/images/og-image.svg` (line 23)

The OG image renders the logo "GEO" text with `fill="#E8E0FF"`, which does not exist in either the primary or accent palette:

- Closest primary token: `primary-100` = `#EDE5FF`
- Closest accent token: `accent-200` = `#E0D4FF`

`#E8E0FF` sits between these two values but matches neither. While the visual difference is subtle, social sharing previews are a high-visibility brand surface that should use exact design tokens.

---

### W3. Logo "GEO" text uses hardcoded `color: white` instead of design token

**File**: `/home/user/MagUpUS/src/css/input.css` (line 101)

```css
.logo-mark .logo-text .logo-geo {
  color: white;
}
```

The brand standard for maximum-emphasis text on dark backgrounds is `primary-50` (`#F5F0FF`), not pure white (`#FFFFFF`). The brand book (Chapter 1) explicitly says `primary-50` is "White Text -- Headlines on dark backgrounds." Using `color: white` bypasses the design system and produces a slightly cooler/harsher white than the warm-tinted `#F5F0FF`.

**Fix**: Change to `color: var(--color-primary-50);`

---

### W4. Typewriter `aria-live="off"` contradicts brand book documentation

**File**: `/home/user/MagUpUS/src/index.njk` (line 40)
**Brand book**: `/home/user/MagUpUS/brand-book/02-typography.md` (line 151)

The brand book documents the typewriter element with `aria-live="polite"`, but the implementation uses `aria-live="off"`. This is likely an intentional performance decision (preventing screen reader verbosity on rapidly cycling text), but the brand book should reflect the actual implementation to maintain documentation accuracy.

---

### W5. Style guide omits `accent-950` from the accent palette display

**File**: `/home/user/MagUpUS/src/style-guide.njk`

The style guide page displays accent swatches from `accent-50` through `accent-900` (10 steps) but omits `accent-950` (`#2E1180`), which is defined in the `@theme` block at `/home/user/MagUpUS/src/css/input.css` (line 1698). Meanwhile, the primary palette correctly shows all 11 steps including `primary-950`. The accent palette display should be symmetric with primary.

---

### W6. Inline `style="border-color: rgba(151,117,250,0.12)"` repeated across dashboard slides

**File**: `/home/user/MagUpUS/src/index.njk` (lines 222, 322, 378, 421)

Four of five dashboard carousel slides override the glass-card border with an identical inline style. This creates a maintenance risk -- if the brand's accent alpha value changes, these inline styles would need manual updates. This should be a CSS class (e.g., `.glass-card--dash`) or the glass-card base border should be adjusted.

---

### W7. Contact form submit button says "Request a Demo" instead of "See It in Action"

**File**: `/home/user/MagUpUS/src/contact.njk` (line 89)

The brand voice chapter (`brand-book/07-brand-voice.md`, line 61) states: **"Primary CTA: 'See It in Action' -- Always this phrase -- never 'Book a Demo' or 'Get Started'."** The contact form submit button reads "Request a Demo", which directly violates this directive. While contextually reasonable for a form submission, the explicit brand voice rule is clear.

---

## Observations (Nice to Have)

### O1. Hero CTA variant text across homepage sections

The primary CTA text "See It in Action" is used correctly in the hero (line 50), nav bar (base.njk line 233), and final CTA (line 1176). However, several mid-page hero-styled buttons (`hero-cta` class) use variant text:

- "See Your Brand's AI Visibility" (line 500)
- "Get Your 90-Day Visibility Forecast" (line 937)

The brand voice chapter allows "Action-oriented phrases" for section CTAs. These variants are engaging but represent a departure from the strict "See It in Action" rule when used with the `hero-cta` gradient pill styling that visually signals "primary CTA."

---

### O2. No Apple Touch Icon PNG fallback

**File**: `/home/user/MagUpUS/src/_includes/base.njk` (line 14)

The `apple-touch-icon` points to `favicon.svg`, but iOS and older Android launchers do not render SVG favicons reliably. A 180x180 PNG fallback would ensure the brand mark appears correctly on home screens. This is especially relevant because the current SVG favicon is off-brand (see C1), meaning even if a PNG were generated from it, it would perpetuate the wrong colors.

---

### O3. `text-body` custom size (17px) defined but underused

**File**: `/home/user/MagUpUS/src/css/input.css` (lines 1671-1672)

The `@theme` block defines `--text-body: 1.0625rem` (17px) with `line-height: 1.7`, and the body element applies it via `text-body leading-relaxed`. However, most template body text uses `text-sm` (14px) or `text-lg` (18px) rather than the custom 17px size. The 17px value functions as a base reset but is rarely leveraged directly, meaning the deliberate custom size has limited practical impact.

---

### O4. Flywheel SVG uses `#B8A0E8` -- a primary-300 token used in an accent context

**File**: `/home/user/MagUpUS/src/index.njk` (line 757)

The flywheel "FLYWHEEL" label uses `fill="#B8A0E8"` (which is `primary-300`). In context, this is being used as a muted accent label rather than a primary/body text element. The distinction is subtle but using an accent-range color (e.g., `accent-400` at lower opacity, or `accent-300`) would be more semantically correct.

---

### O5. Footer copyright year uses `{{ currentYear }}` -- verify dynamic generation

**File**: `/home/user/MagUpUS/src/_includes/base.njk` (line 300)

The copyright notice uses `{{ currentYear }}`. This is good practice, but the template variable must be properly set in the Eleventy data cascade. If not set, it could render blank or as "undefined".

---

### O6. Three.js CDN dependency loaded on every page

**File**: `/home/user/MagUpUS/src/_includes/base.njk` (lines 55-61)

The `<script type="importmap">` for Three.js is included on every page, even though the Three.js scenes (hero, flywheel, CTA) only exist on the homepage. While the import map itself is lightweight, it could be conditionally included only on the homepage via `{% if page.url == "/" %}` to keep the brand's technical precision consistent with its "minimal, purposeful" design principles.

---

## What's Working Well

### Color System Execution
The dual-palette system (deep purple primary + vivid violet accent) is executed with exceptional discipline. All 22 tokens (11 primary, 11 accent) are properly defined in the `@theme` block and used via Tailwind utility classes throughout. There are zero instances of off-system colors in the template Tailwind classes -- every `bg-`, `text-`, `border-` class references a design token. The inline SVG hex values (used in `<stop>`, `<circle>`, `<text>` elements) all map to documented palette entries.

### Typography Hierarchy
Space Grotesk for headings and Inter for body text creates a clear distinction between structural/attention elements and readable content. The `.text-display` class is applied consistently to every section `<h2>` across all pages with the correct `font-weight: 800`, `letter-spacing: -0.04em`, `line-height: 0.95` properties. The responsive type scale (`text-4xl sm:text-5xl lg:text-6xl`) is used uniformly.

### Section Pattern Consistency
Every major section follows the documented pattern from `brand-book/05-layout-patterns.md`: eyebrow label (accent-400, uppercase, tracked) + display heading (text-glow) + description (primary-300) + content + optional CTA. The eyebrow labels match the brand voice chapter's section label table exactly (e.g., "The Shift", "The Challenge", "Proven Results", "Product Preview", "Growth Model", etc.).

### Animation Design Coherence
The core easing curve `cubic-bezier(0.16, 1, 0.3, 1)` is used in every reveal animation (`.reveal`, `.reveal-left`, `.reveal-right`, `.reveal-scale`, `.depth-stagger`, `.bar-fill`). The spring easing `cubic-bezier(0.34, 1.56, 0.64, 1)` is correctly reserved for playful/pop elements (`.stagger-pop`, `.icon-reveal`, `.kpi-flip-container`, `.step-pulse`). This two-tier easing system creates a consistent motion language: "confident deceleration" for content reveals, "energetic bounce" for interactive elements.

### Reduced Motion Accessibility
The `@media (prefers-reduced-motion: reduce)` block (lines 1524-1648) is comprehensive, covering all 25+ animation classes, Three.js canvases, particles, floating shapes, and cursor/touch effects. The JavaScript animation engine also checks `prefers-reduced-motion` at initialization and listens for runtime changes (animations.js, lines 11-21).

### Glass Card Hierarchy
Three levels of glass treatment are used intentionally:
- `.glass-card` -- standard cards (services, platforms, FAQ, dashboards)
- `.card-featured` -- elevated emphasis (case study "after" card, stats row, featured service)
- `.glow-border` -- animated gradient border (platform cards on hover)

This hierarchy creates visual weight differentiation that guides the eye through the page's information architecture.

### CTA Consistency Across Pages
The primary CTA phrase "See It in Action" is correctly used in all primary button instances: hero (index.njk), navigation bar (base.njk), about page, services page, and final CTA section. The `hero-cta` gradient styling is reserved for high-impact conversion moments.

### Section Background Alternation
Sections correctly alternate between `bg-primary-900` (with `mesh-bg`) and `bg-primary-950` (without mesh), creating visual rhythm without jarring transitions. Section dividers use the documented gradient fade pattern (`.section-divider`) rather than flat `border-t` rules.

### OG Image Brand Alignment
The OG image (`src/images/og-image.svg`) uses correct brand gradients (`#110B30` to `#1A1242`), accent colors (`#7C5CF7` to `#B197FC`), and text hierarchy (`#F5F0FF` for headline, `#B8A0E8` for subline, `#8B72B8` for domain). It visually matches the site's hero section, creating consistency between social previews and landing experience.

---

## Detailed Findings

### Design Tokens (`src/css/input.css`)

| Line | Token/Class | Status | Notes |
|------|------------|--------|-------|
| 1666-1699 | `@theme` block | PASS | All 22 color tokens complete (50-950 for both scales) |
| 1667-1670 | Font stacks | PASS | Heading, sans, mono all properly defined with fallbacks |
| 1671-1672 | `--text-body` | MINOR | Defined at 17px but rarely used directly in templates |
| 84-106 | `.logo-mark` | WARN | `.logo-geo` uses `color: white` instead of token (W3) |
| 336-357 | `.hero-cta` | PASS | Gradient values match brand book exactly |
| 386-401 | `.glass-card` | CRITICAL | No backdrop-blur; brand book says blur exists (C2) |
| 477-496 | `.card-featured` | PASS | Gradient, blur, border all match spec |
| 498-563 | `.glow-border` | PASS | Conic gradient, sweep animation, touch fallback correct |
| 598-612 | `.section-divider` | PASS | Gradient fade, not border-t; matches brand book |
| 614-625 | `.text-glow`, `.text-display` | PASS | Values match brand book exactly |
| 643-655 | `.scroll-progress` | PASS | 3px height, accent gradient, scaleX transform |
| 657-676 | `.cursor-glow` | PASS | 400px, radial gradient, hidden on touch |
| 678-710 | `.touch-ripple` | PASS | 120px, 0.6s duration, correct easing |
| 1524-1648 | Reduced motion | PASS | Comprehensive coverage of all animated elements |

### Brand Config (`whitelabel.config.js`)

| Property | Value | Status |
|----------|-------|--------|
| company.name | "GEO 42" | PASS |
| company.tagline | "The Answer Engine for Enterprise Brands" | PASS |
| colors.primary | "#110B30" | PASS -- matches primary-900 |
| colors.accent | "#9775FA" | PASS -- matches accent-500 |
| fonts.heading | Space Grotesk stack | PASS |
| fonts.body | Inter/InterVariable stack | PASS |
| fonts.googleFontsUrl | Loads all 3 families | PASS |

### Favicon (`src/favicon.svg`)

| Element | Current | Expected | Status |
|---------|---------|----------|--------|
| Background fill | `#0F0E0A` (near-black) | `#110B30` (primary-900) or `#9775FA` | CRITICAL (C1) |
| Text fill | `#D4A017` (gold) | `#B197FC` (accent-400) | CRITICAL (C1) |
| Font family | `system-ui,sans-serif` | `'Space Grotesk', system-ui, sans-serif` | WARN (W1) |

### OG Image (`src/images/og-image.svg`)

| Element | Value | Token Match | Status |
|---------|-------|------------|--------|
| BG gradient start | `#110B30` | primary-900 | PASS |
| BG gradient end | `#1A1242` | primary-800 | PASS |
| Accent line | `#7C5CF7` to `#B197FC` | accent-600 to accent-400 | PASS |
| Glow center | `#9775FA` at 15% | accent-500 | PASS |
| Logo "42" text | `#B197FC` | accent-400 | PASS |
| Logo "GEO" text | `#E8E0FF` | NONE -- off-palette | WARN (W2) |
| Headline | `#F5F0FF` | primary-50 | PASS |
| Subline | `#B8A0E8` | primary-300 | PASS |
| Domain | `#8B72B8` | primary-400 | PASS |

### Base Layout (`src/_includes/base.njk`)

| Element | Line | Status | Notes |
|---------|------|--------|-------|
| Meta viewport | 5 | PASS | `viewport-fit=cover` for notched devices |
| Favicon link | 13 | CRITICAL | Points to off-brand favicon.svg (C1) |
| Apple touch icon | 14 | WARN | Uses SVG; iOS needs PNG fallback (O2) |
| OG image | 31 | PASS | Points to correctly-branded og-image.svg |
| Google Fonts preload | 49-50 | PASS | Non-render-blocking pattern |
| Header glass | 213 | PASS | `.site-header` with correct glass values |
| Logo mark | 216-218 | PASS | Correct `.logo-mark` structure |
| Nav CTA | 232-233 | PASS | "See It in Action" with `rounded-xl` |
| Footer | 265-301 | PASS | Correct bg-primary-950, 4-col grid, accent-line |
| JSON-LD | 64-200 | PASS | Comprehensive structured data |

### Homepage (`src/index.njk`)

| Section | Lines | Brand Alignment | Issues |
|---------|-------|----------------|--------|
| Hero | 1-60 | Strong | CTA buttons use `rounded-full` not `rounded-xl` (C3); `aria-live="off"` differs from brand book (W4) |
| Logo Marquee | 62-96 | Strong | Correct dual-track, reverse, client names, pause button |
| SEO vs GEO | 107-199 | Excellent | Correct eyebrow, color coding, data figures match brand book |
| Product Preview carousel | 200-505 | Good | Inline border-color styles repeated (W6); SVG uses system-ui (W1) |
| Case Study | 512-610 | Excellent | Before/After contrast, accent hierarchy, platform badges |
| 6 Walls | 618-660 | Excellent | Correct 3x2 grid, icon style, card hierarchy |
| KPI Stats | 662-698 | Excellent | Counter animation, flip reveal, glow treatment |
| Flywheel | 704-780 | Good | SVG uses `system-ui` font (W1); `#B8A0E8` in accent context (O4) |
| Services | 788-856 | Excellent | 7-pillar layout, featured first card, icon-reveal animation |
| Dashboard Deep Dive | 863-942 | Excellent | Terminal frame, bar animations, stagger-pop |
| Platform Coverage | 949-999 | Excellent | 5-col grid, tilt cards, all 10 platforms |
| Industries | 1000-1106 | Strong | 4-col cards, correct icons |
| FAQ | 1113-1155 | Excellent | Glass cards, accordion animation, +45deg toggle |
| CTA | 1157-1185 | Strong | Hero-noise, ambient-glow, correct "See It in Action"; uses `rounded-full` (C3) |

### Secondary Pages

| Page | File | Status | Notes |
|------|------|--------|-------|
| About | `src/about.njk` | PASS | Correct section patterns, CTA uses `rounded-xl`, brand voice consistent |
| Services | `src/services.njk` | PASS | 7 services listed, correct icons, CTA uses `rounded-xl` |
| Contact | `src/contact.njk` | MINOR | Form submit says "Request a Demo" instead of "See It in Action" (W7) |
| Team | `src/team.njk` | PASS | Placeholder structure awaiting client content (D3) |
| Style Guide | `src/style-guide.njk` | WARN | Describes glass cards as having blur (inaccurate, C2); missing accent-950 (W5); button spec says `rounded-xl` but homepage uses `rounded-full` (C3) |

### Animations (`src/js/animations.js`)

| Feature | Lines | Brand Match | Notes |
|---------|-------|------------|-------|
| IntersectionObserver | 29-44 | PASS | `threshold: 0.15`, `rootMargin: "0px 0px -40px 0px"` matches spec |
| Mobile stagger | 48-59 | PASS | Per-child observation on mobile |
| Bar fills | 84-109 | PASS | `threshold: 0.3`, respects reduced motion |
| Counters | 111-155 | PASS | 1800ms duration, ease-out cubic, tabular-nums |
| Typewriter | 206-260 | PASS | 80ms type, 40ms delete, 2s pause; visibility gating |
| FAQ accordion | 263-299 | PASS | Exclusive open, smooth max-height transition |
| Carousel | 302-394 | PASS | Dynamic step measurement, keyboard nav, aria-current |
| Scroll progress | 396-421 | PASS | RAF-throttled, cached docHeight, debounced resize |
| Cursor glow | 423-454 | PASS | Pointer devices only, RAF-throttled movement |
| Touch ripple | 456-479 | PASS | Touch devices only, 600ms burst |
| Platform tilt | 481-497 | PASS | Desktop only, 12deg max tilt, reduced motion check |
| Marquee toggle | 499-527 | PASS | Tap to pause on touch, keyboard-accessible pause |
| Particle system | 529+ | PASS | WebGL with 2D canvas fallback, visibility gating |

---

## Summary of Findings by Severity

| Severity | Count | IDs |
|----------|-------|-----|
| Critical (Must Fix) | 3 | C1, C2, C3 |
| Warning (Should Fix) | 7 | W1, W2, W3, W4, W5, W6, W7 |
| Observation (Nice to Have) | 6 | O1, O2, O3, O4, O5, O6 |

---

## Priority Remediation Order

1. **C1** -- Fix favicon colors (5 minutes, highest brand impact)
2. **C3** -- Standardize button radius to `rounded-xl` on homepage CTAs (15 minutes)
3. **C2** -- Reconcile glass-card documentation with implementation (30 minutes)
4. **W1** -- Update SVG font-family to include Space Grotesk (10 minutes)
5. **W3** -- Replace `color: white` with `var(--color-primary-50)` in logo CSS (2 minutes)
6. **W2** -- Fix OG image `#E8E0FF` to `#EDE5FF` (primary-100) (5 minutes)
7. **W5** -- Add accent-950 to style guide palette display (5 minutes)
8. **W4** -- Update brand book typewriter docs to reflect `aria-live="off"` (2 minutes)
9. **W6** -- Extract inline border-color to CSS class (10 minutes)
10. **W7** -- Change contact form submit to "See It in Action" (2 minutes)
