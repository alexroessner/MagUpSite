# Accessibility Specialist -- Site Audit Report

## Executive Summary

The GEO 42 website demonstrates a strong **intentional accessibility foundation** -- skip link, `aria-labelledby` on sections, `prefers-reduced-motion` handling across CSS and JS, proper form labeling, `aria-hidden` on decorative elements, and keyboard-navigable carousel. However, several **critical gaps remain** that would create real barriers for screen reader users, keyboard-only users, and people with vestibular or cognitive disabilities. The most urgent issues are: color-only status indicators in the dashboard tables, missing accessible names on some interactive elements, incomplete focus trap management in the mobile menu, and the typewriter effect's `aria-live="off"` setting which silently excludes screen reader users from dynamic hero content.

---

## Critical Issues (Must Fix)

### C1. Color-only status indicators in dashboard table (WCAG 1.4.1 Use of Color)

**File:** `/home/user/MagUpUS/src/index.njk`, lines 268-270

The Prompt Research dashboard table uses color-coded badges (`bg-emerald-500/15 text-emerald-400`, `bg-amber-500/15 text-amber-400`, `bg-red-500/15 text-red-400`) to convey citation status. While the badges do include text labels ("Cited", "Partial", "None"), the text alone is sufficient -- **however**, the color differentiation is the primary visual cue, and on the Real-time Monitoring dashboard (lines 333-338), the `+3.2%` and `+1.8%` change indicators rely on green color (`text-emerald-400`) with no icon or text prefix like "up" to convey direction for colorblind users.

Similarly, in the Roadmap section (line 1071), the gradient top border on cards (`from-emerald-500`, `from-accent-500`, `from-primary-600`) conveys completed/active/upcoming status through color alone. The status badges below do have text ("Done", "Active", "Upcoming"), but the prominent gradient bar is purely color-dependent.

**Impact:** Users with color vision deficiency cannot distinguish between positive/negative changes or status categories from the gradient bars alone.

**Recommendation:** Add directional arrows or `+`/`-` prefixes to change values. The gradient bars should be supplemented with pattern or icon differentiation.

---

### C2. Typewriter hero text uses `aria-live="off"` (WCAG 4.1.3 Status Messages)

**File:** `/home/user/MagUpUS/src/index.njk`, line 40

```html
<span class="text-accent-400" data-typewriter="ChatGPT|Perplexity|Gemini|Google AI|DeepSeek|Claude" role="status" aria-live="off">ChatGPT</span>
```

The `role="status"` combined with `aria-live="off"` is contradictory. `role="status"` implies `aria-live="polite"` by default, but the explicit `aria-live="off"` overrides it, meaning screen readers will **never announce** the cycling platform names. Screen reader users will only ever hear "ChatGPT" -- the initial text content. They miss the entire value proposition of "Become the Answer on [multiple platforms]."

**Impact:** Screen reader users get a degraded, incomplete understanding of the hero message. They do not know the product covers Perplexity, Gemini, Google AI, DeepSeek, or Claude.

**Recommendation:** Either:
- Remove `aria-live="off"` and let `role="status"` work as intended (`aria-live="polite"`), or
- Add an `sr-only` element listing all platforms: "ChatGPT, Perplexity, Gemini, Google AI, DeepSeek, Claude" so the full message is available without animation.

The second approach is preferable since constant live-region updates from the typewriter cycling could be distracting.

---

### C3. Mobile navigation has no focus trap (WCAG 2.4.3 Focus Order)

**File:** `/home/user/MagUpUS/src/_includes/base.njk`, lines 314-328

When the mobile menu opens (toggling `#mobile-nav` from `hidden`), focus is not moved into the menu and no focus trap is established. A keyboard user who opens the mobile menu can tab past it into the page content behind it. There is no mechanism to close the menu with the Escape key.

**Impact:** Keyboard-only users on mobile/tablet viewports cannot reliably navigate the mobile menu. They may accidentally interact with content behind the menu.

**Recommendation:**
- Move focus to the first menu link when the menu opens.
- Trap focus within the menu while it is open.
- Close the menu on `Escape` key press.
- Return focus to the toggle button when the menu closes.

