# Engineering Audit: GEO 42 Live Site

**URL:** `https://alexroessner.github.io/MagUpSite/`
**Stack:** Eleventy v3 static site, Tailwind CSS v4.1.18, vanilla JavaScript
**Reviewer posture:** Senior engineer, code review lens

---

## 1. Build Output Quality -- HTML Structure (8/10)

**Strengths:** Clean semantic HTML5, good landmarks, JSON-LD structured data, reasonable 131KB size.

**Issues:**
- Logo marquee bloat: 64 marquee item divs (~190 lines of near-identical markup)
- Dashboard carousel verbosity: 5 slides at 60-80 lines each
- 30+ inline SVGs could use sprite `<use>` pattern
- Footer uses `<h2>` tags for nav group labels

---

## 2. CSS Efficiency (7.5/10)

**Strengths:** Tailwind tree-shaken to 87KB (14.6KB gzipped), clean custom properties, good `@property` declarations.

**Issues:**
- Prose plugin accounts for 15-20KB but unused on homepage
- Heavy `backdrop-filter: blur()` on 20+ elements
- Unused `.gradient-reveal` class

---

## 3. JavaScript Performance (9/10)

**Strengths:**
- 18KB raw / 4.7KB gzipped -- exceptionally small
- `defer` attribute, IntersectionObserver-based, Visibility API integration
- `requestAnimationFrame`-throttled cursor glow, `{ passive: true }` everywhere
- `prefers-reduced-motion` checked at init AND via change event listener
- No dependencies, no framework

**Issues:**
- `optimizeHeroSize` triggers forced layout/reflow via `getBoundingClientRect()`
- FAQ accordion uses `setTimeout(300)` instead of `transitionend` event
- Multiple IntersectionObservers instead of single dispatcher
- `var` instead of `let`/`const` throughout

---

## 4. Animation Performance (8.5/10)

**Strengths:** GPU-composited properties dominate, `will-change` used sparingly, stagger timing well-calibrated.

**Issues:**
- `.scroll-progress` animates `width` -- should use `transform: scaleX()`
- `.shimmer::after` runs infinitely on 15-20 elements
- `.ambient-glow` uses `filter: blur(60px)` with transform animation -- expensive
- `backdrop-filter: blur()` on 20+ cards creates GPU memory pressure

---

## 5. Asset Loading (7/10)

**Strengths:** Zero `<img>` tags, `<link rel="preconnect">` for Google Fonts.

**Issues:**
- **Google Fonts stylesheet is render-blocking** -- blocks first paint
- **10 font files loaded** (Space Grotesk 4, Inter 4, JetBrains Mono 2) -- JetBrains Mono only used in table cells
- Single-bundle CSS includes unused prose styles
- No critical CSS inlining

---

## 6. Mobile Performance -- Carousel (8/10)

**Strengths:** Native CSS scroll-snap, hidden scrollbar, momentum scrolling, touch-first design.

**Issues:**
- iOS scroll-snap bounce at snap boundaries
- Carousel dot sync fires frequently during scroll (needs RAF throttle)
- Missing `scroll-snap-stop: always` -- fast flicks can skip slides

---

## 7. Accessibility Engineering (7.5/10)

**Strengths:** Skip-link, landmarks, ARIA on menu/FAQ/flywheel, reduced motion, safe area insets.

**Issues:**
- Carousel slides lack `aria-roledescription`
- FAQ `hidden` class timing fragility
- `text-primary-500` on dark backgrounds may fail contrast ratio

---

## 8. Code Quality (8/10)

**Strengths:** Zero dependencies, IIFE wrapper, defensive null checks, clean separation.

**Concerns:** `var` declarations, magic numbers, no canvas error boundary.

---

## TOP 5 RECOMMENDATIONS

1. **Make Google Fonts non-render-blocking** -- `<link rel="preload" as="style">` with onload handler
2. **Fix scroll-progress to use `transform: scaleX()`** -- one-line compositor fix
3. **Reduce `backdrop-filter` on mobile** -- remove or simplify blur below 768px
4. **Implement critical CSS inlining** -- ~5KB inline for header + hero
5. **Add `scroll-snap-stop: always`** to carousel slides
