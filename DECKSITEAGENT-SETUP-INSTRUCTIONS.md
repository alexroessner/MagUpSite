# DeckSiteAgent Pipeline: New Repo Setup Instructions

## Context

You are working in the `alexroessner/MagUpSite` repository. This repo currently contains **only built HTML/CSS/JS artifacts** (the deployed GEO 42 site). It will be **renamed to `DeckSiteAgent`** after setup, becoming the multi-agent PDF-to-website pipeline product.

The GEO 42 source code lives in `alexroessner/DeckSiteAgent` (which will be renamed to `MagUpSite`). You need to copy specific files FROM that repo to build the pipeline product here.

**Your job:** Set up this repo as the DeckSiteAgent pipeline product — a multi-agent system that takes a PDF deck + reference URL and produces a production-ready static website.

---

## Strategy

1. Wipe the current build artifacts (they belong to GEO 42, not this product)
2. Set up the project structure with pipeline scripts, personas, generic templates, and configs
3. Include the GEO 42 data as `examples/geo42/` reference example
4. Verify the pipeline builds successfully
5. Push to main

---

## Step 1: Clean the Repo

The current `main` branch has only built HTML files. Remove everything and start fresh:

```bash
git checkout main
git rm -rf .
```

---

## Step 2: Project Root Files

### `package.json`

```json
{
  "name": "decksiteagent",
  "version": "1.0.0",
  "description": "Multi-agent PDF-to-website pipeline. Extracts content from PDF documents, scrapes design systems from reference URLs, and generates professional static sites.",
  "main": "index.js",
  "scripts": {
    "extract": "node scripts/extract-pdf.js",
    "scrape": "node scripts/scrape-styles.js",
    "merge": "node scripts/merge.js",
    "generate": "node scripts/generate.js",
    "build:css": "npx @tailwindcss/cli -i ./src/css/input.css -o ./src/css/style.css --minify",
    "build:11ty": "npx eleventy",
    "clean": "rm -rf dist",
    "build": "npm run clean && npm run build:css && npm run build:11ty",
    "dev:css": "npx @tailwindcss/cli -i ./src/css/input.css -o ./src/css/style.css --watch",
    "dev:11ty": "npx eleventy --serve",
    "dev": "npm run build:css && npm-run-all --parallel dev:*",
    "lint:html": "html-validate dist/**/*.html",
    "lint:css": "stylelint src/css/input.css",
    "lint:a11y": "pa11y-ci",
    "lint:links": "linkinator http://localhost:8080 --config .linkinator.config.json",
    "lint": "npm run lint:html && npm run lint:css && npm run lint:a11y && npm run lint:links",
    "check": "npm run build && npm run lint",
    "audit": "node scripts/audit.js",
    "pipeline": "npm run extract && npm run scrape && npm run merge && npm run build",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "devDependencies": {
    "@11ty/eleventy": "^3.1.2",
    "@tailwindcss/cli": "^4.1.18",
    "@tailwindcss/typography": "^0.5.19",
    "cheerio": "^1.0.0",
    "html-validate": "^10.7.0",
    "linkinator": "^7.5.3",
    "npm-run-all": "^4.1.5",
    "pa11y-ci": "^4.0.1",
    "pdf-parse": "^1.1.1",
    "puppeteer-core": "^24.37.2",
    "stylelint": "^17.1.1",
    "stylelint-config-standard": "^40.0.0",
    "tailwindcss": "^4.1.18"
  }
}
```

### `eleventy.config.js`

```js
const fs = require("fs");
const path = require("path");

module.exports = function (eleventyConfig) {
  // Copy static assets
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/css/style.css");
  eleventyConfig.addPassthroughCopy({ "src/favicon.svg": "favicon.svg" });
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy({ "src/robots.txt": "robots.txt" });

  // Load merged blueprint if it exists, otherwise use defaults
  const blueprintPath = path.join(__dirname, "data", "merged-blueprint.json");
  if (fs.existsSync(blueprintPath)) {
    const blueprint = JSON.parse(fs.readFileSync(blueprintPath, "utf-8"));
    eleventyConfig.addGlobalData("blueprint", blueprint);
  }

  // Path prefix for deployment (e.g., GitHub Pages subdirectory)
  eleventyConfig.addGlobalData("pathPrefix", process.env.PATH_PREFIX || "/");

  // Current year for copyright notices
  eleventyConfig.addGlobalData("currentYear", new Date().getFullYear());

  return {
    dir: {
      input: "src",
      output: "dist",
      includes: "_includes",
    },
    pathPrefix: process.env.PATH_PREFIX || "/",
  };
};
```

