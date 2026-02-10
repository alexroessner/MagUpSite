# GEO 42 Brand Book — Dashboard & Data Elements

> **Purpose**: All dashboard visualizations, charts, data tables, and metric displays used in the GEO 42 product. Replicate these elements in pitch decks, reports, and internal documents.

---

## Dashboard Shell

The container that frames all dashboard content.

```html
<div class="glass-card rounded-2xl p-6 sm:p-8" style="backdrop-filter: blur(30px); border: 1px solid rgba(151,117,250,0.15)">
  <!-- Header bar -->
  <div class="flex items-center justify-between mb-6">
    <div class="flex items-center gap-2">
      <div class="w-3 h-3 rounded-full bg-accent-500"></div>
      <span class="font-heading text-sm font-semibold text-primary-50">GEO 42 Dashboard</span>
    </div>
    <div class="flex gap-1.5" aria-hidden="true">
      <div class="w-2.5 h-2.5 rounded-full bg-primary-600"></div>
      <div class="w-2.5 h-2.5 rounded-full bg-primary-600"></div>
      <div class="w-2.5 h-2.5 rounded-full bg-accent-500"></div>
    </div>
  </div>
  <!-- Dashboard content -->
</div>
```

### Dashboard Slide Header (Carousel)

```html
<div class="flex items-center gap-2 pb-3 mb-4 border-b border-primary-700/20">
  <div class="w-2 h-2 rounded-full bg-accent-500"></div>
  <h3 class="font-heading text-[10px] font-semibold text-primary-300 uppercase tracking-wider">Section Title</h3>
  <span class="ml-auto text-[10px] px-2 py-0.5 bg-accent-500/10 rounded-full text-accent-400 font-medium">Label</span>
</div>
```

---

## KPI Cards

### Standard KPI (4-up Grid)

```html
<div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
  <div class="kpi-glow glass-card rounded-xl p-4">
    <div class="text-xs text-primary-500 uppercase tracking-wider mb-1">Metric Name</div>
    <div class="text-2xl font-bold text-accent-400">87.3%</div>
    <div class="text-xs text-accent-500 mt-1">+12.4% this week</div>
  </div>
  <!-- Repeat for each KPI -->
</div>
```

### Compact KPI (Dashboard Slides)

```html
<div class="bg-primary-900/40 border border-primary-700/20 rounded-xl p-3">
  <div class="text-[10px] text-primary-500 uppercase tracking-wider mb-1">Visibility</div>
  <div class="text-lg font-bold text-accent-400">28.75%</div>
  <div class="text-[10px] text-emerald-400">+3.2%</div>
</div>
```

### KPI Color Mapping

| Metric Type | Value Color | Change Indicator |
|------------|-----------|-----------------|
| Visibility/Rate | `text-accent-400` | `text-emerald-400` (+) or `text-red-400` (-) |
| Recommendation | `text-amber-400` | `text-emerald-400` |
| Count | `text-emerald-400` | `text-emerald-400` |
| Neutral | `text-primary-100` | `text-emerald-400` |
| Trust/Sentiment | `text-accent-400` | descriptive text |

---

## Data Tables

### Prompt Research Table

Full-width table with citation status badges.

```html
<table class="w-full text-[11px] sm:text-xs">
  <thead>
    <tr class="border-b border-primary-700/30">
      <th class="text-left py-2 px-2 text-primary-500 font-medium">ID</th>
      <th class="text-left py-2 px-2 text-primary-500 font-medium">Prompt</th>
      <th class="text-center py-2 px-1.5 text-primary-500 font-medium">ChatGPT</th>
      <th class="text-center py-2 px-1.5 text-primary-500 font-medium">Google AI</th>
      <th class="text-center py-2 px-1.5 text-primary-500 font-medium">Perplexity</th>
    </tr>
  </thead>
  <tbody>
    <tr class="border-b border-primary-800/30">
      <td class="py-1.5 px-2 text-primary-500 font-mono text-[10px]">Q001</td>
      <td class="py-1.5 px-2 text-primary-200 whitespace-nowrap">Prompt text</td>
      <td class="py-1.5 px-1.5 text-center">
        <span class="inline-block px-1.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400">Cited</span>
      </td>
      <!-- More columns -->
    </tr>
  </tbody>
</table>
```

---

## Progress Bars

### Brand Visibility Ranking

Horizontal bar chart with gradient fill for the primary brand and muted fill for competitors.

