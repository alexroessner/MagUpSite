# DeckSiteAgent Separation & Productization Plan
## 6 Phases, Ordered by Risk

**Status:** Ready to Execute
**Created:** 2026-02-11
**Priority:** Phase 1 → Phase 6 (in order)

---

## Phase 1: Freeze MagUpSite ⚡ DO FIRST (Zero Risk)

**Goal:** Ensure the live GEO 42 site cannot be affected by DeckSiteAgent development

**Actions:**
1. **Remove CI force-push to MagUpSite**
   - Edit `.github/workflows/ci.yml` lines 64-94
   - Comment out or delete the MagUpSite deployment steps
   - MagUpSite already has everything on its main branch
   - GitHub Pages will keep serving it indefinitely

2. **Remove hardcoded MagUpSite URLs**
   - `whitelabel.config.js` line 34: `siteUrl: "https://alexroessner.github.io/MagUpSite"`
   - `scripts/merge.js` line 318: same URL
   - Replace with environment variables or generic defaults

3. **Simplify CI to DeckSiteAgent-only**
   - Keep linting and testing
   - Remove all MagUpSite-specific deployment logic
   - Focus CI on pipeline validation

**Risk:** Zero. MagUpSite is already deployed and self-sufficient.

**Timeline:** 30 minutes

---

## Phase 2: Extract GEO 42 into examples/geo42/

**Goal:** Preserve the hand-crafted GEO 42 data as a reference example

**Actions:**
1. **Create examples directory structure**
   ```
   examples/
   └── geo42/
       ├── input/
       │   ├── company-deck.pdf
       │   └── reference-url.txt
       ├── data/
       │   ├── raw-extract.json
       │   ├── scraped-styles.json
       │   └── merged-blueprint.json
       ├── config/
       │   ├── whitelabel.config.js
       │   └── pageContent.json
       └── README.md
   ```

2. **Move hand-crafted data files**
   - Current `data/*.json` → `examples/geo42/data/`
   - Current `whitelabel.config.js` → `examples/geo42/config/`
   - Current `src/_data/pageContent.json` → `examples/geo42/config/`

3. **Replace with clean defaults**
   - Create generic `whitelabel.config.js` with placeholder values
   - Create empty `data/` directory with `.gitkeep`
   - Create generic `src/_data/pageContent.json` with minimal schema

**Risk:** Low. Just moving files, not changing logic.

**Timeline:** 1-2 hours

---

## Phase 3: Genericize Templates

**Goal:** Templates render from data, not hardcoded content

**The Problem:**
- `index.njk`: ~1,000 lines of hardcoded GEO 42 narrative
- Typewriter text: "ChatGPT|Perplexity|Gemini"
- Robot vacuum case study
- 6 Walls framework
- Specific KPIs and metrics

**The Solution:**
Every section needs to render from `pageContent.json` with `{% if %}` guards:
- Missing data = missing section (not a broken page)
- Clean degradation (partial data = partial section)
- No GEO 42 assumptions

**Files to genericize:**
1. **`src/index.njk`** — Homepage (biggest lift)
2. **`src/about.njk`** — About page
3. **`src/services.njk`** — Services page
4. **`src/contact.njk`** — Contact form
5. **`src/_includes/base.njk`** — FAQs, nav, footer
6. **`src/sections.njk`** — Keyword matching logic

**Pattern:**
```njk
{# BEFORE: #}
<h1>The Answer Engine for Enterprise Brands</h1>

{# AFTER: #}
{% if pageContent.hero.headline %}
  <h1>{{ pageContent.hero.headline }}</h1>
{% endif %}
```

**Risk:** Medium. Templates need careful refactoring and testing.

**Timeline:** 1-2 weeks

---

## Phase 4: Wire Personas Into the Pipeline

**Goal:** Personas aren't just prompts — they actively improve generated content

**New Scripts:**

### `scripts/enrich.js` — Post-Extraction LLM Pass
Each persona reviews and improves the data:

1. **Document Analyst** — Checks data completeness
   - "Is the company description present?"
   - "Are key metrics included?"
   - Flags missing required fields

