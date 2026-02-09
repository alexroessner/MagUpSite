# AGENTS.md for MagUpUS

PDF-driven white-label website generator. Takes a PDF document and a
reference URL, extracts content and design, merges them, and generates
a professional static site.

## About This Project

- Two-stream pipeline: PDF extraction (content) + web scraping (design)
- Merge step synthesizes both streams into a unified site blueprint
- Static site built with Eleventy (11ty) and Tailwind CSS v4
- See `README.md` for setup and commands
- See `TODO.md` for current tasks
- See `/style-guide/` page for design principles and patterns

## Pipeline Overview

```
PDF → extract → raw-extract.json ─┐
                                   ├→ merge → merged-blueprint.json → build → dist/
URL → scrape → scraped-styles.json┘
```

Run the full pipeline: `npm run pipeline`
Run individual steps: `npm run extract`, `npm run scrape`, `npm run merge`, `npm run build`

## Running Commands

Use `npm run check` (build + lint) or `npm run lint` (lint only) as a
single command instead of running individual linters separately.

Key commands:
- `npm run extract -- --pdf path/to/file.pdf` — Extract content from PDF
- `npm run scrape -- --url https://example.com` — Scrape design from URL
- `npm run merge` — Merge content + design into blueprint
- `npm run build` — Build CSS + Eleventy
- `npm run dev` — Development server with live reload
- `npm run check` — Full build + all linters
- `npm run audit` — Run multi-persona audit checks
- `npm run pipeline` — Full pipeline (extract → scrape → merge → build)

Some commands require specific permissions:
- **`npm install`** — May require elevated permissions for Puppeteer browser download
- **`npm run check`** and **`npm run lint`** — Require permissions for pa11y-ci headless browser
- **`npm run scrape`** — Requires network access and Puppeteer permissions

The dev server (`npm run dev`) must be running before `lint` or `check`
because pa11y-ci and linkinator test against `http://localhost:8080`.

## Principles

- **Two streams, one blueprint.** Content and design are extracted
  independently, then merged by the Synthesizer. Neither stream should
  assume knowledge of the other until merge time.
- **General, not specific.** This is a product, not a one-off project.
  No hardcoded company names, industry assumptions, or content biases.
  Everything flows from the PDF and URL inputs.
- **Build the feedback loop first.** Establish checks (linting, tests, CI)
  on a minimal working state, then introduce changes incrementally.
- **Be proactive about warnings and errors.** When npm, linters, or other
  tools emit warnings, investigate immediately. Explain what's causing
  them and recommend a course of action.
- **Minimize environment differences** between local dev, CI, and
  production. When differences are necessary, make them explicit and
  configurable.
- **Own the coherence of the codebase.** If a new change reveals that a
  previous decision no longer makes sense, say so and fix it. Coherence
  is the job.
- **Debug before delegating.** When a command fails, check env vars,
  paths, configs, and error messages before concluding it needs manual
  intervention.

## Personas

The `personas/` directory contains expert personas that can be activated
in any AI-assisted conversation. Each file is a prompt that changes how
the AI thinks -- not a record of past decisions, but an instruction to
adopt a specific expert's cognitive stance.

### Stream A (Content)
- **[personas/document-analyst.md](personas/document-analyst.md)** — PDF
  structure analysis and data extraction
- **[personas/content-architect.md](personas/content-architect.md)** —
  Information architecture and page structure
- **[personas/copywriter.md](personas/copywriter.md)** — Web content
  adaptation and voice preservation

### Stream B (Design)
- **[personas/style-cloner.md](personas/style-cloner.md)** — Web design
  reverse-engineering and style extraction
- **[personas/brand-interpreter.md](personas/brand-interpreter.md)** —
  Visual identity analysis and design token generation

### Merge & Build
- **[personas/synthesizer.md](personas/synthesizer.md)** — Two-stream
  merger and site blueprint architect
- **[personas/engineer.md](personas/engineer.md)** — Build pipeline,
  tooling, and process discipline

### Quality
- **[personas/accessibility.md](personas/accessibility.md)** — WCAG
  compliance and the automated/perceptual gap
- **[personas/seo.md](personas/seo.md)** — Search optimization, JSON-LD,
  and AI discoverability
- **[personas/target-audience.md](personas/target-audience.md)** —
  Dynamic persona generated from extracted content

Use them by referencing the file (e.g., "you are an expert
@personas/style-cloner.md") when you want the AI to bring that expert's
perspective to the work.

## Design Approach

When changing colors, fonts, or spacing:
1. Update `src/css/input.css` first (source of truth for `@theme` tokens)
2. Update `src/style-guide.njk` to reflect rationale and examples
3. Verify visually on the style guide page (`/style-guide/`)

This project uses Tailwind CSS v4 with CSS-based configuration via
`@theme` in `input.css`. The `tailwind.config.js` file is kept for
reference but is not used.

## Data Flow

```
source-pdf/doc.pdf
  → scripts/extract-pdf.js
  → data/raw-extract.json
  → [AUDIT A: Document Analyst verifies completeness]

reference URL
  → scripts/scrape-styles.js
  → data/scraped-styles.json
  → [AUDIT B: Style Cloner verifies design system]

data/raw-extract.json + data/scraped-styles.json
  → scripts/merge.js
  → data/merged-blueprint.json
  → whitelabel.config.js (updated)
  → src/_data/site.js (updated)
  → src/_data/nav.js (updated)
  → src/_data/pageContent.json (updated)
  → src/css/input.css @theme block (updated)
  → personas/target-audience.md (generated)
  → [AUDIT C: Synthesizer verifies blueprint coherence]

data/merged-blueprint.json
  → npm run build
  → dist/
  → [AUDIT D: All personas review their domain]
```

## Audit Checkpoints

Four mandatory audit gates in the pipeline:

| Gate | When | Primary Persona | Checks |
|------|------|----------------|--------|
| A | Post-extraction | Document Analyst | Content completeness, missing sections, data schema validity |
| B | Post-scrape | Style Cloner + Accessibility | Design system completeness, WCAG contrast on scraped colors |
| C | Post-merge | Synthesizer + Content Architect | Blueprint coherence, content-to-design fit, no empty pages |
| D | Post-build | All personas | HTML valid, CSS clean, a11y passing, links working, SEO correct, brand consistent |

## Git Workflow

### Pre-commit checklist (mandatory, every time)

1. **TODO.md is up to date.** Every completed sub-task has a `[x]` with
   detail. Do this as you finish each sub-task, not in a batch at the end.
2. **Related docs are updated.** If you changed a command, tool, workflow,
   or design decision, check README.md, AGENTS.md, and style-guide.njk.
3. **Ask the developer** to review the commit message before committing.

### Other guidance

- When you encounter a new constraint or learn something about the
  development environment, update AGENTS.md immediately.
- Small, frequent commits following imperative mood subject lines.
