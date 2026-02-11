# RELOCATION PLAN: Complete GEO 42 Site Separation
## Moving Everything to MagUpSite Repo

**Status:** 🔴 CRITICAL — Complete Separation Required
**Created:** 2026-02-11
**Goal:** MagUpSite becomes a fully standalone, independent website project

---

## THE VISION

### MagUpSite Repository (Target State)
**What it is:** A complete, self-contained Eleventy website project for GEO 42

**Contains:**
- ✅ All source files (`src/` directory)
- ✅ Build configuration (`package.json`, `eleventy.config.js`, `tailwind.config.js`)
- ✅ All content (`pageContent.json`, images, fonts, etc.)
- ✅ Build tooling (scripts, linters, CI/CD)
- ✅ Documentation (README, setup guide)
- ✅ Git history (standalone development)

**Can be:**
- Cloned and built independently
- Developed without any DeckSiteAgent dependency
- Deployed to any hosting provider
- Maintained by someone who's never heard of DeckSiteAgent

**Status:** Production-stable, actively maintained

---

### DeckSiteAgent Repository (Target State)
**What it is:** A SaaS product engine for generating websites/decks for NEW clients

**Does NOT contain:**
- ❌ GEO 42-specific templates
- ❌ GEO 42 content or branding
- ❌ MagUpSite deployment configs
- ❌ GEO 42 as a "client workspace"

**Contains:**
- ✅ Pipeline scripts (extract, scrape, merge, generate)
- ✅ Persona system (11 AI agents)
- ✅ Generic template starters (marketing-site, pitch-deck, etc.)
- ✅ API integrations (Anthropic, data sources)
- ✅ Multi-client orchestration
- ✅ Reference documentation linking to MagUpSite as an example

**Status:** Clean slate for building the autonomous generation engine

---

## WHY COMPLETE SEPARATION?

### Current Problem
Right now DeckSiteAgent is **both** things:
- The GEO 42 website project (in `src/`)
- The theoretical SaaS engine (in `scripts/` and `personas/`)

This creates confusion:
- "Is DeckSiteAgent a website or a product?"
- "Can I delete this GEO 42-specific code?"
- "Why is there a Three.js 3D scene in a 'generic' template?"

### Solution: Two Distinct Repositories

**MagUpSite** = "Here's a great website we built"
- Stand-alone project
- Can evolve independently
- No coupling to generator engine

**DeckSiteAgent** = "Here's the engine that can build websites like MagUpSite"
- Clean, generic codebase
- References MagUpSite as proof-of-concept
- Builds NEW sites for NEW clients from scratch

---

## RELOCATION CHECKLIST

### Phase 1: Prepare MagUpSite Repository

#### 1.1 Clone MagUpSite Repo Locally
```bash
cd /tmp
git clone https://github.com/alexroessner/MagUpSite.git
cd MagUpSite
```

**Current state check:**
- Does it have HTML files? (deployed output)
- Does it have source files? (src/, package.json)
- Or is it just dist/?

---

#### 1.2 Copy Complete Source Tree from DeckSiteAgent

**Files to copy:**

```bash
# From DeckSiteAgent → to MagUpSite

# Source files
src/                        → src/

# Build configuration
package.json                → package.json
package-lock.json           → package-lock.json
eleventy.config.js          → eleventy.config.js
tailwind.config.js          → tailwind.config.js
whitelabel.config.js        → whitelabel.config.js

# Scripts (only build-related, not pipeline)
scripts/audit.js            → scripts/audit.js
scripts/lighthouse.js       → scripts/lighthouse.js

# CI/CD (modified for MagUpSite-only)
.github/workflows/ci.yml    → .github/workflows/deploy.yml (modified)

# Documentation
README.md                   → README.md (rewritten for MagUpSite)
AGENTS.md                   → AGENTS.md (keep persona context)
TODO.md                     → TODO.md (if relevant)

# Audits and planning docs (as reference)
audits/                     → audits/
docs/                       → docs/ (if exists)

# Personas (as reference/context)
personas/                   → personas/ (for future manual use)
```

