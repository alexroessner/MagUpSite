# FINAL SEPARATION PLAN
## Complete MagUpSite Standalone + DeckSiteAgent Cleanup

**Status:** Ready for Execution
**Created:** 2026-02-11
**Critical Requirements:**
- ✅ MagUpSite: ZERO changes, minimal downtime, same URL
- ✅ MagUpSite: All docs, files, and information centralized in one repo
- ✅ Three.js: Always included (confirmed)
- ✅ Schema fields: enrich.js approach (confirmed)
- ✅ Phase 4: Incremental scope (approved)
- ✅ docs/: Investigated - REMOVE (stale build artifacts)

---

## INVESTIGATION RESULTS: docs/ Directory

### What I Found:
1. **Eleventy config** (line 29): `output: "dist"` — builds to `dist/`, not `docs/`
2. **docs/index.html exists**: Contains GEO 42 site with `/MagUpSite/` path prefix
3. **dist/ doesn't exist**: Not currently built
4. **CI workflow**: Builds to `dist/` with `PATH_PREFIX=/MagUpSite/` (line 69)

### Conclusion:
**docs/ is stale build artifacts from an earlier deployment strategy.**

Current build process:
```
npm run build → dist/ (via Eleventy)
CI deploys dist/ → MagUpSite repo
```

docs/ is not used and should be removed.

---

## ARCHITECTURAL DECISIONS CONFIRMED

### 1. Three.js: Always Included ✅
**User decision:** Always included (not opt-in)

**Implementation:**
- Keep all Three.js scenes in templates
- Bundle size is acceptable (400KB total)
- Every generated site gets 3D hero, flywheel, particles
- Future optimization: lazy load Three.js below the fold

**Phase 3 impact:**
- No fallback hero needed
- Three.js stays in templates
- Templates become data-driven but keep 3D

---

### 2. Missing Schema Fields: enrich.js Approach ✅
**Confirmed correct approach.**

**Why this is right:**
- **merge.js** = Deterministic, pattern-matching, no guessing
  - Produces: identity, hero, about, services, team, contact, custom_sections, tables
  - Reliable, fast, works offline

- **enrich.js** (Phase 4) = LLM inference for complex fields
  - Produces: roadmap, industries, faqs, stats, methodology, challenges, case_studies
  - Optional, slow, requires API key
  - Only runs if explicitly requested: `npm run enrich`

**Why NOT enhance merge.js:**
- Adding heuristics for FAQs/roadmap = brittle pattern matching
- False positives would be common (seeing "Q:" in unrelated text)
- LLM is better at understanding context

**Phase 3 implementation:**
```njk
{# Templates handle optional fields gracefully #}
{% if pageContent.faqs and pageContent.faqs.length > 0 %}
  <section id="faq">
    {% for faq in pageContent.faqs %}
      <div class="faq-item">
        <h3>{{ faq.question }}</h3>
        <p>{{ faq.answer }}</p>
      </div>
    {% endfor %}
  </section>
{% endif %}

{# If faqs missing, section doesn't render — no broken page #}
```

**Confirmed: This approach is architecturally sound.**

---

## UPDATED REQUIREMENT: MagUpSite Complete Standalone

### User Requirement:
> "make sure all relevant docs, files, and information is centralized in the same magupsite repo"

**This changes the approach from plan.md.**

### Original plan.md Approach:
- Keep GEO 42 in `DeckSiteAgent/examples/geo42/`
- MagUpSite repo = deployed HTML only
- Reference DeckSiteAgent for source files

### New Approach (Per User Requirement):
- **MagUpSite repo = Complete Eleventy project**
- Contains: src/, personas/, audits/, configs, build scripts, CI, everything
- Fully self-contained, can be developed without DeckSiteAgent
- DeckSiteAgent = Clean SaaS engine, no GEO 42 content

### Why This Is Better:
- MagUpSite is truly standalone (not dependent on DeckSiteAgent)
- Clear ownership: MagUpSite team doesn't need DeckSiteAgent access
- DeckSiteAgent is cleaner (pure engine, no client baggage)
- If DeckSiteAgent repo deleted, MagUpSite still works

---

## EXECUTION PLAN (Revised)

### Phase 0: Pre-Flight Checks (30 minutes)

**Actions:**
1. **Clone MagUpSite repo locally**
   ```bash
   cd /tmp
   git clone https://github.com/alexroessner/MagUpSite.git
   cd MagUpSite
   ls -la  # Check current contents
   ```

