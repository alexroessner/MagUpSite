# 3D Graphics Implementor — Site Audit Report

## Executive Summary

The GEO 42 site ships three WebGL (Three.js) scenes plus a custom WebGL/2D-canvas particle system. The implementation is well-architected: every scene gates on IntersectionObserver, the Page Visibility API, and `prefers-reduced-motion`; devicePixelRatio is capped at 2; and all Three.js scripts are conditionally loaded only on desktop pointer devices. The main gaps are the absence of explicit renderer/geometry disposal (potential GPU memory leaks on SPA-like navigation), a missing `try/catch` around WebGL context creation in the Three.js files, and per-frame vertex buffer mutations on two terrain meshes that will stress lower-end GPUs.

## Critical Issues (Must Fix)

### C1. No WebGL Availability Guard in Three.js Files
**Files:** `src/js/three-hero.js` (line 25), `src/js/three-flywheel.js` (line 25), `src/js/three-cta.js` (line 24)

All three files call `new THREE.WebGLRenderer(...)` without a `try/catch`. If the browser supports `<canvas>` but the GPU driver is blocklisted or context creation fails, the entire IIFE throws and halts execution. The `animations.js` particle system correctly tests for WebGL context (`canvas.getContext("webgl2") || canvas.getContext("webgl")`) and has a 2D fallback (line 575-576), but the Three.js scenes have no equivalent guard.

**Impact:** On machines with failing GPU drivers, a hard JS error blocks the hero from rendering and potentially disrupts later scripts.

**Recommendation:** Wrap `new THREE.WebGLRenderer(...)` in a `try/catch`. If it throws, `return` from the IIFE silently. The fallback CSS shapes and SVG flywheel will show instead.

### C2. No Renderer/Geometry/Material Disposal
**Files:** All three Three.js files

None of the three scenes call `renderer.dispose()`, `geometry.dispose()`, or `material.dispose()`. The IIFEs close over all objects but never provide a teardown path. In a standard multi-page Eleventy site this is mitigated by full page navigation releasing all GPU resources, but if the site ever migrates to SPA routing (Turbo, Barba, etc.), these will become GPU memory leaks.

Current object counts per scene:
- **three-hero.js:** 1 renderer, ~10 geometries (2 icosahedrons, 3 tori, 1 plane, 3 satellite geos, 1 buffer geometry), ~15+ materials, 2 point lights, 1 hemisphere light
- **three-flywheel.js:** 1 renderer, ~8 geometries (4 tori, 2 spheres, 1 buffer geometry, 3 lines), ~12 materials, 3 sprites, 2 point lights
- **three-cta.js:** 1 renderer, ~6 geometries (1 plane, 2 icosahedrons, 1 torus, 1 buffer geometry), ~7 materials, 2 point lights

**Impact:** Medium today (MPA), high if SPA migration occurs.

**Recommendation:** Add a `cleanup()` function to each scene that traverses `scene.children`, disposes geometries/materials, and calls `renderer.dispose()`. Even if not called today, it future-proofs the code.

### C3. Per-Frame Vertex Buffer Mutation on Two Terrain Meshes
**Files:** `src/js/three-hero.js` (lines 240-248, 273-277), `src/js/three-cta.js` (lines 172-176)

Both the hero and CTA scenes mutate every vertex of a PlaneGeometry each frame via CPU-side JS loops and set `needsUpdate = true`. The hero terrain is 45x45 = 2,025 vertices (6,075 floats), and the CTA terrain is 55x55 = 3,025 vertices (9,075 floats). Additionally, the hero scene mutates the icosahedron vertices each frame (lines 240-248).

These are re-uploaded to the GPU every frame via `bufferSubData`. On mobile GPUs (if the touch check ever fails or is overridden), this is expensive.

**Impact:** Each terrain frame performs O(n) JS math + a GPU buffer upload. The CTA terrain (9,075 floats) is the most expensive.

**Recommendation:** Consider reducing terrain resolution for the animated portion, or use a vertex shader with uniform time to compute displacement on the GPU, eliminating CPU vertex mutation entirely.

