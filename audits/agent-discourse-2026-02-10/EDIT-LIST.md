# Comprehensive Edit List -- All Persona Findings

Every actionable item extracted from all 10 persona reviews, ordered by severity.
Items marked with [CODE] are implementable now. Items marked [CONTENT] require client input.

---

## SEVERITY 1: CRITICAL (Blocking functionality / actively harmful)

### C1. Sitemap URL Doubling Bug [CODE]
**Source:** SEO Specialist
**File:** `src/sitemap.njk`
**Problem:** `{{ site.url }}{{ item.url | url }}` doubles the `/MagUpSite/` path prefix when `pathPrefix` is set. All sitemap URLs return 404.
**Fix:** Remove the `| url` filter OR adjust site.url to not include the path prefix.

### C2. FAQ JSON-LD Schema Mismatch [CODE]
**Source:** SEO Specialist
**File:** `src/_includes/base.njk` (JSON-LD block)
**Problem:** 7 FAQ items on page but only 4 in JSON-LD structured data. Google may flag as inconsistent.
**Fix:** Sync all 7 FAQ items into the FAQPage schema.

---

## SEVERITY 2: HIGH (Major UX/conversion/performance impact)

### H1. No og:image Meta Tag [CODE]
**Source:** SEO + Copywriter
**File:** `src/_includes/base.njk`
**Problem:** Every social share renders a blank card. No `og:image` tag exists.
**Fix:** Create an OG image (1200x630) and add `<meta property="og:image">` tag.

### H2. Google Fonts Render-Blocking [CODE]
**Source:** Engineer
**File:** `src/_includes/base.njk`
**Problem:** Font CSS blocks first paint. `<link rel="stylesheet">` for Google Fonts is synchronous.
**Fix:** Use `<link rel="preload" as="style" onload="this.rel='stylesheet'">` pattern.

### H3. Space Grotesk Weight 800 Not Loaded [CODE]
**Source:** Brand Interpreter + Style Cloner
**File:** `src/_includes/base.njk` (Google Fonts URL) + `src/css/input.css`
**Problem:** `.text-display` uses `font-weight: 800` but font only loads up to 700. All headings are silently weight-clamped.
**Fix:** Either extend font URL to `wght@300..800` or change `.text-display` to `font-weight: 700`.

### H4. Scroll-Progress Uses Layout-Triggering `width` [CODE]
**Source:** Engineer
**File:** `src/js/animations.js`
**Problem:** `progressBar.style.width = progress + "%"` triggers layout on every scroll frame.
**Fix:** Use `transform: scaleX()` with `transform-origin: left`.

### H5. "GEO" Never Expanded Above the Fold [CODE]
**Source:** Content Architect + SEO
**File:** `src/index.njk`
**Problem:** First-time visitors don't know "GEO" = "Generative Engine Optimization" until the FAQ.
**Fix:** Add "Generative Engine Optimization" as subtitle or first-line context in hero.

### H6. 9 of 15 Sections Are Dead Ends (No CTA) [CODE]
**Source:** Content Architect
**File:** `src/index.njk`
**Problem:** Only ~33% of sections have any call to action. Key sections like SEO-vs-GEO, Dashboard Carousel, 6 Walls, Market Data, Platform Coverage, Industries have no conversion path.
**Fix:** Add contextual CTAs to at minimum: Dashboard Carousel, SEO-vs-GEO, 6 Walls, Services, Platform Coverage sections.

### H7. Dual Dashboard KPI Discrepancy [CODE]
**Source:** Document Analyst + Synthesizer
**File:** `src/index.njk`
**Problem:** Carousel shows 28.75% visibility; Intelligence Dashboard shows 87.3%. Same page, conflicting numbers, no explanation.
**Fix:** Add explicit framing labels -- "Day 1 Baseline" on carousel, "After 90 Days" on deep-dive dashboard.

### H8. FAQ Heading "We Have the Answers" is Tone-Deaf [CODE]
**Source:** Copywriter
**File:** `src/index.njk`
**Problem:** Smug-sounding headline in a trust-building section.
**Fix:** Change to "Your Questions About AI Visibility, Answered" or similar humble framing.

### H9. Contact Page Has No Form [CODE]
**Source:** Content Architect + Target Audience
**File:** `src/contact.njk`
**Problem:** Only mailto link. Enterprise buyers need a proper contact form.
**Fix:** Add a functional contact form (Formspree/Netlify Forms/static form submission).

### H10. Broken /7-ai-agents/ Link on About Page [CODE]
**Source:** Content Architect
**File:** `src/about.njk`
**Problem:** Link to `/7-ai-agents/` returns 404.
**Fix:** Remove or redirect to the Services section anchor on homepage.

