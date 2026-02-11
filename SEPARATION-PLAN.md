# SEPARATION PLAN: MagUpSite Production Freeze
## Ensuring the GEO 42 Site Can NOT Go Down

**Status:** 🔴 CRITICAL — Must Complete Before Any Other Work
**Created:** 2026-02-11
**Deadline:** Immediate (today)

---

## THE REQUIREMENT

**MagUpSite MUST be fully standalone and production-stable.**

- ✅ The GEO 42 marketing site is live and polished
- ✅ It serves real business purposes (lead generation, brand authority)
- ❌ Currently coupled to DeckSiteAgent CI/CD
- ❌ Every push to DeckSiteAgent force-pushes to MagUpSite
- ❌ Experimental DeckSiteAgent changes could break production

**Bottom line:** Development work on DeckSiteAgent cannot risk the live GEO 42 site.

---

## CURRENT COUPLING (What Needs to Break)

### 1. CI/CD Force-Push (CRITICAL)
**File:** `.github/workflows/ci.yml` lines 64-94

```yaml
- name: Build for MagUpSite
  if: github.event_name == 'push'
  run: npm run build
  env:
    PATH_PREFIX: /MagUpSite/
    SITE_URL: https://alexroessner.github.io/MagUpSite

- name: Push to MagUpSite repo
  if: github.event_name == 'push'
  env:
    DEPLOY_TOKEN_V3: ${{ secrets.MAGUPSITE_DEPLOY_TOKEN3 }}
  run: |
    cd dist
    git init
    git push -f origin main  # ← FORCE PUSH TO PRODUCTION
```

**Risk:** Every commit to DeckSiteAgent (including experimental work) automatically force-pushes to the live site.

---

### 2. Hardcoded URLs
**Files with MagUpSite-specific URLs:**

- `whitelabel.config.js` line 34: `siteUrl: "https://alexroessner.github.io/MagUpSite"`
- `scripts/merge.js` line 318: Same URL
- `src/robots.txt.njk`: Hardcoded sitemap URL
- `src/sitemap.njk`: Generates URLs with MagUpSite path
- Multiple template files reference the specific deployment

**Risk:** DeckSiteAgent cannot be used for other clients without manual find/replace.

---

### 3. Deploy Tokens
**Secrets configured:**
- `MAGUPSITE_DEPLOY_TOKEN` (v1)
- `MAGUPSITE_DEPLOY_TOKEN2` (v2)
- `MAGUPSITE_DEPLOY_TOKEN3` (v3)

**Risk:** CI has write access to production site repository.

---

### 4. Template Content
**Reality (from your message):**
- 56% of template layer is bespoke GEO 42 content
- `index.njk` is 1,185 lines with hardcoded:
  - Typewriter text: "ChatGPT|Perplexity|Gemini"
  - Robot vacuum case study
  - 6 Walls framework
  - Specific KPIs and metrics

**Risk:** Templates cannot be reused for other clients without massive editing.

---

## THE SEPARATION PLAN

### Phase 1: FREEZE (Immediate — Today)

#### 1.1 Disable CI Auto-Deploy to MagUpSite
**Action:** Comment out or remove the MagUpSite deployment step in CI.

```yaml
# --- Deploy to MagUpSite repo (DISABLED — site is now standalone) ---
# - name: Build for MagUpSite
#   if: github.event_name == 'push'
#   run: npm run build
#   env:
#     PATH_PREFIX: /MagUpSite/
#     SITE_URL: https://alexroessner.github.io/MagUpSite
#
# - name: Push to MagUpSite repo
#   ... (commented out)
```

**Why:** Prevents any DeckSiteAgent commits from touching production.

**Verification:**
- [ ] Push a test commit to DeckSiteAgent
- [ ] Verify MagUpSite repo shows no new commits
- [ ] Verify live site at `alexroessner.github.io/MagUpSite` remains unchanged

---

#### 1.2 Revoke Deploy Token Access (Optional but Recommended)
**Action:** Rotate or delete the `MAGUPSITE_DEPLOY_TOKEN*` secrets from DeckSiteAgent repo settings.

**Why:** Defense in depth — even if CI is re-enabled accidentally, it won't have write access.

**Trade-off:** Can re-add later if we need manual deploy capability.

---

#### 1.3 Verify MagUpSite Repo is Self-Contained
**Action:** Clone the MagUpSite repository and confirm it has everything needed:

