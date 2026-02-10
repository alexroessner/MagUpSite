# GEO 42 Brand Book — Component Library

> **Purpose**: Every reusable UI component in the GEO 42 design system. Copy these patterns directly into pitch decks, internal documents, product screens, and marketing materials.

---

## Glass Card (`.glass-card`)

The foundational surface component. Frosted translucent panel with subtle purple border.

### CSS

```css
.glass-card {
  background: rgba(20, 16, 45, 0.60);
  backdrop-filter: blur(20px) saturate(1.4);
  border: 1px solid rgba(151, 117, 250, 0.08);
  box-shadow: 0 8px 32px -8px rgba(8, 5, 30, 0.40),
              inset 0 1px 0 rgba(151, 117, 250, 0.06);
  border-radius: 1rem; /* rounded-2xl */
  overflow: hidden;
  position: relative;
}
```

### Hover State (Desktop)

```css
.glass-card:hover {
  background: rgba(20, 16, 45, 0.75);
  border-color: rgba(151, 117, 250, 0.20);
  box-shadow: 0 16px 48px -12px rgba(0, 0, 0, 0.50),
              0 0 30px -10px rgba(151, 117, 250, 0.12),
              inset 0 1px 0 rgba(151, 117, 250, 0.10);
}
```

### Touch Active State (Mobile)

```css
.glass-card:active {
  background: rgba(20, 16, 45, 0.80);
  border-color: rgba(151, 117, 250, 0.25);
  transition-duration: 0.1s;
}
```

### Usage

```html
<div class="glass-card rounded-2xl p-6 sm:p-8">
  <h3 class="font-heading text-lg font-semibold text-primary-50 mb-2">Card Title</h3>
  <p class="text-primary-400 text-sm leading-relaxed">Card description text.</p>
</div>
```

### Mobile Override

On `<=768px`, blur reduces to `12px` and saturation to `1.2` for GPU performance.

---

## Featured Card (`.card-featured`)

A more dramatic variant for highlighted content. Adds a gradient background and a top accent bar.

### CSS

```css
.card-featured {
  background: linear-gradient(135deg, rgba(151,117,250,0.08), rgba(20,16,45,0.80));
  backdrop-filter: blur(20px) saturate(1.4);
  border: 1px solid rgba(151, 117, 250, 0.15);
  box-shadow: 0 12px 40px -8px rgba(151, 117, 250, 0.12),
              inset 0 1px 0 rgba(151, 117, 250, 0.10);
}

/* Top accent edge (2px gradient bar) */
.card-featured::after {
  content: "";
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, #7C5CF7, #B197FC, #7C5CF7);
}
```

### Usage

```html
<div class="card-featured rounded-2xl p-8">
  <span class="text-xs text-accent-400 font-medium uppercase tracking-[0.2em]">Featured</span>
  <h3 class="font-heading text-xl font-bold text-primary-50 mt-2 mb-4">Feature Title</h3>
  <p class="text-primary-300 text-base leading-relaxed">Description...</p>
</div>
```

---

## Glow Border (`.glow-border`)

Animated conic-gradient border that sweeps around the card on hover (desktop) or on scroll-reveal (mobile).

### CSS

```css
.glow-border::before {
  content: "";
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  background: conic-gradient(from var(--border-angle, 0deg), transparent 60%, rgba(151,117,250,0.40), transparent 80%);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  padding: 1px;
  opacity: 0;
  transition: opacity 0.4s ease;
}

/* Desktop: rotate on hover */
.glow-border:hover::before {
  opacity: 1;
  animation: rotate-border 3s linear infinite;
}

@keyframes rotate-border { to { --border-angle: 360deg; } }
```

### Usage

```html
<div class="glass-card glow-border rounded-2xl p-6">
  <!-- Card content -->
</div>
```

---

## Card Lift (`.card-lift`)

Adds a hover lift and shadow expansion. Combine with `glass-card`.

### Behavior

| Platform | Interaction | Transform |
|---------|-------------|-----------|
| Desktop | hover | `translateY(-6px) scale(1.02)` |
| Mobile | active (tap) | `scale(0.97)` |

### Usage

```html
<div class="card-lift glass-card rounded-2xl p-6">
  <!-- Lifts on hover, presses on tap -->
</div>
```

---

## Buttons

### Hero CTA (Primary)

The main conversion button. Purple gradient with warm glow shadow.

```html
<a href="/contact/" class="btn-press hero-cta inline-flex items-center justify-center gap-2 text-white font-bold px-10 py-4 rounded-full transition-all duration-300 text-lg hover:scale-[1.03]">
  See It in Action
  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
  </svg>
</a>
```

**Specs:**