2. **Copywriter** — Adapts content for web
   - Transforms PDF language → web-friendly copy
   - Adds hooks, improves readability
   - Maintains brand voice

3. **Brand Interpreter** — Validates design consistency
   - Checks color palette coherence
   - Validates typography choices
   - Ensures visual hierarchy

4. **Accessibility Specialist** — Preemptive fixes
   - Adds alt text suggestions
   - Checks color contrast ratios
   - Flags potential WCAG issues

5. **SEO Specialist** — Optimizes for search
   - Suggests meta descriptions
   - Identifies keyword opportunities
   - Recommends schema markup

**Usage:**
```bash
npm run extract -- --pdf document.pdf
npm run enrich              # NEW: LLM-powered improvement
npm run merge
npm run build
```

### Enhanced `scripts/audit.js --deep` Flag
Current audit.js does boolean file-existence checks.
New `--deep` mode uses LLM for quality gates:

```bash
npm run audit               # Fast: file checks only
npm run audit -- --deep     # Slow: persona reviews
```

**Persona reviews:**
- Content completeness (Document Analyst)
- Narrative coherence (Copywriter)
- Contrast ratios (Accessibility)
- WCAG compliance (Accessibility)
- SEO optimization (SEO Specialist)

**Important:** All optional
- Pipeline works deterministic-only without API keys
- LLM enhancement is an optional layer
- Graceful degradation if Anthropic API unavailable

**Risk:** High. Complex persona orchestration, API costs.

**Timeline:** 2-3 weeks

---

## Phase 5: Fix Pipeline Scripts

**Goal:** Pipeline works end-to-end without manual intervention

**Issues to Fix:**

### `scripts/scrape-styles.js`
- **Problem:** Hardcoded Chrome path
- **Solution:** Auto-detect Chrome/Chromium location
  ```javascript
  const chromePath = process.env.CHROME_PATH ||
    findChrome() ||  // Search common locations
    undefined;       // Let Puppeteer download
  ```

### `scripts/extract-pdf.js`
- **Problem:** Fails on image-based PDFs (no text layer)
- **Solution:** OCR fallback using Tesseract.js
  ```javascript
  if (extractedText.length < 100) {
    // Likely scanned PDF, try OCR
    const ocrText = await runOCR(pdfPath);
    return ocrText;
  }
  ```

### End-to-End Test
- **Use GEO 42 example data** as test case
- **Run full pipeline:**
  ```bash
  npm run pipeline -- \
    --pdf examples/geo42/input/company-deck.pdf \
    --url examples/geo42/input/reference-url.txt
  ```
- **Compare output** to known-good baseline
- **Verify:**
  - Data extraction complete
  - Styles scraped correctly
  - Merge produces valid blueprint
  - Build generates working site

**Risk:** Medium. Pipeline bugs can be subtle.

**Timeline:** 1 week

---

## Phase 6: Documentation & Product Identity

**Goal:** DeckSiteAgent presents as a professional SaaS product

### README Rewrite as Product Page
Transform from "project README" to "product landing page"

**Structure:**
```markdown
# DeckSiteAgent
## Autonomous Website & Deck Generator

[Hero section with value prop]
[Feature highlights with icons]
[How it works (3-step diagram)]
[Proof of concept (MagUpSite link)]
[Get started (installation)]
[Roadmap (3 horizons)]
```

### DeckSiteAgent GitHub Pages as Demo Site
Currently: Fallback deployment of GEO 42 site
Future: Product demo site for DeckSiteAgent itself

**Content:**
- Product overview and value proposition
- Live demos (show generated outputs)
- Documentation hub
- Persona system explainer
- API docs (when available)

**URL:** `https://alexroessner.github.io/DeckSiteAgent`

**Deploy from:** `docs/` directory or separate branch

### Examples Gallery
Showcase sites built with DeckSiteAgent:
- MagUpSite (GEO 42)
- Future client examples (anonymized)
- Template variants (marketing-site, pitch-deck, etc.)

**Risk:** Low. Just documentation work.

**Timeline:** 3-4 days

---

## Timeline Summary