### `whitelabel.config.js` — GENERIC DEFAULTS

```js
// White-label configuration — generic defaults for DeckSiteAgent.
// This file is overwritten by scripts/merge.js when running the pipeline.
// Edit manually to configure a site without running the pipeline.

module.exports = {
  company: {
    name: "",
    tagline: "",
    description: "",
    industry: "",
    founded: "",
  },
  author: {
    name: "",
    email: "",
    jobTitle: "",
  },
  contact: {
    email: "",
    phone: "",
    fax: "",
    url: "",
    address: {},
  },
  colors: {
    primary: "#006699",
    accent: "#CC3300",
  },
  fonts: {
    heading: "Georgia, 'Times New Roman', serif",
    body: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    googleFontsUrl: "",
  },
  siteUrl: process.env.SITE_URL || "",
  pathPrefix: "/",
};
```

### `tailwind.config.js`

```js
// This file is kept for reference only.
// Tailwind CSS v4 uses CSS-based configuration via @theme in src/css/input.css.
// See: https://tailwindcss.com/docs/upgrade-guide#using-css-theme

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{njk,md,html}"],
};
```

### `.gitignore`

```
# Dependencies
node_modules/

# Build output
dist/
src/css/style.css

# Intermediate data (regenerated by pipeline)
data/merged-blueprint.json

# OS files
.DS_Store
Thumbs.db

# Editor files
*.swp
*.swo
*~
.vscode/
.idea/

# Environment
.env
.env.local
```

Note: `data/merged-blueprint.json` IS gitignored here (unlike the GEO 42 repo) because the pipeline regenerates it.

### `.htmlvalidate.json`

```json
{
  "extends": ["html-validate:recommended"],
  "rules": {
    "no-trailing-whitespace": "off",
    "no-inline-style": "off"
  }
}
```

### `.stylelintrc.json`

```json
{
  "extends": "stylelint-config-standard",
  "rules": {
    "at-rule-no-unknown": [
      true,
      {
        "ignoreAtRules": ["theme", "plugin", "import", "tailwind", "apply", "layer"]
      }
    ],
    "import-notation": null,
    "value-keyword-case": null,
    "custom-property-pattern": null,
    "color-hex-length": null,
    "property-no-vendor-prefix": null,
    "length-zero-no-unit": null
  }
}
```

### `.linkinator.config.json`

```json
{
  "recurse": true,
  "skip": [
    "^(?!http://localhost)"
  ],
  "timeout": 10000
}
```

### `.pa11yci.json`

```json
{
  "defaults": {
    "timeout": 30000,
    "wait": 1000,
    "chromeLaunchConfig": {
      "args": ["--no-sandbox", "--disable-setuid-sandbox"]
    }
  },
  "urls": [
    "http://localhost:8080/"
  ]
}
```

---

## Step 3: Pipeline Scripts (scripts/)

Copy ALL 5 scripts from the GEO 42 repo (`alexroessner/DeckSiteAgent`):

```
scripts/extract-pdf.js     ← 10.6KB, PDF content extraction
scripts/scrape-styles.js   ← 16.8KB, web style scraping with 5 sub-agents
scripts/merge.js           ← 17.5KB, two-stream merge + blueprint generation
scripts/generate.js        ← 3.2KB, pipeline orchestrator
scripts/audit.js           ← 9.7KB, 4-gate quality audit system
```

**Important:** In `scripts/merge.js`, the `siteUrl` line should use the env var pattern:

```js
siteUrl: process.env.SITE_URL || "",
```

