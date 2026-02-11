# Software Engineer — Site Audit Report

## Executive Summary

The GEO 42 site is built on a solid Eleventy v3 + Tailwind CSS v4 stack with a well-structured pipeline. The build system is clean, the CSS output is properly minified, and the JavaScript is free of debug artifacts. However, the CI pipeline has a critical flaw where all lint and audit steps use `continue-on-error: true`, meaning broken code will still deploy. The Three.js scenes lack WebGL error handling and have no disposal/cleanup logic, creating potential memory leaks on long-lived sessions. The JS files ship unminified at 62 KB total, and the 159 KB HTML index could benefit from compression.

## Critical Issues (Must Fix)

### C1. CI pipeline silently ignores all lint failures
**File:** `/home/user/MagUpUS/.github/workflows/ci.yml`, lines 38-62
Every quality gate in CI runs with `continue-on-error: true`:
- `lint:html` (line 38)
- `lint:css` (line 41)
- `lint:links` (line 53)
- `lint:a11y` (line 57)
- `audit.js --gate ALL` (line 62)

This means HTML validation errors, CSS lint failures, broken links, and accessibility violations will **never** block deployment. The site could ship with critical regressions without anyone noticing. At minimum, HTML and CSS linting should be blocking.

### C2. Three.js WebGLRenderer has no try/catch or fallback
**Files:**
- `/home/user/MagUpUS/src/js/three-hero.js`, line 25
- `/home/user/MagUpUS/src/js/three-flywheel.js`, line 25
- `/home/user/MagUpUS/src/js/three-cta.js`, line 24

All three files call `new THREE.WebGLRenderer(...)` without any error handling. If WebGL context creation fails (e.g., on some older hardware, or when the GPU context limit is exceeded), this will throw an unhandled exception and halt script execution. The animations.js particle system (line 575) does gracefully check `canvas.getContext("webgl2") || canvas.getContext("webgl")` and falls back to 2D canvas, but the Three.js scenes have no such pattern.

### C3. No test suite exists
**File:** `/home/user/MagUpUS/package.json`, line 26
```json
"test": "echo \"Error: no test specified\" && exit 1"
```
The test script is a no-op that exits with failure. There are no unit tests, integration tests, or end-to-end tests for the pipeline scripts (extract, scrape, merge, generate) or the audit system. A single malformed JSON in the pipeline could cascade silently.

### C4. Three.js scenes never dispose GPU resources
**Files:**
- `/home/user/MagUpUS/src/js/three-hero.js` (entire file)
- `/home/user/MagUpUS/src/js/three-flywheel.js` (entire file)
- `/home/user/MagUpUS/src/js/three-cta.js` (entire file)

None of the Three.js scenes call `renderer.dispose()`, `geometry.dispose()`, or `material.dispose()`. While these are IIFEs that run once and the page is an SPA-style single page, if the user navigates away and back (or if this architecture ever adds client-side routing), WebGL contexts will accumulate and eventually hit the browser limit (typically 8-16 contexts). The `compileShader` function in `animations.js` (line 618) also never checks `gl.getShaderParameter(s, gl.COMPILE_STATUS)`, meaning shader compilation failures are silent.

## Warnings (Should Fix)

### W1. Parallax uses `marginTop` instead of `transform`
**File:** `/home/user/MagUpUS/src/js/animations.js`, line 869
```javascript
shape.style.marginTop = -yOffset + "px";
```
Animating `marginTop` triggers layout recalculation (reflow) on every scroll frame. This is a compositing-hostile property that bypasses GPU acceleration. Should use `transform: translateY()` instead, which only triggers compositing and is much cheaper. This is particularly impactful on mobile devices.

### W2. Bar fill animation uses `style.width` property
**File:** `/home/user/MagUpUS/src/js/animations.js`, lines 95, 104
Setting `el.style.width` triggers layout/paint. The CSS transition on `.bar-fill` (input.css line 996) animates `width`, which forces reflow. Consider using `transform: scaleX()` with `transform-origin: left` for GPU-composited animation.