**Files NOT to copy:**
- ❌ `scripts/extract-pdf.js` (pipeline-specific)
- ❌ `scripts/scrape-styles.js` (pipeline-specific)
- ❌ `scripts/merge.js` (pipeline-specific)
- ❌ `scripts/generate.js` (pipeline-specific)
- ❌ MASTER-PLAN.md (DeckSiteAgent roadmap)
- ❌ ARCHITECTURE-CLARITY.md (DeckSiteAgent docs)
- ❌ SEPARATION-PLAN.md (this doc)

---

#### 1.3 Modify Files for Standalone MagUpSite

**Update `package.json`:**
```json
{
  "name": "magupsite",
  "version": "1.0.0",
  "description": "GEO 42 Marketing Website - AI Visibility Platform",
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

---

**Update `README.md`:**
```markdown
# MagUpSite — GEO 42 Marketing Website

**Live Site:** https://alexroessner.github.io/MagUpSite
**Status:** ✅ Production

## About

This is the official marketing website for GEO 42, an AI visibility platform
that helps enterprise brands become the definitive answer across generative
engines like ChatGPT, Perplexity, and Gemini.

## Features

- 🎨 Premium glassmorphism design language
- 🌐 23 pages including services, case studies, methodology
- 🎬 Three.js 3D interactive hero scene
- ♿ WCAG 2.1 AA accessibility compliant
- 🔍 SEO optimized with structured data
- 📱 Fully responsive mobile design

## Tech Stack

- **Static Site Generator:** Eleventy 3.1.2
- **Styling:** Tailwind CSS 4.1.18
- **3D Graphics:** Three.js
- **Deployment:** GitHub Pages
- **CI/CD:** GitHub Actions

## Development

### Prerequisites
- Node.js 18+
- npm 9+

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

### Build for Production
```bash
npm run build
# Output: dist/
```

### Quality Checks
```bash
npm run check  # Full build + all linters
npm run lint   # Linters only
npm run audit  # Persona-based audit
```

## Project Structure

```
MagUpSite/
├── src/                    # Source files
│   ├── index.njk           # Homepage
│   ├── about.njk           # About page
│   ├── services.njk        # Services page
│   ├── contact.njk         # Contact page
│   ├── _includes/          # Layout templates
│   ├── _data/              # Content data
│   ├── css/                # Styles
│   ├── js/                 # JavaScript
│   └── images/             # Images
├── dist/                   # Built site (generated)
├── personas/               # AI persona context files
├── audits/                 # Quality audit reports
├── scripts/                # Build scripts
├── eleventy.config.js      # Eleventy config
├── tailwind.config.js      # Tailwind config
├── whitelabel.config.js    # Brand configuration
└── package.json
```

## Design System

See `/style-guide` page for:
- Color palette (purple primary, dark navy background)
- Typography (Space Grotesk, Inter)
- Component library
- Design tokens

## Deployment

The site automatically deploys to GitHub Pages via GitHub Actions on every
push to the `main` branch.

**Production URL:** https://alexroessner.github.io/MagUpSite

## Personas

This project was built using AI-assisted development with 11 expert personas:

1. **Document Analyst** — Content extraction and structuring
2. **Content Architect** — Information architecture
3. **Copywriter** — Web content and voice
4. **Style Cloner** — Design system extraction
5. **Brand Interpreter** — Visual identity
6. **Synthesizer** — Content-design integration
7. **Engineer** — Build tooling and optimization
8. **Accessibility Specialist** — WCAG compliance
9. **SEO Specialist** — Search optimization
10. **3D Graphics Specialist** — Three.js scenes
11. **Target Audience** — User perspective validation

The `personas/` directory contains context files that can be used with Claude
or other AI assistants for maintaining consistency when making updates.

## History

This site was originally built as a pilot project for DeckSiteAgent, an
autonomous website generation engine. It now stands as an independent,
production-stable website maintained separately.

