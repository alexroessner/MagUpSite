# Implementation Plan -- Systematic Resolution of All 56 Edit Items

Organized into implementation phases. Each phase targets a severity tier and groups
related changes to minimize file conflicts and maximize testing efficiency.

---

## PHASE 1: CRITICAL FIXES (2 items)
*Estimated: Quick wins that unblock core functionality*

### Step 1.1: Fix Sitemap URL Doubling (C1)
**File:** `src/sitemap.njk`
- Remove `| url` filter from URL generation: `{{ site.url }}{{ item.url }}` instead of `{{ site.url }}{{ item.url | url }}`
- Verify generated URLs match actual page paths

### Step 1.2: Sync FAQ JSON-LD Schema (C2)
**File:** `src/_includes/base.njk`
- Update the FAQPage JSON-LD to include all 7 FAQ items (currently only 4)
- Match question/answer text exactly with what's on the page

---

## PHASE 2: HIGH-IMPACT SEO + PERFORMANCE (4 items)
*H1, H2, H3, H4 -- Technical fixes with major impact*

### Step 2.1: Add og:image Meta Tag (H1)
**File:** `src/_includes/base.njk`
- Create OG image: generate a 1200x630 PNG/JPG social card using the brand colors and logo
- Add `<meta property="og:image" content="{{ site.url }}/images/og-image.png">`
- Add `<meta property="og:image:width" content="1200">` and height
- Add `<meta name="twitter:card" content="summary_large_image">` (upgrade from `summary`)

### Step 2.2: Fix Google Fonts Render-Blocking (H2)
**File:** `src/_includes/base.njk`
- Replace `<link rel="stylesheet" href="fonts.googleapis.com/...">` with:
  ```html
  <link rel="preload" as="style" href="fonts.googleapis.com/..." onload="this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="fonts.googleapis.com/..."></noscript>
  ```
- Add font-display: swap fallback in CSS

### Step 2.3: Fix Space Grotesk Weight 800 (H3)
**File:** `src/_includes/base.njk`
- Update Google Fonts URL to include weight 800: `Space+Grotesk:wght@300;400;500;600;700;800`
- OR change `.text-display` in input.css from `font-weight: 800` to `font-weight: 700`

### Step 2.4: Fix Scroll-Progress Compositor (H4)
**File:** `src/js/animations.js` + `src/css/input.css`
- CSS: Change `.scroll-progress` to `width: 100%; transform: scaleX(0); transform-origin: left`
- JS: Change `progressBar.style.width = progress + "%"` to `progressBar.style.transform = "scaleX(" + (progress / 100) + ")"`

---

## PHASE 3: HIGH-IMPACT CONTENT + UX (6 items)
*H5-H10 -- Content and navigation improvements*

### Step 3.1: Expand "GEO" in Hero (H5)
**File:** `src/index.njk`
- Add "Generative Engine Optimization" as sub-label or first line above/below the hero H1
- Format: small uppercase label like existing section labels

### Step 3.2: Add CTAs to Dead-End Sections (H6)
**File:** `src/index.njk`
- After Dashboard Carousel: "See Your Brand's AI Visibility →" link to /contact/
- After SEO-vs-GEO section: "Break Through the Binary →" link to /contact/
- After 6 Walls: "Overcome Every Wall →" link to /contact/
- After Services section: already has "View all services" -- ensure it links properly
- After Platform Coverage: "Get Coverage Across All Platforms →" link to /contact/
- After Industries: "See How We Help Your Industry →" link to /contact/
- Each CTA: consistent style, centered, with subtle reveal animation

### Step 3.3: Add Dashboard Framing Labels (H7)
**File:** `src/index.njk`
- Carousel section: Add label "Your Dashboard on Day 1" or "Live Product Preview"
- Intelligence Dashboard section: Add label "After 90 Days of GEO 42" or "Your Results at Scale"