### W3. JavaScript files ship unminified
**Files:** `/home/user/MagUpUS/dist/js/`
- `animations.js`: 33,563 bytes (unminified, 897 lines of source)
- `three-hero.js`: 11,155 bytes
- `three-flywheel.js`: 9,696 bytes
- `three-cta.js`: 8,117 bytes
- **Total: 62,531 bytes**

The build pipeline minifies CSS via `@tailwindcss/cli --minify` but does not minify JavaScript. Eleventy's passthrough copy (`eleventy.config.js` line 10) copies `src/js` verbatim. Adding a JS minification step (e.g., `terser` or `esbuild`) could reduce these by 40-60%.

### W4. Three.js loaded from CDN without SRI or version pinning integrity
**File:** `/home/user/MagUpUS/src/_includes/base.njk`, lines 55-61
```html
<script type="importmap">
{
  "imports": {
    "three": "https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js"
  }
}
</script>
```
The Three.js library (~600 KB) is loaded from jsdelivr without a `integrity` hash (Subresource Integrity). While import maps do not natively support SRI, this is a supply-chain risk. If jsdelivr is compromised, arbitrary code could execute. Consider self-hosting the Three.js module or using an SRI-compatible loading strategy.

### W5. `og:image` uses SVG format
**File:** `/home/user/MagUpUS/dist/index.html`, line 23
```html
<meta property="og:image" content="...images/og-image.svg">
```
Most social platforms (Facebook, LinkedIn, Twitter) do not render SVG for Open Graph previews. They require JPEG or PNG. The og-image.svg is only 2,110 bytes (likely just a logo). This means social shares will show no preview image on most platforms.

### W6. Pa11y only tests the homepage
**File:** `/home/user/MagUpUS/.pa11yci.json`, line 10
```json
"urls": ["http://localhost:8080/"]
```
The sitemap shows 22 pages, but accessibility testing only covers the root URL. Pages like `/about/`, `/services/`, `/contact/`, and all 17 section pages are never accessibility-tested. Critical pages with forms (`/contact/`) are the most likely to have a11y issues.

### W7. Excessive `will-change` declarations
**File:** `/home/user/MagUpUS/src/css/input.css`
Nine elements declare `will-change`:
- Line 62: `.site-header` - `will-change: transform`
- Line 270: `.logo-marquee` - `will-change: transform`
- Line 654: `.scroll-progress` - `will-change: transform`
- Line 689: `.touch-ripple` - `will-change: transform, opacity`
- Line 763: `.s3d` - `will-change: transform, opacity`
- Line 918: `.shimmer::after` - `will-change: transform`
- Line 1123: `.ambient-glow` - `will-change: transform, opacity`
- Line 1321: `.hero-shape` - `will-change: transform`
- Line 1416: `.section-orb` - `will-change: transform`

`will-change` promotes elements to their own compositor layers, consuming GPU memory. Having 9 declarations (some applying to multiple elements like `.hero-shape` and `.section-orb`) means dozens of promoted layers. The `.site-header` will-change (line 62) is always active despite the header only transforming during scroll. Consider adding `will-change` dynamically via JS or only when the element is about to animate.

### W8. Duplicate tilt-card event binding
**File:** `/home/user/MagUpUS/src/js/animations.js`
Tilt-card event listeners are bound in two places:
- Lines 483-496: First `querySelectorAll(".tilt-card")` with max tilt of 12 degrees
- Lines 823-851: Second `querySelectorAll(".tilt-card")` with max tilt of 14 degrees + shine effect

The second binding on lines 823-851 overwrites the first on lines 483-496. Both will fire, but the second `mousemove` handler's `card.style.transform` assignment will overwrite the first. This is not a bug per se (the second wins), but it means the first block is dead code that adds unnecessary event listeners.