**First deployed:** 2025
**Last major update:** 2026-02-11

## License

Proprietary — © 2025-2026 GEO 42. All rights reserved.

## Contact

- **Email:** hello@geo42.ai
- **Website:** https://www.geo42.ai
```

---

**Update `.github/workflows/deploy.yml`:**
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

      - name: Lint HTML
        run: npm run lint:html
        continue-on-error: true

      - name: Lint CSS
        run: npm run lint:css
        continue-on-error: true

      - name: Start server for checks
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

      - name: Run persona audit
        run: npm run audit
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
      - name: Wait for deployment propagation
        run: sleep 15

      - name: Verify live site
        run: |
          STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://alexroessner.github.io/MagUpSite/)
          echo "HTTP status: $STATUS"
          [ "$STATUS" = "200" ]
```

---

#### 1.4 Create MagUpSite-Specific Documentation

**New file: `DEVELOPMENT.md`**
```markdown
# Development Guide for MagUpSite

## Making Content Updates

### Updating Homepage Content
Edit `src/_data/pageContent.json`:
```json
{
  "hero": {
    "headline": "Your new headline",
    "subheadline": "Supporting text"
  }
}
```

### Updating Brand Colors
Edit `whitelabel.config.js`:
```javascript
module.exports = {
  colors: {
    primary: "#110B30",  // Dark navy
    accent: "#9775FA",   // Purple
  }
}
```

### Adding New Pages
1. Create `src/new-page.njk`
2. Add frontmatter with layout
3. Build and test locally
4. Commit and push

## Build Process

1. **Clean:** Removes `dist/` directory
2. **Build CSS:** Tailwind compilation
3. **Build 11ty:** Eleventy static site generation
4. **Output:** Files written to `dist/`

## Deployment

On push to `main` branch:
1. GitHub Actions triggers
2. Build runs (`npm run build`)
3. Linters check quality
4. Deploy to GitHub Pages
5. Smoke test verifies live site

## Using Personas

The `personas/` directory contains AI assistant context files.

**Example workflow:**
1. Load persona: "Act as the Accessibility Specialist persona from personas/accessibility-specialist.md"
2. Ask for review: "Review the contact form for WCAG compliance"
3. Apply suggestions
4. Run lint: `npm run lint:a11y`

## Troubleshooting

### Build fails with "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Linters report errors
```bash
npm run lint          # See all errors
npm run lint:html     # HTML only
npm run lint:a11y     # Accessibility only
```

### Three.js scene not loading
Check browser console for errors. Ensure `src/js/three-scene.js` is included.

### Styles not applying
```bash
npm run build:css     # Rebuild Tailwind
```
```

---

### Phase 2: Clean Up DeckSiteAgent Repository

#### 2.1 Remove GEO 42-Specific Files

**Delete from DeckSiteAgent:**
```bash
# Remove entire source tree
rm -rf src/

# Remove build configs
rm eleventy.config.js
rm tailwind.config.js
rm whitelabel.config.js

# Remove audit reports (they're in MagUpSite now)
rm -rf audits/agent-discourse-2026-02-10/

# Remove build scripts (keep pipeline scripts)
rm scripts/audit.js
rm scripts/lighthouse.js

# Keep these:
# ✅ scripts/extract-pdf.js
# ✅ scripts/scrape-styles.js
# ✅ scripts/merge.js
# ✅ scripts/generate.js
# ✅ personas/
# ✅ MASTER-PLAN.md
# ✅ ARCHITECTURE-CLARITY.md
```

---

#### 2.2 Disable MagUpSite Deployment in CI

**Update `.github/workflows/ci.yml`:**
```yaml
name: DeckSiteAgent CI

on:
  push:
    branches: [main, 'claude/**']
  pull_request:
    branches: [main]

permissions:
  contents: read

jobs:
  test:
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

      - name: Run pipeline tests
        run: npm test

      - name: Lint code
        run: npm run lint

      # NO DEPLOYMENT — DeckSiteAgent doesn't build a site anymore
      # It's a SaaS engine for generating NEW sites
```