This should already be the case if copying from the current state of the GEO 42 repo.

---

## Step 4: Personas (personas/)

Copy ALL 11 persona files from the GEO 42 repo:

```
personas/3d-graphics.md
personas/accessibility.md
personas/brand-interpreter.md
personas/content-architect.md
personas/copywriter.md
personas/document-analyst.md
personas/engineer.md
personas/seo.md
personas/style-cloner.md
personas/synthesizer.md
personas/target-audience.md
```

These are the core of the product — the expert personas that guide every pipeline stage.

---

## Step 5: Source Templates (src/)

Copy ALL template files from the GEO 42 repo. These will be **genericized later** (Phase 3 of PLAN.md) but need to exist now for the pipeline to produce output.

### Templates
```
src/404.njk
src/about.njk
src/contact.njk
src/index.njk              ← 85KB homepage (will be genericized in Phase 3)
src/llms-full.txt.njk
src/llms.txt.njk
src/robots.txt.njk
src/sections.njk
src/services.njk
src/sitemap.njk
src/style-guide.njk
src/team.njk
```

### Includes
```
src/_includes/base.njk     ← 16KB base layout (will be genericized in Phase 3)
src/_includes/page.njk
```

### Data
```
src/_data/nav.js
src/_data/site.js
```

**Do NOT copy `src/_data/pageContent.json`** — create a minimal placeholder instead (see Step 7).

### CSS
```
src/css/input.css          ← 41KB, copy as-is (design tokens will be overwritten by merge.js)
```

### JavaScript
```
src/js/animations.js
src/js/three-hero.js
src/js/three-flywheel.js
src/js/three-cta.js
```

### Static Assets
```
src/favicon.svg
src/images/og-image.svg
src/robots.txt
```

---

## Step 6: GEO 42 Example (examples/geo42/)

Create `examples/geo42/` with the GEO 42 data as a working reference example:

```
examples/geo42/
├── raw-extract.json          ← copy from data/raw-extract.json
├── scraped-styles.json       ← copy from data/scraped-styles.json
├── merged-blueprint.json     ← copy from data/merged-blueprint.json
├── whitelabel.config.js      ← copy the GEO 42 version (with hardcoded GEO 42 values)
├── pageContent.json          ← copy from src/_data/pageContent.json
└── README.md
```

### `examples/geo42/README.md`

```markdown
# GEO 42 — Example Project

This directory contains the complete pipeline output from the GEO 42
AI visibility platform project — the first site built with DeckSiteAgent.

## Files

- `raw-extract.json` — Content extracted from the MagUp slide deck (18 slides)
- `scraped-styles.json` — Design system scraped from tryprofound.com
- `merged-blueprint.json` — Unified site blueprint from merge step
- `whitelabel.config.js` — Brand configuration (GEO 42 identity)
- `pageContent.json` — Structured content used by templates

## Usage

To rebuild the GEO 42 site using the pipeline:

\`\`\`bash
cp examples/geo42/raw-extract.json data/
cp examples/geo42/scraped-styles.json data/
node scripts/merge.js
npm run build
\`\`\`

## Live Site

The GEO 42 site is deployed at: https://alexroessner.github.io/MagUpSite/
```

### `examples/geo42/whitelabel.config.js`

This should be the GEO 42-branded version:

```js
module.exports = {
  company: {
    name: "GEO 42",
    tagline: "The Answer Engine for Enterprise Brands",
    description: "GEO 42 is the AI visibility platform that makes your brand the definitive answer across every generative engine — ChatGPT, Perplexity, Gemini, and beyond.",
    industry: "AI Visibility & Generative Engine Optimization",
    founded: "2025",
  },
  author: {
    name: "",
    email: "hello@geo42.ai",
    jobTitle: "",
  },
  contact: {
    email: "hello@geo42.ai",
    phone: "",
    fax: "",
    url: "https://www.geo42.ai",
    address: {},
  },
  colors: {
    primary: "#110B30",
    accent: "#9775FA",
  },
  fonts: {
    heading: "'Space Grotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    body: "InterVariable, Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    mono: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    googleFontsUrl: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap",
  },
  siteUrl: "https://alexroessner.github.io/MagUpSite",
  pathPrefix: "/",
};
```