### W9. `visibilitychange` listeners accumulate per typewriter instance
**File:** `/home/user/MagUpUS/src/js/animations.js`, lines 251-259
Inside `typers.forEach()`, each typewriter element adds its own `document.addEventListener("visibilitychange", ...)`. These are never removed. If there are N typewriter elements, N visibility listeners are permanently registered. While the page likely has only 1-2 typewriters, this is a pattern that leaks.

### W10. HTML validation has `no-inline-style: "off"`
**File:** `/home/user/MagUpUS/.htmlvalidate.json`, line 6
Inline styles are fully permitted. The animations engine uses many inline style manipulations (`el.style.width`, `el.style.transform`, etc.), which is understandable for animation, but this setting also suppresses warnings for any accidental inline styles in templates.

## Observations (Nice to Have)

### O1. CSS output is large (103 KB minified)
**File:** `/home/user/MagUpUS/dist/css/style.css` - 103,134 bytes
While Tailwind v4 includes tree-shaking, 103 KB of minified CSS for a single-page-centric site is substantial. Gzip would likely reduce this to ~15-20 KB, but the server (GitHub Pages) needs to serve it compressed. Consider auditing for unused utility classes.

### O2. HTML index is 159 KB
**File:** `/home/user/MagUpUS/dist/index.html` - 158,917 bytes (2,103 lines)
This is a single-page site with all sections inlined into `index.html`. While this avoids additional HTTP requests, the HTML alone is 159 KB uncompressed. With Gzip, this should compress to ~20-30 KB, but ensure the hosting supports it.

### O3. Empty `dist/pdf/` directory deployed
The `dist/pdf/` directory exists but is empty. The `eleventy.config.js` line 7 copies `src/pdf` via passthrough. If there are no PDF assets, this passthrough copy is unnecessary and creates a ghost directory.

### O4. `npm-run-all` is unmaintained
**File:** `/home/user/MagUpUS/package.json`, line 35
```json
"npm-run-all": "^4.1.5"
```
This package has not been updated since 2019 and is effectively abandoned. The modern replacement is `npm-run-all2` which is a maintained fork, or simply use `concurrently`.

### O5. `pdf-parse` has known prototype pollution vulnerability
**File:** `/home/user/MagUpUS/package.json`, line 37
```json
"pdf-parse": "^1.1.1"
```
`pdf-parse` v1.1.1 (last published 2019) has no known CVEs but its dependency `debug` has had past issues, and the package itself is unmaintained. Consider `pdf2json` or `pdfjs-dist` as more actively maintained alternatives.

### O6. No image optimization pipeline
The only image in `dist/images/` is `og-image.svg` (2.1 KB). No raster images are present. If images are ever added, there is no optimization step (no `sharp`, `imagemin`, or Eleventy image plugin). The `<img>` tags in templates also do not use `loading="lazy"` anywhere.

### O7. Linkinator config only checks localhost
**File:** `/home/user/MagUpUS/.linkinator.config.json`, lines 3-5
```json
"skip": ["^(?!http://localhost)"]
```
This skips all external links. External link checking is important for detecting dead outbound links (e.g., `https://www.geo42.ai` in the whitelabel config, which may not resolve).

### O8. Build runs three times in CI
**File:** `/home/user/MagUpUS/.github/workflows/ci.yml`
The build step executes `npm run build` three separate times:
1. Line 34: Build for linting (no prefix)
2. Line 66: Build for MagUpSite (`PATH_PREFIX: /MagUpSite/`)
3. Line 99: Build for DeckSiteAgent Pages (`PATH_PREFIX: /DeckSiteAgent/`)

Each build includes `npm run clean && npm run build:css && npm run build:11ty`. This triples the CI time. Consider building once and using a post-processing step to rewrite path prefixes, or using Eleventy's `--pathprefix` flag.