---

### C4. Dashboard carousel dots lack accessible labels (WCAG 4.1.2 Name, Role, Value)

**File:** `/home/user/MagUpUS/src/index.njk`, lines 491-494

```html
<button type="button" class="dash-dot{% if loop.first %} active{% endif %}" aria-label="{{ label }}"></button>
```

The dots do have `aria-label` values ("Prompt Research", "Brand Analysis", etc.), which is good. However, the dots lack `role="tab"` or equivalent semantics to convey they are part of a tabbed/carousel interface. The active dot gets `aria-current="true"` dynamically via JS (line 378 in animations.js), which is appropriate.

**Issue:** The dots are bare `<button>` elements with no `role="tablist"` on their container. While functional, assistive technology cannot convey the relationship between dots and slides. A screen reader user hearing "Prompt Research, button" does not know it switches carousel slides.

**Recommendation:** Add `role="tablist"` to the dot container, `role="tab"` to each dot, and `aria-selected` instead of (or in addition to) `aria-current`.

---

### C5. FAQ accordion panels use `hidden` class during transition (WCAG 4.1.2)

**File:** `/home/user/MagUpUS/src/js/animations.js`, lines 277-299

When closing an FAQ panel, the code sets `content.style.maxHeight = null` and then waits for `transitionend` to add `hidden`. During the closing animation, the content is still in the DOM and visible but `aria-expanded` is already set to `false`. Conversely, when opening, `hidden` is removed before `aria-expanded` is set to `true`. This creates a brief mismatch between announced state and visual state.

More critically, the FAQ answers are `<div>` elements with `role="region"` and `aria-labelledby`, which is correct. But the `hidden` attribute is implemented via a CSS class (`.hidden { display: none }`), not the native HTML `hidden` attribute. While Tailwind's `.hidden` applies `display: none`, this is functionally equivalent and should work with screen readers.

**Impact:** Minor timing mismatch during transitions. Low severity but worth noting.

---

### C6. `role="meter"` elements missing `aria-label` on some instances

**File:** `/home/user/MagUpUS/src/index.njk`, line 924

```html
<div class="flex-1 h-2 bg-primary-700 rounded-full overflow-hidden" role="meter" aria-valuenow="{{ p.pct }}" aria-valuemin="0" aria-valuemax="100">
```

The Platform Visibility meters in the Intelligence Dashboard section (line 924) have `role="meter"` with `aria-valuenow`, `aria-valuemin`, and `aria-valuemax`, but lack an `aria-label` or `aria-labelledby` attribute. A screen reader would announce "87 percent, meter" without knowing it refers to ChatGPT visibility.

By contrast, the Brand Visibility Ranking meters (line 365) correctly include `aria-label="{{ b.name }} visibility"`.

**Impact:** Screen reader users cannot tell which platform each meter corresponds to in the deep-dive dashboard.

**Recommendation:** Add `aria-label="{{ p.name }} visibility"` to the meter elements at line 924.

---

## Warnings (Should Fix)

### W1. Heading hierarchy issues across pages

**Home page (`/home/user/MagUpUS/src/index.njk`):**
- `h1` at line 38: "Become the Answer on [platform]" -- correct, single h1
- Multiple `h2` sections follow logically
- `h3` elements are nested correctly within their `h2` sections
- **Good:** Clean hierarchy on the homepage

**About page (`/home/user/MagUpUS/src/about.njk`):**
- `h1` at line 13: "The Answer Engine for Enterprise Brands"
- `h2` at line 33: "By the Numbers"
- `h2` at line 54: "Trusted By"
- `h2` at line 72: "The People Behind the Platform"
- `h3` at line 82: Team member names
- `h2` at line 99: "The Trilogy: From Indexing to Recommendation"
- `h3` at line 111: Strategy steps
- `h2` at line 140: "Your Dedicated GEO Team"
- `h3` at line 153: "Project Leader"
- `h4` at line 166: Role titles
- `h2` at line 200-201: CTA "Ready to Get Started?"
- **Issue:** `h3` headings at lines 180, 183, 188 ("7 AI Agents", "Core Value of GEO", "Case Study") are inside `<a>` link cards. These are not true headings for sections -- they are link titles. This is technically valid but slightly unusual.