2. **Verify current MagUpSite deployment**
   - URL: https://alexroessner.github.io/MagUpSite
   - Check if GitHub Pages is serving from:
     - `main` branch / (root)
     - `main` branch /docs
     - `gh-pages` branch

3. **Document current state**
   - Take screenshots of live site
   - Record current commit SHA
   - Note GitHub Pages settings

**Goal:** Understand exactly how MagUpSite is deployed before touching anything.

---

### Phase 1: Freeze DeckSiteAgent CI (15 minutes)

**Goal:** Stop DeckSiteAgent from pushing to MagUpSite (zero risk)

**Actions:**
1. **Disable CI deployment to MagUpSite**
   ```yaml
   # .github/workflows/ci.yml lines 64-94
   # Comment out entire section:
   # --- Deploy to MagUpSite repo (DISABLED) ---
   ```

2. **Remove hardcoded URLs**
   ```javascript
   // whitelabel.config.js line 34
   siteUrl: process.env.SITE_URL || "http://localhost:8080",

   // scripts/merge.js line 318
   siteUrl: config.siteUrl || process.env.SITE_URL || "",
   ```

3. **Test DeckSiteAgent CI**
   ```bash
   git commit -m "Decouple MagUpSite from CI"
   git push origin main
   # Verify CI runs but doesn't deploy to MagUpSite
   ```

**Result:**
- ✅ MagUpSite unchanged (still live at same URL)
- ✅ DeckSiteAgent CI no longer touches MagUpSite
- ✅ Zero downtime

**Verification:**
- MagUpSite repo shows no new commits
- Live site at alexroessner.github.io/MagUpSite unchanged

---

### Phase 2: Copy Everything to MagUpSite Repo (2 hours)

**Goal:** MagUpSite becomes complete, self-contained Eleventy project

**Files to copy from DeckSiteAgent to MagUpSite:**

```bash
# From DeckSiteAgent → to MagUpSite

# SOURCE FILES (complete Eleventy project)
src/                        → src/
eleventy.config.js          → eleventy.config.js
tailwind.config.js          → tailwind.config.js
whitelabel.config.js        → whitelabel.config.js
package.json                → package.json (updated)
package-lock.json           → package-lock.json

# BUILD SCRIPTS
scripts/audit.js            → scripts/audit.js
# Note: NOT copying pipeline scripts (extract, scrape, merge)

# CI/CD
.github/workflows/ci.yml    → .github/workflows/deploy.yml (modified)

# DOCUMENTATION
README.md                   → README.md (rewritten for MagUpSite)
AGENTS.md                   → AGENTS.md
personas/                   → personas/
audits/                     → audits/

# DATA (hand-crafted GEO 42 content)
data/merged-blueprint.json  → data/merged-blueprint.json (if exists)
src/_data/pageContent.json  → src/_data/pageContent.json

# CONFIGURATION
.gitignore                  → .gitignore (updated)
.prettierrc                 → .prettierrc (if exists)
.eslintrc                   → .eslintrc (if exists)
```

**DO NOT copy:**
- ❌ `scripts/extract-pdf.js` (pipeline-specific)
- ❌ `scripts/scrape-styles.js` (pipeline-specific)
- ❌ `scripts/merge.js` (pipeline-specific)
- ❌ `scripts/generate.js` (pipeline-specific)
- ❌ `MASTER-PLAN.md` (DeckSiteAgent roadmap)
- ❌ `ARCHITECTURE-CLARITY.md` (DeckSiteAgent architecture)
- ❌ `plan.md` (DeckSiteAgent plan)
- ❌ `PLAN-ADDENDUM.md` (DeckSiteAgent planning)

---

**Modified files for MagUpSite:**