### O9. Constellation line rendering is O(n^2)
**File:** `/home/user/MagUpUS/src/js/animations.js`, lines 705-721
The constellation line drawing loop is a nested `O(n^2)` comparison:
```javascript
for (var ci = 0; ci < particleCount && lc < maxLines; ci++) {
  for (var cj = ci + 1; cj < particleCount && lc < maxLines; cj++) {
```
With `particleCount = 200` on desktop, this performs up to 19,900 distance checks per frame. The `maxLines` cap (250) helps, but the distance checks still run. A spatial hash grid would reduce this to near-linear time.

### O10. `@property --border-angle` has limited browser support
**File:** `/home/user/MagUpUS/src/css/input.css`, lines 565-569
```css
@property --border-angle {
  syntax: "<angle>";
  initial-value: 0deg;
  inherits: false;
}
```
`@property` is required for animating custom properties (used in `.glow-border` conic gradient rotation). This works in Chromium and Safari 15.4+, but Firefox only added support in Firefox 128 (July 2024). Earlier Firefox versions will see a static border with no animation. This is a progressive enhancement, not a breakage, but worth noting.

## What's Working Well

### Build Pipeline
- **Clean separation of concerns**: Extract, scrape, merge, build pipeline is well-structured with clear data flow through JSON intermediates.
- **CSS is properly minified**: `@tailwindcss/cli --minify` produces a single minified stylesheet (1 line, 103 KB).
- **No source maps in production**: The dist directory contains no `.map` files.
- **No debug output**: Zero `console.log`, `console.debug`, or `debugger` statements in production JS.
- **Clean build script**: `npm run clean` removes dist before each build, preventing stale artifacts.

### Performance Engineering
- **Visibility gating**: All three Three.js scenes and the particle system use `IntersectionObserver` to pause `requestAnimationFrame` loops when off-screen. This is critical for battery life on mobile.
- **`document.hidden` check**: All animation loops pause when the tab is hidden (via `visibilitychange` event), preventing wasted GPU cycles.
- **RAF throttling**: Scroll handlers for progress bar, carousel dots, and header class toggling all use `requestAnimationFrame` gating to prevent layout thrashing.
- **Passive event listeners**: All `scroll`, `resize`, `mousemove`, and `touchstart` listeners use `{ passive: true }`.
- **Device-appropriate rendering**: Touch devices get reduced particle counts (80 vs 200), shorter connection distances, and Three.js scenes are skipped entirely.
- **Debounced resize**: All resize handlers use `setTimeout` debouncing (150-200ms).
- **Pixel ratio capped**: `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))` prevents 3x rendering on high-DPI mobile.

### Accessibility
- **prefers-reduced-motion respected everywhere**: CSS has a comprehensive `@media (prefers-reduced-motion: reduce)` block (lines 1524-1648) that disables all animations, removes decorative elements, and resets transforms. JavaScript also checks `matchMedia("(prefers-reduced-motion: reduce)")` and listens for runtime changes (line 17-21).
- **Skip link present**: `base.njk` line 210.
- **ARIA attributes used correctly**: FAQ toggles use `aria-expanded`, carousel dots use `aria-current`, decorative elements use `aria-hidden="true"`.
- **Keyboard navigation**: Carousel supports arrow keys (`keydown` handler, line 361).
- **Focus styles defined**: `input.css` lines 45-50 provide visible focus outlines.

### Code Quality
- **IIFE encapsulation**: `animations.js` wraps everything in an IIFE with `"use strict"`.
- **No global leaks**: All Three.js files use IIFEs. Variables are scoped appropriately.
- **Conditional loading**: Three.js scenes only import on desktop pointer devices with motion enabled (`base.njk` lines 306-312).
- **Font loading strategy**: Google Fonts use `preload` with `onload="this.rel='stylesheet'"` for non-render-blocking loading, with `<noscript>` fallback.
- **Structured data**: Comprehensive JSON-LD with Organization, SoftwareApplication, WebSite, WebPage, FAQPage, and BreadcrumbList schemas.