---

## Step 7: Minimal Placeholder Content

### `src/_data/pageContent.json`

Create a minimal placeholder that the templates can render without errors:

```json
{
  "_schema": "DeckSiteAgent content schema v1. Generated by scripts/merge.js.",
  "company": {
    "name": "",
    "tagline": "",
    "description": "",
    "industry": "",
    "founded": ""
  },
  "hero": {
    "headline": "",
    "subheadline": "",
    "cta_primary": { "text": "Contact Us", "url": "/contact/" },
    "cta_secondary": { "text": "Learn More", "url": "/about/" }
  },
  "about": {
    "title": "About",
    "content": "",
    "highlights": []
  },
  "services": [],
  "team": [],
  "contact": {
    "email": "",
    "phone": "",
    "fax": "",
    "url": "",
    "address": {}
  },
  "testimonials": [],
  "clients": [],
  "certifications": [],
  "custom_sections": [],
  "tables": [],
  "industries": []
}
```

### `data/raw-extract.json` and `data/scraped-styles.json`

Create empty placeholder files:

**`data/raw-extract.json`:**
```json
{}
```

**`data/scraped-styles.json`:**
```json
{}
```

These are generated by the pipeline. They exist as empty files so scripts don't error when checking for them.

---

## Step 8: Documentation

### Copy from GEO 42 repo:
```
AGENTS.md    ← copy as-is (already describes the pipeline product)
README.md    ← copy as-is (already describes DeckSiteAgent)
TODO.md      ← copy as-is (tracks pipeline development tasks)
PLAN.md      ← copy as-is (product roadmap)
```

These files already describe DeckSiteAgent as a pipeline product. They don't need modification.

### Also copy:
```
LICENSE      ← if it exists
```

---

## Step 9: CI Workflow

### `.github/workflows/ci.yml`

