# MagUpSite: Full Source Setup Instructions

## Context

You are working in the `alexroessner/MagUpSite` repository. This repo currently contains **only built HTML/CSS/JS artifacts** on its `main` branch, force-pushed there by DeckSiteAgent's CI pipeline. GitHub Pages serves these static files at `https://alexroessner.github.io/MagUpSite/`.

**Your job:** Turn MagUpSite into a complete, rebuildable Eleventy project with all source files, so it can be independently maintained, modified, and redeployed — without any dependency on DeckSiteAgent.

**Critical constraint:** The live site at `alexroessner.github.io/MagUpSite/` must not go down or change visually at any point during this process.

---

## Strategy

1. Create a new branch (e.g. `source`) for the source-based project
2. Add all source files, configs, and build tooling
3. Add a CI workflow that builds and deploys to GitHub Pages
4. Verify the build output matches the current live site
5. Merge to `main` (this replaces the artifact-only main with a full project)
6. GitHub Pages CI rebuilds and redeploys — identical output

**Why this is safe:** The built output will be identical because you're using the exact same source files, configs, and build commands. The only change is that `main` now also contains source files alongside the build process that produces the same output.

---

## Step 1: Project Root Files

Create these files at the repo root:

### `package.json`

```json
{
  "name": "magupsite",
  "version": "1.0.0",
  "private": true,
  "description": "GEO 42 — The Answer Engine for Enterprise Brands. AI visibility platform website.",
  "scripts": {
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
    "audit": "node scripts/audit.js"
  },
  "devDependencies": {
    "@11ty/eleventy": "^3.1.2",
    "@tailwindcss/cli": "^4.1.18",
    "@tailwindcss/typography": "^0.5.19",
    "html-validate": "^10.7.0",
    "linkinator": "^7.5.3",
    "npm-run-all": "^4.1.5",
    "pa11y-ci": "^4.0.1",
    "stylelint": "^17.1.1",
    "stylelint-config-standard": "^40.0.0",
    "tailwindcss": "^4.1.18"
  }
}
```

**Note:** This removes `pdf-parse`, `puppeteer-core`, and `cheerio` — those are DeckSiteAgent pipeline dependencies, not needed for building the site. Also removes `extract`, `scrape`, `merge`, `generate`, and `pipeline` scripts.

### `eleventy.config.js`

```js
const fs = require("fs");
const path = require("path");

module.exports = function (eleventyConfig) {
  // Copy static assets
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/pdf");
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

### `whitelabel.config.js`

```js
// White-label configuration for GEO 42
// This is the production config — edit values here to change the site.

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

**Note:** `siteUrl` is hardcoded to the MagUpSite URL (not env var). This is the production site.

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

## Step 2: Source Files (src/)

Copy **every file** from DeckSiteAgent's `src/` directory. The complete file list:

### Templates (src/*.njk)
```
src/404.njk
src/about.njk
src/contact.njk
src/index.njk              ← 85KB, the main homepage
src/llms-full.txt.njk
src/llms.txt.njk
src/robots.txt.njk
src/sections.njk
src/services.njk
src/sitemap.njk
src/style-guide.njk
src/team.njk
```

### Includes (src/_includes/)
```
src/_includes/base.njk     ← 16KB, base HTML layout
src/_includes/page.njk     ← 820B, content page wrapper
```

### Data (src/_data/)
```
src/_data/nav.js           ← Navigation structure
src/_data/site.js          ← Global metadata (reads whitelabel.config.js)
src/_data/pageContent.json ← 24KB, ALL page content
```

### CSS
```
src/css/input.css          ← 41KB, Tailwind v4 @theme + all custom CSS
```

### JavaScript
```
src/js/animations.js       ← Scroll animations, cursor effects
src/js/three-hero.js       ← Three.js hero scene
src/js/three-flywheel.js   ← Three.js flywheel visualization
src/js/three-cta.js        ← Three.js CTA particles
```

### Static assets
```
src/favicon.svg
src/images/og-image.svg
src/robots.txt             ← Static robots.txt (alongside the .njk template)
```