---

#### 2.3 Update DeckSiteAgent README

**New `README.md`:**
```markdown
# DeckSiteAgent

**Autonomous website and presentation generator powered by AI personas.**

## What It Does

DeckSiteAgent transforms input materials (PDFs, company data, design references)
into professional output (websites, pitch decks, sales presentations) using a
two-stream pipeline and 11-persona quality control system.

## Architecture

```
Input Sources                Pipeline                    Output Formats
┌──────────────┐            ┌─────────┐                ┌──────────────┐
│ PDF          │───────────▶│ Extract │                │ Static Site  │
│ Company data │            └─────────┘                │ (Eleventy)   │
│ URLs         │                 │                     ├──────────────┤
└──────────────┘                 │                     │ Pitch Deck   │
                                 ▼                     │ (Reveal.js)  │
┌──────────────┐            ┌─────────┐                ├──────────────┤
│ Reference    │───────────▶│ Scrape  │                │ PDF Export   │
│ Design URLs  │            └─────────┘                ├──────────────┤
└──────────────┘                 │                     │ PPTX Export  │
                                 │                     └──────────────┘
                                 ▼
                            ┌─────────┐
                            │ Merge   │◀───────── 11 AI Personas
                            └─────────┘           (Quality Control)
                                 │
                                 ▼
                            ┌─────────┐
                            │Generate │
                            └─────────┘
```

## Personas

DeckSiteAgent uses 11 expert AI agents for quality control:

### Stream A: Content
- **Document Analyst** — PDF structure analysis
- **Content Architect** — Information architecture
- **Copywriter** — Web content adaptation

### Stream B: Design
- **Style Cloner** — Design system extraction
- **Brand Interpreter** — Visual identity analysis

### Merge & Build
- **Synthesizer** — Two-stream merger
- **Engineer** — Build pipeline optimization

### Quality Assurance
- **Accessibility Specialist** — WCAG compliance
- **SEO Specialist** — Search optimization
- **3D Graphics Specialist** — Interactive scenes
- **Target Audience** — User perspective (dynamically generated)

See `personas/` directory for detailed persona definitions.

## Proof of Concept

**MagUpSite** (https://github.com/alexroessner/MagUpSite) was built as the
pilot project for this engine. It's a complete, production-stable marketing
website for GEO 42 that demonstrates the quality DeckSiteAgent can achieve.

Study MagUpSite's codebase to understand:
- How persona context is used
- Template structure and patterns
- Content architecture
- Quality standards

## Current Status

**Phase 0:** Foundation
- ✅ Pipeline architecture designed
- ✅ 11 personas defined
- ✅ Pilot site (MagUpSite) completed
- 🔄 Pipeline scripts functional but manual
- ❌ Personas not yet wired into code execution

**Phase 1:** Autonomous Generation (In Progress)
- Build input enrichment layer
- Implement persona orchestration
- Add multi-format export
- Create automated QA system

**Phase 2:** Autonomous Pipeline (Planned)
- CRM integration (HubSpot, Salesforce)
- Data source APIs (Clearbit, Crunchbase)
- Webhook-driven generation
- Feedback loops

**Phase 3:** Platform Launch (Future)
- Multi-tenant SaaS
- White-labeling
- API + marketplace
- $50K MRR target

See `MASTER-PLAN.md` for complete roadmap.

## Installation

```bash
git clone https://github.com/alexroessner/DeckSiteAgent.git
cd DeckSiteAgent
npm install
```

## Usage (Current — Manual)

### Extract content from PDF:
```bash
npm run extract -- --pdf path/to/document.pdf
# Output: data/raw-extract.json
```

### Scrape design from URL:
```bash
npm run scrape -- --url https://example.com
# Output: data/scraped-styles.json
```

### Merge streams:
```bash
npm run merge
# Output: data/merged-blueprint.json
```

### Generate site:
```bash
npm run generate
# Output: dist/
```

## Usage (Future — Autonomous)

```bash
# Full pipeline with minimal input
npm run pipeline -- \
  --company "Acme Corp" \
  --website "https://acme.com" \
  --template "marketing-site"

