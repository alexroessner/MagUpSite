# GEO 42 Brand Book — Animation & Interaction Specs

> **Purpose**: Every animation, transition, and interaction pattern in the GEO 42 design system. Use these specs to maintain consistent motion design across web, presentations, and video content.

---

## Design Principles

1. **Purposeful** — Every animation communicates state change or draws attention to content
2. **Performant** — Uses `transform` and `opacity` only (GPU-composited properties)
3. **Respectful** — All animations honor `prefers-reduced-motion: reduce`
4. **Platform-aware** — Desktop uses hover; mobile uses tap feedback and scroll-triggered reveals

---

## Core Easing Curve

The signature GEO 42 easing for all content reveals:

```css
cubic-bezier(0.16, 1, 0.3, 1)
```

This is a deceleration curve — fast start, smooth landing. Used for reveals, card lifts, and staggers.

### Spring Easing (Pop)

For icon reveals and playful elements:

```css
cubic-bezier(0.34, 1.56, 0.64, 1)
```

Slight overshoot for a bouncy feel.

---

## Scroll Reveals

All reveal animations are triggered by `IntersectionObserver` at `threshold: 0.15` with `rootMargin: "0px 0px -40px 0px"`.

### Reveal (Up)

```css
.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}
.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}
```

### Reveal Left

```css
.reveal-left {
  opacity: 0; transform: translateX(-32px);
  /* Same transition */
}
```

### Reveal Right

```css
.reveal-right {
  opacity: 0; transform: translateX(32px);
}
```

### Reveal Scale

```css
.reveal-scale {
  opacity: 0; transform: scale(0.92);
}
```

### Glow Reveal

Fades in with a brief purple glow flash, then the glow fades away.

```css
.glow-reveal.visible {
  opacity: 1;
  transform: translateY(0);
  box-shadow: 0 0 40px -10px rgba(151, 117, 250, 0.30);
  animation: glow-fade 2s ease 0.6s forwards;
}

@keyframes glow-fade {
  to { box-shadow: 0 0 0 0 rgba(151, 117, 250, 0); }
}
```

---

## Stagger Animations

### Stagger (Slide Up)

Children animate sequentially with 80ms delay between each.

```css
.stagger > * {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.stagger.visible > *:nth-child(1) { transition-delay: 0ms; }
.stagger.visible > *:nth-child(2) { transition-delay: 80ms; }
.stagger.visible > *:nth-child(3) { transition-delay: 160ms; }
/* ... up to 8 children */
```

### Stagger Pop (Scale + Bounce)

Children pop in with spring easing and 60ms delay.

```css
.stagger-pop > * {
  opacity: 0;
  transform: scale(0.6) translateY(12px);
  transition: opacity 0.5s cubic-bezier(0.34, 1.56, 0.64, 1),
              transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}
/* 60ms stagger delay, up to 10 children */
```

### Mobile Stagger Behavior

On mobile (`<640px`), each child is observed individually (not as a group) for smooth per-card reveals as the user scrolls.

---

## Interactive Animations

### Card Lift (Desktop Hover)

```css
.card-lift:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 24px 60px -16px rgba(151, 117, 250, 0.20),
              0 0 0 1px rgba(151, 117, 250, 0.15);
  transition: 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
```

### Card Press (Mobile Tap)

```css
.card-lift:active {
  transform: scale(0.97);
  transition-duration: 0.1s;
}
```

### Button Press

```css
.btn-press:active {
  transform: scale(0.97);
}
```

### CTA Hover Scale

```css
hover:scale-[1.03]
```

---

## Continuous Animations

### Logo Marquee

```css
.logo-marquee {
  animation: marquee 30s linear infinite;
}
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
```

- Mobile: `18s` duration (faster)
- Reverse row: `animation-direction: reverse`
- Desktop: pauses on hover
- Mobile: pauses on tap

### Typewriter

Cycles through words with type/delete animation. Speed: 80ms per character typing, 40ms deleting, 2s pause between words.

### Flywheel Pulse

```css
@keyframes flywheel-pulse {
  0%, 100% { filter: drop-shadow(0 0 6px rgba(151, 117, 250, 0.30)); }
  50% { filter: drop-shadow(0 0 16px rgba(151, 117, 250, 0.50)); }
}
/* 4s cycle, ease-in-out, infinite */
```

### Pulse Dot

```css
@keyframes pulse-ring {
  0%, 100% { transform: scale(1); opacity: 0.4; }
  50% { transform: scale(1.8); opacity: 0; }
}
/* 2s cycle */
```