---

## SEVERITY 3: MEDIUM (Quality/polish/completeness)

### M1. Dashboard Carousel Lacks ARIA Carousel Pattern [CODE]
**Source:** Accessibility Specialist
**File:** `src/index.njk`
**Problem:** No `role="region"`, no `aria-roledescription="carousel"`, no slide grouping.
**Fix:** Add `role="region" aria-roledescription="carousel" aria-label="Product dashboards"` to container. Add `role="group" aria-roledescription="slide" aria-label="Slide N of 5: [title]"` to each slide.

### M2. Carousel Dot Touch Targets Too Small [CODE]
**Source:** Accessibility Specialist
**File:** `src/css/input.css`
**Problem:** `.dash-dot` is 8x8px (active: 24x8px). Below WCAG 44x44px minimum.
**Fix:** Add padding or increase clickable area to 44x44px while keeping visual size small.

### M3. Table Missing `<caption>` and `scope` Attributes [CODE]
**Source:** Accessibility Specialist
**File:** `src/index.njk`
**Problem:** Prompt Research table has no caption and no `scope="col"` on `<th>` elements.
**Fix:** Add `<caption class="sr-only">Prompt Research - AI Platform Citation Status</caption>` and `scope="col"`.

### M4. Heatmap Has No Text Alternative [CODE]
**Source:** Accessibility Specialist
**File:** `src/index.njk`
**Problem:** 5x4 colored grid is 100% color-dependent, screen readers get nothing.
**Fix:** Add `aria-hidden="true"` to grid + visually-hidden summary text describing what the heatmap shows.

### M5. Footer Logo Link Missing `aria-label` [CODE]
**Source:** Accessibility Specialist
**File:** `src/_includes/base.njk`
**Problem:** Header logo has `aria-label="GEO 42 -- Home"` but footer logo link doesn't.
**Fix:** Add `aria-label="GEO 42 -- Home"` to footer logo link.

### M6. Footer Heading Levels Wrong [CODE]
**Source:** Accessibility + Engineer
**File:** `src/_includes/base.njk`
**Problem:** Footer uses `<h2>` for "Company", "Services", "Contact" -- pollutes heading outline.
**Fix:** Change footer group labels from `<h2>` to `<p class="font-bold">` or `<strong>`.

### M7. Shimmer Effect Overused [CODE]
**Source:** Synthesizer + Style Cloner
**File:** `src/index.njk` + `src/css/input.css`
**Problem:** 20+ elements have `shimmer` class. Dilutes premium feel.
**Fix:** Remove `shimmer` from all cards except: hero CTA button and featured service card.

### M8. Glow-Border Overused [CODE]
**Source:** Synthesizer + Style Cloner
**File:** `src/index.njk`
**Problem:** 15+ cards have `glow-border`. When every card has it, it becomes noise.
**Fix:** Reserve `glow-border` for featured/highlighted/interactive elements only (featured service card, active carousel slide, CTA sections).

### M9. Float Animation on Market Data [CODE]
**Source:** Synthesizer
**File:** `src/index.njk`
**Problem:** "34x" and "1000x" bob up and down forever. Undermines gravitas of statistics.
**Fix:** Remove `float` class from market data numbers. Keep `glow-reveal` only.

### M10. Flywheel Spin Labels Don't Rotate [CODE]
**Source:** Synthesizer
**File:** `src/index.njk` + `src/css/input.css`
**Problem:** SVG circle spins but labels positioned outside SVG stay fixed. Visual disconnect.
**Fix:** Replace full 360° spin with a subtle pulse/glow animation on the flywheel.

### M11. Brand Visibility Ranking Bars Missing ARIA [CODE]
**Source:** Accessibility Specialist
**File:** `src/index.njk`
**Problem:** Carousel ranking bars have no `role="meter"` or `aria-valuenow` (unlike the Platform Visibility section which does).
**Fix:** Add `role="meter" aria-valuenow="78" aria-valuemin="0" aria-valuemax="100"` etc.

### M12. Counter Elements Show Intermediate Values [CODE]
**Source:** Accessibility Specialist
**File:** `src/js/animations.js`
**Problem:** Screen readers could read "0" or intermediate values during animation.
**Fix:** Add `aria-label` with the final target value on each counter container.

### M13. Carousel Slides Lack Heading Structure [CODE]
**Source:** Accessibility Specialist
**File:** `src/index.njk`
**Problem:** Slide labels are `<span>` elements. Screen readers scanning by headings skip the carousel.
**Fix:** Change slide titles to `<h3>` or add `<h3 class="sr-only">` to each slide.