**Services page (`/home/user/MagUpUS/src/services.njk`):**
- `h1` at line 32: "Full-Stack AI Visibility"
- `h2` at lines 49-51: Each service name -- correct
- **Clean hierarchy**

**Contact page (`/home/user/MagUpUS/src/contact.njk`):**
- `h1` at line 15: "Ready to Become the AI Answer?"
- `h2` at line 59: "See It in Action"
- **Clean hierarchy**

**Team page (`/home/user/MagUpUS/src/team.njk`):**
- Uses `page.njk` layout which outputs `h1` from front matter title
- Markdown `##` headings for team members -- renders as `h2`
- **Clean hierarchy**

**Sections page (`/home/user/MagUpUS/src/sections.njk`):**
- `h1` from `page.njk` layout (line 5)
- `h2` for table captions (line 30) and related topics (line 78)
- **Clean hierarchy**

**Style guide page (`/home/user/MagUpUS/src/style-guide.njk`):**
- `h1` at line 15: "Design System"
- `h2` at line 29: "Color Palette"
- `h3` at lines 33, 43, 53: "Primary Scale", "Accent Scale", "Semantic Colors"
- `h2` at line 80: "Typography"
- `h3` at lines 90, 115: sub-sections
- **Clean hierarchy**

**404 page (`/home/user/MagUpUS/src/404.njk`):**
- `h1` at line 11: "Page Not Found"
- **Also has a `<p>` with display-level styling ("404") above the h1 at line 10, but this is not an h-element -- acceptable**

**Verdict:** Heading hierarchy is generally well-maintained across the site. No skipped heading levels were found. No pages have multiple `h1` elements.

---

### W2. Missing `aria-label` on some text-only links

**File:** `/home/user/MagUpUS/src/index.njk`, multiple locations

Several links use generic visible text like "Full case study" (line 602), "View all services" (line 849), "Learn how we break through each wall" (line 654). While these are reasonably descriptive, some links like "See how GEO 42 breaks through" (line 201) and "Start your flywheel" (line 775) are ambiguous when read out of context by a screen reader using a links list.

**Impact:** Moderate. Screen reader users navigating via links list get reduced context.

**Recommendation:** Add `aria-label` attributes with more descriptive text on ambiguous link text, or ensure the surrounding context is programmatically associated.

---

### W3. Marquee pause button is sr-only by default

**File:** `/home/user/MagUpUS/src/index.njk`, line 68

```html
<button type="button" id="marquee-pause" class="sr-only focus:not-sr-only ..." aria-pressed="false">Pause</button>
```

The marquee pause button exists and is keyboard-accessible (appears on focus), which is excellent. However, sighted users who are bothered by the continuous motion (but do not use `prefers-reduced-motion`) have no visible way to pause the marquee. On touch devices, `touchstart` toggles pause (animations.js line 515), but this is not discoverable.

**Impact:** Users with vestibular disorders or attention difficulties who have not enabled system-level reduced motion settings cannot easily pause the marquee.

**Recommendation:** Consider making the pause button always visible (even if small/subtle), or add a visible pause-on-hover indicator.

---

### W4. Heatmap visualization has accessible description but could be improved

**File:** `/home/user/MagUpUS/src/index.njk`, lines 306-307

```html
<span class="sr-only">Competitor visibility heatmap showing varying brand presence levels across AI platforms, from low to high intensity.</span>
<div class="grid grid-cols-5 gap-1" aria-hidden="true">
```

The heatmap grid is `aria-hidden="true"` and preceded by an `sr-only` description. This is a valid approach for a decorative/illustrative visualization. However, the description is vague -- it does not convey the actual data.

**Impact:** Screen reader users get a general sense of the visualization but miss any specific data points.

**Recommendation:** If the heatmap conveys meaningful competitive intelligence, provide a data table alternative. If it is purely illustrative, the current approach is acceptable.