### Configuration
- **Whitelabel architecture**: Clean separation between brand config (`whitelabel.config.js`), site data (`src/_data/site.js`), and templates.
- **Dynamic navigation**: `nav.js` reads from the blueprint and automatically structures header, footer, and mobile nav.
- **Eleventy config is minimal**: Only 34 lines, clean passthrough rules, blueprint loading.

## Detailed Findings

### File: `/home/user/MagUpUS/package.json`
- **Line 11**: `build:css` uses `npx @tailwindcss/cli` -- this resolves from `node_modules` but `npx` adds startup overhead. A direct `node_modules/.bin/tailwindcss` path would be marginally faster.
- **Line 14**: The `build` script chains `clean && build:css && build:11ty` sequentially. This is correct since CSS must be built before Eleventy copies it.
- **Line 17**: `dev` script runs `build:css` first then `dev:*` in parallel. This is correct -- CSS must exist before Eleventy serves it.
- **Line 26**: `test` script exits with error. Should at minimum run the audit script or lint checks.
- **Line 29**: `@11ty/eleventy` at `^3.1.2` -- current and appropriate.
- **Line 30-31**: `@tailwindcss/cli` and `tailwindcss` both at `^4.1.18` -- these are aligned.
- **Line 35**: `npm-run-all` at `^4.1.5` -- abandoned, use `npm-run-all2`.
- **Line 37**: `pdf-parse` at `^1.1.1` -- unmaintained since 2019.
- **Line 38**: `puppeteer-core` at `^24.37.2` -- appropriate for scraping without bundled Chromium.

### File: `/home/user/MagUpUS/eleventy.config.js`
- **Line 6-11**: Passthrough copies are well-structured. Each asset type is explicit.
- **Line 7**: `src/pdf` is copied but the directory is empty in dist. Minor waste.
- **Line 10**: `src/js` is copied wholesale. No JS processing occurs. This is the source of the unminified JS issue.
- **Line 14-18**: Blueprint loading uses synchronous `fs.readFileSync` in the config. This is fine for build-time but blocks the event loop. Not an issue for static site generation.
- **Line 26-33**: Return object is clean. `pathPrefix` respects the `PATH_PREFIX` env var.

### File: `/home/user/MagUpUS/.github/workflows/ci.yml`
- **Lines 38, 41, 53, 57, 62**: All five quality gates use `continue-on-error: true`. This is the single biggest engineering risk. The CI pipeline is advisory-only; nothing can fail the build.
- **Lines 44-48**: The a11y/link server is started with `npx serve dist -l 8080 &` followed by a fixed `sleep 3`. This is fragile -- on slow CI runners, the server may not be ready in 3 seconds. Use a wait-for-it pattern or poll the port.
- **Lines 78-94**: Deploy script uses `git push -f origin main` to force-push to MagUpSite. This is intentional (it replaces the entire deployment) but is inherently destructive.
- **Lines 97-102**: A second build runs for DeckSiteAgent with a different `PATH_PREFIX`. This is wasteful.
- **Lines 119-130**: The "Enable GitHub Pages" step uses `|| true` which swallows real errors.
- **Lines 136-154**: Smoke test verifies HTTP 200 from both deployment targets. MagUpSite check uses `continue-on-error: true` (acceptable as fallback).

### File: `/home/user/MagUpUS/src/js/animations.js`
- **Lines 1-7**: Good file header documenting features and optimization strategies.
- **Lines 8-21**: `prefers-reduced-motion` detection with runtime change listener. Excellent.
- **Line 24**: `isMobile` is computed once at load time (`window.innerWidth < 640`). If the user resizes from mobile to desktop, this value is stale. However, since all IntersectionObserver work is done at load time, this is unlikely to cause issues.
- **Lines 158-204**: `optimizeHeroSize()` creates and removes a DOM probe element. This is clean and the probe is properly cleaned up.
- **Lines 250-259**: Each typewriter adds a `visibilitychange` listener to `document`. These are never removed.
- **Lines 271-281**: FAQ `transitionend` listeners use named functions and properly call `removeEventListener`. Good pattern.
- **Lines 483-496**: First tilt-card binding (dead code, overridden by lines 823-851).
- **Line 575**: WebGL context acquisition with `webgl2 || webgl` fallback. Good.
- **Lines 618-623**: `compileShader()` never checks `gl.getShaderParameter(s, gl.COMPILE_STATUS)`. A shader compile error would produce a silent black canvas.
- **Line 869**: Parallax uses `marginTop` (layout-triggering) instead of `transform` (compositor-only).
- **Lines 735-747**: Particle system has proper visibility gating with IntersectionObserver + visibilitychange. Clean start/stop pattern.

