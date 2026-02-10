# GEO 42 Brand Book — Color System

> **Purpose**: Every color in the GEO 42 design system. Use these exact values for all brand materials — pitch decks, summaries, internal docs, social media, and product UI.

---

## Brand Colors (Quick Reference)

| Role | Hex | CSS Variable | Use |
|------|-----|-------------|-----|
| **Primary Brand** | `#110B30` | `--color-primary-900` | Page backgrounds, dark fields |
| **Primary Deepest** | `#08051A` | `--color-primary-950` | Footer, hero sections, CTA blocks |
| **Accent Core** | `#9775FA` | `--color-accent-500` | Primary accent, buttons, highlights |
| **Accent Bright** | `#B197FC` | `--color-accent-400` | Links, active states, glow text |
| **White Text** | `#F5F0FF` | `--color-primary-50` | Headlines on dark backgrounds |

---

## Primary Palette — Deep Purple

The primary palette forms all background surfaces, text on light elements, and structural UI.

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| `primary-50` | `#F5F0FF` | `245, 240, 255` | Headlines, hero text, high-contrast text on dark |
| `primary-100` | `#EDE5FF` | `237, 229, 255` | Body text on dark backgrounds (high emphasis) |
| `primary-200` | `#D4C4FF` | `212, 196, 255` | Body text on dark (standard emphasis), nav links |
| `primary-300` | `#B8A0E8` | `184, 160, 232` | Descriptions, secondary body text, subtitles |
| `primary-400` | `#8B72B8` | `139, 114, 184` | Card descriptions, tertiary text, metadata |
| `primary-500` | `#6350A0` | `99, 80, 160` | Labels, muted text, captions, timestamps |
| `primary-600` | `#3D2B7A` | `61, 43, 122` | Card borders (low opacity), muted fills |
| `primary-700` | `#2A1D5E` | `42, 29, 94` | Progress bar tracks, subtle borders, dividers |
| `primary-800` | `#1A1242` | `26, 18, 66` | Glass card backgrounds, secondary surfaces |
| `primary-900` | `#110B30` | `17, 11, 48` | Main page background, section backgrounds |
| `primary-950` | `#08051A` | `8, 5, 26` | Deepest background — footer, hero, CTA sections |

### Usage in Tailwind

```html
<!-- Background -->
<div class="bg-primary-900">...</div>

<!-- Text -->
<h2 class="text-primary-50">Headline</h2>
<p class="text-primary-300">Body text</p>
<span class="text-primary-500">Caption</span>
```

---

## Accent Palette — Vivid Violet

The accent palette is the brand's signature. Used for all interactive elements, CTAs, highlights, data visualization, and glow effects.

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| `accent-50` | `#F8F5FF` | `248, 245, 255` | Tint wash (rarely used) |
| `accent-100` | `#F0EAFF` | `240, 234, 255` | Light accent background |
| `accent-200` | `#E0D4FF` | `224, 212, 255` | Light accent fills |
| `accent-300` | `#C9B5FF` | `201, 181, 255` | Gradient text start, lighter glow |
| `accent-400` | `#B197FC` | `177, 151, 252` | **Primary interactive**: links, active states, KPI text, highlighted labels |
| `accent-500` | `#9775FA` | `151, 117, 250` | **Core accent**: buttons, badges, progress bars, dot indicators |
| `accent-600` | `#7C5CF7` | `124, 92, 247` | CTA button gradient mid, hover states |
| `accent-700` | `#6741F0` | `103, 65, 240` | CTA button gradient end, dark accent |
| `accent-800` | `#5530DB` | `85, 48, 219` | Deep accent for contrast |
| `accent-900` | `#4320B8` | `67, 32, 184` | Darkest accent tone |
| `accent-950` | `#2E1180` | `46, 17, 128` | Ultra-deep accent |

### Usage in Tailwind

```html
<!-- Buttons -->
<button class="bg-accent-500 text-white">Primary</button>

<!-- Links -->
<a class="text-accent-400 hover:text-accent-300">Link text</a>

<!-- Badges -->
<span class="bg-accent-500/10 text-accent-400">Badge</span>
```

---

## Semantic / Data Colors

Used in dashboard visualizations, status indicators, and data tables.