```html
<div class="space-y-2.5">
  <!-- Primary brand (highlighted) -->
  <div class="flex items-center gap-2">
    <span class="text-[10px] w-20 text-accent-400 font-semibold">Your Brand</span>
    <div class="flex-1 h-1.5 bg-primary-800/50 rounded-full overflow-hidden">
      <div class="h-full rounded-full" style="width: 78%; background: linear-gradient(90deg, #7C5CF7, #B197FC)"></div>
    </div>
    <span class="text-[10px] w-8 text-right text-accent-400">78%</span>
  </div>
  <!-- Competitor (muted) -->
  <div class="flex items-center gap-2">
    <span class="text-[10px] w-20 text-primary-400">Competitor A</span>
    <div class="flex-1 h-1.5 bg-primary-800/50 rounded-full overflow-hidden">
      <div class="h-full rounded-full" style="width: 65%; background: rgba(139, 114, 184, 0.3)"></div>
    </div>
    <span class="text-[10px] w-8 text-right text-primary-500">65%</span>
  </div>
</div>
```

### Platform Visibility Bars (Animated)

Bars that fill on scroll-reveal. Uses `bar-fill` class with `data-bar-width`.

```html
<div class="flex items-center gap-3">
  <span class="text-xs text-primary-300 w-20">ChatGPT</span>
  <div class="flex-1 h-2 bg-primary-700 rounded-full overflow-hidden">
    <div class="h-full rounded-full bar-fill"
         data-bar-width="92%"
         data-bar-delay="0"
         style="background: linear-gradient(90deg, #7C5CF7, #B197FC)"></div>
  </div>
  <span class="text-xs text-accent-400 w-10 text-right">92%</span>
</div>
```

### SEO vs GEO Comparison Bars

```html
<!-- SEO: progressive (multiple bars filling) -->
<div class="h-2 bg-primary-700 rounded-full overflow-hidden">
  <div class="h-full bg-primary-500 rounded-full bar-fill" data-bar-width="82%"></div>
</div>

<!-- GEO: binary (#1 gets 100%, rest empty) -->
<div class="h-2 bg-primary-700 rounded-full overflow-hidden">
  <div class="h-full bg-accent-500 rounded-full bar-fill" data-bar-width="100%"></div>
</div>
```

---

## Heatmap

Grid of colored cells showing relative intensity.

```html
<div class="bg-primary-900/30 rounded-xl p-4 border border-primary-700/15">
  <div class="text-[10px] text-primary-500 uppercase tracking-wider mb-3">Competitor Heatmap</div>
  <div class="grid grid-cols-5 gap-1">
    <div class="h-5 rounded-sm" style="background: rgba(151, 117, 250, 0.08)"></div>
    <div class="h-5 rounded-sm" style="background: rgba(151, 117, 250, 0.25)"></div>
    <div class="h-5 rounded-sm" style="background: rgba(151, 117, 250, 0.45)"></div>
    <!-- More cells with varying opacity 0.06–0.52 -->
  </div>
  <div class="flex justify-between mt-2">
    <span class="text-[11px] text-primary-500">Low visibility</span>
    <span class="text-[11px] text-primary-500">High visibility</span>
  </div>
</div>
```

**Opacity scale**: `0.06` (cold) → `0.52` (hot), all using `rgba(151, 117, 250, N)`.

---

## Radial Progress Gauge

SVG-based circular progress indicator.

```html
<svg viewBox="0 0 120 120" class="w-28 h-28">
  <!-- Track -->
  <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(42,29,94,0.5)" stroke-width="8"/>
  <!-- Progress arc -->
  <circle cx="60" cy="60" r="50" fill="none" stroke="url(#prog-grad)" stroke-width="8"
          stroke-linecap="round" stroke-dasharray="314" stroke-dashoffset="213"
          transform="rotate(-90 60 60)"/>
  <defs>
    <linearGradient id="prog-grad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#7C5CF7"/>
      <stop offset="100%" stop-color="#B197FC"/>
    </linearGradient>
  </defs>
  <!-- Center text -->
  <text x="60" y="55" text-anchor="middle" fill="#B197FC" font-weight="700" font-size="22">32%</text>
  <text x="60" y="72" text-anchor="middle" fill="#8B72B8" font-size="9">Complete</text>
</svg>
```

**Math**: `stroke-dashoffset = 314 × (1 - percentage)`. For 32%: `314 × 0.68 = 213`.

---

## Pipeline Steps

Step indicator with status icons.

```html
<div class="flex items-center gap-3">
  <!-- Done step -->
  <div class="w-6 h-6 rounded-full flex items-center justify-center bg-emerald-500/20 text-emerald-400">
    <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
  </div>
  <span class="text-xs text-primary-300">Data Collection</span>
</div>

<!-- Active step -->
<div class="flex items-center gap-3">
  <div class="w-6 h-6 rounded-full flex items-center justify-center bg-accent-500/20 text-accent-400 text-[10px] font-bold">3</div>
  <span class="text-xs text-accent-400 font-medium">AI Optimization</span>
  <span class="ml-auto text-[11px] px-1.5 py-0.5 bg-accent-500/10 rounded-full text-accent-400">In Progress</span>
</div>

<!-- Pending step -->
<div class="flex items-center gap-3">
  <div class="w-6 h-6 rounded-full flex items-center justify-center bg-primary-700/30 text-primary-500 text-[10px] font-bold">4</div>
  <span class="text-xs text-primary-500">Distribution</span>
</div>
```