#### `package.json`
```json
{
  "name": "magupsite",
  "version": "1.0.0",
  "description": "GEO 42 Marketing Website",
  "repository": {
    "type": "git",
    "url": "https://github.com/alexroessner/MagUpSite.git"
  },
  "scripts": {
    "dev": "npx eleventy --serve",
    "build": "npm run clean && npm run build:css && npm run build:11ty",
    "build:css": "npx @tailwindcss/cli -i ./src/css/input.css -o ./src/css/style.css --minify",
    "build:11ty": "npx eleventy",
    "clean": "rm -rf dist",
    "check": "npm run build && npm run lint",
    "lint": "npm run lint:html && npm run lint:css && npm run lint:links && npm run lint:a11y",
    "lint:html": "npx htmlhint dist/**/*.html",
    "lint:css": "npx stylelint 'src/css/**/*.css'",
    "lint:links": "npx linkinator dist/ --recurse --skip 'localhost|127.0.0.1'",
    "lint:a11y": "npx pa11y-ci dist/**/*.html",
    "audit": "node scripts/audit.js --gate ALL"
  },
  "dependencies": {},
  "devDependencies": {
    "@11ty/eleventy": "^3.1.2",
    "@tailwindcss/cli": "^4.1.18",
    "htmlhint": "^1.1.4",
    "linkinator": "^6.0.4",
    "pa11y-ci": "^3.1.0",
    "stylelint": "^16.2.1",
    "three": "^0.160.0"
  }
}
```

#### `README.md`
```markdown
# MagUpSite — GEO 42 Marketing Website

**Live Site:** https://alexroessner.github.io/MagUpSite
**Status:** ✅ Production

## About

Official marketing website for GEO 42, the AI visibility platform that helps enterprise brands become the definitive answer across ChatGPT, Perplexity, Gemini, and other generative engines.

## Features

- 🎨 Premium glassmorphism design
- 🌐 23 pages (services, case studies, methodology)
- 🎬 Three.js 3D interactive scenes
- ♿ WCAG 2.1 AA accessible
- 🔍 SEO optimized with structured data
- 📱 Fully responsive

## Tech Stack

- **Static Site Generator:** Eleventy 3.1.2
- **Styling:** Tailwind CSS 4.1.18
- **3D Graphics:** Three.js
- **Deployment:** GitHub Pages
- **CI/CD:** GitHub Actions

## Development

### Setup
```bash
git clone https://github.com/alexroessner/MagUpSite.git
cd MagUpSite
npm install
```

### Local Development
```bash
npm run dev
# Opens at http://localhost:8080
```

### Build
```bash
npm run build
# Output: dist/
```

### Quality Checks
```bash
npm run check   # Full build + linters
npm run audit   # Persona-based audit
```

## Project Structure

```
MagUpSite/
├── src/                    # Source files
│   ├── index.njk           # Homepage
│   ├── _includes/          # Layouts
│   ├── _data/              # Content data
│   ├── css/                # Styles
│   ├── js/                 # JavaScript (Three.js)
│   └── images/             # Images
├── dist/                   # Built site (generated)
├── personas/               # AI persona context
├── audits/                 # Quality reports
├── scripts/                # Build scripts
└── package.json
```

## Personas

This site was built with AI-assisted development using 11 expert personas:
- Document Analyst, Content Architect, Copywriter
- Style Cloner, Brand Interpreter, Synthesizer
- Engineer, Accessibility Specialist, SEO Specialist
- 3D Graphics Specialist, Target Audience

See `personas/` for context files that can be used with Claude for maintaining consistency.

## Deployment

Automatically deploys to GitHub Pages via GitHub Actions on push to `main`.

**Production URL:** https://alexroessner.github.io/MagUpSite

## History

Built as pilot project for DeckSiteAgent (autonomous website generator).
Now maintained as standalone production site.

## License

Proprietary — © 2025-2026 GEO 42. All rights reserved.

## Contact

- **Email:** hello@geo42.ai
- **Website:** https://www.geo42.ai
```

#### `.github/workflows/deploy.yml`
```yaml
name: Deploy MagUpSite

on:
  push:
    branches: [main]
  workflow_dispatch:

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

      - name: Run linters
        run: npm run lint
        continue-on-error: true

      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
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
    needs: deploy
    runs-on: ubuntu-latest
    steps:
      - name: Wait for propagation
        run: sleep 15

      - name: Verify live site
        run: |
          STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://alexroessner.github.io/MagUpSite/)
          echo "HTTP status: $STATUS"
          [ "$STATUS" = "200" ]
```

---

**Commit and push to MagUpSite:**
```bash
cd /path/to/MagUpSite
git add .
git commit -m "Add complete source files and build system

Makes MagUpSite a fully standalone Eleventy project.

Includes:
- Complete src/ directory
- Build configs (Eleventy, Tailwind)
- CI/CD workflow (GitHub Actions)
- Personas and audit documentation
- Development scripts

MagUpSite is now independent of DeckSiteAgent and can be
developed, built, and deployed without any external dependencies.

https://alexroessner.github.io/MagUpSite"

git push origin main
```