| Property | Default | Hover |
|----------|---------|-------|
| Background | `linear-gradient(135deg, #9775FA, #7C5CF7 60%, #6741F0)` | `linear-gradient(135deg, #B197FC, #9775FA 60%, #7C5CF7)` |
| Shadow | `0 4px 20px rgba(151,117,250,0.30)` | `0 6px 28px rgba(151,117,250,0.40)` |
| Border radius | `9999px` (full pill) | — |
| Text | White, bold | — |
| Scale on hover | `1.03` | — |
| Scale on press | `0.97` (`.btn-press:active`) | — |

### Navigation CTA (Header)

```html
<a class="px-5 py-2 text-sm font-bold bg-accent-500 text-white rounded-xl hover:bg-accent-400 transition-all shadow-lg shadow-accent-500/25 hover:shadow-accent-400/30 hover:scale-[1.03]">
  See It in Action
</a>
```

### Ghost Button (Secondary)

```html
<a class="btn-press inline-flex items-center gap-2 border border-primary-600/40 hover:border-accent-500/40 text-primary-200 hover:text-white font-semibold px-10 py-4 rounded-full transition-all backdrop-blur-sm">
  View Case Study
</a>
```

### Text Link (Arrow)

```html
<a class="inline-flex items-center gap-2 text-accent-400 hover:text-accent-300 font-semibold transition-colors">
  Learn more
  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
  </svg>
</a>
```

---

## Status Badges

Used in dashboard tables and data displays.

```html
<!-- Positive / Cited -->
<span class="inline-block px-1.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400">Cited</span>

<!-- Warning / Partial -->
<span class="inline-block px-1.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-400">Partial</span>

<!-- Negative / None -->
<span class="inline-block px-1.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-500/15 text-red-400">None</span>

<!-- Info / Feature label -->
<span class="text-[10px] px-2 py-0.5 bg-accent-500/10 rounded-full text-accent-400 font-medium">Live</span>
```

---

## KPI Card

Used for stat displays in dashboards and section highlights.

```html
<div class="kpi-glow glass-card rounded-xl p-4">
  <div class="text-xs text-primary-500 uppercase tracking-wider mb-1">Visibility Rate</div>
  <div class="text-2xl font-bold text-accent-400">87.3%</div>
  <div class="text-xs text-accent-500 mt-1">+12.4% this week</div>
</div>
```

**KPI Glow CSS:**
```css
.kpi-glow {
  box-shadow: 0 0 0 1px rgba(151,117,250,0.10),
              0 4px 24px -4px rgba(151,117,250,0.08);
}
```

---

## Counter (Animated Number)

Numbers that count up when scrolled into view.

```html
<div class="text-4xl font-heading font-extrabold text-accent-400 counter"
     data-count="450" data-prefix="+" data-suffix="%"
     aria-label="+450% Brand Mentions">0</div>
```

---

## Logo Mark

```html
<a href="/" class="logo-mark">
  <span class="logo-icon" aria-hidden="true">42</span>
  <span class="logo-text">
    <span class="logo-geo">GEO</span>
    <span class="logo-42"> 42</span>
  </span>
</a>
```

| Element | Style |
|---------|-------|
| Logo icon | 36×36px, `rounded-lg`, gradient `accent-500→accent-600`, text `primary-950` |
| "GEO" text | White, Space Grotesk, 700, 22px |
| "42" text | `accent-400`, Space Grotesk, 700, 22px |
| Letter spacing | `-0.03em` |

---

## Section Divider (`.section-divider`)

Replaces hard `border-top` with a gradient fade line.

```css
.section-divider::before {
  content: "";
  position: absolute;
  top: 0;
  left: 10%; right: 10%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(151,117,250,0.25), rgba(151,117,250,0.50), rgba(151,117,250,0.25), transparent);
}
```

---

## Accent Line

A thin horizontal gradient stripe for visual separation.

```css
.accent-line {
  height: 2px;
  background: linear-gradient(90deg, transparent, #9775FA, transparent);
}
```

---

## Pulse Dot

A live indicator with pulsing ring.

```html
<div class="w-2 h-2 rounded-full bg-accent-400 pulse-dot" aria-hidden="true"></div>
```

---

## FAQ Accordion

```html
<div class="glass-card rounded-2xl overflow-hidden group">
  <button type="button" class="faq-toggle w-full flex items-center justify-between p-5 text-left" aria-expanded="false">
    <span class="font-heading font-semibold text-primary-50 text-base pr-4">Question?</span>
    <svg class="w-5 h-5 text-accent-400 flex-shrink-0 transition-transform duration-300 group-[.open]:rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
    </svg>
  </button>
  <div class="faq-content hidden">
    <div class="px-6 pb-6">
      <p class="text-primary-300 text-sm leading-relaxed">Answer text.</p>
    </div>
  </div>
</div>
```

---

## Architecture Layer (`.arch-layer`)

Used for step/layer visualization (Flywheel section).

```html
<div class="arch-layer">
  <h3 class="font-heading text-lg font-semibold text-primary-50">Step Title</h3>
  <p class="text-primary-400 text-sm">Step description.</p>
</div>
```

Renders as: left accent border (3px `accent-500`) + dot indicator at top.