```bash
git clone https://github.com/alexroessner/MagUpSite.git /tmp/magup-test
cd /tmp/magup-test
# Check for:
# - index.html and all page files
# - CSS, JS, images
# - favicon, robots.txt, sitemap.xml
# - No references to DeckSiteAgent
```

**Why:** Ensure the site can remain live indefinitely without DeckSiteAgent.

**If missing files:** Do a final manual deployment before freezing.

---

#### 1.4 Document the Freeze
**Action:** Add README.md to MagUpSite repo:

```markdown
# MagUpSite — GEO 42 Marketing Site

**Status:** ✅ Production Stable (Frozen)
**Last Updated:** 2026-02-11
**Deployed At:** https://alexroessner.github.io/MagUpSite

## Important

This site is **no longer auto-deployed** from DeckSiteAgent.

It is a **standalone production site** for the GEO 42 brand.

### Making Updates

If you need to update this site:

1. Clone DeckSiteAgent
2. Check out a client workspace branch
3. Make changes to templates/content
4. Build locally: `npm run build`
5. Manually copy `dist/` to this repo
6. Test thoroughly before committing

Do NOT re-enable automatic CI deployment.

### History

This site was initially built using DeckSiteAgent as a pilot project.
It is now maintained separately to ensure production stability.
```

**Why:** Prevent future confusion about deployment model.

---

### Phase 2: DECOUPLE (Next 1-2 Days)

#### 2.1 Remove MagUpSite-Specific Configuration from DeckSiteAgent

**Files to modify:**

1. **`whitelabel.config.js`**
   ```javascript
   // BEFORE:
   siteUrl: "https://alexroessner.github.io/MagUpSite",

   // AFTER:
   siteUrl: process.env.SITE_URL || "http://localhost:8080",
   // Note: siteUrl should come from client workspace config, not hardcoded
   ```

2. **`scripts/merge.js` line 318**
   ```javascript
   // BEFORE:
   siteUrl: "https://alexroessner.github.io/MagUpSite",

   // AFTER:
   siteUrl: config.siteUrl || process.env.SITE_URL || "",
   ```

3. **`src/robots.txt.njk` and `src/sitemap.njk`**
   - Use template variables: `{{ site.url }}` instead of hardcoded URL
   - Ensure they render correctly with dynamic `siteUrl`

**Verification:**
- [ ] Build with `SITE_URL=http://localhost:8080` → verify robots.txt and sitemap
- [ ] Build with `SITE_URL=https://example.com` → verify different URL

---

#### 2.2 Create Client Workspace Structure

**Action:** Implement the multi-client architecture:

```
DeckSiteAgent/
├── clients/                        # NEW: Client workspaces
│   ├── geo42/                      # GEO 42 workspace (for future updates)
│   │   ├── whitelabel.config.js   # GEO 42-specific config
│   │   ├── content/                # GEO 42-specific content
│   │   │   └── pageContent.json
│   │   ├── source-materials/       # Original PDFs, screenshots
│   │   └── README.md               # GEO 42 project notes
│   │
│   └── template/                   # Template for new clients
│       ├── whitelabel.config.js
│       ├── content/
│       └── README.md
│
├── src/                            # Generic templates (shared across clients)
├── personas/                       # Personas (shared)
├── scripts/                        # Pipeline (shared)
└── .github/workflows/ci.yml        # CI (no client-specific deploys)
```

**Why:**
- Clear separation: engine code vs. client data
- Easy to add new clients: copy `clients/template/` to `clients/new-client/`
- Git history: client changes don't pollute engine commits

---

#### 2.3 Update Build Scripts to Support Client Workspaces

**Action:** Modify `package.json` scripts:

```json
{
  "scripts": {
    "build": "npm run clean && npm run build:css && npm run build:11ty",
    "build:client": "node scripts/build-client.js",
    "dev:client": "node scripts/dev-client.js"
  }
}
```