**Verify:**
- GitHub Actions runs for MagUpSite
- Site rebuilds from its own source
- Live at https://alexroessner.github.io/MagUpSite (same URL)
- **ZERO visual changes** to the live site

---

### Phase 3: Clean DeckSiteAgent (1 hour)

**Goal:** Remove all GEO 42-specific content from DeckSiteAgent

**Files to remove:**
```bash
# Remove source files (now in MagUpSite)
rm -rf src/
rm eleventy.config.js
rm tailwind.config.js
rm whitelabel.config.js

# Remove build scripts (keep pipeline scripts)
rm scripts/audit.js

# Remove docs/ directory (stale artifacts)
rm -rf docs/

# Remove audits (now in MagUpSite)
rm -rf audits/

# Keep these in DeckSiteAgent:
# ✅ scripts/extract-pdf.js, scrape-styles.js, merge.js, generate.js
# ✅ personas/ (shared between both projects)
# ✅ MASTER-PLAN.md, ARCHITECTURE-CLARITY.md, plan.md
```

**Update `.gitignore`:**
```
# Build outputs
dist/
docs/  # Don't commit built sites

# Dependencies
node_modules/

# Data (generated by pipeline)
data/*.json

# Logs
*.log
```

**Update `README.md` for DeckSiteAgent:**
```markdown
# DeckSiteAgent

Autonomous website and presentation generator powered by AI personas.

## What It Does

Transforms PDFs and company data into professional websites and pitch decks
using a two-stream pipeline (content + design) and 11-persona quality control.

## Proof of Concept

**MagUpSite** (https://github.com/alexroessner/MagUpSite) was built as the
pilot project. It demonstrates the quality DeckSiteAgent aims to achieve autonomously.

Study MagUpSite to understand:
- Template patterns and structure
- Persona-driven development workflow
- Quality standards and outputs

## Architecture

```
PDF + URL → extract → scrape → merge → enrich (LLM) → build → deploy
                                            ↑
                                       11 personas
```

## Current Status

**Phase 0:** Foundation ✅
- Pipeline architecture designed
- 11 personas defined
- Pilot site (MagUpSite) completed

**Phase 1:** Autonomous Generation (Next)
- Genericize templates
- Wire personas into pipeline
- Multi-format export

See `MASTER-PLAN.md` for complete roadmap.

## Installation

```bash
git clone https://github.com/alexroessner/DeckSiteAgent.git
cd DeckSiteAgent
npm install
```

## Usage (Current — Manual)

```bash
npm run extract -- --pdf document.pdf    # Extract content
npm run scrape -- --url https://site.com # Scrape design
npm run merge                            # Merge streams
npm run generate                         # Generate site
```

## License

Proprietary — © 2025-2026 MagUpUS. All rights reserved.
```

**Update `package.json`:**
```json
{
  "name": "decksiteagent",
  "version": "0.1.0",
  "description": "Autonomous website and presentation generator",
  "repository": {
    "type": "git",
    "url": "https://github.com/alexroessner/DeckSiteAgent.git"
  },
  "scripts": {
    "extract": "node scripts/extract-pdf.js",
    "scrape": "node scripts/scrape-styles.js",
    "merge": "node scripts/merge.js",
    "generate": "node scripts/generate.js",
    "pipeline": "npm run extract && npm run scrape && npm run merge && npm run generate",
    "test": "echo 'No tests yet' && exit 0"
  },
  "dependencies": {
    "@anthropic-ai/sdk": "^0.30.0",
    "puppeteer": "^22.0.0"
  },
  "devDependencies": {}
}
```

**Commit and push:**
```bash
cd /path/to/DeckSiteAgent
git add .
git commit -m "Remove GEO 42 content, clean for SaaS engine development

All GEO 42 source files, configs, and documentation moved to MagUpSite repo.

DeckSiteAgent is now a clean slate for building the autonomous
generation engine.

Removed:
- src/ directory (Eleventy templates)
- Build configs (eleventy.config.js, tailwind.config.js, whitelabel.config.js)
- docs/ directory (stale build artifacts)
- scripts/audit.js (moved to MagUpSite)
- audits/ directory (moved to MagUpSite)

Kept:
- Pipeline scripts (extract, scrape, merge, generate)
- Personas (shared reference)
- Planning documents (MASTER-PLAN, etc.)

DeckSiteAgent is ready for Phase 1-6 development."

git push origin main
```

