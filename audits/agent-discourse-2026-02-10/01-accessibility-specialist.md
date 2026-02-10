# GEO 42 Accessibility Audit -- Accessibility Specialist Report

**Site:** https://alexroessner.github.io/MagUpSite/
**Auditor persona:** Accessibility Specialist (WCAG 2.1 AA baseline)

---

## 1. SCREEN READER EXPERIENCE -- Heading hierarchy, reading order, ARIA usage

**Rating: CONCERN**

### What is good

- **Single H1 per page.** The homepage has one `<h1>` in the hero ("Become the Answer on ChatGPT"). The about page and contact page each have their own single `<h1>`. Correct.
- **`aria-hidden="true"` on decorative elements.** Noise textures, glow divs, particle canvases, colored dots, and decorative SVGs all carry `aria-hidden="true"`. This is thorough and correct.
- **`aria-label` on interactive SVGs.** The flywheel SVG has `role="img" aria-label="Visibility Flywheel: Become the Answer, Win Trust, Facilitate Transaction"`. Good practice.
- **`aria-current="page"` on active nav items.** Both desktop nav and mobile nav set `aria-current="page"` when the current URL matches. Correct.
- **`aria-expanded` toggled correctly** on the mobile menu button and FAQ accordion buttons.
- **`aria-controls` on menu toggle** pointing to `mobile-nav`. Correct.
- **Typewriter element has `role="status" aria-live="polite"`** so screen readers will announce changes to the cycling text without being disruptive.

### What needs fixing

1. **Heading hierarchy has gaps on the homepage.** Footer uses `<h2>` elements for "Company", "Services", "Contact" groupings. These should either be demoted to H3 or use `<strong>` or `<p>` instead.

2. **Dashboard carousel slides lack heading structure.** Each slide has a label like "Prompt Research", "Brand Intelligence", etc., but these are marked up as `<span>` elements. A screen reader user scanning by headings will skip the entire carousel. Each slide should have at least an H3.

3. **Heatmap visualization is opaque to screen readers.** The "Competitor Heatmap" is a 5x4 grid of colored `<div>` elements with inline opacity styles. Needs a text alternative -- either `aria-label` on the container or a visually-hidden description.

4. **Brand visibility ranking bars lack accessible labels.** The progress bars convey data visually but have no `role="meter"` or `aria-valuenow`. Compare with the "Platform Visibility" section which correctly uses these attributes.

5. **Footer logo link has no accessible name.** The header logo correctly has `aria-label="GEO 42 -- Home"`, but the footer copy does not.

---

## 2. KEYBOARD NAVIGATION -- Tab order, focus visibility, keyboard traps

**Rating: PASS (with minor concerns)**

### What is good

- **Global `focus-visible` styles.** `outline: 2px solid var(--color-accent-400); outline-offset: 2px` on all `a:focus-visible` and `button:focus-visible`.
- **Mobile menu toggle** is a real `<button>` with appropriate ARIA attributes.
- **FAQ accordion** uses `<button type="button">` elements with `aria-expanded`.
- **Dashboard carousel arrows** are real `<button>` elements with `aria-label`.
- **Touch targets on mobile.** Menu toggle has `min-w-[44px] min-h-[44px]`.

### Concerns

1. **Carousel dots are 8x8px** -- below the 44x44px minimum for touch targets per WCAG 2.5.8.
2. **On smaller viewports, keyboard users have no way to navigate carousel slides** (arrow buttons are `hidden lg:flex`).
3. **FAQ content uses `hidden` class with `setTimeout` removal.** The 300ms gap means content is technically tabbable for 300ms after closing.

---

## 3. MOTION / ANIMATION -- `prefers-reduced-motion` support

**Rating: PASS**

Comprehensive `@media (prefers-reduced-motion: reduce)` block neutralizes ALL animations and transitions. JavaScript checks at load AND listens for runtime changes. All animation systems skip properly. **Exemplary implementation.**

### One minor concern

- **Marquee cannot be paused by keyboard.** Per WCAG 2.2.2, auto-playing content > 5 seconds should have a pause mechanism. However, the marquee is decorative (client logos), so this is a soft concern.

---

## 4. COLOR INDEPENDENCE -- Information conveyed by color alone?

**Rating: CONCERN**

- Dashboard table badges include text labels "Cited", "Partial", "None" -- **passes** WCAG 1.4.1.
- KPI trends use green + `+` sign -- borderline pass.
- Pipeline steps use color + distinct icons + text labels -- **pass**.
- **Heatmap is 100% color-dependent. FAIL for this component.**
- Brand visibility bars use color + bold + numeric percentage -- **pass**.

---

## 5. CONTENT REFLOW -- 200% zoom / 320px viewport

**Rating: PASS (with minor concerns)**

- Hero text uses `min()` for scaling. Dashboard slides use `w-[84vw]`.
- Tables have `overflow-x-auto` wrappers.
- Dashboard table `min-width: 420px` requires two-dimension scrolling at 200% zoom.
- Smallest text is `text-[9px]` and `text-[10px]` in dashboard mockups -- 9-10px is too small for inclusive design.

---

## 6. DYNAMIC CONTENT -- Typewriter effects, animated counters, carousel

**Rating: CONCERN**

- Typewriter `aria-live="polite"` could become annoying (announces every 3-4 seconds).
- Counter elements expose intermediate values to screen readers during animation.
- **Dashboard carousel lacks the WAI-ARIA carousel pattern entirely.** No `role="region"`, no `aria-roledescription="carousel"`, no slide grouping, no live region for current slide.

---

## 7. TABLE ACCESSIBILITY

**Rating: CONCERN**

- Prompt Research table has proper HTML structure but missing `<caption>` and `scope="col"`.
- Heatmap "table" is a CSS grid of empty `<div>` elements -- zero semantic structure.

---

## 8. SKIP LINK AND LANDMARK REGIONS

**Rating: PASS**

- Skip link present and functional. Landmark regions properly defined. Dual nav elements distinguished.
- Minor: Homepage `<section>` elements lack `aria-labelledby` for landmark navigation.

---

## PRIORITY FIXES (ordered by impact)

1. **Dashboard carousel ARIA pattern** -- Add `role="region" aria-roledescription="carousel"`, slide grouping, connected controls
2. **Table captions and scope attributes** -- Add `<caption class="sr-only">` and `scope="col"`
3. **Heatmap text alternative** -- Add `aria-hidden="true"` + visually-hidden summary
4. **Footer logo accessible name** -- Add `aria-label="GEO 42 -- Home"`
5. **Carousel dot touch targets** -- Increase to 44x44px minimum
6. **Footer heading levels** -- Change `<h2>` to `<p>` or `<strong>`
7. **Counter `aria-label`** -- Add final value as `aria-label`
8. **Section landmarks** -- Add `aria-labelledby` referencing each section's H2