### File: `/home/user/MagUpUS/src/js/three-hero.js`
- **Line 8**: `import * as THREE from "three"` -- relies on import map in base.njk. Good.
- **Lines 25-29**: WebGLRenderer created with `alpha: true`, `antialias: true`, `powerPreference: "high-performance"`. No try/catch.
- **Line 31**: Pixel ratio capped at 2. Good for performance.
- **Lines 133-134**: Terrain geometry with 45x45 resolution (2,025 vertices). Updated every frame (lines 273-277) with `needsUpdate = true`. This is ~6 KB of vertex data uploaded to the GPU every frame.
- **Lines 240-248**: Vertex breathing modifies icosahedron vertices every frame. Combined with terrain, this is two buffer uploads per frame.
- **Lines 296-301**: IntersectionObserver with `threshold: 0` is correct for visibility gating.
- **Lines 303-307**: `visibilitychange` handler properly cancels RAF and restarts.
- **No `dispose()` calls**: Scene objects (geometries, materials, renderer) are never cleaned up.

### File: `/home/user/MagUpUS/src/js/three-flywheel.js`
- **Lines 258-266**: Visibility gating starts animation only when scrolled into view. Uses `rootMargin: "100px"` for pre-loading. Good UX decision.
- **Line 199**: Animation starts only when visible (`isVisible && !wasVisible && !rafId`). Clean state machine.
- **No `dispose()` calls**: Same issue as three-hero.js.

### File: `/home/user/MagUpUS/src/js/three-cta.js`
- **Lines 161-163**: `animate()` assigns `rafId` first, then checks `!isVisible || document.hidden`. This means `requestAnimationFrame` is always called even when not visible. The frame skips rendering but still schedules the next frame. Unlike three-hero.js which has the same pattern (line 207-208), the CTA scene never fully stops its RAF loop once started -- it just renders empty frames. The `cancelAnimationFrame` in `visibilitychange` (line 235) mitigates this for tab-hidden, but scrolling past the section does not stop the loop.
- **Lines 172-176**: Terrain position updated every frame with `needsUpdate = true`. Same GPU upload concern as hero.
- **No `dispose()` calls**: Same issue.

### File: `/home/user/MagUpUS/src/css/input.css`
- **Line 1**: `@import "tailwindcss"` -- Tailwind v4 syntax. Correct.
- **Line 3**: `@plugin "@tailwindcss/typography"` -- Tailwind v4 plugin syntax. Correct.
- **Lines 385-394**: `.glass-card` comment explicitly notes blur was removed for performance ("50+ instances on homepage"). Good engineering decision.
- **Lines 396-401**: `.glass-blur` is an opt-in class for blur when needed. Thoughtful architecture.
- **Lines 1244-1307**: Mobile-specific GPU optimizations reduce blur radii and hide heavy elements. Demonstrates performance awareness.
- **Lines 1524-1648**: Comprehensive `prefers-reduced-motion` override. Covers every animated class. Thorough.
- **Lines 1650-1657**: iOS safe-area inset support. Important for notched devices.
- **Line 62**: `.site-header` has `will-change: transform` but the header never transforms -- it only changes `background` and `border-color` on scroll. This `will-change` is wasted GPU memory.