### Shimmer

A horizontal light sweep across featured cards.

```css
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  50% { transform: translateX(100%); }
  100% { transform: translateX(100%); }
}
/* 3s cycle (4s on mobile) */
```

### Ambient Glow Pulse

CTA section background glow that breathes.

```css
@keyframes ambient-pulse {
  0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 1; transform: translate(-50%, -50%) scale(1.15); }
}
/* 4s cycle */
```

### Float (Hero Numbers)

```css
@keyframes float-gentle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}
/* 4s cycle */
```

---

## Cursor & Touch Effects

### Cursor Glow (Desktop Only)

A 400×400px purple radial gradient that follows the mouse pointer.

```css
.cursor-glow {
  width: 400px; height: 400px;
  background: radial-gradient(circle, rgba(151,117,250,0.06), transparent 70%);
  /* Fixed position, follows mousemove via JS */
}
```

Hidden on touch devices.

### Touch Ripple (Mobile Only)

A 120px purple burst on tap, replacing the cursor glow.

```css
@keyframes ripple-burst {
  0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
  60% { opacity: 0.6; }
  100% { transform: translate(-50%, -50%) scale(3); opacity: 0; }
}
/* 0.6s duration */
```

---

## Scroll Progress Bar

Fixed at top, 3px tall, gradient fill that scales with scroll position.

```css
.scroll-progress {
  height: 3px;
  background: linear-gradient(90deg, #7C5CF7, #B197FC, #C9B5FF);
  transform: scaleX(0);
  transform-origin: left;
}
/* JS updates scaleX(progress) on scroll */
```

---

## Animated Bars

Progress bars that fill to their target width when scrolled into view.

```css
.bar-fill {
  width: 0%;
  transition: width 1.2s cubic-bezier(0.16, 1, 0.3, 1);
}
/* Target width set via data-bar-width attribute */
/* Staggered via data-bar-delay attribute */
```

---

## Animated Counters

Numbers that count from 0 to target over 1.8s with cubic easing.

```javascript
// Easing: 1 - Math.pow(1 - progress, 3)  (ease-out cubic)
// Duration: 1800ms
// Triggered by IntersectionObserver at threshold: 0.5
```

---

## Icon Reveal Spin

Icons in card grids spin from -90deg and scale up.

```css
.icon-reveal {
  transform: rotate(-90deg) scale(0.5);
  opacity: 0;
  transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.visible .icon-reveal {
  transform: rotate(0) scale(1);
  opacity: 1;
}
```

---

## Step Connector Pulse

Horizontal lines between process steps that fade in after the parent staggers.

```css
.step-connector::after {
  width: 1.5rem; height: 2px;
  background: linear-gradient(90deg, #9775FA, transparent);
  opacity: 0;
  transition: opacity 0.5s ease 0.4s;
}
.stagger.visible .step-connector::after { opacity: 1; }
```

---

## Step Badge Pulse

Step numbers scale in with a bounce.

```css
@keyframes step-pulse {
  0% { transform: scale(0.5); opacity: 0; }
  60% { transform: scale(1.15); }
  100% { transform: scale(1); opacity: 1; }
}
/* 0.6s, cubic-bezier spring */
```

---

## Glow Border Sweep (Mobile)

Single-sweep animation when card enters viewport on touch devices.

```css
@keyframes glow-border-sweep {
  0% { --border-angle: 0deg; opacity: 0; }
  20% { opacity: 1; }
  80% { opacity: 1; }
  100% { --border-angle: 360deg; opacity: 0; }
}
/* 2s duration */
```

---

## Reduced Motion

When `prefers-reduced-motion: reduce` is active:

- All reveals show immediately (no animation)
- Typewriter shows first word statically
- Marquee stops scrolling
- Card lift/press disabled
- Particles hidden
- All continuous animations stopped
- Bar fills show target width instantly
- Cursor glow and touch ripple hidden

---

## Performance Notes

- **GPU optimization**: All animations use `transform` and `opacity` only
- **will-change**: Applied to marquee, scroll progress, cursor glow
- **Visibility gating**: Particles pause when hero is off-screen via IntersectionObserver
- **Page visibility**: All animations pause when tab is hidden (`visibilitychange`)
- **RAF throttling**: Carousel scroll and cursor glow use `requestAnimationFrame` for smooth updates
- **requestIdleCallback**: Hero font sizing deferred to idle time
- **Debounced resize**: Canvas resize throttled to 150ms