# Output: dist/ (complete, client-ready website)
```

## Development

See `MASTER-PLAN.md` for:
- Phase-by-phase implementation plan
- Technical architecture decisions
- Risk register and mitigations
- Metrics and success criteria

See `ARCHITECTURE-CLARITY.md` for:
- Repository structure rationale
- Persona system design
- Template architecture
- Multi-client support strategy

## Contributing

This is currently a private project. Contributions are limited to the core team.

## License

Proprietary — © 2025-2026 MagUpUS. All rights reserved.
```

---

#### 2.4 Update package.json

**New `package.json`:**
```json
{
  "name": "decksiteagent",
  "version": "0.1.0",
  "description": "Autonomous website and presentation generator",
  "main": "index.js",
  "scripts": {
    "extract": "node scripts/extract-pdf.js",
    "scrape": "node scripts/scrape-styles.js",
    "merge": "node scripts/merge.js",
    "generate": "node scripts/generate.js",
    "pipeline": "npm run extract && npm run scrape && npm run merge && npm run generate",
    "test": "echo 'No tests yet' && exit 0",
    "lint": "echo 'No linting yet' && exit 0"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/alexroessner/DeckSiteAgent.git"
  },
  "dependencies": {
    "@anthropic-ai/sdk": "^0.30.0",
    "puppeteer": "^22.0.0"
  },
  "devDependencies": {
    "eslint": "^8.56.0"
  }
}
```

---

### Phase 3: Reference MagUpSite as Example

#### 3.1 Add MagUpSite as Git Submodule (Optional)

**In DeckSiteAgent repo:**
```bash
git submodule add https://github.com/alexroessner/MagUpSite.git examples/magupsite

# Now developers can reference MagUpSite code:
cd examples/magupsite
git pull origin main  # Update to latest
```

**Benefits:**
- Can inspect MagUpSite templates as reference
- Always have latest version
- Don't duplicate code

**Alternative:** Just link to the repo in documentation (simpler).

---

#### 3.2 Document the Relationship

**New file: `docs/magupsite-reference.md`**
```markdown
# MagUpSite as a Reference Implementation

## Overview

MagUpSite (https://github.com/alexroessner/MagUpSite) is the first site
built with the techniques that DeckSiteAgent aims to automate.

It serves as:
- Proof of concept for quality achievable
- Reference for template patterns
- Example of persona-driven development
- Baseline for automated output comparison

## What to Study in MagUpSite

### Template Architecture
- See `src/` for component-based template structure
- Study `src/_includes/base.njk` for master layout pattern
- Review `src/index.njk` for data-driven content rendering

### Persona Usage (Manual)
MagUpSite was built by manually loading persona context into Claude sessions.
Study `personas/` to see:
- How each persona defines its role and responsibilities
- Self-editing protocols and verification checklists
- Cross-persona data flow dependencies

DeckSiteAgent aims to automate this manual workflow.

### Content Architecture
- See `src/_data/pageContent.json` for content structure
- Study how templates consume this data
- Note separation of content from presentation

### Quality Standards
- Review `audits/` for persona-based quality reports
- Study accessibility patterns (WCAG 2.1 AA compliance)
- Analyze SEO implementation (structured data, meta tags)

### Design System
- Visit `/style-guide` on live site for design tokens
- Study Tailwind configuration in `tailwind.config.js`
- Review component patterns and naming conventions

## Differences from DeckSiteAgent

| Aspect | MagUpSite | DeckSiteAgent |
|--------|-----------|---------------|
| Purpose | Specific GEO 42 site | Generic engine |
| Content | Hardcoded for GEO 42 | Data-driven from inputs |
| Personas | Manual context loading | Automated orchestration |
| Templates | Bespoke, polished | Generic, configurable |
| Deployment | Single production site | Multi-client outputs |

## Using MagUpSite to Improve DeckSiteAgent

When building new DeckSiteAgent features:

1. **Study MagUpSite first** — see what good output looks like
2. **Extract patterns** — identify reusable structures
3. **Genericize** — remove GEO 42-specific elements
4. **Test** — compare generated output to MagUpSite quality
5. **Iterate** — close the gap between manual and automated

## Keeping in Sync

MagUpSite will evolve independently as a production site.

**When MagUpSite adds features:**
- Evaluate if feature is generic enough for DeckSiteAgent
- If yes: extract pattern, add to DeckSiteAgent templates
- If no: document as "client-specific customization"

**When DeckSiteAgent improves:**
- Consider backporting improvements to MagUpSite
- Use MagUpSite as test bed for new features
- Maintain MagUpSite as "gold standard" example
```