## Warnings (Should Fix)

### W1. Hero RAF Loop Never Stops (Only Short-Circuits)
**File:** `src/js/three-hero.js` (lines 206-294)

The hero scene starts `animate()` immediately on line 309 and registers an IntersectionObserver that sets `heroVisible`. However, the RAF loop runs continuously -- it calls `requestAnimationFrame(animate)` on line 207 before the visibility check on line 208. When the hero scrolls off-screen, the RAF callback still fires every frame; it just returns early without rendering.

In contrast, `three-flywheel.js` and `three-cta.js` correctly stop the RAF loop when invisible (flywheel lines 258-265, CTA lines 220-230) and restart it only when the element comes back into view.

**Impact:** Minor CPU waste. The early return is cheap (~0.01ms per frame), but it means the browser cannot fully throttle the tab's rendering budget when the hero is not visible.

**Recommendation:** Match the flywheel/CTA pattern: cancel the RAF when `heroVisible` becomes false, restart when it becomes true.

### W2. Flywheel Scene Does Not Start RAF Until Intersection
**File:** `src/js/three-flywheel.js` (lines 257-266)

Unlike the hero, the flywheel correctly waits for IntersectionObserver before calling `animate()`. However, `isVisible` defaults to `false` (line 198) and the observer uses `threshold: 0` with `rootMargin: "100px"`. If IntersectionObserver is not supported (extremely rare but possible), the scene never starts and shows a blank canvas.

**Impact:** Negligible (IO is supported in all modern browsers).

**Recommendation:** Add a fallback: `if (!("IntersectionObserver" in window)) { isVisible = true; animate(); }`.

### W3. Scroll Event Listener on Hero Never Removed
**File:** `src/js/three-hero.js` (lines 52-60)

The scroll listener for `scrollProgress` tracking is never removed, even after the hero scrolls far out of view. It continues to fire RAF callbacks to update `scrollProgress` for the entire session.

**Impact:** Minor. The RAF-gated handler is lightweight, but it runs for the entire page lifetime.

### W4. Multiple Independent `visibilitychange` Listeners
**Files:** All three Three.js files + animations.js

Each scene registers its own `document.addEventListener("visibilitychange", ...)`. The typewriter in animations.js adds another per `[data-typewriter]` element (line 251). For a page with all three scenes + one typewriter, that's 5 visibility listeners. While harmless, a single coordinator would be cleaner.

### W5. Constellation Lines Use O(n^2) Distance Check
**File:** `src/js/animations.js` (lines 705-721)

The constellation line drawing iterates all particle pairs: `O(n^2/2)` where n=200 (desktop) or n=80 (mobile). For 200 particles that is 19,900 distance checks per frame. The `maxLines` cap (250 desktop) short-circuits early in many cases, but worst-case (sparse particles) it runs the full nested loop.

**Impact:** Moderate CPU cost on lower-end devices.

**Recommendation:** A spatial hash or grid-based neighbor lookup would reduce this to O(n).

### W6. `powerPreference: "high-performance"` on All Renderers
**Files:** `src/js/three-hero.js` (line 29), `src/js/three-flywheel.js` (line 29), `src/js/three-cta.js` (line 28)

All three renderers request `powerPreference: "high-performance"`. On laptops with integrated+discrete GPUs, this forces the discrete GPU, increasing power consumption. For subtle wireframe scenes, `"default"` would be sufficient and more battery-friendly.

**Impact:** Battery drain on dual-GPU laptops.

### W7. Parallax Uses `marginTop` Instead of `transform`
**File:** `src/js/animations.js` (lines 854-876)

The parallax effect for `.hero-shape` elements sets `shape.style.marginTop = -yOffset + "px"` (line 869). This triggers layout recalculation each frame, which is expensive. Using `transform: translateY()` would keep the effect on the compositor thread.

**Impact:** Layout thrashing during scroll on the hero section for mobile fallback shapes (desktop hides them via CSS when Three.js is active).