**Copy these exactly as-is.** Do not modify any content. The templates contain GEO 42-specific content — that's correct, this IS the GEO 42 site.

---

## Step 3: Data Files (data/)

Copy from DeckSiteAgent:

```
data/raw-extract.json        ← 28.7KB, original PDF extraction data
data/scraped-styles.json     ← 4.1KB, design system data from reference URL
data/merged-blueprint.json   ← 43.9KB, unified site blueprint
```

The `merged-blueprint.json` is used by `eleventy.config.js` and `nav.js` at build time. It must be present. Note: `.gitignore` excludes `data/merged-blueprint.json` — for MagUpSite, **remove that line from `.gitignore`** since this file needs to be committed (it won't be regenerated by a pipeline here).

---

## Step 4: Personas (personas/)

Copy all 11 persona files from DeckSiteAgent:

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

These serve as expert guidance for anyone maintaining the site — human or AI.

---

## Step 5: Audit Script (scripts/)

Copy only the audit script — the pipeline scripts (extract, scrape, merge, generate) are not needed:

```
scripts/audit.js            ← 9.7KB, multi-gate quality audit
```

---

## Step 6: Audit History (audits/)

Copy the full audit history directory:

```
audits/agent-discourse-2026-02-10/00-unified-summary.md
audits/agent-discourse-2026-02-10/01-accessibility-specialist.md
audits/agent-discourse-2026-02-10/02-brand-interpreter.md
audits/agent-discourse-2026-02-10/03-content-architect.md
audits/agent-discourse-2026-02-10/04-copywriter.md
audits/agent-discourse-2026-02-10/05-document-analyst.md
audits/agent-discourse-2026-02-10/06-engineer.md
audits/agent-discourse-2026-02-10/07-seo-specialist.md
audits/agent-discourse-2026-02-10/08-style-cloner.md
audits/agent-discourse-2026-02-10/09-synthesizer.md
audits/agent-discourse-2026-02-10/10-target-audience.md
audits/agent-discourse-2026-02-10/EDIT-LIST.md
audits/agent-discourse-2026-02-10/IMPLEMENTATION-PLAN.md
```

Also copy these root-level discourse files:
```
agent-discourse-002-live-site-review.md
agent-discourse-003-post-differentiation-audit.md
```

---

## Step 7: CI Workflow (.github/workflows/)

Create `.github/workflows/deploy.yml`:

```yaml
name: Build & Deploy

on:
  push:
    branches: [main]
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

      - name: Build site
        run: npm run build
        env:
          PATH_PREFIX: /MagUpSite/
          SITE_URL: https://alexroessner.github.io/MagUpSite

      - name: Lint HTML
        run: npm run lint:html
        continue-on-error: true

      - name: Lint CSS
        run: npm run lint:css
        continue-on-error: true

      - name: Run audit
        run: node scripts/audit.js --gate D
        continue-on-error: true

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

  smoke-test:
    if: github.event_name == 'push'
    needs: deploy
    runs-on: ubuntu-latest
    steps:
      - name: Wait for deployment propagation
        run: sleep 15

      - name: Verify site is live
        run: |
          STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://alexroessner.github.io/MagUpSite/)
          echo "MagUpSite HTTP status: $STATUS"
          [ "$STATUS" = "200" ]
```

**Important:** GitHub Pages must be configured to deploy from "GitHub Actions" (not from a branch). Check Settings > Pages > Build and deployment > Source = "GitHub Actions". If it's currently set to "Deploy from a branch" (main), you'll need to change it. The first CI run after the switch will deploy the newly-built site.

---

## Step 8: Documentation

### `README.md`

Write a README for the GEO 42 site project. It should cover:
- What the site is (GEO 42 AI visibility platform)
- How to build locally (`npm install && npm run build`)
- How to develop (`npm run dev`)
- How deployment works (push to main → CI → GitHub Pages)
- Where content lives (`src/_data/pageContent.json`, `whitelabel.config.js`)
- The persona system for quality guidance
- The audit system (`npm run audit`)

### `AGENTS.md`

Copy the existing AGENTS.md from DeckSiteAgent, but remove pipeline-specific instructions (extract, scrape, merge, generate commands). Keep the persona references, design workflow, pre-commit protocol, and debugging philosophy.

---

## Step 9: .gitignore Adjustment

The DeckSiteAgent `.gitignore` excludes `data/merged-blueprint.json` because it's regenerated by the merge pipeline. In MagUpSite, this file is static and must be committed. **Remove this line from `.gitignore`:**

```diff
- # Intermediate data (regenerated by merge)
- data/merged-blueprint.json
```

---

## Step 10: Verification

After setting everything up, verify:

1. **Build succeeds locally:**
   ```bash
   npm install
   PATH_PREFIX=/MagUpSite/ SITE_URL=https://alexroessner.github.io/MagUpSite npm run build
   ```

2. **Output matches live site:**
   Compare `dist/index.html` against the live site. The HTML structure, content, and asset paths should be identical.

3. **Audit passes:**
   ```bash
   node scripts/audit.js --gate D
   ```

4. **Dev server works:**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:8080` and verify all 23 pages, Three.js scenes, and navigation work.

---

## Step 11: Migration to Main

Once verified:

1. Commit all source files on the `source` branch
2. Open a PR from `source` → `main`
3. **Before merging:** Ensure GitHub Pages is set to deploy from "GitHub Actions" (not "Deploy from a branch")
4. Merge the PR
5. CI builds and deploys — site stays identical
6. Verify live site: `https://alexroessner.github.io/MagUpSite/`

If GitHub Pages is currently set to serve from branch (which it is, since the old CI was pushing built files to main), the transition is:
1. Change Pages source to "GitHub Actions" in repo settings
2. Merge the source branch to main
3. CI triggers, builds, and deploys via the workflow artifact

There may be a brief (~2 min) gap during the Pages source switch. The site will be back as soon as the first CI run completes.

---

## Complete File Manifest

Every file that must exist in MagUpSite after setup:

```
MagUpSite/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── .gitignore
├── .htmlvalidate.json
├── .linkinator.config.json
├── .pa11yci.json
├── .stylelintrc.json
├── AGENTS.md
├── README.md
├── agent-discourse-002-live-site-review.md
├── agent-discourse-003-post-differentiation-audit.md
├── audits/
│   └── agent-discourse-2026-02-10/
│       ├── 00-unified-summary.md
│       ├── 01-accessibility-specialist.md
│       ├── 02-brand-interpreter.md
│       ├── 03-content-architect.md
│       ├── 04-copywriter.md
│       ├── 05-document-analyst.md
│       ├── 06-engineer.md
│       ├── 07-seo-specialist.md
│       ├── 08-style-cloner.md
│       ├── 09-synthesizer.md
│       ├── 10-target-audience.md
│       ├── EDIT-LIST.md
│       └── IMPLEMENTATION-PLAN.md
├── data/
│   ├── merged-blueprint.json
│   ├── raw-extract.json
│   └── scraped-styles.json
├── eleventy.config.js
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
│   └── audit.js
├── src/
│   ├── 404.njk
│   ├── _data/
│   │   ├── nav.js
│   │   ├── pageContent.json
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
└── whitelabel.config.js
```

**Total: 63 files across 12 directories.**

Files deliberately NOT included (DeckSiteAgent-only):
- `scripts/extract-pdf.js` — PDF extraction pipeline
- `scripts/scrape-styles.js` — Web style scraping pipeline
- `scripts/merge.js` — Stream merge pipeline
- `scripts/generate.js` — Pipeline orchestrator
- `MagUp - ENG V9 .pdf` — Source PDF
- `PLAN.md` — DeckSiteAgent product plan
- `TODO.md` — DeckSiteAgent roadmap
- `docs/` — Stale build artifacts
- Pipeline dependencies in package.json (`pdf-parse`, `puppeteer-core`, `cheerio`)