---

### Phase 4: Verification & Handoff

#### 4.1 Verify MagUpSite Builds Independently

```bash
cd /path/to/MagUpSite
rm -rf node_modules dist
npm install
npm run build
npm run dev

# Verify:
# - Site builds without errors
# - All pages load at localhost:8080
# - No references to DeckSiteAgent
# - No broken links or images
```

---

#### 4.2 Verify DeckSiteAgent is Clean

```bash
cd /path/to/DeckSiteAgent
rm -rf node_modules dist
npm install

# Verify:
# - No src/ directory
# - No eleventy.config.js
# - No GEO 42 references in code
# - Pipeline scripts still present
# - Personas still present
```

---

#### 4.3 Test CI Pipelines

**MagUpSite CI:**
```bash
# Push a commit to MagUpSite main branch
git commit --allow-empty -m "Test CI deployment"
git push origin main

# Verify:
# - GitHub Actions runs
# - Site builds successfully
# - Deploys to https://alexroessner.github.io/MagUpSite
# - Live site updates
```

**DeckSiteAgent CI:**
```bash
# Push a commit to DeckSiteAgent
git commit --allow-empty -m "Test CI pipeline"
git push origin main

# Verify:
# - GitHub Actions runs
# - Tests pass (or skip if none yet)
# - NO deployment to MagUpSite
# - DeckSiteAgent repo remains clean
```

---

## EXECUTION TIMELINE

### Day 1: Prepare MagUpSite (2-3 hours)
- [ ] Clone MagUpSite repo
- [ ] Copy all source files from DeckSiteAgent
- [ ] Update package.json, README, configs
- [ ] Test build locally
- [ ] Commit and push

### Day 1: Update CI (30 minutes)
- [ ] Update MagUpSite CI workflow (deploy from own repo)
- [ ] Disable DeckSiteAgent → MagUpSite deployment
- [ ] Test both CI pipelines

### Day 2: Clean DeckSiteAgent (2-3 hours)
- [ ] Remove src/, build configs, audit reports
- [ ] Update README, package.json
- [ ] Add reference documentation
- [ ] Test pipeline scripts still work
- [ ] Commit and push

### Day 2: Verify Separation (1 hour)
- [ ] Build MagUpSite independently
- [ ] Verify DeckSiteAgent is clean
- [ ] Check both CI pipelines work
- [ ] Verify live sites are stable

**Total time:** 1-2 days for complete relocation

---

## DECISION POINTS

### D1: Should MagUpSite Keep Personas?
**Options:**
1. **Yes** — useful for future manual updates with AI assistance
2. **No** — removes DeckSiteAgent dependency entirely

**Recommendation:** Yes. Personas are useful context even without automation.

---

### D2: Git History — Preserve or Fresh Start?
**Options:**
1. **Copy files, keep MagUpSite history** — preserves deployment history
2. **Fresh git init in MagUpSite** — clean slate
3. **Import DeckSiteAgent history** — full provenance

**Recommendation:** Option 1. MagUpSite likely has deployment commits already. Just add source files.

---

### D3: Should DeckSiteAgent Reference MagUpSite?
**Options:**
1. **Git submodule** — code available locally
2. **Documentation link** — reference only
3. **No reference** — complete separation