**New file:** `scripts/build-client.js`
```javascript
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Parse --client flag
const clientArg = process.argv.find(arg => arg.startsWith('--client='));
if (!clientArg) {
  console.error('Usage: npm run build:client -- --client=<client-name>');
  process.exit(1);
}

const clientName = clientArg.split('=')[1];
const clientDir = path.join(__dirname, '..', 'clients', clientName);

if (!fs.existsSync(clientDir)) {
  console.error(`Client workspace not found: ${clientDir}`);
  process.exit(1);
}

// Load client config
const clientConfig = require(path.join(clientDir, 'whitelabel.config.js'));

// Set environment variables
process.env.SITE_URL = clientConfig.siteUrl;
process.env.PATH_PREFIX = clientConfig.pathPrefix || '/';

// Copy client content to src/_data
const contentSrc = path.join(clientDir, 'content', 'pageContent.json');
const contentDest = path.join(__dirname, '..', 'src', '_data', 'pageContent.json');
if (fs.existsSync(contentSrc)) {
  fs.copyFileSync(contentSrc, contentDest);
  console.log(`Loaded content from ${contentSrc}`);
}

// Copy client config to root (for Eleventy)
const configSrc = path.join(clientDir, 'whitelabel.config.js');
const configDest = path.join(__dirname, '..', 'whitelabel.config.js');
fs.copyFileSync(configSrc, configDest);
console.log(`Loaded config from ${configSrc}`);

// Run build
console.log(`Building for client: ${clientName}`);
execSync('npm run build', { stdio: 'inherit' });

console.log(`\nBuild complete for ${clientName}`);
console.log(`Output: dist/`);
console.log(`Deploy to: ${clientConfig.siteUrl}`);
```

**Commands:**
```bash
npm run build:client -- --client=geo42
npm run dev:client -- --client=geo42
```

**Why:** Makes it explicit which client you're building for, prevents accidental cross-contamination.

---

### Phase 3: GENERICIZE (Next 1-2 Weeks)

#### 3.1 Audit Templates for Hardcoded Content

**Action:** Run systematic audit:

```bash
# Find all hardcoded "GEO 42" references
grep -r "GEO 42\|Generative Engine Optimization" src/

# Find hardcoded content (long text blocks)
find src/ -name "*.njk" -exec wc -l {} \; | sort -rn | head -10

# Review each large template file
```

**For each hardcoded section:**
1. **Move to `pageContent.json`**
   ```json
   {
     "hero": {
       "typewriterWords": ["ChatGPT", "Perplexity", "Gemini", "Claude"],
       "headline": "The Answer Engine for Enterprise Brands",
       "subheadline": "..."
     }
   }
   ```

2. **Update template to use data**
   ```njk
   {# BEFORE: #}
   <h1>The Answer Engine for Enterprise Brands</h1>

   {# AFTER: #}
   <h1>{{ pageContent.hero.headline }}</h1>
   ```

3. **Test with different content**
   - Create `clients/test/content/pageContent.json` with different values
   - Build: `npm run build:client -- --client=test`
   - Verify template renders correctly

**Goal:** 0% hardcoded content in templates (everything flows from `pageContent.json` or `whitelabel.config.js`)

---

#### 3.2 Create Content Schema

**Action:** Document what data is required in `pageContent.json`:

**New file:** `docs/content-schema.md`
```markdown
# Content Schema for DeckSiteAgent Templates

## Required Fields

### `pageContent.hero`
- `headline` (string) — Main homepage headline
- `subheadline` (string) — Supporting text
- `ctaText` (string) — Primary CTA button text
- `ctaUrl` (string) — CTA destination

### `pageContent.about`
- `title` (string)
- `description` (string)
- `sections` (array of objects):
  - `heading` (string)
  - `body` (string)

... (continue for all sections)
```

**Why:**
- Clients know exactly what content to provide
- Developers know what templates expect
- Validation: can check if client content is complete

---

#### 3.3 Build Content Validator

**New file:** `scripts/validate-content.js`
```javascript
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const schema = {
  required: [
    'hero.headline',
    'hero.subheadline',
    'about.title',
    // ... all required fields
  ],
  optional: [
    'hero.backgroundVideo',
    // ... optional fields
  ]
};

function validateContent(contentPath) {
  const content = JSON.parse(fs.readFileSync(contentPath, 'utf-8'));

  const missing = [];
  for (const field of schema.required) {
    const value = field.split('.').reduce((obj, key) => obj?.[key], content);
    if (!value) {
      missing.push(field);
    }
  }

  if (missing.length > 0) {
    console.error('❌ Missing required fields:');
    missing.forEach(f => console.error(`   - ${f}`));
    process.exit(1);
  }

  console.log('✅ Content validation passed');
}

// Usage: node scripts/validate-content.js clients/geo42/content/pageContent.json
validateContent(process.argv[2]);
```