### Step 3.4: Fix FAQ Heading (H8)
**File:** `src/index.njk`
- Change "We Have the Answers" → "Your Questions About AI Visibility, Answered"
- Ensure heading style remains consistent (text-display, gradient-text, etc.)

### Step 3.5: Add Contact Form (H9)
**File:** `src/contact.njk`
- Add a static form with action pointing to Formspree or similar service
- Fields: Name, Email, Company, Company Size (dropdown), Message
- Keep existing mailto as fallback
- Style with glass-card, consistent with site design

### Step 3.6: Fix Broken /7-ai-agents/ Link (H10)
**File:** `src/about.njk`
- Find the link to `/7-ai-agents/`
- Replace with anchor link to homepage services section: `/#services`

---

## PHASE 4: ACCESSIBILITY (12 items)
*M1-M6, M11-M14, M17, L8, L9, L10, L14*

### Step 4.1: ARIA Carousel Pattern (M1)
**File:** `src/index.njk`
- Add to carousel container: `role="region" aria-roledescription="carousel" aria-label="Product dashboards"`
- Add to each slide: `role="group" aria-roledescription="slide" aria-label="Slide N of 5: [title]"`
- Connect dots via `aria-controls`

### Step 4.2: Carousel Dot Touch Targets (M2)
**File:** `src/css/input.css`
- Keep visual size at 8px but add `padding: 18px` to reach 44x44 clickable area
- Or use `min-width: 44px; min-height: 44px` with centered visual dot

### Step 4.3: Table Caption + Scope (M3)
**File:** `src/index.njk`
- Add `<caption class="sr-only">Prompt Research - AI Platform Citation Status</caption>` to Prompt Research table
- Add `scope="col"` to all `<th>` elements in table header

### Step 4.4: Heatmap Text Alternative (M4)
**File:** `src/index.njk`
- Add `aria-hidden="true"` to heatmap grid container
- Add visually-hidden paragraph: "Competitor visibility heatmap showing varying brand presence levels across AI platforms, from low to high intensity."

### Step 4.5: Footer Logo aria-label (M5)
**File:** `src/_includes/base.njk`
- Add `aria-label="GEO 42 -- Home"` to footer logo link

### Step 4.6: Footer Heading Levels (M6)
**File:** `src/_includes/base.njk`
- Change footer `<h2>` group labels to `<p class="text-sm font-bold uppercase tracking-wider text-primary-100 mb-4">`

### Step 4.7: Ranking Bars ARIA (M11)
**File:** `src/index.njk`
- Add `role="meter" aria-valuenow="78" aria-valuemin="0" aria-valuemax="100" aria-label="Your Brand visibility"` to each ranking bar in carousel slide 3

### Step 4.8: Counter aria-labels (M12)
**File:** `src/index.njk`
- Add `aria-label="+450%"` (final target value) to each `[data-count]` container element

### Step 4.9: Carousel Slide Headings (M13)
**File:** `src/index.njk`
- Change slide title `<span>` elements to `<h3 class="text-xs sm:text-sm ...">` in each carousel slide

### Step 4.10: Section Landmarks (M17)
**File:** `src/index.njk`
- Give each section H2 a unique ID (e.g., `id="hero-heading"`, `id="case-study-heading"`)
- Add `aria-labelledby` referencing that ID on each `<section>`

### Step 4.11: Typewriter aria-live Adjustment (L9)
**File:** `src/index.njk`
- Add a `<span class="sr-only">` after typewriter listing all platforms statically
- Change typewriter `aria-live="polite"` to `aria-live="off"`

### Step 4.12: Dashboard Min Text Size (L10)
**File:** `src/index.njk`
- Replace `text-[9px]` with `text-[11px]` and `text-[10px]` with `text-[11px]` in dashboard slides

### Step 4.13: Before/After Semantic Labels (L14)
**File:** `src/index.njk`
- Add `<span class="sr-only">Before GEO 42 optimization:</span>` and `<span class="sr-only">After GEO 42 optimization:</span>` to case study cards

