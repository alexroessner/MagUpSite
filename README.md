# MagUpUS

PDF-driven white-label website generator. Extracts content from PDF
documents, scrapes design systems from reference URLs, merges both
streams, and generates professional static sites.

## Quick Start

```bash
npm install
npm run extract -- --pdf source-pdf/company.pdf
npm run scrape -- --url https://example.com
npm run merge
npm run build
npm run dev          # Preview at http://localhost:8080
```

Or run the full pipeline in one command:

```bash
npm run pipeline
```

## How It Works

MagUpUS operates as a two-stream pipeline with a merge step:

```
Stream A (Content)          Stream B (Design)
─────────────────          ──────────────────
PDF document               Reference URL
      │                          │
      ▼                          ▼
 extract-pdf.js            scrape-styles.js
      │                          │
      ▼                          ▼
 raw-extract.json          scraped-styles.json
      │                          │
      └──────────┬───────────────┘
                 ▼
            merge.js
                 │
                 ▼
        merged-blueprint.json
                 │
                 ▼
         Eleventy + Tailwind
                 │
                 ▼
            dist/ (static site)
```

### Stream A: PDF Extraction

The extraction script (`scripts/extract-pdf.js`) parses the PDF and
produces structured data:
- Company identity (name, tagline, description)
- Content sections with hierarchy (headings, paragraphs, lists)
- Tables with semantic structure
- Contact information
- Image references

### Stream B: Style Scraping

The scraping script (`scripts/scrape-styles.js`) visits the reference
URL and extracts the visual design system:
- Color palette (primary, accent, neutral scales)
- Typography (font families, sizes, weights, line-heights)
- Layout patterns (containers, grids, spacing)
- Component patterns (buttons, cards, navigation)
- Brand assets (logo, favicon)

### Merge

The merge script (`scripts/merge.js`) combines both streams into a
unified site blueprint:
- Maps content to design patterns
- Resolves conflicts (tone, volume, coverage)
- Generates navigation structure
- Produces the final design tokens
- Creates the target audience persona

### Build

Standard Eleventy + Tailwind CSS v4 build:
- Tailwind compiles `src/css/input.css` → `src/css/style.css`
- Eleventy builds `src/` → `dist/`

## Development

```bash
npm run dev          # CSS watch + Eleventy serve (localhost:8080)
npm run build        # Production build
npm run check        # Build + all linters
npm run lint         # Linters only (requires dev server running)
npm run audit        # Multi-persona audit checks
```

## Project Structure

```
MagUpUS/
├── .github/workflows/ci.yml    CI/CD pipeline
├── personas/                   AI persona files (10 total)
│   ├── document-analyst.md     PDF structure & extraction
│   ├── style-cloner.md         Web design reverse-engineering
│   ├── content-architect.md    Information architecture
│   ├── brand-interpreter.md    Visual identity & design tokens
│   ├── synthesizer.md          Two-stream merger
│   ├── copywriter.md           Web content adaptation
│   ├── engineer.md             Build pipeline & tooling
│   ├── accessibility.md        WCAG compliance
│   ├── seo.md                  Search & AI discoverability
│   └── target-audience.md      Dynamic (generated per project)
├── scripts/                    Pipeline scripts
│   ├── extract-pdf.js          Stream A: PDF → structured data
│   ├── scrape-styles.js        Stream B: URL → design system
│   ├── merge.js                Merge: content + design → blueprint
│   ├── generate.js             Orchestrator: full pipeline
│   └── audit.js                Multi-persona quality checks
├── data/                       Intermediate pipeline data
│   ├── raw-extract.json        PDF extraction output
│   ├── scraped-styles.json     Style scraping output
│   └── merged-blueprint.json   Merge output (site blueprint)
├── source-pdf/                 Input PDF documents
├── src/                        Eleventy source
│   ├── _data/                  Global data files
│   │   ├── site.js             Site metadata (from whitelabel config)
│   │   ├── nav.js              Navigation structure
│   │   └── pageContent.json    Structured content for templates
│   ├── _includes/              Layout templates
│   │   ├── base.njk            Master layout (head, header, nav, footer)
│   │   └── page.njk            Interior page layout (prose wrapper)
│   ├── css/input.css           Tailwind v4 theme (@theme tokens)
│   ├── images/                 Site images
│   ├── pdf/                    PDF assets
│   ├── index.njk               Homepage template
│   ├── style-guide.njk         Living design system reference
│   ├── sitemap.njk             XML sitemap
│   ├── robots.txt.njk          Robots file
│   ├── llms.txt.njk            AI discoverability (short)
│   └── llms-full.txt.njk       AI discoverability (extended)
├── whitelabel.config.js        Brand identity configuration
├── eleventy.config.js          Eleventy configuration
├── AGENTS.md                   AI assistant instructions
├── TODO.md                     Task tracking
└── README.md                   This file
```

## Design System

The site's visual design is configured in two places:

1. **`src/css/input.css`** — Source of truth for design tokens in the
   `@theme` block (colors, fonts, spacing). Updated by the merge script.

2. **`/style-guide/`** — Living reference showing all tokens, components,
   and rationale. Run `npm run dev` and visit
   http://localhost:8080/style-guide/

This project uses Tailwind CSS v4 with CSS-based `@theme` configuration.
The `tailwind.config.js` file is kept for reference but is not used.

## Audit System

Four audit gates run at pipeline boundaries:

| Gate | Phase | What It Checks |
|------|-------|---------------|
| A | Post-extraction | Content completeness against source PDF |
| B | Post-scrape | Design system completeness, WCAG contrast |
| C | Post-merge | Blueprint coherence, content-design fit |
| D | Post-build | HTML, CSS, a11y, links, SEO, brand consistency |

Run all audits: `npm run audit`

## Working With AI

This project uses an AI persona system for consistent quality across
sessions. See `AGENTS.md` for full details and `personas/` for the
persona files. Each persona changes how the AI *thinks* about the work
-- what it notices, what it pushes back on, what it raises unprompted.

## Git Workflow

- Small, frequent commits with imperative mood subject lines
- Keep these files in sync when making changes:
  - `TODO.md` — as tasks are completed or plans change
  - `README.md` — developer instructions and documentation
  - `AGENTS.md` — AI assistant instructions
  - `src/style-guide.njk` — when design decisions change