**Integration:**
```json
{
  "scripts": {
    "validate": "node scripts/validate-content.js",
    "build:client": "npm run validate clients/$CLIENT/content/pageContent.json && ..."
  }
}
```

**Why:** Catch incomplete client data before build time.

---

### Phase 4: DOCUMENT (Next 2-3 Days)

#### 4.1 Update README.md

**Action:** Rewrite DeckSiteAgent README to reflect new architecture:

```markdown
# DeckSiteAgent

White-label website and presentation generator powered by AI personas.

## What It Does

Transforms input materials (PDFs, data) into professional output (websites,
pitch decks, sales presentations) using a two-stream pipeline and 11-persona
quality control system.

## Architecture

- **Templates:** Generic, data-driven templates in `src/`
- **Personas:** 11 expert AI agents in `personas/`
- **Pipeline:** Extract → Scrape → Merge → Build
- **Clients:** Per-client workspaces in `clients/`

## Quick Start

### Build for existing client:
```bash
npm run build:client -- --client=geo42
npm run dev:client -- --client=geo42
```

### Create new client:
```bash
cp -r clients/template clients/new-client
# Edit clients/new-client/whitelabel.config.js
# Edit clients/new-client/content/pageContent.json
npm run build:client -- --client=new-client
```

## Project History

This engine was originally built to create the GEO 42 marketing site
(MagUpSite), which served as the pilot project. That site is now
maintained separately as a standalone production asset.

DeckSiteAgent is the reusable engine extracted from that work.
```

---

#### 4.2 Create Onboarding Guide

**New file:** `docs/onboarding-new-client.md`

```markdown
# Onboarding a New Client

## Prerequisites

- Client materials (PDFs, brand guidelines)
- Access to reference website (for style scraping)
- Client contact for Q&A

## Steps

### 1. Create Client Workspace
```bash
cp -r clients/template clients/new-client-name
cd clients/new-client-name
```

### 2. Configure Branding
Edit `whitelabel.config.js`:
- Company name, tagline, description
- Colors (primary, accent)
- Fonts (heading, body, mono)
- Contact info
- Site URL and path prefix

### 3. Extract Content
```bash
npm run extract -- --pdf path/to/client.pdf --output clients/new-client-name/
```

### 4. Scrape Design
```bash
npm run scrape -- --url https://client-reference-site.com --output clients/new-client-name/
```

### 5. Merge & Review
```bash
npm run merge -- --client new-client-name
# Review: clients/new-client-name/merged-blueprint.json
```

### 6. Build Site
```bash
npm run build:client -- --client=new-client-name
```

### 7. Quality Check
- [ ] Lighthouse scores (npm run lighthouse)
- [ ] Accessibility audit (npm run lint:a11y)
- [ ] Link checker (npm run lint:links)
- [ ] Persona audit (npm run audit)

### 8. Deploy
- [ ] Review output in `dist/`
- [ ] Deploy to client's hosting
- [ ] Verify live site
- [ ] Collect feedback
```

---

## VERIFICATION CHECKLIST

### ✅ Phase 1: FREEZE (Must Complete Before Any Other Work)
- [ ] CI no longer auto-deploys to MagUpSite
- [ ] Test commit to DeckSiteAgent does not affect MagUpSite repo
- [ ] MagUpSite repo verified as self-contained
- [ ] MagUpSite README documents the freeze
- [ ] Deploy tokens revoked or rotated (optional)

### ✅ Phase 2: DECOUPLE
- [ ] `whitelabel.config.js` uses env var for `siteUrl`
- [ ] `merge.js` no longer hardcodes MagUpSite URL
- [ ] `clients/` directory structure created
- [ ] `clients/geo42/` contains GEO 42-specific config/content
- [ ] Build scripts accept `--client` flag
- [ ] Can build for multiple clients without conflicts

### ✅ Phase 3: GENERICIZE
- [ ] All templates audited for hardcoded content
- [ ] Content moved to `pageContent.json`
- [ ] Templates render from data (no hardcoding)
- [ ] Content schema documented
- [ ] Content validator script created
- [ ] Tested with 2+ different client configs

### ✅ Phase 4: DOCUMENT
- [ ] README.md updated with new architecture
- [ ] Onboarding guide created
- [ ] Client workspace template ready
- [ ] Examples provided for common scenarios