---

### W5. SVG flywheel fallback lacks complete alt text for complex diagram

**File:** `/home/user/MagUpUS/src/index.njk`, line 736

```html
<svg ... role="img" aria-label="Visibility Flywheel: Become the Answer, Win Trust, Facilitate Transaction">
```

The SVG flywheel has `role="img"` and an `aria-label`, which is correct. The label covers the three stages. This is adequate for a simple diagram.

---

### W6. No `aria-describedby` or linked error messaging on contact form

**File:** `/home/user/MagUpUS/src/contact.njk`, lines 63-92

The contact form has:
- Proper `<label>` elements linked via `for`/`id` on all inputs (lines 65-86) -- **excellent**
- `required` attribute on name and email fields
- No custom error messaging or `aria-describedby` for validation errors
- No `aria-invalid` attribute management

The form submits to Formspree, so client-side validation relies on native browser validation (the `required` and `type="email"` attributes). Native browser validation does provide accessible error messages, but they are minimal and cannot be customized.

**Impact:** Users with disabilities get only browser-default validation messages, which may be insufficient for understanding what went wrong.

**Recommendation:** Add custom client-side validation with `aria-describedby` pointing to error message elements, and toggle `aria-invalid="true"` on fields with errors.

---

### W7. Carousel slides are not `aria-hidden` when not visible

**File:** `/home/user/MagUpUS/src/index.njk`, lines 233-488

The dashboard carousel uses `role="region" aria-roledescription="carousel"` on the container and `role="group" aria-roledescription="slide"` on each slide. This is good.

However, slides that are scrolled out of view are not marked `aria-hidden="true"`. All 5 slides remain in the accessibility tree at all times. A screen reader user encountering the carousel will hear all 5 slides' content sequentially, which is a lot of data.

**Impact:** Screen reader users face an overwhelming amount of carousel content with no indication of which slide is currently visible.

**Recommendation:** Use IntersectionObserver to toggle `aria-hidden` on off-screen slides, or implement the ARIA carousel pattern (W3C APG) with `aria-hidden` management.

---

### W8. Scroll progress bar and cursor glow could trigger motion sensitivity

**File:** `/home/user/MagUpUS/src/css/input.css`, lines 1524-1648

The `prefers-reduced-motion: reduce` media query is comprehensive and handles:
- All reveal animations (line 1525-1537)
- Typewriter (line 1539-1543)
- Logo marquee (line 1545-1547)
- Card lift hover (line 1549-1551)
- Pulse dots (line 1553-1555)
- Flywheel (line 1557-1561)
- Shimmer (line 1563-1565)
- Float (line 1567-1569)
- Ambient glow (line 1571-1574)
- Bar fills and dash bar fills (line 1576-1579)
- Step badges (line 1581-1585)
- Cursor glow and touch ripple (line 1587-1590)
- Particle canvas (line 1592-1594)
- Section angles (line 1596-1601)
- Depth stagger and KPI flip (line 1603-1608)
- Hero shapes and section orbs (line 1610-1614)
- 3D reveals (line 1616-1622)
- Constellation canvas (line 1624-1626)
- Three.js canvases (line 1628-1632)
- Section boundary geometry (line 1634-1637)
- Glow border (line 1639-1641)
- Active transforms (line 1643-1647)

**However:** The scroll progress bar (line 643-655) is NOT disabled in the `prefers-reduced-motion` block. The progress bar animates via JS `scaleX()` transforms on every scroll event. This is a continuous motion element.

**Impact:** Users with motion sensitivity who enable `prefers-reduced-motion` still see the progress bar animating.

**Recommendation:** Add `.scroll-progress { display: none; }` inside the `prefers-reduced-motion` media query, or set `transition: none` on it.

---

## Observations (Nice to Have)

### O1. No visible focus indicator on glass-card links in the About page

**File:** `/home/user/MagUpUS/src/about.njk`, lines 179-190

The "Related Links" cards are `<a>` elements styled as cards. While the global `a:focus-visible` style (input.css line 45-50) applies a 2px accent outline, the glass card background and rounded corners may make the outline hard to see against the dark background.