### Step 4.14: Marquee Keyboard Pause (L8)
**File:** `src/index.njk` + `src/js/animations.js`
- Add a visually minimal pause button near the marquee
- Toggle `animation-play-state: paused` on the marquee tracks

---

## PHASE 5: DESIGN REFINEMENT (7 items)
*M7-M10, M14, M18, M22*

### Step 5.1: Reduce Shimmer Usage (M7)
**File:** `src/index.njk`
- Remove `shimmer` class from ALL cards except:
  - Hero CTA button
  - Featured service card (#1)
- Leaves ~2 shimmer elements instead of 20+

### Step 5.2: Reduce Glow-Border Usage (M8)
**File:** `src/index.njk`
- Remove `glow-border` from:
  - 6 Walls cards (keep glass-card only)
  - Industries cards
  - Platform Coverage cards
  - Non-featured service cards
- Keep `glow-border` on:
  - Featured service card
  - About page team cards (if desired)

### Step 5.3: Remove Float Animation from Market Data (M9)
**File:** `src/index.njk`
- Remove `float` class from "34x" and "1000x" number elements
- Keep `glow-reveal` and `gradient-text-accent` classes

### Step 5.4: Fix Flywheel Spin (M10)
**File:** `src/css/input.css`
- Replace `@keyframes spin-slow { to { transform: rotate(360deg) } }` with a subtle pulse/glow:
  ```css
  @keyframes flywheel-pulse {
    0%, 100% { opacity: 0.8; filter: drop-shadow(0 0 8px var(--color-accent-400)); }
    50% { opacity: 1; filter: drop-shadow(0 0 16px var(--color-accent-400)); }
  }
  ```
- Update the flywheel SVG animation to use the pulse instead of spin

### Step 5.5: Add scroll-snap-stop (M14)
**File:** `src/css/input.css`
- Add `scroll-snap-stop: always;` to `.dash-slide`

### Step 5.6: Unify CTA Button Pattern (M18)
**File:** `src/index.njk` + `src/_includes/base.njk` + inner pages
- Define ONE primary CTA style: `hero-cta` class (gradient pill, rounded-xl, font-bold, shadow-xl)
- Apply consistently across: hero, nav, section CTAs, inner page CTAs
- Pick one verb convention: "See It in Action" as primary, "Learn More" as secondary

### Step 5.7: Reduce backdrop-filter on Mobile (M22)
**File:** `src/css/input.css`
- In the existing `@media (max-width: 768px)` block, change glass-card from `backdrop-filter: blur(12px)` to `backdrop-filter: blur(6px)` or use solid `background: rgba(20, 16, 45, 0.85)` on mobile

---

## PHASE 6: SEO + METADATA (4 items)
*M16, L13 + remaining SEO items*

### Step 6.1: Create robots.txt (M16)
**File:** `src/robots.txt` (new, passthrough copy)
```
User-agent: *
Allow: /
Sitemap: https://alexroessner.github.io/MagUpSite/sitemap.xml
```
- Add to eleventy.config.js passthrough copies

### Step 6.2: Add BreadcrumbList Schema (L13)
**File:** `src/_includes/base.njk`
- Add BreadcrumbList JSON-LD for inner pages:
```json
{
  "@type": "BreadcrumbList",
  "itemListElement": [{
    "@type": "ListItem",
    "position": 1,
    "name": "Home",
    "item": "{{ site.url }}"
  }, {
    "@type": "ListItem",
    "position": 2,
    "name": "{{ title }}",
    "item": "{{ site.url }}{{ page.url }}"
  }]
}
```

---

## PHASE 7: JS POLISH (6 items)
*L3, L4, L5, L6, L7, L11, L12*

### Step 7.1: FAQ transitionend Fix (L3)
**File:** `src/js/animations.js`
- Replace `setTimeout(function() { content.classList.add("hidden") }, 300)` with `content.addEventListener("transitionend", function() { content.classList.add("hidden") }, { once: true })`

### Step 7.2: Carousel Scroll RAF Throttle (L4)
**File:** `src/js/animations.js`
- Wrap carousel `scroll` handler in RAF:
```js
var rafScrollPending = false;
dashTrack.addEventListener("scroll", function() {
  if (!rafScrollPending) {
    rafScrollPending = true;
    requestAnimationFrame(function() { updateDashDots(); rafScrollPending = false; });
  }
}, { passive: true });
```

### Step 7.3: Canvas Context Null Check (L7)
**File:** `src/js/animations.js`
- Add `var ctx = canvas.getContext("2d"); if (!ctx) return;`

### Step 7.4: Remove Dead CSS (L11)
**File:** `src/css/input.css`
- Remove `.gradient-reveal` class definition

### Step 7.5: var → let/const Modernization (L5)
**File:** `src/js/animations.js`
- Replace `var` with `const` for unchanging references, `let` for mutable variables
- Maintain IIFE wrapper

### Step 7.6: Hero Size requestIdleCallback (L12)
**File:** `src/js/animations.js`
- Wrap `optimizeHeroSize()` call in `requestIdleCallback` if available:
```js
if (window.requestIdleCallback) requestIdleCallback(optimizeHeroSize);
else setTimeout(optimizeHeroSize, 100);
```

---

## PHASE 8: COPY IMPROVEMENTS (2 items)
*M19, M20*

### Step 8.1: Rewrite Service Descriptions (M19)
**File:** `src/index.njk`
- Rewrite all 7 service card descriptions from feature-list to benefit-driven:
  - Current: "Track and analyze your brand's presence across AI platforms..."
  - New: "Know exactly where you appear — and where you don't. Real-time monitoring across 10+ AI platforms shows your brand's visibility score, citation rate, and competitive position."
- Follow pattern: [What] → [Why it matters] → [Outcome]

### Step 8.2: Soften "1,000+ Enterprises" Claim (M20)
**File:** `src/index.njk`
- Change "Trusted by 1,000+ enterprise brands worldwide" to "Trusted by leading enterprise brands worldwide" or "Powering AI visibility for enterprise brands"
- Remove specific number unless client can verify

---

## PHASE 9: HOMEPAGE RESEQUENCING (1 item)
*D7 -- Largest structural change, done last for safety*

### Step 9.1: Reorder Homepage Sections (D7)
**File:** `src/index.njk`
- Current: Hero → Logos → Carousel → Case Study → KPIs → SEO-vs-GEO → 6 Walls → Market Data → Flywheel → Services → Dashboard → Platforms → Industries → FAQ → CTA
- New: Hero → Logos → Carousel → SEO-vs-GEO + Market Data → 6 Walls → Case Study + KPIs → Flywheel → Services → Dashboard Deep-Dive → Platforms → FAQ → CTA
- Remove standalone Industries section (merge industry tags into Services cards)
- Remove standalone Market Data (integrate 34x/1000x into SEO-vs-GEO section)

---

## EXECUTION SUMMARY

| Phase | Items | Focus |
|-------|-------|-------|
| 1 | 2 | Critical: Sitemap + FAQ schema |
| 2 | 4 | High: og:image, fonts, scroll-progress |
| 3 | 6 | High: Hero GEO, CTAs, dashboard labels, FAQ heading, contact form, broken link |
| 4 | 14 | Accessibility: ARIA, touch targets, captions, landmarks |
| 5 | 7 | Design: Shimmer, glow-border, float, flywheel, CTA unification |
| 6 | 2 | SEO: robots.txt, breadcrumbs |
| 7 | 6 | JS: transitionend, RAF, null checks, cleanup |
| 8 | 2 | Copy: Service descriptions, enterprise claim |
| 9 | 1 | Structure: Homepage resequencing |
| **Total** | **44** | **All implementable items** |

Remaining 12 items are content decisions requiring client input (D1-D6) or are addressed within other fixes.
