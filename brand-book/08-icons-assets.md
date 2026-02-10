# GEO 42 Brand Book — Icons & Asset Reference

> **Purpose**: All icons, SVG assets, and visual elements used in the GEO 42 design system. Source paths and inline SVG code for direct reuse.

---

## Icon Style Guide

| Property | Value |
|----------|-------|
| **Style** | Outline / stroke (not filled) |
| **Stroke width** | `1.5` (standard) or `2` (emphasis/arrows) |
| **Viewbox** | `0 0 24 24` |
| **Line caps** | `round` |
| **Line joins** | `round` |
| **Color** | `currentColor` (inherits from parent, typically `text-accent-400`) |
| **Size** | `w-5 h-5` (nav), `w-6 h-6` (cards), `w-7 h-7` (industries) |

---

## Service Icons (7)

### 1. AI Visibility (Eye)

```html
<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
</svg>
```

### 2. Prompt Intelligence (Question)

```html
<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
</svg>
```

### 3. Citation Analytics (Clipboard)

```html
<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
</svg>
```

### 4. Crawler Analytics (Gear)

```html
<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0"/>
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
</svg>
```

### 5. Traffic Attribution (Trend)

```html
<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
</svg>
```

### 6. Shopping Visibility (Cart)

```html
<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"/>
</svg>
```

### 7. Content Marketing (Megaphone)

```html
<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/>
</svg>
```

---

## 6 Walls Icons

| Wall | Icon | SVG Path |
|------|------|----------|
| Discovery | Clipboard | `M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2` |
| Credibility | Shield Check | `M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944...` |
| Brand | Building | `M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5...` |
| Capability | Users | `M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1...` |
| Operations | Gear (double) | `M10.325 4.317c.426-1.756 2.924-1.756 3.35 0...` |
| ROI | Dollar Circle | `M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2...` |

---

## Platform Icons (10)

| Platform | Symbol | SVG Type |
|---------|--------|----------|
| ChatGPT | Chat bubble | `M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418...` |
| Google AI | Search | `M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z` |
| Perplexity | Compass/Map | `M9 20l-5.447-2.724A1 1 0 013 16.382V5.618...` |
| Gemini | Sparkle | `M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12...` |
| Claude | Brain/Bulb | `M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707...` |
| Copilot | Code | `M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4` |
| DeepSeek | Flask | `M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477...` |
| Doubao | Globe | `M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2...` |
| Qwen | Star | `M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674...` |
| Kimi | Moon | `M20.354 15.354A9 9 0 018.646 3.646...` |

---

## Navigation Arrow

Used in all CTAs and text links:

```html
<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
</svg>
```

Hero CTA uses `stroke-width="2.5"` and `w-5 h-5`.

---

## Carousel Arrows

```html
<!-- Previous -->
<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
</svg>

<!-- Next -->
<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
</svg>
```

---

## FAQ Toggle Icon

Plus sign that rotates 45° to become an X when open:

```html
<svg class="w-5 h-5 text-accent-400 transition-transform duration-300 group-[.open]:rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
</svg>
```

---

## Menu Icons

```html
<!-- Hamburger (open) -->
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>

<!-- X (close) -->
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
```

---

## Checkmark

```html
<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
</svg>
```

---

## OG Image Asset

**File**: `src/images/og-image.svg`
**Dimensions**: 1200×630px
**Format**: SVG with embedded gradients

Contains: GEO 42 logo, "Become the Answer on ChatGPT" headline, tagline, domain. Uses brand gradient background with glow effect.

---

## Favicon

**File**: `src/favicon.svg`
**Format**: SVG
**Use**: Browser tab, Apple touch icon

---

## Asset Source Files

| Asset | Location | Format |
|-------|----------|--------|
| OG Image | `src/images/og-image.svg` | SVG |
| Favicon | `src/favicon.svg` | SVG |
| CSS (all styles) | `src/css/input.css` | CSS (Tailwind v4) |
| Animations JS | `src/js/animations.js` | JavaScript |
| Content data | `src/_data/pageContent.json` | JSON |
| Brand config | `whitelabel.config.js` | JavaScript |
| Style guide page | `src/style-guide.njk` | Nunjucks template |