---

## TIMELINE

| Phase | Duration | Priority | Blockers |
|-------|----------|----------|----------|
| **1. FREEZE** | 1-2 hours | 🔴 CRITICAL | None — do this first |
| **2. DECOUPLE** | 1-2 days | 🟠 HIGH | Must complete Phase 1 |
| **3. GENERICIZE** | 1-2 weeks | 🟡 MEDIUM | Can start after Phase 2 |
| **4. DOCUMENT** | 2-3 days | 🟢 LOW | Can do in parallel with Phase 3 |

**Total time:** 2-3 weeks for complete separation

**Critical path:** Phase 1 FREEZE must happen immediately (today).

---

## RISKS & MITIGATIONS

### Risk 1: MagUpSite Becomes Stale
**Scenario:** Site is frozen, but needs updates (new case study, pricing change, etc.)

**Mitigation:**
- Document manual update process
- Keep GEO 42 client workspace in DeckSiteAgent
- For urgent updates: edit MagUpSite directly, backport to DeckSiteAgent later
- For planned updates: update `clients/geo42/`, build, manually deploy

---

### Risk 2: Genericization Breaks Existing Build
**Scenario:** Removing hardcoded content causes templates to break

**Mitigation:**
- Work in branch: `git checkout -b refactor/genericize-templates`
- Test each change: `npm run build:client -- --client=geo42`
- Compare output: `diff -r dist/ /tmp/original-dist/`
- Merge only when output is identical

---

### Risk 3: Client Workspace Structure Too Complex
**Scenario:** Developers find multi-client setup confusing

**Mitigation:**
- Comprehensive documentation (onboarding guide)
- Helper scripts: `npm run new-client -- --name=foo`
- Video walkthrough (record screen while onboarding first new client)
- Gradual rollout: start with GEO 42 only, add second client to validate

---

## DECISION POINTS

### D1: When to Actually Freeze CI?
**Options:**
1. **Immediately** — safest, prevents any accidents
2. **After next deploy** — allows one final update to MagUpSite
3. **Gradual** — require manual approval for MagUpSite deploys

**Recommendation:** Option 1 (immediately). If updates are needed, do them manually.

---

### D2: Should We Keep Deploy Token?
**Options:**
1. **Revoke entirely** — most secure
2. **Keep for emergencies** — allows manual redeploy if needed
3. **Rotate to new token** — invalidate current access, keep capability

**Recommendation:** Option 2 (keep for emergencies). Might need to redeploy if we find bugs.

---

### D3: Where Does GEO 42 Content Live?
**Options:**
1. **In DeckSiteAgent (`clients/geo42/`)** — keep engine + first client together
2. **In MagUpSite repo** — full separation, client owns everything
3. **Split** — templates in DeckSiteAgent, content in MagUpSite

**Recommendation:** Option 1 for now (keep together), Option 2 long-term (after genericization).

---

## NEXT ACTIONS

1. **Get approval on this plan**
   - [ ] Review with stakeholders
   - [ ] Confirm freeze is acceptable
   - [ ] Agree on timeline

2. **Execute Phase 1 (FREEZE) immediately**
   - [ ] Disable CI auto-deploy
   - [ ] Verify MagUpSite independence
   - [ ] Document the freeze

3. **Schedule Phase 2-4 work**
   - [ ] Create issues/tasks for each action item
   - [ ] Assign owners
   - [ ] Set deadlines

---

## APPENDIX: CURRENT STATE ANALYSIS

### What We Have Now
- ✅ Beautiful, polished GEO 42 marketing site (MagUpSite)
- ✅ Well-architected pipeline (extract, scrape, merge, build)
- ✅ 11 sophisticated persona definitions
- ✅ Solid build tooling (Eleventy, Tailwind, linters)

### What's Missing
- ❌ Production stability (CI can break live site)
- ❌ Client separation (GEO 42 hardcoded everywhere)
- ❌ Template reusability (56% bespoke content)
- ❌ Persona operational integration (prompts exist, not wired into code)

### What This Plan Fixes
- ✅ Freezes MagUpSite (production stability)
- ✅ Creates client workspace structure (separation)
- ✅ Genericizes templates (reusability)
- ⏸️  Persona integration (Phase 1 of master plan, separate effort)

---

**END OF SEPARATION PLAN**