### File: `/home/user/MagUpUS/src/_includes/base.njk`
- **Line 36**: Font preload with `onload="this.rel='stylesheet'"` -- non-blocking font load. Excellent.
- **Line 37**: `<noscript>` fallback for Google Fonts. Correct.
- **Line 52**: CSS loaded as `<link rel="stylesheet">` -- this is render-blocking. Consider inlining critical CSS.
- **Lines 55-61**: Import map for Three.js. Version-pinned at 0.169.0. No SRI.
- **Line 304**: `animations.js` loaded with `defer`. Correct -- runs after DOM parse.
- **Lines 306-312**: Three.js conditional import -- desktop pointer devices only. Smart loading.
- **Lines 314-348**: Inline script for mobile nav toggle and header scroll effect. Small enough to inline. Good.

### File: `/home/user/MagUpUS/.stylelintrc.json`
- **Lines 4-8**: `at-rule-no-unknown` whitelist includes Tailwind-specific at-rules (`@theme`, `@plugin`, `@apply`, `@layer`). Correct.
- **Lines 10-15**: Multiple rules disabled (`value-keyword-case`, `custom-property-pattern`, `color-hex-length`, `property-no-vendor-prefix`, `length-zero-no-unit`). These are all justified by Tailwind v4's CSS-based configuration pattern. Clean configuration.

### File: `/home/user/MagUpUS/.htmlvalidate.json`
- **Line 5**: `no-trailing-whitespace: "off"` -- acceptable, trailing whitespace is cosmetic.
- **Line 6**: `no-inline-style: "off"` -- needed because animation JS sets inline styles. Consider using `data-*` attributes instead where possible.

### File: `/home/user/MagUpUS/.pa11yci.json`
- Only tests `http://localhost:8080/`. Should test all page URLs from the sitemap.

### File: `/home/user/MagUpUS/.linkinator.config.json`
- **Lines 3-5**: Skips all non-localhost URLs. External links are never validated.

### File: `/home/user/MagUpUS/scripts/audit.js`
- **Lines 40-57**: Simple pass/warn/fail counter with console output. No structured output (JSON/SARIF) for CI integration.
- **Lines 72-105**: Gate A checks raw extraction data. Reasonable coverage.
- **Lines 111-145**: Gate B checks scraped styles. Includes a simplified WCAG contrast check (lines 129-138) that uses a luminance formula. This is not a proper WCAG 2.0 contrast ratio calculation (it uses `(0.299*R + 0.587*G + 0.114*B)/255` rather than relative luminance with gamma correction). The result could produce false passes.
- **Lines 197-231**: Gate D checks build output. Verifies key files exist and HTML has essential elements. Reasonable but surface-level -- it checks for `id="main"` as a string match rather than parsing HTML.
- **Line 252**: Exit code 1 on failure. Good -- CI could use this if `continue-on-error` were removed.

### File: `/home/user/MagUpUS/dist/index.html`
- **Line 1**: Proper `<!DOCTYPE html>`.
- **Line 2**: `lang="en"` present.
- **Line 5**: Viewport meta with `viewport-fit=cover` for iOS notch. Good.
- **Line 23**: OG image is SVG (social platforms won't render it).
- **Line 44**: Import map for Three.js pinned to 0.169.0. Present in every page.
- **Lines 2057-2065**: Scripts at bottom of body. `animations.js` has `defer`. Three.js loaded conditionally. Clean.
- **Line 2053**: Copyright year is dynamic (`2026`). Correct.

### Build Output Summary
| Asset | Size | Minified? | Notes |
|-------|------|-----------|-------|
| `dist/css/style.css` | 103 KB | Yes (1 line) | Tailwind output |
| `dist/js/animations.js` | 33.5 KB | No | Largest JS file |
| `dist/js/three-hero.js` | 11.2 KB | No | ES module |
| `dist/js/three-flywheel.js` | 9.7 KB | No | ES module |
| `dist/js/three-cta.js` | 8.1 KB | No | ES module |
| `dist/index.html` | 159 KB | No | Single-page layout |
| **Total dist/** | **1,015 KB** | Mixed | All pages combined |