```yaml
name: CI

on:
  push:
    branches: [main, 'claude/**']
  pull_request:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build site (no prefix, for linting)
        run: npm run build

      - name: Lint HTML
        run: npm run lint:html
        continue-on-error: true

      - name: Lint CSS
        run: npm run lint:css
        continue-on-error: true

      - name: Start server for a11y and link checks
        run: npx serve dist -l 8080 &
        env:
          CI: true

      - name: Wait for server
        run: sleep 3

      - name: Lint links
        run: npm run lint:links
        continue-on-error: true

      - name: Lint accessibility
        run: npm run lint:a11y
        continue-on-error: true

      - name: Run audit
        run: node scripts/audit.js --gate ALL
        continue-on-error: true

      - name: Build for GitHub Pages
        if: github.event_name == 'push'
        run: npm run build
        env:
          PATH_PREFIX: /${{ github.event.repository.name }}/
          SITE_URL: https://${{ github.repository_owner }}.github.io/${{ github.event.repository.name }}

      - name: Upload Pages artifact
        if: github.event_name == 'push'
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    if: github.event_name == 'push'
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

---

## Step 10: Audit History (Optional)

If you want to preserve the audit history from the GEO 42 development process, copy:

```
audits/agent-discourse-2026-02-10/   ← entire directory (13 files)
agent-discourse-002-live-site-review.md
agent-discourse-003-post-differentiation-audit.md
```

These are optional — they document the development process but aren't needed for the pipeline to function.

---

## Complete File Manifest

Every file that must exist in the DeckSiteAgent repo after setup:

```
DeckSiteAgent/
├── .github/
│   └── workflows/
│       └── ci.yml
├── .gitignore
├── .htmlvalidate.json
├── .linkinator.config.json
├── .pa11yci.json
├── .stylelintrc.json
├── AGENTS.md
├── PLAN.md
├── README.md
├── TODO.md
├── data/
│   ├── raw-extract.json        ← empty placeholder {}
│   └── scraped-styles.json     ← empty placeholder {}
├── eleventy.config.js
├── examples/
│   └── geo42/
│       ├── README.md
│       ├── merged-blueprint.json
│       ├── pageContent.json
│       ├── raw-extract.json
│       ├── scraped-styles.json
│       └── whitelabel.config.js
├── package.json
├── personas/
│   ├── 3d-graphics.md
│   ├── accessibility.md
│   ├── brand-interpreter.md
│   ├── content-architect.md
│   ├── copywriter.md
│   ├── document-analyst.md
│   ├── engineer.md
│   ├── seo.md
│   ├── style-cloner.md
│   ├── synthesizer.md
│   └── target-audience.md
├── scripts/
│   ├── audit.js
│   ├── extract-pdf.js
│   ├── generate.js
│   ├── merge.js
│   └── scrape-styles.js
├── src/
│   ├── 404.njk
│   ├── _data/
│   │   ├── nav.js
│   │   ├── pageContent.json    ← minimal placeholder
│   │   └── site.js
│   ├── _includes/
│   │   ├── base.njk
│   │   └── page.njk
│   ├── about.njk
│   ├── contact.njk
│   ├── css/
│   │   └── input.css
│   ├── favicon.svg
│   ├── images/
│   │   └── og-image.svg
│   ├── index.njk
│   ├── js/
│   │   ├── animations.js
│   │   ├── three-cta.js
│   │   ├── three-flywheel.js
│   │   └── three-hero.js
│   ├── llms-full.txt.njk
│   ├── llms.txt.njk
│   ├── robots.txt
│   ├── robots.txt.njk
│   ├── sections.njk
│   ├── services.njk
│   ├── sitemap.njk
│   ├── style-guide.njk
│   └── team.njk
├── tailwind.config.js
└── whitelabel.config.js       ← generic defaults
```

---

## Verification

After setup:

1. **Build with GEO 42 example data:**
   ```bash
   cp examples/geo42/raw-extract.json data/
   cp examples/geo42/scraped-styles.json data/
   cp examples/geo42/pageContent.json src/_data/pageContent.json
   cp examples/geo42/whitelabel.config.js whitelabel.config.js
   node scripts/merge.js
   npm run build
   ```
   Should produce 29 pages in `dist/`.

2. **Build with empty defaults:**
   ```bash
   # Reset to defaults
   git checkout -- whitelabel.config.js src/_data/pageContent.json
   npm run build
   ```
   Should build without errors (pages will be mostly empty but structurally valid).

3. **Run audit:**
   ```bash
   node scripts/audit.js --gate ALL
   ```

---

## What Happens After Setup

Once both repos are set up and renamed:

- `alexroessner/MagUpSite` = GEO 42 production site (renamed from DeckSiteAgent)
- `alexroessner/DeckSiteAgent` = Pipeline product (renamed from MagUpSite)

Then proceed with PLAN.md:
- **Phase 3:** Genericize templates in the DeckSiteAgent repo (make index.njk, about.njk, etc. data-driven)
- **Phase 4:** Wire personas into pipeline via `scripts/enrich.js` (LLM-powered enrichment)
- **Phase 5:** Fix pipeline scripts (Chrome path, OCR fallback)
- **Phase 6:** Documentation and product identity

---

## Key Differences from GEO 42 Repo

| Aspect | GEO 42 Repo (MagUpSite) | DeckSiteAgent Repo |
|--------|-------------------------|-------------------|
| `whitelabel.config.js` | GEO 42 branded, hardcoded MagUpSite URL | Generic defaults, env var URL |
| `package.json` | No pipeline deps | Has pdf-parse, puppeteer-core, cheerio |
| `scripts/` | Only audit.js | All 5 pipeline scripts |
| `data/` | GEO 42 data (committed) | Empty placeholders (gitignored blueprint) |
| `.gitignore` | Tracks merged-blueprint.json | Ignores merged-blueprint.json |
| `src/_data/pageContent.json` | Full GEO 42 content (24KB) | Minimal placeholder |
| `examples/` | Does not exist | Has examples/geo42/ reference |
| `PLAN.md`, `TODO.md` | Does not exist | Product roadmap |