**Recommendation:** Consider adding a more prominent focus style specifically for card-style links (e.g., brighter outline, offset, or background change).

---

### O2. Footer link groups use `<p>` for headings instead of proper headings

**File:** `/home/user/MagUpUS/src/_includes/base.njk`, lines 277, 288

```html
<p class="font-heading text-sm font-semibold text-accent-400 mb-4 uppercase tracking-wider">{{ group.heading }}</p>
```

Footer section headings ("Company", "Services", "Resources", "Contact") use `<p>` elements instead of heading elements. While the footer has `aria-label="Site footer"`, using `<h2>` or `<h3>` would provide better semantic structure for screen reader users navigating by headings.

**Recommendation:** Change footer group headings to `<h2>` or `<h3>` elements (they would not affect visual design since they are already styled independently).

---

### O3. Dashboard table could benefit from `<th scope="row">` on first column

**File:** `/home/user/MagUpUS/src/index.njk`, lines 265-272

The Prompt Research table has `<th scope="col">` on all column headers. The first cell of each row (the ID column, e.g., "Q001") uses `<td>`, which is correct since IDs are not semantic row headers. However, the Prompt text in the second column effectively acts as a row header.

**Recommendation:** Consider using `<th scope="row">` on the Prompt column cells for improved screen reader navigation of the table.

---

### O4. `lang` attribute on `<html>` is correctly set

**File:** `/home/user/MagUpUS/src/_includes/base.njk`, line 2

```html
<html lang="en">
```

This is correct. No foreign language spans are present in the templates (the Chinese platform names like "Doubao", "Qwen", "Kimi" are proper nouns, not foreign text requiring `lang` attributes).

---

### O5. Touch target sizes are well-handled

**File:** `/home/user/MagUpUS/src/_includes/base.njk`, line 238

The mobile menu toggle has explicit minimum dimensions:
```html
class="... min-w-[44px] min-h-[44px] ..."
```

The carousel dots use `padding: 18px` with `background-clip: content-box` (input.css line 1191-1192), effectively creating a 44px touch target around the 8px visible dot.

This meets WCAG 2.5.5 (AAA) and 2.5.8 (AA) target size requirements.

---

### O6. Consider adding `role="list"` to CSS-styled lists

Some lists in the footer and navigation rely on `<ul>` elements. In Safari with VoiceOver, list semantics can be removed by `list-style: none` (which Tailwind applies by default). While this is debated, adding `role="list"` ensures list semantics are preserved.

---

### O7. Content reflow at 320px and 200% zoom

**File:** `/home/user/MagUpUS/src/_includes/base.njk`, line 5

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
```

The viewport meta tag does not include `maximum-scale=1` or `user-scalable=no`, which is correct -- it allows pinch-to-zoom.

The CSS uses responsive classes (`sm:`, `lg:`, etc.) and fluid sizing (`min(6rem,10vw)` at line 39 of index.njk). Tables use `overflow-x-auto` wrappers. The layout should generally reflow properly at 320px, though the dashboard carousel slides have fixed minimum widths (`w-[84vw]` on small screens), which is appropriate for a horizontally scrolling carousel.

**One concern:** The hero text sizing uses `text-[min(6rem,10vw)]` which at 320px viewport = 32px. At 200% zoom on a 1280px viewport (effective 640px), this = 64px, which is within reasonable bounds.

---

## What's Working Well

### Excellent prefers-reduced-motion implementation

The `prefers-reduced-motion: reduce` media query at lines 1524-1648 of `input.css` is one of the most comprehensive implementations I have seen. It covers:
- All CSS animations and transitions (reveals, staggers, marquee, shimmer, float, pulse, glow, 3D effects)
- All decorative elements (particles, hero shapes, orbs, constellation lines, section boundary geometry)
- All Three.js canvases (`hero-3d-canvas`, `flywheel-3d-canvas`, `cta-3d-canvas`)
- Cursor glow and touch ripple
- Content is made immediately visible (`opacity: 1; transform: none`) rather than hidden

Additionally, the JavaScript respects reduced motion:
- `animations.js` line 11-12: Checks `prefers-reduced-motion` and listens for runtime changes (line 17-21)
- `animations.js` line 28, 61-62: Falls back to immediate visibility when reduced motion is enabled
- `animations.js` line 212-214: Typewriter stops cycling under reduced motion
- `animations.js` line 103: Bar fills skip animation under reduced motion
- `animations.js` line 114-119: Counters show final values immediately under reduced motion
- Three.js files (three-hero.js line 14, three-flywheel.js line 14, three-cta.js line 13): Exit early if reduced motion is detected
- `base.njk` line 308: Three.js module imports are gated behind `prefers-reduced-motion` check

### Well-implemented skip link

**File:** `/home/user/MagUpUS/src/_includes/base.njk`, line 210; `/home/user/MagUpUS/src/css/input.css`, lines 22-42

The skip link is:
- Present on every page (in the base layout)
- Hidden by default (`top: -100%`)
- Visible on focus (`top: 0`)
- Targets `#main` which exists on every page (line 260)
- Has a visible focus indicator (`outline: 2px solid`)
- Has adequate color contrast (accent on dark background)