**Recommendation:** Option 2. Link in docs, no code coupling.

---

## ROLLBACK PLAN

If something breaks during relocation:

1. **MagUpSite broken?**
   - Revert last commit: `git reset --hard HEAD^1`
   - Re-copy files from DeckSiteAgent
   - Test again before pushing

2. **DeckSiteAgent broken?**
   - Revert last commit: `git reset --hard HEAD^1`
   - Pipeline scripts are still there
   - Can regenerate src/ from MagUpSite if needed

3. **Live site down?**
   - MagUpSite should still have old dist/ in repo
   - Force redeploy: `git push --force origin main`
   - Or manually copy dist/ from backup

---

## POST-RELOCATION STATE

### MagUpSite Repository
```
MagUpSite/
├── src/                    # All source files (from DeckSiteAgent)
├── dist/                   # Built site
├── personas/               # Persona context files
├── audits/                 # Quality audit reports
├── scripts/                # Build scripts only
├── .github/workflows/      # Deploy workflow
├── eleventy.config.js
├── tailwind.config.js
├── whitelabel.config.js
├── package.json
├── README.md               # Standalone project docs
└── DEVELOPMENT.md          # Development guide
```

**Status:** ✅ Complete, independent website project
**Can be:** Cloned, built, deployed without any DeckSiteAgent knowledge

---

### DeckSiteAgent Repository
```
DeckSiteAgent/
├── scripts/                # Pipeline scripts only
│   ├── extract-pdf.js
│   ├── scrape-styles.js
│   ├── merge.js
│   └── generate.js
├── personas/               # Persona definitions
├── docs/                   # Documentation
│   └── magupsite-reference.md
├── MASTER-PLAN.md          # Product roadmap
├── ARCHITECTURE-CLARITY.md # Architecture docs
├── package.json            # Pipeline dependencies only
└── README.md               # SaaS engine docs
```

**Status:** ✅ Clean slate for building the SaaS engine
**No longer:** Contains GEO 42 website code

---

## APPENDIX: File Manifest

### Copy to MagUpSite (Complete List)

**Critical files:**
- `src/**/*` (all source files)
- `package.json`
- `package-lock.json`
- `eleventy.config.js`
- `tailwind.config.js`
- `whitelabel.config.js`

**Build & tooling:**
- `scripts/audit.js`
- `.github/workflows/ci.yml` → rename to `deploy.yml`

**Documentation & reference:**
- `personas/**/*`
- `audits/**/*`
- `AGENTS.md`
- `.gitignore`
- `.eleventy.js` (if exists)

**New files to create:**
- `README.md` (rewritten for MagUpSite)
- `DEVELOPMENT.md` (new)

---

### Keep in DeckSiteAgent

**Pipeline:**
- `scripts/extract-pdf.js`
- `scripts/scrape-styles.js`
- `scripts/merge.js`
- `scripts/generate.js`

**Personas:**
- `personas/**/*`

**Docs:**
- `MASTER-PLAN.md`
- `ARCHITECTURE-CLARITY.md`
- `SEPARATION-PLAN.md`
- `RELOCATION-PLAN.md` (this doc)

**Config:**
- `package.json` (updated for pipeline only)
- `.github/workflows/ci.yml` (updated for tests only)
- `.gitignore`

---

## SUCCESS CRITERIA

✅ **MagUpSite is fully standalone**
- Can clone and build without DeckSiteAgent
- CI deploys from its own repo
- All source files present
- Documentation is self-contained

✅ **DeckSiteAgent is clean**
- No GEO 42-specific code
- No website source files
- Pipeline scripts functional
- Clear SaaS engine focus

✅ **Both sites are stable**
- MagUpSite live site unchanged
- DeckSiteAgent CI doesn't break
- No coupling between repos

✅ **Reference relationship documented**
- DeckSiteAgent docs link to MagUpSite
- Developers know to study MagUpSite
- Patterns can be extracted and genericized

---

**END OF RELOCATION PLAN**