---

## Quick Tool Chips

Small action chips in dashboard interfaces.

```html
<div class="flex flex-wrap gap-2">
  <div class="flex items-center gap-1.5 px-3 py-1.5 bg-primary-800/40 border border-primary-700/20 rounded-lg text-[10px] text-primary-300">
    <span class="w-1.5 h-1.5 rounded-full bg-accent-500/50"></span>
    Prompt Audit
  </div>
</div>
```

---

## Activity Feed

Recent updates / message stream.

```html
<div class="bg-primary-900/30 rounded-xl p-3 border border-primary-700/15">
  <div class="text-[10px] text-primary-500 uppercase tracking-wider mb-2">Recent Updates</div>
  <div class="space-y-2">
    <div class="flex items-center gap-2">
      <span class="w-1 h-1 rounded-full bg-accent-400 shrink-0"></span>
      <span class="text-[10px] text-primary-300 truncate">Brand visibility increased +3.2% on ChatGPT</span>
      <span class="text-[11px] text-primary-600 ml-auto shrink-0">2m</span>
    </div>
  </div>
</div>
```

**Dot colors**: `accent-400` (brand update), `emerald-400` (success), `amber-400` (warning).

---

## Before/After Comparison

AI conversation mockup showing before and after GEO optimization.

### Before State

```html
<div class="glass-card rounded-2xl p-6">
  <div class="flex items-center gap-2 mb-4">
    <div class="w-6 h-6 rounded bg-primary-600 flex items-center justify-center">
      <!-- Platform icon -->
    </div>
    <span class="text-sm font-semibold text-primary-300">Gemini</span>
    <span class="ml-auto text-xs px-2 py-0.5 bg-primary-700 rounded text-primary-400">BEFORE</span>
  </div>
  <!-- Conversation bubbles -->
  <div class="p-3 bg-primary-900/50 rounded-lg border border-primary-700/50">
    <p class="text-xs text-primary-500 mb-1">User</p>
    <p class="text-sm text-primary-200">Question text</p>
  </div>
  <!-- Status indicator -->
  <div class="mt-4 flex items-center gap-2">
    <div class="w-2 h-2 rounded-full bg-primary-600"></div>
    <span class="text-xs text-primary-500">Visibility: <strong class="text-primary-300">0%</strong></span>
  </div>
</div>
```

### After State

Same structure but uses `card-featured` instead of `glass-card`, and the status dot becomes `bg-accent-400 pulse-dot`.

---

## Dashboard Carousel

Container for swipeable dashboard slides.

```html
<div class="relative" role="region" aria-roledescription="carousel" aria-label="Dashboard previews">
  <!-- Arrow buttons (desktop only, hidden <=1024px) -->
  <button class="dash-arrow dash-arrow-prev hidden lg:flex">←</button>
  <button class="dash-arrow dash-arrow-next hidden lg:flex">→</button>

  <!-- Scrollable track -->
  <div class="dash-carousel-track flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4" id="dash-track">
    <div class="dash-slide snap-center shrink-0 w-[84vw] sm:w-[560px] lg:w-[680px]">
      <!-- Slide content in glass-card -->
    </div>
  </div>

  <!-- Navigation dots -->
  <div class="flex justify-center gap-2 mt-6">
    <button class="dash-dot active" aria-label="Slide 1"></button>
    <button class="dash-dot" aria-label="Slide 2"></button>
  </div>
</div>
```

### Dot Specs

| State | Width | Background |
|-------|-------|-----------|
| Inactive | `0.5rem` | `rgba(151,117,250,0.20)` |
| Active | `1.5rem` | `accent-500` (#9775FA) |
| Hover | `0.5rem` | `rgba(151,117,250,0.40)` |
| Touch target | `18px` padding on all sides |

---

## Flywheel Diagram (SVG)

Circular growth model visualization.

**Key colors:**
- Outer arcs: `#B197FC`, `#9775FA`, `#7C5CF7`
- Node dots: Same three colors
- Center hub: `#2A1D5E` → `#1A1242` gradient fill, `#9775FA` stroke
- Center text: "42" in `#B197FC` at 24px, "FLYWHEEL" in `#B8A0E8` at 11px

**Labels positioned around the circle:**
- Top: "Become the Answer" (`accent-300`)
- Bottom-right: "Win Trust" (`accent-400`)
- Bottom-left: "Facilitate Transaction" (`accent-500`)

See `src/index.njk` lines 693–732 for full SVG source.