### M14. Missing `scroll-snap-stop: always` on Carousel [CODE]
**Source:** Engineer
**File:** `src/css/input.css`
**Problem:** Fast flick gestures can skip slides entirely.
**Fix:** Add `scroll-snap-stop: always` to `.dash-slide`.

### M15. Style Guide Page Disconnected from Design [CODE]
**Source:** Brand Interpreter + Style Cloner
**File:** `src/style-guide.njk` (or equivalent)
**Problem:** Uses light-mode, bg-white, no glassmorphism. Completely out of sync.
**Fix:** Rebuild style guide to use actual glassmorphism design system.

### M16. Missing robots.txt [CODE]
**Source:** SEO
**File:** New file `src/robots.txt`
**Problem:** No robots.txt file. Signal of site maturity.
**Fix:** Create robots.txt with sitemap reference.

### M17. Add `aria-labelledby` to Major Sections [CODE]
**Source:** Accessibility Specialist
**File:** `src/index.njk`
**Problem:** ~14 `<section>` elements have no labels. Screen reader landmark navigation is impaired.
**Fix:** Add `aria-labelledby` referencing each section's H2 (give H2s unique IDs).

### M18. CTA Button Pattern Inconsistency [CODE]
**Source:** Brand Interpreter + Copywriter
**File:** `src/index.njk` + `src/_includes/base.njk` + inner pages
**Problem:** Three different CTA patterns: hero `rounded-full` gradient pill, nav solid `rounded-xl`, inner pages another variant.
**Fix:** Standardize to one primary CTA pattern across all pages.

### M19. Service Descriptions Need Benefit Framing [CODE]
**Source:** Copywriter
**File:** `src/index.njk` (service cards)
**Problem:** All 7 descriptions are feature lists, not benefit-driven. Read like translated spec sheets.
**Fix:** Rewrite each to follow: [What it does] → [Why it matters] → [Specific outcome].

### M20. "1,000+ enterprises" Claim Unsubstantiated [CONTENT]
**Source:** Copywriter + Target Audience
**File:** `src/index.njk`
**Problem:** Highest credibility risk on the site. If not verifiable, it's damaging.
**Fix:** Either substantiate with named clients or soften to "Leading enterprises across 4 industries."

### M21. Carousel Needs Post-Section CTA [CODE]
**Source:** Content Architect
**File:** `src/index.njk`
**Problem:** Most interactive section leads nowhere.
**Fix:** Add CTA after carousel ("See Your Brand's AI Visibility" linking to contact).

### M22. Backbone-filter/blur() Heavy on Mobile [CODE]
**Source:** Engineer
**File:** `src/css/input.css`
**Problem:** 20+ glass cards with `backdrop-filter: blur()` create GPU memory pressure.
**Fix:** Consider using solid semi-transparent backgrounds on mobile below 768px.

---

## SEVERITY 4: LOW (Polish / minor improvements)

### L1. JetBrains Mono Loaded Everywhere [CODE]
**Source:** Engineer
**File:** `src/_includes/base.njk` (Google Fonts URL)
**Problem:** 2 extra font files loaded on every page for one dashboard table.
**Fix:** Only load JetBrains Mono when needed, or use system monospace.

### L2. Prose Plugin CSS Unused on Homepage [CODE]
**Source:** Engineer
**Problem:** Tailwind Typography plugin adds 15-20KB unused on homepage.
**Fix:** Split CSS per-page or lazy-load typography stylesheet. (Low priority -- tree-shaking handles most.)

### L3. FAQ `setTimeout(300)` Fragile [CODE]
**Source:** Engineer + Accessibility
**File:** `src/js/animations.js`
**Problem:** Uses setTimeout instead of `transitionend` event. If CSS timing changes, breaks.
**Fix:** Replace setTimeout with `transitionend` listener.

### L4. Scroll Progress Bar RAF Throttle [CODE]
**Source:** Engineer
**File:** `src/js/animations.js`
**Problem:** Carousel dot sync fires on every scroll event. Minor overhead on older devices.
**Fix:** Add RAF throttle to scroll listener.

### L5. `var` Declarations Instead of `let`/`const` [CODE]
**Source:** Engineer
**File:** `src/js/animations.js`
**Problem:** All variables use `var`. Safe in IIFE but less clear intent.
**Fix:** Replace with `let`/`const` as appropriate. (Low priority -- cosmetic.)