### Proper ARIA attributes on navigation

- Header nav: `aria-label="Main navigation"` (line 221)
- Mobile nav: `aria-label="Mobile navigation"` (line 247)
- Footer: `aria-label="Site footer"` (line 265)
- `aria-current="page"` on active nav items (lines 227, 254)
- `aria-expanded` / `aria-controls` on mobile toggle (line 239)

### Proper ARIA on carousel

- Container: `role="region" aria-roledescription="carousel"` (line 222)
- Each slide: `role="group" aria-roledescription="slide"` with descriptive `aria-label` (lines 234, 280, 321, 377, 420)
- Arrow buttons: `aria-label="Previous dashboard"` / `aria-label="Next dashboard"` (lines 224, 227)
- Keyboard navigation: Arrow keys scroll the carousel (animations.js lines 358-372)
- Dot navigation: `aria-current="true"` on active dot (animations.js lines 375-390)

### Comprehensive decorative element handling

Every decorative element is properly hidden from assistive technology:
- `aria-hidden="true"` on: hero-noise, hero-glow, particle canvases, hero shapes, section orbs, Three.js canvases, terminal dots, section boundaries, all decorative SVG icons, scroll progress bar, cursor glow, constellation canvas
- Dynamically created touch ripple element also gets `aria-hidden="true"` (animations.js line 460)

### Proper form labeling

**File:** `/home/user/MagUpUS/src/contact.njk`, lines 65-86

All form fields have:
- Explicit `<label>` elements with `for` attributes matching input `id`s
- `required` attribute on name and email
- `type="email"` for email validation
- Clear placeholder text
- Visible focus states (`focus:ring-2 focus:ring-accent-500`)

### Section labeling with `aria-labelledby`

Multiple sections on the homepage use `aria-labelledby` pointing to heading `id` attributes:
- `aria-labelledby="h-seo-geo"` (line 116)
- `aria-labelledby="h-product-preview"` (line 210)
- `aria-labelledby="h-proven-results"` (line 514)
- `aria-labelledby="h-six-walls"` (line 620)
- `aria-labelledby="h-kpi-stats"` (line 664)
- `aria-labelledby="h-flywheel"` (line 706)
- `aria-labelledby="h-services"` (line 801)
- `aria-labelledby="h-dashboard"` (line 865)
- `aria-labelledby="h-platforms"` (line 951)
- `aria-labelledby="h-industries"` (line 1017)
- `aria-labelledby="h-roadmap"` (line 1056)
- `aria-labelledby="h-faq"` (line 1115)
- `aria-labelledby="h-cta"` (line 1159)

### Table accessibility in sections.njk

**File:** `/home/user/MagUpUS/src/sections.njk`, lines 31-49

Tables have:
- `<caption class="sr-only">` with meaningful descriptions
- `<th scope="col">` on all column headers
- Proper `<thead>` / `<tbody>` structure
- Alternating row colors for visual distinction