---

### Phase 4: Verification (30 minutes)

**Goal:** Confirm both repos work independently

#### MagUpSite Verification:
```bash
cd /path/to/MagUpSite
rm -rf node_modules dist
npm install
npm run build
npm run dev

# Check:
# - Site builds without errors
# - All pages load at localhost:8080
# - Three.js scenes work
# - No broken links or images
# - No references to DeckSiteAgent
```

#### DeckSiteAgent Verification:
```bash
cd /path/to/DeckSiteAgent
rm -rf node_modules

# Check:
# - No src/ directory
# - No eleventy.config.js
# - No GEO 42 references
# - Pipeline scripts still present
# - Personas still present
```

#### Live Site Verification:
- Visit: https://alexroessner.github.io/MagUpSite
- **MUST BE IDENTICAL** to before (zero visual changes)
- Check all 23 pages
- Verify Three.js scenes load
- Check mobile responsiveness
- Run Lighthouse audit

---

## CRITICAL SUCCESS CRITERIA

### MagUpSite:
- ✅ **Zero visual changes** to live site
- ✅ **Same URL** (https://alexroessner.github.io/MagUpSite)
- ✅ **All files centralized** in MagUpSite repo
- ✅ **Fully standalone** (no DeckSiteAgent dependency)
- ✅ **Can be built independently** (`npm install && npm run build`)
- ✅ **CI/CD works** (deploys from MagUpSite repo)
- ✅ **Minimal downtime** (<5 minutes during transition)

### DeckSiteAgent:
- ✅ **Clean** (no GEO 42 content)
- ✅ **Pipeline scripts work** (extract, scrape, merge, generate)
- ✅ **Personas accessible** (for reference/documentation)
- ✅ **Ready for Phase 1-6** (genericization, persona integration, etc.)

---

## ROLLBACK PLAN

If anything breaks:

### MagUpSite breaks:
```bash
cd /path/to/MagUpSite
git reset --hard HEAD^1  # Undo last commit
git push --force origin main
```

### DeckSiteAgent breaks:
```bash
cd /path/to/DeckSiteAgent
git reset --hard HEAD^1  # Undo last commit
git push --force origin main
```

### Live site goes down:
- MagUpSite repo still has old deployed files
- GitHub Pages will keep serving until new deploy succeeds
- Max downtime: time for CI to rebuild (~2-3 minutes)

---

## TIMELINE

| Phase | Duration | Description |
|-------|----------|-------------|
| 0. Pre-flight | 30 min | Check current state |
| 1. Freeze CI | 15 min | Decouple DeckSiteAgent |
| 2. Copy to MagUpSite | 2 hours | Make MagUpSite standalone |
| 3. Clean DeckSiteAgent | 1 hour | Remove GEO 42 content |
| 4. Verification | 30 min | Test both repos |
| **Total** | **4-5 hours** | Complete separation |

---

## POST-SEPARATION STATE

### MagUpSite Repository (Complete Project)
```
MagUpSite/
├── src/                    # All source files
├── personas/               # Persona context
├── audits/                 # Quality reports
├── scripts/                # Build scripts
├── .github/workflows/      # CI/CD
├── eleventy.config.js
├── tailwind.config.js
├── whitelabel.config.js
├── package.json
└── README.md
```
**Status:** ✅ Production-stable, fully standalone

---

### DeckSiteAgent Repository (Clean Engine)
```
DeckSiteAgent/
├── scripts/                # Pipeline only
│   ├── extract-pdf.js
│   ├── scrape-styles.js
│   ├── merge.js
│   └── generate.js
├── personas/               # Shared reference
├── MASTER-PLAN.md          # Roadmap
├── ARCHITECTURE-CLARITY.md # Architecture docs
├── plan.md                 # Execution plan
├── PLAN-ADDENDUM.md        # Architectural decisions
├── package.json            # Pipeline dependencies
└── README.md               # SaaS engine docs
```
**Status:** ✅ Clean slate for Phase 1-6

---

## NEXT STEPS AFTER SEPARATION

Once separation is complete and verified:

1. **Begin Phase 1 of plan.md** — Genericize templates (in DeckSiteAgent)
2. **Maintain MagUpSite independently** — Bug fixes, content updates as needed
3. **Reference MagUpSite** — As example while building generic templates
4. **Phase 4 onward** — Wire personas, fix pipeline, document

---

**END OF FINAL SEPARATION PLAN**