### L6. Multiple IntersectionObservers [CODE]
**Source:** Engineer
**File:** `src/js/animations.js`
**Problem:** 4 separate IntersectionObservers instead of single dispatcher.
**Fix:** Consolidate to single observer with class-based dispatch. (Low priority -- marginal gain.)

### L7. Canvas Context Null Check [CODE]
**Source:** Engineer
**File:** `src/js/animations.js`
**Problem:** `canvas.getContext("2d")` could return null. Not checked.
**Fix:** Add null guard.

### L8. Marquee Not Pausable by Keyboard [CODE]
**Source:** Accessibility Specialist
**File:** `src/js/animations.js`
**Problem:** WCAG 2.2.2 -- auto-playing content >5s should have pause mechanism. Marquee only pauses on hover/tap.
**Fix:** Add keyboard-accessible pause button near marquee.

### L9. Typewriter `aria-live="polite"` Too Chatty [CODE]
**Source:** Accessibility Specialist
**File:** `src/index.njk`
**Problem:** Announces every 3-4 seconds. Could be annoying.
**Fix:** Consider `aria-live="off"` with a visually-hidden static list of platforms.

### L10. Dashboard Text Sizes 9-10px [CODE]
**Source:** Accessibility Specialist
**File:** `src/index.njk`
**Problem:** `text-[9px]` and `text-[10px]` in dashboard slides. Below inclusive design guidelines.
**Fix:** Increase minimum to `text-[11px]`.

### L11. Unused `.gradient-reveal` CSS Class [CODE]
**Source:** Engineer
**File:** `src/css/input.css`
**Problem:** Defined but never used in HTML.
**Fix:** Remove the dead CSS.

### L12. `optimizeHeroSize` Forces Layout [CODE]
**Source:** Engineer
**File:** `src/js/animations.js`
**Problem:** Creates temp DOM element and calls `getBoundingClientRect()` during paint window.
**Fix:** Defer to `requestIdleCallback`. (Low priority -- runs once.)

### L13. Add BreadcrumbList Schema to Inner Pages [CODE]
**Source:** SEO
**File:** `src/_includes/base.njk`
**Problem:** No breadcrumb structured data for about/contact pages.
**Fix:** Add BreadcrumbList JSON-LD for inner pages.

### L14. Before/After Labels Lack Semantic Weight [CODE]
**Source:** Accessibility Specialist
**File:** `src/index.njk`
**Problem:** "BEFORE" and "AFTER GEO 42" labels are `<span>` elements with no semantic weight.
**Fix:** Add visually-hidden text like "Before GEO 42 optimization" / "After GEO 42 optimization".

### L15. Critical CSS Inlining for FCP [CODE]
**Source:** Engineer
**Problem:** Above-fold content depends on full 87KB stylesheet download.
**Fix:** Inline ~5KB critical CSS for header + hero in `<style>` tag. (Complex, low priority.)

---

## SEVERITY 5: CONTENT DECISIONS (Require client/stakeholder input)

### D1. Named Case Studies with Real Clients [CONTENT]
**Source:** Target Audience + Content Architect + Copywriter
**Impact:** Would change Target Audience score from 4/10 to 7/10.

### D2. Customer Testimonials [CONTENT]
**Source:** Target Audience + Content Architect
**Impact:** Empty `testimonials[]` array. Most impactful missing element.

### D3. Team/Founder Bios [CONTENT]
**Source:** Target Audience + Synthesizer
**Impact:** Enterprise buyers "buy from people, not landing pages."

### D4. Pricing/Engagement Model Signal [CONTENT]
**Source:** Target Audience + Copywriter
**Impact:** "Is this SaaS, managed service, or agency?" still unanswered.

### D5. Methodology Explanation [CONTENT]
**Source:** Target Audience
**Impact:** HOW does the optimization work? Needs 3-step summary.

### D6. Client Logo SVGs [CONTENT]
**Source:** Brand Interpreter + Synthesizer
**Impact:** Text-only logos need replacement with actual brand marks. Requires licensing consideration.

### D7. Homepage Resequencing [CODE]
**Source:** Content Architect + Synthesizer
**Impact:** Structural change: Problem before Proof. Requires careful testing.
**Proposed order:** Hero → Logos → SEO-vs-GEO → 6 Walls → Case Study → Flywheel → Services → Dashboard → Platforms → FAQ → CTA

---

## TOTAL COUNT

| Severity | Count | Implementable Now |
|----------|-------|------------------|
| Critical | 2 | 2 |
| High | 10 | 10 |
| Medium | 22 | 20 (2 need content) |
| Low | 15 | 15 |
| Content Decisions | 7 | 1 (resequencing) |
| **TOTAL** | **56** | **48** |