| Role | Hex | CSS Class | Usage |
|------|-----|-----------|-------|
| **Positive / Success** | `#34D399` | `text-emerald-400`, `bg-emerald-500/15` | Cited status, growth indicators, checkmarks |
| **Warning / Partial** | `#FBBF24` | `text-amber-400`, `bg-amber-500/15` | Partial citation, caution states |
| **Negative / None** | `#F87171` | `text-red-400`, `bg-red-500/15` | Missing citation, alert states |
| **White** | `#FFFFFF` | `text-white` | Maximum emphasis text, CTA button text |

---

## Gradient Definitions

### Text Gradients

```css
/* Primary gradient text (hero headlines) */
.gradient-text {
  background: linear-gradient(135deg, #F5F0FF 0%, #C9B5FF 50%, #9775FA 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Accent gradient text (big numbers: 34x, 1000x) */
.gradient-text-accent {
  background: linear-gradient(135deg, #C9B5FF 0%, #9775FA 50%, #6741F0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

### Surface Gradients

```css
/* Hero CTA button */
background: linear-gradient(135deg, #9775FA, #7C5CF7 60%, #6741F0);

/* Hero CTA hover */
background: linear-gradient(135deg, #B197FC, #9775FA 60%, #7C5CF7);

/* Accent line divider */
background: linear-gradient(90deg, transparent, #9775FA, transparent);

/* Section divider (subtle) */
background: linear-gradient(90deg, transparent, rgba(151,117,250,0.25), rgba(151,117,250,0.50), rgba(151,117,250,0.25), transparent);

/* Card featured top-edge accent */
background: linear-gradient(90deg, #7C5CF7, #B197FC, #7C5CF7);

/* Scroll progress bar */
background: linear-gradient(90deg, #7C5CF7, #B197FC, #C9B5FF);
```

### Glow / Radial Effects

```css
/* Hero background glow */
background: radial-gradient(ellipse, rgba(151,117,250,0.08), transparent 70%);
filter: blur(80px);

/* CTA ambient glow (pulsing) */
background: radial-gradient(ellipse, rgba(151,117,250,0.12), transparent 70%);
filter: blur(60px);

/* Cursor follow glow (desktop) */
background: radial-gradient(circle, rgba(151,117,250,0.06), transparent 70%);

/* Touch ripple (mobile) */
background: radial-gradient(circle, rgba(151,117,250,0.15), rgba(151,117,250,0.05) 40%, transparent 70%);
```

---

## Glass & Transparency Values

These alpha values are used consistently across all glass surfaces:

| Surface | Background | Backdrop Blur | Border |
|---------|-----------|--------------|--------|
| **Glass card** | `rgba(20,16,45, 0.60)` | `blur(20px) saturate(1.4)` | `rgba(151,117,250, 0.08)` |
| **Glass card hover** | `rgba(20,16,45, 0.75)` | same | `rgba(151,117,250, 0.20)` |
| **Card featured** | `linear-gradient(135deg, rgba(151,117,250,0.08), rgba(20,16,45,0.80))` | same | `rgba(151,117,250, 0.15)` |
| **Header** | `rgba(12,10,30, 0.85)` | `blur(16px) saturate(1.5)` | `rgba(151,117,250, 0.10)` |
| **Header scrolled** | `rgba(12,10,30, 0.95)` | same | `rgba(151,117,250, 0.20)` |
| **Mobile glass** | same bg | `blur(12px) saturate(1.2)` | same |

---

## OG Image Colors

Used in the `og-image.svg` social preview:

| Element | Color |
|---------|-------|
| Background gradient | `#110B30` → `#1A1242` |
| Accent line | `#7C5CF7` → `#B197FC` |
| Glow center | `#9775FA` at 15% opacity |
| Logo text "42" | `#B197FC` |
| Headline | `#F5F0FF` |
| Subline | `#B8A0E8` |
| Domain text | `#8B72B8` |

---

## Do / Don't

- **DO** use `primary-900` or `primary-950` as backgrounds — never pure black `#000`
- **DO** use `accent-400` for interactive text, `accent-500` for filled elements
- **DO** maintain the purple glow aesthetic — no flat borders, use gradient dividers
- **DON'T** use any shade of blue, green, or orange as brand colors
- **DON'T** use light/white backgrounds for any primary surfaces
- **DON'T** mix accent colors with other hue families in the same element
