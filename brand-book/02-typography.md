# GEO 42 Brand Book — Typography

> **Purpose**: Font families, sizes, weights, and spacing for all GEO 42 materials. Consistent type treatment across web, pitch decks, internal docs, and social media.

---

## Font Families

### Heading: Space Grotesk

| Property | Value |
|----------|-------|
| **Font** | Space Grotesk |
| **CSS Variable** | `--font-heading` |
| **Fallbacks** | `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif` |
| **Weights used** | 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold), 800 (Extrabold) |
| **Character** | Geometric, modern, tight tracking — conveys tech precision |
| **Use** | All headings, display text, navigation labels, card titles, KPI labels, logo text |

**Google Fonts URL:**
```
https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&display=swap
```

### Body: Inter

| Property | Value |
|----------|-------|
| **Font** | Inter (InterVariable for variable font support) |
| **CSS Variable** | `--font-sans` |
| **Fallbacks** | `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif` |
| **Weights used** | 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold) |
| **Character** | Highly readable, neutral, optimized for screens |
| **Use** | Body text, descriptions, form inputs, metadata, paragraphs |

**Google Fonts URL:**
```
https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap
```

### Monospace: JetBrains Mono

| Property | Value |
|----------|-------|
| **Font** | JetBrains Mono |
| **CSS Variable** | `--font-mono` |
| **Fallbacks** | `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace` |
| **Weights used** | 400 (Regular), 500 (Medium) |
| **Character** | Technical, code-like |
| **Use** | Code snippets, data IDs (Q001), technical labels, dashboard data |

**Google Fonts URL:**
```
https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap
```

---

## Type Scale

### Display / Hero Text

```css
.text-display {
  font-family: var(--font-heading);  /* Space Grotesk */
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 0.95;
}
```

| Breakpoint | Size | Tailwind Class | Use |
|-----------|------|----------------|-----|
| Mobile | `2.25rem` (36px) | `text-4xl` | Section headings |
| Tablet | `3rem` (48px) | `text-5xl` | Section headings |
| Desktop | `3.75rem` (60px) | `text-6xl` | Section headings |
| Hero Max | `min(6rem, 10vw)` | `text-[min(6rem,10vw)]` | Hero headline only |
| CTA Max | `4.5rem` (72px) | `text-7xl` | CTA section heading |

### Heading Levels

| Level | Font | Weight | Size (Desktop) | Tailwind | Letter Spacing |
|-------|------|--------|-----------------|----------|---------------|
| H1 (Hero) | Space Grotesk | 800 | `min(6rem, 10vw)` | `text-display text-[min(6rem,10vw)]` | `-0.04em` |
| H2 (Section) | Space Grotesk | 800 | 48–60px | `text-display text-4xl sm:text-5xl lg:text-6xl` | `-0.04em` |
| H3 (Card title) | Space Grotesk | 600–700 | 18–20px | `font-heading text-lg font-semibold` or `text-xl font-bold` | default |
| H4 (Sub-label) | Space Grotesk | 600 | 14px | `font-heading text-sm font-semibold` | default |

### Body Text

| Role | Font | Weight | Size | Line Height | Tailwind |
|------|------|--------|------|-------------|----------|
| **Body default** | Inter | 400 | 17px (`1.0625rem`) | 1.7 | `text-body leading-relaxed` |
| **Body large** | Inter | 400 | 18–20px | 1.7 | `text-lg leading-relaxed` |
| **Intro/subtitle** | Inter | 400–500 | 20–24px | 1.6 | `text-xl lg:text-2xl` |
| **Card description** | Inter | 400 | 14px | 1.6 | `text-sm leading-relaxed` |
| **Caption/label** | Inter/Space Grotesk | 500 | 12px | 1.4 | `text-xs` |
| **Micro label** | Space Grotesk | 600 | 10px | 1.2 | `text-[10px]` |
| **Dashboard min** | Inter | 400–600 | 11px | 1.3 | `text-[11px]` |

### Label / Tag Pattern

```html
<!-- Section eyebrow label -->
<p class="text-accent-400 font-semibold text-xs uppercase tracking-[0.2em] mb-5">
  Section Label
</p>
```

| Property | Value |
|----------|-------|
| Color | `accent-400` (#B197FC) |
| Weight | 600 (semibold) |
| Size | 12px (xs) |
| Transform | UPPERCASE |
| Letter spacing | `0.2em` |
| Bottom margin | `1.25rem` |

---

## Text Effects

### Gradient Text

Applied to hero headlines and large stat numbers.

```html
<span class="gradient-text">Become the Answer</span>
<span class="gradient-text-accent">34x</span>
```

### Text Glow

Subtle purple halo behind important headings.

```css
.text-glow {
  text-shadow: 0 0 40px rgba(151,117,250,0.20),
               0 0 80px rgba(151,117,250,0.10);
}
```

### Typewriter Effect

Cycles through words with a blinking cursor. Used in the hero for "ChatGPT|Perplexity|Gemini|Google AI|DeepSeek|Claude".

```html
<span class="text-accent-400"
      data-typewriter="ChatGPT|Perplexity|Gemini|Google AI|DeepSeek|Claude"
      role="status"
      aria-live="polite">ChatGPT</span>
```

---

## Text Color Hierarchy

| Level | Color Token | Hex | Use |
|-------|-----------|-----|-----|
| Maximum emphasis | `primary-50` | `#F5F0FF` | Headlines, hero text, card titles |
| High emphasis | `primary-100` | `#EDE5FF` | Important body text |
| Standard emphasis | `primary-200` | `#D4C4FF` | Navigation, body text |
| Secondary | `primary-300` | `#B8A0E8` | Descriptions, supporting text |
| Tertiary | `primary-400` | `#8B72B8` | Card descriptions, metadata |
| Caption | `primary-500` | `#6350A0` | Timestamps, labels, captions |
| Interactive | `accent-400` | `#B197FC` | Links, active states, highlighted text |
| Interactive hover | `accent-300` | `#C9B5FF` | Link hover states |

---

## Spacing Convention

| Relationship | Spacing | Tailwind |
|-------------|---------|----------|
| Eyebrow → Heading | `1.25rem` | `mb-5` |
| Heading → Subtitle | `1.25rem` | `mb-5` |
| Subtitle → Content | `4rem` | `mb-16` |
| Heading → CTA | `3rem` | `mb-12` |
| Card title → description | `0.5–1rem` | `mb-2` to `mb-4` |

---

## Do / Don't

- **DO** use Space Grotesk for ALL headings — never Inter for headings
- **DO** use tight letter-spacing (`-0.04em`) on display text
- **DO** use the eyebrow pattern (uppercase, tracked, accent-400) above section headings
- **DO** use `text-pretty` on paragraph text for optimal line breaking
- **DON'T** use font weights below 400 — the dark theme needs sufficient contrast
- **DON'T** set body text smaller than 14px (exception: dashboard micro-labels at 10–11px)
- **DON'T** use centered text for body paragraphs longer than 2 lines — use left-aligned