| Phase | Duration | Start After | Cumulative |
|-------|----------|-------------|------------|
| 1. Freeze MagUpSite | 30 min | Now | 30 min |
| 2. Extract GEO 42 | 1-2 hours | Phase 1 | 3 hours |
| 3. Genericize Templates | 1-2 weeks | Phase 2 | 2 weeks |
| 4. Wire Personas | 2-3 weeks | Phase 3 | 5 weeks |
| 5. Fix Pipeline | 1 week | Phase 4 | 6 weeks |
| 6. Documentation | 3-4 days | Phase 5 | 6.5 weeks |

**Critical Path:** Phases 1-3 must be sequential
**Parallelizable:** Phases 5-6 can overlap with Phase 4

---

## Success Criteria

### Phase 1 ✅
- [ ] MagUpSite live site unchanged
- [ ] No CI deployment to MagUpSite
- [ ] DeckSiteAgent pushes don't affect MagUpSite

### Phase 2 ✅
- [ ] GEO 42 data in `examples/geo42/`
- [ ] Clean default configs in root
- [ ] Can build generic site without GEO 42 data

### Phase 3 ✅
- [ ] Templates render from `pageContent.json`
- [ ] No hardcoded GEO 42 content
- [ ] Graceful handling of missing data
- [ ] Test with 2+ different datasets

### Phase 4 ✅
- [ ] `scripts/enrich.js` improves extracted data
- [ ] `npm run audit --deep` provides LLM reviews
- [ ] Works without API keys (degrades gracefully)
- [ ] Persona orchestration functional

### Phase 5 ✅
- [ ] Chrome path auto-detected
- [ ] OCR fallback for scanned PDFs
- [ ] End-to-end test passes with GEO 42 example
- [ ] Pipeline runs without manual intervention

### Phase 6 ✅
- [ ] README rewritten as product page
- [ ] DeckSiteAgent Pages deployed
- [ ] Examples gallery live
- [ ] Documentation complete

---

## Risk Mitigation

### Risk: Breaking MagUpSite During Separation
**Mitigation:** Phase 1 freezes it immediately (zero risk)

### Risk: Templates Break During Genericization
**Mitigation:**
- Work in branch: `git checkout -b refactor/genericize`
- Test each file individually
- Compare output to baseline: `diff -r dist/ baseline-dist/`
- Don't merge until output matches

### Risk: Persona Orchestration Complexity
**Mitigation:**
- Start simple (single persona review)
- Add personas incrementally
- Make LLM calls optional
- Fallback to deterministic behavior

### Risk: Pipeline Scripts Fail in Production
**Mitigation:**
- Comprehensive error handling
- Retry logic with exponential backoff
- Detailed logging
- Graceful degradation

---

## Next Actions

**Immediate (Phase 1):**
1. Review this plan
2. Get approval to proceed
3. Execute Phase 1 (freeze MagUpSite)
4. Verify MagUpSite stability
5. Commit changes

**Short-term (Phases 2-3):**
1. Extract GEO 42 to examples/
2. Begin template genericization
3. Test with multiple datasets

**Medium-term (Phases 4-6):**
1. Build persona enrichment system
2. Fix pipeline scripts
3. Create product documentation
4. Launch DeckSiteAgent demo site

---

## Decision Log

### D1: Where Does GEO 42 Data Live?
**Decision:** `examples/geo42/` in DeckSiteAgent repo
**Rationale:**
- Keeps example close to code
- Easy to test pipeline against known data
- Can reference in documentation
- No separate repo needed

### D2: Should Personas Be Required?
**Decision:** No, optional enhancement
**Rationale:**
- Pipeline should work deterministically
- LLM calls add cost and latency
- Graceful degradation for users without API keys
- Optional `--enrich` flag for premium quality

### D3: What Happens to MagUpSite Repo?
**Decision:** Remains as deployed site only
**Rationale:**
- Already serving production traffic
- Has deployment history in git
- No need for source files (they're in examples/geo42/)
- Can manually update if needed (build in DeckSiteAgent, copy dist/)

---

**END OF PLAN**