## Observations (Nice to Have)

### O1. Three.js Loaded from CDN Without Subresource Integrity
**File:** `src/_includes/base.njk` (line 58)

The import map points to `https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js` without an `integrity` attribute. Import maps do not currently support SRI in most browsers, but the full Three.js module (~600KB uncompressed, ~150KB gzipped) is loaded even though only a fraction of its exports are used.

**Impact:** ~150KB gzipped network payload for Three.js core.

**Recommendation:** Consider a custom Three.js build with only the used classes (WebGLRenderer, PerspectiveCamera, Scene, Mesh, Points, various geometries, materials, lights, sprites). This could reduce the payload to ~60-80KB gzipped. Alternatively, self-host the module for SRI and caching control.

### O2. Import Map Loaded Unconditionally
**File:** `src/_includes/base.njk` (lines 55-61)

The `<script type="importmap">` block is in the `<head>` for all pages and all devices. While import maps are inert (the browser won't fetch Three.js until a module `import` triggers), the HTML payload includes this on mobile where it's never used.

**Impact:** Negligible (~150 bytes of HTML).

### O3. Particle Canvas Not Using `willReadFrequently` for 2D Fallback
**File:** `src/js/animations.js` (line 751)

The 2D canvas fallback calls `canvas.getContext("2d")` without `{ willReadFrequently: true }`. Since this context is used for continuous animation drawing (not pixel reading), this is actually correct behavior. No issue here.

### O4. Three.js Scene Complexity is Reasonable for Desktop
Geometry polygon counts per scene:
- **Hero:** ~2 icosahedrons (detail 2, ~320 tris each), 3 torus rings (8x100 segments, ~1,600 tris each), 1 terrain plane (45x45, ~4,050 tris), 18 satellite shapes (~36 tris each), 120 point sprites = ~10,000 total triangles
- **Flywheel:** 3 torus rings (16x80, ~2,560 tris each), 1 wireframe ring, 2 spheres (~768 tris each), 3 line objects, 60 point sprites = ~10,000 total triangles
- **CTA:** 1 terrain plane (55x55, ~6,050 tris), 2 icosahedrons (~80 tris each), 1 torus ring, 200 point sprites = ~8,000 total triangles

Total: ~28,000 triangles across three scenes. This is very lightweight for desktop WebGL. Draw calls are more of a concern -- each scene has ~15-25 draw calls, and only one scene is visible at a time thanks to IntersectionObserver gating.

### O5. No `resize` Observer for Container Size Changes
**Files:** All three Three.js files

All three scenes use `window.addEventListener("resize", ...)` with debouncing. This works for viewport resizes but won't catch container size changes from CSS layout shifts (e.g., sidebar toggle). A `ResizeObserver` on the parent container would be more precise.

### O6. Mouse Event Listeners Not Scoped to Container (Hero + CTA)
**Files:** `src/js/three-hero.js` (line 182), `src/js/three-cta.js` (line 138)

The hero and CTA scenes attach `mousemove` to `document` rather than to their container element. The flywheel scene correctly scopes to `container` (line 174). Document-level mouse tracking means the camera responds to mouse position even when the cursor is over unrelated page sections.

### O7. Constellation Canvas Stacking
**File:** `src/index.njk` (line 18)

The hero section uses two stacked canvases: `particle-canvas` (WebGL particles) and `constellation-canvas` (2D lines). This is a pragmatic approach since WebGL and 2D contexts cannot share a canvas. The constellation canvas uses individual `beginPath/stroke` calls per line, which could be batched with a single `beginPath` and multiple `moveTo/lineTo` pairs followed by one `stroke()`.

## What's Working Well

### Progressive Enhancement is Excellent
The conditional loading chain is well-designed:
1. `base.njk` (lines 306-312): Three.js scripts are dynamically imported only when `(hover: hover) and (pointer: fine)` AND `!(prefers-reduced-motion: reduce)` both pass
2. Each Three.js IIFE independently re-checks `isTouch` and `reducedMotion` (defense in depth)
3. CSS provides fallback: `.hero-shapes` with CSS animations show on mobile; `.flywheel-svg-fallback` SVG shows for the flywheel on mobile
4. On desktop with Three.js active, CSS hides the fallbacks (lines 722-731 of input.css)

### IntersectionObserver Gating is Thorough
- Hero: observes parent container (line 297-301)
- Flywheel: observes container with `rootMargin: "100px"` for pre-loading (line 265)
- CTA: observes parent with `rootMargin: "50px"` (line 230)
- Particle system: observes canvas parent (lines 735-743)
- All use `threshold: 0` for fast triggering

### Page Visibility API is Properly Implemented
All three Three.js scenes cancel RAF on `document.hidden` and restart on visible (hero: lines 303-307, flywheel: lines 268-272, CTA: lines 233-237). The particle system does the same (lines 745-747). The typewriter pauses its `setTimeout` chain (lines 251-259).

### devicePixelRatio Capped at 2
All three renderers: `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))` -- hero (line 31), flywheel (line 31), CTA (line 30). This prevents 3x Retina displays from rendering at excessive resolution.

### Canvas Elements Properly Marked aria-hidden
All canvas elements in `index.njk` have `aria-hidden="true"`:
- `<canvas id="hero-3d" class="hero-3d-canvas" aria-hidden="true">` (line 17)
- `<canvas id="particle-canvas">` inside `<div class="particle-canvas" aria-hidden="true">` (line 18)
- `<canvas id="constellation-canvas" ...>` inside same aria-hidden div (line 18)
- `<canvas id="flywheel-3d" class="flywheel-3d-canvas" aria-hidden="true">` (line 735)
- `<canvas id="cta-3d" class="cta-3d-canvas" aria-hidden="true">` (line 1162)

### CSS Animations Use Composited Properties
The vast majority of CSS animations use `transform` and `opacity` exclusively:
- `.reveal`, `.reveal-left`, `.reveal-right`, `.reveal-scale` -- all use `opacity` + `transform` (lines 109-155)
- `.stagger > *` -- `opacity` + `transform: translateY` (lines 158-177)
- `.s3d-drift` -- `opacity` + `transform` (lines 792-807)
- `.marquee` -- `transform: translateX` only (lines 273-276)
- `.shimmer` -- `transform: translateX` (lines 921-925)
- `.float-gentle` -- `transform: translateY` (lines 1008-1011)
- All hero shape drifts (hdrift1-8) -- `transform: translate3d` + `rotate` (lines 1364-1408)
- Section orbs -- `transform: translate` + `scale` (lines 1443-1459)
- Reveal-3d variants -- `opacity` + `transform: perspective/translateZ/rotateX` (lines 1462-1496)

### `will-change` Usage is Sparse and Intentional
`will-change` appears on only 8 elements:
- `.site-header` -- `will-change: transform` (line 62, sticky header)
- `.logo-marquee` -- `will-change: transform` (line 270, continuous animation)
- `.scroll-progress` -- `will-change: transform` (line 654, continuous scaleX)
- `.touch-ripple` -- `will-change: transform, opacity` (line 689, ephemeral)
- `.s3d` -- `will-change: transform, opacity` (line 763, small elements)
- `.ambient-glow` -- `will-change: transform, opacity` (line 1123, single CTA element)
- `.hero-shape` -- `will-change: transform` (line 1321, mobile-only shapes)
- `.section-orb` -- `will-change: transform` (line 1416, ambient decoration)

This is a disciplined approach -- `will-change` is only on continuously-animated elements, not sprayed everywhere.

### Mobile Performance Optimizations in CSS
The `@media (width <= 768px)` block (lines 1244-1307) reduces:
- `backdrop-filter` blur radius (16px to 12px on header, 20px to 12px on cards)
- Hero glow size (700px to 350px) and blur (80px to 50px)
- Ambient glow size and blur
- Hides 3 of 8 hero shapes and shrinks remaining ones
- Reduces noise texture tile size (256px to 128px)

### `backdrop-filter` Usage is Reasonable
`backdrop-filter` appears on:
- `.site-header` (always visible, blur 16px -- reduced to 12px on mobile) -- line 58
- `.glass-blur` (opt-in class, blur 20px) -- line 398
- `.card-featured` (blur 20px, reduced to 12px on mobile) -- line 481
- `.dash-arrow` (blur 8px, hidden on mobile) -- line 1220

Notably, `.glass-card` (the most frequently used card class, 50+ instances) does NOT use `backdrop-filter` -- the comment on line 385 explicitly notes it was removed for performance. This is a smart tradeoff.

### Reduced Motion is Fully Respected
- All Three.js scenes exit immediately if `prefers-reduced-motion: reduce` (hero line 15, flywheel line 15, CTA line 14)
- `animations.js` checks at initialization (line 12) and listens for runtime changes (lines 17-21)
- Counters show final values immediately (lines 114-120)
- Typewriter shows first word statically (lines 212-215)
- All scroll-reveal elements get `.visible` class immediately (lines 60-63)
- Cursor glow, touch ripple, tilt cards, and parallax all gated (lines 424, 457, 482, 855)

## Detailed Findings

### File: `src/js/three-hero.js` (311 lines, 11.2KB)

| Line(s) | Finding | Severity |
|---------|---------|----------|
| 8 | `import * as THREE from "three"` -- imports entire Three.js namespace. Tree-shaking depends on bundler. With bare import maps + CDN, no tree-shaking occurs. | Observation |
| 13-15 | Touch + reduced motion guard -- correct, exits IIFE early | Good |
| 25-34 | Renderer creation without try/catch | Critical |
| 29 | `powerPreference: "high-performance"` | Warning |
| 31 | `Math.min(window.devicePixelRatio, 2)` -- capped at 2 | Good |
| 52-60 | Scroll listener with RAF throttle + `{ passive: true }` | Good |
| 64 | IcosahedronGeometry detail 2 -- reasonable (~320 faces) | Good |
| 90-98 | 3 TorusGeometry(3.5, 0.015, 8, 100) -- thin tubes, 8 radial segments is minimal | Good |
| 107-129 | 18 satellites with 3 shared geometries -- memory efficient | Good |
| 133 | PlaneGeometry(50, 50, 45, 45) -- 2,025 vertices, animated per-frame | Warning |
| 136-141 | `fbm()` function -- 4 octaves of sin/cos, computed per vertex per frame | Warning |
| 157-169 | 120 dust particles as Points -- very lightweight | Good |
| 182-185 | `document.addEventListener("mousemove", ...)` -- document-level, not container-scoped | Observation |
| 189-199 | Resize debounced at 150ms with `clearTimeout` | Good |
| 206-208 | RAF starts unconditionally; visibility check is early-return, not RAF cancellation | Warning |
| 240-248 | Per-frame vertex mutation on icosahedron (detail 2 = ~480 floats) | Warning |
| 273-277 | Per-frame vertex mutation on terrain (45x45 = 6,075 floats) | Warning |
| 297-301 | IntersectionObserver on parent with threshold 0 | Good |
| 303-307 | visibilitychange: cancels RAF when hidden, restarts when visible | Good |
| -- | No geometry/material/renderer disposal anywhere | Critical |

### File: `src/js/three-flywheel.js` (273 lines, 9.7KB)

| Line(s) | Finding | Severity |
|---------|---------|----------|
| 13-15 | Touch + reduced motion guard | Good |
| 25-34 | Renderer without try/catch | Critical |
| 31 | DPR capped at 2 | Good |
| 63-75 | 3 torus rings (16x80 segments) -- reasonable geometry | Good |
| 86-115 | 3 nodes with sprites (additive blending) -- lightweight | Good |
| 134-143 | Line geometry from hub to nodes -- 3 draw calls for simple lines | Good |
| 146-161 | 60 micro-particles as Points | Good |
| 174-178 | Mouse tracking scoped to container (not document) | Good |
| 185-194 | Resize debounced at 200ms | Good |
| 198-199 | `isVisible = false` -- scene starts paused, waits for IO | Good |
| 201-203 | RAF with early return on `!isVisible || document.hidden` | Good |
| 258-266 | IO starts RAF only when visible, stops when not visible | Good |
| 263 | `if (isVisible && !wasVisible && !rafId) animate()` -- prevents double-start | Good |
| 268-272 | visibilitychange properly implemented | Good |
| -- | No disposal | Critical |

### File: `src/js/three-cta.js` (238 lines, 8.1KB)

| Line(s) | Finding | Severity |
|---------|---------|----------|
| 13-15 | Touch + reduced motion guard | Good |
| 24-33 | Renderer without try/catch | Critical |
| 30 | DPR capped at 2 | Good |
| 45 | PlaneGeometry(60, 60, 55, 55) -- 3,025 vertices, largest terrain | Warning |
| 70-81 | 200 ascending particles with velocities -- data well-structured | Good |
| 88 | Additive blending on particles -- nice visual effect | Good |
| 93-119 | Central ascending icosahedron + ring -- lightweight | Good |
| 132-134 | `revealProgress` with lerp for smooth reveal -- good UX | Good |
| 138-141 | Mouse tracking on document level | Observation |
| 161-163 | RAF with early return on `!isVisible || document.hidden` | Good |
| 172-176 | Per-frame terrain vertex mutation (9,075 floats) -- most expensive | Warning |
| 180-189 | Per-frame particle position updates (600 floats) | Acceptable |
| 220-231 | IO with rootMargin: "50px", starts RAF on visibility | Good |
| 225-227 | `targetReveal = 1` on intersection -- scroll-driven crescendo | Good |
| 233-237 | visibilitychange properly implemented | Good |
| -- | No disposal | Critical |

### File: `src/js/animations.js` (896 lines, 33.6KB)

| Line(s) | Finding | Severity |
|---------|---------|----------|
| 11-14 | Motion/touch/pointer detection at top level | Good |
| 17-21 | Runtime `prefers-reduced-motion` change listener | Excellent |
| 28-63 | IntersectionObserver for reveals with mobile stagger adaptation | Good |
| 66-82 | Separate IO for mobile glow-border cards | Good |
| 84-109 | Bar fill animations with reduced-motion fallback | Good |
| 112-155 | Counter animations with RAF + cubic easing, reduced-motion fallback | Good |
| 158-204 | Mobile hero font optimization -- creative approach using probe span | Good |
| 206-260 | Typewriter with visibility gating + reduced-motion fallback | Good |
| 396-421 | Scroll progress bar with RAF throttle + cached doc height | Excellent |
| 424-454 | Cursor glow with RAF throttle, pointer-only | Good |
| 457-479 | Touch ripple with animation reset via `void offsetWidth` | Good |
| 482-497 | Tilt cards with 12-degree max tilt | Good |
| 529-818 | WebGL particle system with 2D fallback -- thorough implementation | Good |
| 575-576 | WebGL context test with webgl2 -> webgl fallback | Good |
| 618-623 | Shader compilation without error checking | Observation |
| 669-721 | CPU-side position cache for constellation lines -- pragmatic approach | Good |
| 705-721 | O(n^2) constellation distance check with maxLines early exit | Warning |
| 727-733 | Start/stop functions for clean RAF lifecycle | Good |
| 735-743 | IO on canvas parent for particle start/stop | Good |
| 749-818 | 2D canvas fallback with identical constellation logic | Good |
| 821-852 | Universal tilt cards with dynamic shine element | Good |
| 854-876 | Parallax uses `marginTop` instead of `transform` | Warning |
| 878-895 | 3D reveal observer for reveal-3d classes | Good |

### File: `src/css/input.css` (CSS Animations)

| Line(s) | Finding | Severity |
|---------|---------|----------|
| 185-191 | `@keyframes typing` -- animates `width`, a layout property | Warning |
| 273-276 | `@keyframes marquee` -- `transform: translateX` only | Good |
| 346-348 | `.faq-content` -- animates `max-height`, a layout property | Warning |
| 539-541 | `@keyframes rotate-border` -- animates `--border-angle` custom property | Good |
| 586-596 | `@keyframes pulse-ring` -- `transform: scale` + `opacity` | Good |
| 696-710 | `@keyframes ripple-burst` -- `transform` + `opacity` | Good |
| 792-807 | `@keyframes s3d-drift` -- `transform` + `opacity` | Good |
| 868-876 | `@keyframes flywheel-glow` -- animates `box-shadow` (paint, not layout) | Acceptable |
| 921-925 | `@keyframes shimmer` -- `transform: translateX` only | Good |
| 993-997 | `.bar-fill` -- transitions `width` (layout property) | Warning |
| 1008-1011 | `@keyframes float-gentle` -- `transform: translateY` | Good |
| 1029-1031 | `@keyframes glow-fade` -- `box-shadow` transition | Acceptable |
| 1095-1109 | `@keyframes step-pulse` -- `transform: scale` + `opacity` | Good |
| 1126-1136 | `@keyframes ambient-pulse` -- `transform` + `opacity` | Good |
| 1364-1408 | Hero shape drifts (hdrift1-8) -- all `transform: translate3d` + `rotate` | Good |
| 1443-1459 | Section orbs -- `transform: translate` + `scale` | Good |
| 1462-1496 | 3D reveal variants -- `transform: perspective` + `opacity` | Good |

**Layout-triggering animations found:**
1. `@keyframes typing` (width) -- line 188-191. Used on `.typewriter` class. Low impact: applied to one element.
2. `.faq-content { max-height }` transition -- line 346-348. Triggered by user click only, not continuous.
3. `.bar-fill { width }` transition -- line 994-997. Triggered once on scroll reveal, not continuous.

These are all one-shot or user-triggered, not continuous animations, so the layout cost is acceptable.

### Bundle Size Summary

| File | Raw Size | Notes |
|------|----------|-------|
| `three-hero.js` | 11.2 KB | Source only; Three.js loaded separately |
| `three-flywheel.js` | 9.7 KB | Source only |
| `three-cta.js` | 8.1 KB | Source only |
| `animations.js` | 33.6 KB | Includes WebGL shaders inline |
| **Total custom JS** | **62.5 KB** | Before minification |
| Three.js (CDN) | ~150 KB gzipped | Full library, not tree-shaken |
| **Total 3D payload** | **~180 KB gzipped** | Estimate: custom JS minified (~25KB gz) + Three.js (~150KB gz) |

The Three.js CDN module is the dominant cost. The three custom scene files are lean.

### Brand Alignment Assessment

The 3D elements reinforce the GEO 42 brand narrative effectively:

1. **Hero icosahedron** -- A wireframe polyhedron with breathing vertices evokes data complexity and network topology. The scroll-driven camera pullback creates a "zooming out to see the big picture" metaphor aligned with GEO 42's analytics positioning.

2. **Flywheel visualization** -- Three interlocking gimbal rings with glowing nodes at "Become the Answer / Win Trust / Facilitate Transaction" vertices directly visualize the core business model. The gentle bob (no continuous rotation per user preference) communicates stability and reliability.

3. **CTA terrain** -- Rising peaks with ascending particles create a crescendo effect at the page's climax, reinforcing the "rise above the noise" messaging. The scroll-driven reveal (terrain grows as it enters view) is a nice narrative touch.

4. **Particle constellation** -- The WebGL particle system with connecting lines in the hero evokes neural networks and interconnected data, supporting the AI/intelligence brand positioning.

All elements use the brand purple palette (#9775FA, #B197FC, #7C5CF7) consistently. They are subtle and atmospheric rather than attention-grabbing, which is appropriate for an enterprise B2B product.

**Verdict:** These are purposeful brand reinforcements, not decorative gimmicks.
