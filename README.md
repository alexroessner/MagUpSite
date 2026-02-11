# GEO 42

The Answer Engine for Enterprise Brands. AI visibility platform website
deployed at [alexroessner.github.io/MagUpSite](https://alexroessner.github.io/MagUpSite/).

## Quick Start

```bash
npm install
npm run build
npm run dev          # Preview at http://localhost:8080
```

## Development

```bash
npm run dev          # CSS watch + Eleventy serve (localhost:8080)
npm run build        # Production build
npm run check        # Build + all linters
npm run audit        # Multi-persona quality audit (gate D)
```

## How Deployment Works

Push to `main` triggers the CI workflow:
1. Build CSS (Tailwind v4) and HTML (Eleventy)
2. Lint HTML and CSS
3. Run accessibility and link checks
4. Run audit (gate D: post-build checks)
5. Deploy to GitHub Pages
6. Smoke test the live URL

GitHub Pages serves the `dist/` output at the repo's Pages URL.

## Where Content Lives

| File | What It Controls |
|------|-----------------|
| `whitelabel.config.js` | Company name, tagline, colors, fonts, contact info |
| `src/_data/pageContent.json` | All page content (hero, about, services, team, etc.) |
| `src/_data/nav.js` | Navigation structure (reads from merged blueprint) |
| `src/_data/site.js` | Global site metadata (reads from whitelabel config) |
| `src/css/input.css` | Design tokens via Tailwind v4 `@theme` block |
| `data/merged-blueprint.json` | Unified site blueprint (content + design merged) |

## Project Structure

```
MagUpSite/
├── .github/workflows/ci.yml    Build & deploy pipeline
├── brand-book/                  Design system documentation
├── personas/                    AI expert personas (11 total)
├── scripts/
│   └── audit.js                 Multi-gate quality audit
├── data/                        Site blueprint data
│   ├── merged-blueprint.json    Unified content + design blueprint
│   ├── raw-extract.json         Original PDF extraction
│   └── scraped-styles.json      Design system from reference URL
├── src/                         Eleventy source
│   ├── _data/                   Global data (site.js, nav.js, pageContent.json)
│   ├── _includes/               Layouts (base.njk, page.njk)
│   ├── css/input.css            Tailwind v4 theme + custom CSS
│   ├── js/                      Three.js animations + scroll effects
│   ├── index.njk                Homepage (23 sections)
│   ├── about.njk                About page
│   ├── services.njk             Services page
│   ├── contact.njk              Contact page
│   ├── team.njk                 Team page
│   ├── sections.njk             Content sections
│   └── style-guide.njk          Living design reference
├── audits/                      Audit history
├── whitelabel.config.js         Brand configuration
├── eleventy.config.js           Eleventy configuration
└── tailwind.config.js           Tailwind reference (v4 uses CSS config)
```

## Design System

Design tokens live in `src/css/input.css` via Tailwind v4's `@theme` block.
The `/style-guide/` page is a living reference showing all tokens, components,
and rationale.

The `brand-book/` directory documents the full design system: colors,
typography, components, animations, layout patterns, and brand voice.

## Personas

The `personas/` directory contains 11 expert personas that guide quality.
Each persona is a prompt that adopts a specific expert's cognitive stance
for AI-assisted maintenance:

- **Document Analyst** / **Content Architect** / **Copywriter** — content quality
- **Style Cloner** / **Brand Interpreter** / **3D Graphics** — visual design
- **Synthesizer** — content-design coherence
- **Engineer** — build pipeline and tooling
- **Accessibility** / **SEO** / **Target Audience** — quality gates

## Audit System

Gate D (post-build) checks HTML validity, CSS quality, accessibility,
links, SEO, and brand consistency:

```bash
npm run audit                    # Run all gate D checks
node scripts/audit.js --gate D   # Same thing, explicit
```