### FAQ accordion accessibility

**File:** `/home/user/MagUpUS/src/index.njk`, lines 1133-1145

- Toggle buttons have `aria-expanded` state management
- `aria-controls` links button to content panel
- Content panels have `role="region"` with `aria-labelledby` pointing to the question button
- Unique `id` attributes for both questions and panels (`faq-q-N`, `faq-panel-N`)

---

## Detailed Findings

### File-by-file reference

| File | Lines | Finding | Severity |
|------|-------|---------|----------|
| `src/index.njk` | 40 | `aria-live="off"` on typewriter contradicts `role="status"` | Critical (C2) |
| `src/index.njk` | 268-270 | Table status badges use color + text (acceptable); change indicators lack direction cue | Critical (C1) |
| `src/index.njk` | 333-338 | Monitoring KPI change values rely on green color alone | Critical (C1) |
| `src/index.njk` | 924 | `role="meter"` without `aria-label` | Critical (C6) |
| `src/index.njk` | 1071 | Roadmap gradient bars convey status by color alone | Critical (C1) |
| `src/index.njk` | 491-494 | Carousel dots lack tablist/tab semantics | Critical (C4) |
| `src/index.njk` | 233-488 | Carousel slides not `aria-hidden` when off-screen | Warning (W7) |
| `src/_includes/base.njk` | 314-328 | Mobile menu: no focus trap, no Escape key handling | Critical (C3) |
| `src/_includes/base.njk` | 277, 288 | Footer group headings use `<p>` instead of heading elements | Observation (O2) |
| `src/contact.njk` | 63-92 | Form lacks custom error messaging / `aria-describedby` | Warning (W6) |
| `src/css/input.css` | 643-655 | Scroll progress bar not disabled under `prefers-reduced-motion` | Warning (W8) |
| `src/css/input.css` | 22-42 | Skip link correctly implemented | Good |
| `src/css/input.css` | 44-50 | Global focus-visible styles correctly implemented | Good |
| `src/css/input.css` | 1524-1648 | Comprehensive reduced-motion handling | Excellent |
| `src/js/animations.js` | 11-21 | Reduced motion detection with runtime change listener | Excellent |
| `src/js/animations.js` | 358-372 | Carousel keyboard navigation (arrow keys) | Good |
| `src/js/animations.js` | 375-390 | Carousel dot aria-current management | Good |
| `src/js/animations.js` | 518-526 | Marquee keyboard-accessible pause button | Good |
| `src/js/three-hero.js` | 13-15 | Touch/reduced-motion gate | Good |
| `src/js/three-flywheel.js` | 13-15 | Touch/reduced-motion gate | Good |
| `src/js/three-cta.js` | 12-14 | Touch/reduced-motion gate | Good |
| `src/about.njk` | All | Clean heading hierarchy, no skipped levels | Good |
| `src/services.njk` | All | Clean heading hierarchy, proper SVG aria-hidden | Good |
| `src/contact.njk` | 65-86 | All form fields properly labeled | Good |
| `src/sections.njk` | 31-49 | Tables have caption, scope, proper structure | Good |
| `src/style-guide.njk` | All | Clean heading hierarchy | Good |
| `src/team.njk` | All | Clean heading hierarchy via Markdown | Good |
| `src/404.njk` | All | Single h1, functional navigation link | Good |

### Priority fix order

1. **C3** -- Mobile focus trap (keyboard users completely blocked)
2. **C2** -- Typewriter `aria-live="off"` (core value proposition invisible to SR users)
3. **C1** -- Color-only indicators (colorblind users miss status information)
4. **C6** -- Missing `aria-label` on meters (quick fix)
5. **C4** -- Carousel dot semantics (moderate effort)
6. **W8** -- Scroll progress bar reduced-motion (quick fix)
7. **W7** -- Carousel slide aria-hidden management (moderate effort)
8. **W6** -- Form error messaging (moderate effort)
9. **W3** -- Visible marquee pause (design decision)
10. **O2** -- Footer heading semantics (quick fix)
