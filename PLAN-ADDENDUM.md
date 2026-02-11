# Plan Addendum: Architectural Decisions & Realistic Expectations
## Addressing the Five Critical Points

**Created:** 2026-02-11
**Status:** Must Review Before Executing plan.md

---

## Overview

The 6-phase plan in `plan.md` is structurally sound, but glosses over five architectural complexities that will surface during execution. This addendum documents those issues and proposes solutions.

---

## Point 1: Three.js Scenes Are Not Generic

### The Problem

**What exists now:**
- `src/js/three-scene.js` — Custom-built hero globe for GEO 42
- `src/js/flywheel-scene.js` — Rotating flywheel visualization
- `src/js/cta-particles.js` — Particle effects for CTAs
- All tied to GEO 42's visual identity (purple accent, dark navy, tech aesthetic)

**What Phase 3 implies:**
> "Move content to pageContent.json and add {% if %} guards"

**Reality:**
A generic pipeline **cannot assume every generated site gets Three.js.**

An accounting firm's PDF → website doesn't need a 3D globe. A law firm doesn't need particle effects. A restaurant doesn't need a flywheel visualization.

### The Architectural Decision

**Question:** Does the generic template have 3D? Is it opt-in? What does the default visual experience look like?

**Options:**

#### Option A: Three.js is Opt-In
```javascript
// whitelabel.config.js
module.exports = {
  features: {
    threejs: {
      enabled: true,
      scenes: ['hero-globe', 'flywheel', 'cta-particles']
    }
  }
}
```

**Pros:**
- Clean default (no 3D bloat for sites that don't need it)
- Templates use `{% if config.features.threejs.enabled %}`
- Three.js bundle only loaded when needed

**Cons:**
- Requires maintaining two visual paths (with/without 3D)
- Default experience might feel less impressive
- Need fallback hero design (static gradient? Video? Image?)

---

#### Option B: Three.js Always Included, Scenes Are Configurable
```javascript
// whitelabel.config.js
module.exports = {
  hero: {
    type: 'three-globe' | 'video' | 'image' | 'gradient',
    config: { /* scene-specific settings */ }
  }
}
```

**Pros:**
- Consistent architecture (hero slot is always present)
- Easy to swap scenes without template changes
- Three.js optimizations benefit all clients

**Cons:**
- Forces 3D library on sites that don't need it (bundle size)
- Requires building multiple scene types
- Complexity in scene selection logic

---

#### Option C: Template Variants (No Single "Generic" Template)
```
templates/
├── premium-3d/        # Three.js scenes, high-end
├── standard/          # Clean, no 3D, faster
└── minimal/           # Bare-bones, accessibility-first
```

**Pros:**
- Purpose-built templates for different use cases
- No compromise on performance or features
- Clear client choice

**Cons:**
- Maintenance burden (3x templates to update)
- How does pipeline choose which template?
- Risk of templates diverging over time

---

### Recommendation: Option A (Three.js Opt-In) + Static Fallback

**Implementation:**

1. **Default hero (no Three.js):**
   ```njk
   {% if config.features.threejs.enabled %}
     <div id="three-hero-scene"></div>
     <script src="/js/three-scene.js"></script>
   {% else %}
     <div class="hero-gradient">
       <video autoplay muted loop poster="{{ hero.posterImage }}">
         <source src="{{ hero.backgroundVideo }}" type="video/mp4">
       </video>
     </div>
   {% endif %}
   ```

2. **pageContent.json schema:**
   ```json
   {
     "hero": {
       "backgroundVideo": "/videos/hero-bg.mp4",
       "posterImage": "/images/hero-poster.jpg",
       "headline": "...",
       "subheadline": "..."
     }
   }
   ```

3. **GEO 42 config enables 3D:**
   ```javascript
   // examples/geo42/config/whitelabel.config.js
   features: {
     threejs: {
       enabled: true,
       scenes: ['hero-globe', 'flywheel']
     }
   }
   ```

**Why this works:**
- Default template is lightweight (no 3D)
- GEO 42 can still use Three.js (opt-in)
- New clients get clean, fast experience
- Fallback is video/gradient (universally applicable)

**Phase 3 now includes:**
- Build static fallback hero (video or gradient)
- Wrap Three.js scenes in feature flags
- Test both paths (with/without 3D)

---

## Point 2: Schema Mismatch Between merge.js and Templates

### The Problem

**What templates expect (pageContent.json schema):**
```json
{
  "hero": {},
  "about": {},
  "services": {},
  "roadmap": {},           // ← Not produced by merge.js
  "industries": [],        // ← Not produced by merge.js
  "faqs": [],              // ← Not produced by merge.js
  "stats": {},             // ← Not produced by merge.js
  "methodology": {},       // ← Not produced by merge.js
  "challenges": [],        // ← Not produced by merge.js
  "case_studies": []       // ← Not produced by merge.js
}
```

**What merge.js produces:**
```javascript
// scripts/merge.js line ~200-300 (simplified)
{
  identity: {},
  hero: {},
  about: {},
  services: {},
  team: {},
  contact: {},
  custom_sections: [],
  tables: []
}
```

**The gap:**
Templates assume fields that the pipeline doesn't generate. Current GEO 42 site works because `pageContent.json` was **hand-crafted** with all those fields. A generated site from merge.js output would have missing sections.

### The Decision

**Options:**

#### Option A: Templates Only Use What merge.js Produces
- Strip templates of roadmap, industries, faqs, stats, methodology, challenges, case_studies
- Only render identity, hero, about, services, team, contact, custom_sections, tables
- Simpler, but less feature-rich output

#### Option B: Enhance merge.js to Detect and Populate Missing Fields
- Add heuristics to extract FAQs from PDF (look for Q: / A: patterns)
- Detect roadmap sections (keywords: "timeline", "phases", "Q1 2025")
- Infer industries from company description
- Extract stats from tables/charts
- Identify case studies (look for "Case Study:", customer names)

**Complexity:** Medium-high. Lots of pattern matching, false positives.

#### Option C: Make enrich.js (Phase 4) Responsible for Missing Fields
- merge.js produces basic structure (current behavior)
- `scripts/enrich.js` runs LLM passes to **infer** missing fields:
  - **Document Analyst**: "Does this PDF contain FAQs? Extract them."
  - **Content Architect**: "Identify a roadmap or timeline if present."
  - **Copywriter**: "Generate industry tags based on company description."

**Complexity:** High. Requires LLM integration. But this is already planned for Phase 4.

---

### Recommendation: Option C (enrich.js Populates Missing Fields)

**Why:**
- merge.js stays deterministic (no AI guessing)
- enrich.js (Phase 4) is the right place for inference
- Templates can use {% if %} guards for optional fields
- Graceful degradation: missing field = missing section

**Phase 3 implementation:**
```njk
{# Template handles missing fields gracefully #}
{% if pageContent.faqs and pageContent.faqs.length > 0 %}
  <section id="faq">
    <h2>Frequently Asked Questions</h2>
    {% for faq in pageContent.faqs %}
      <div class="faq-item">
        <h3>{{ faq.question }}</h3>
        <p>{{ faq.answer }}</p>
      </div>
    {% endfor %}
  </section>
{% endif %}
```

**Phase 4 enhancement:**
```javascript
// scripts/enrich.js (future)
async function enrichFAQs(pageContent, rawExtract) {
  if (!pageContent.faqs || pageContent.faqs.length === 0) {
    // Use Document Analyst persona to extract FAQs
    const faqs = await extractFAQsWithLLM(rawExtract);
    pageContent.faqs = faqs;
  }
  return pageContent;
}
```

**Action item for Phase 3:**
- Document the **full schema** templates expect
- Add {% if %} guards for ALL optional fields
- Test with minimal data (only what merge.js produces)
- Verify graceful degradation (no broken sections)

---

## Point 3: Phase 4 Timeline Is Too Optimistic

### The Reality Check

**Current state (from audit):**
- 75 out of ~120 persona actions are **unimplemented**
- Personas exist as prompts, not code

**Phase 4 scope (from plan.md):**
- Build `scripts/enrich.js` with 5+ persona LLM passes
- Enhance `audit.js --deep` with LLM-powered quality gates
- Structured output parsing, retry logic, quality validation

**Just the Copywriter persona alone:**
1. Generate unique meta descriptions (30+ pages)
2. Contextual CTAs for each section
3. Headline adaptation for web
4. Print artifact removal
5. Voice consistency checks
6. Readability scoring

**Each action requires:**
- Prompt engineering (get consistent output)
- Structured output parsing (JSON schema validation)
- Retry logic (handle API failures)
- Cost management (batch similar requests)
- Quality checks (verify LLM didn't hallucinate)

### Revised Timeline: 4-6 Weeks (Not 2-3)

**Why longer:**

**Week 1-2: Infrastructure**
- Build LLM client wrapper (Anthropic SDK)
- Implement retry logic with exponential backoff
- Add structured output parsing (Zod schemas)
- Create cost tracking and rate limiting
- Build graceful degradation (no API key = skip enrichment)

**Week 3-4: First 3 Personas**
- **Document Analyst** — Completeness checks (easiest)
- **Copywriter** — Content adaptation (medium complexity)
- **SEO Specialist** — Meta tags and keywords (structured output)

**Week 5-6: Remaining Personas + Quality Gates**
- **Brand Interpreter** — Design validation
- **Accessibility Specialist** — WCAG checks
- **audit.js --deep** — Integrate all persona reviews

**Testing throughout:**
- Unit tests for each persona function
- Integration tests with real GEO 42 data
- Cost analysis ($/generation)
- Quality validation (human review sample)

### Recommendation: Set Realistic Expectations

**Phase 4 revised:**
- **Minimum viable:** 1 persona working (Document Analyst) — 2 weeks
- **Production ready:** 3-5 personas working — 4-6 weeks
- **Full system:** All personas + deep audit — 8-10 weeks

**Incremental rollout:**
```bash
# Week 2: Basic enrichment available
npm run enrich -- --personas document-analyst

# Week 4: Core enrichment (3 personas)
npm run enrich -- --personas document-analyst,copywriter,seo

# Week 6+: Full enrichment
npm run enrich              # All personas
npm run audit -- --deep     # LLM-powered gates
```

---

## Point 4: "Freeze" Is One-Directional, Not Locked

### The Clarification

**What "freeze" means:**
- DeckSiteAgent CI will not push to MagUpSite
- Changes to DeckSiteAgent won't affect MagUpSite

**What "freeze" does NOT mean:**
- MagUpSite repo is read-only
- Nobody can update MagUpSite
- The site is permanently static

**Reality:**
Anyone with write access to the MagUpSite repo can still:
- Push commits directly
- Update via GitHub UI
- Deploy manually

**Is this a problem?**
- Probably not (you control both repos)
- But the framing should be accurate

### Updated Phase 1 Description

**Before (plan.md):**
> "Freeze MagUpSite (do first, zero risk)"

**After (more accurate):**
> "Decouple MagUpSite from DeckSiteAgent CI (zero risk)"

**What it does:**
- ✅ Prevents DeckSiteAgent from auto-deploying to MagUpSite
- ✅ Protects production site from experimental DeckSiteAgent work
- ❌ Does NOT lock MagUpSite repo (still manually editable)

**If true lock is needed:**
1. Set MagUpSite repo to "Restrict who can push" (branch protection)
2. Require PR reviews for main branch
3. Or just rely on the fact that you control both repos

**Recommendation:** Current "freeze" (decouple CI) is sufficient. No need for repo locks.

---

## Point 5: The docs/ Directory Has 29 HTML Files

### The Discovery

```bash
$ ls docs/
404.html
about/
case-study-regaining-ai-voice-share/
contact/
css/
... (29 HTML files total)
```

**What is this?**
- Built GEO 42 site output (from Eleventy)
- Possibly from an older build
- Not referenced in current CI workflow (which builds to `dist/`)

**Questions:**
1. Is docs/ stale? (When was it last built?)
2. Is it served anywhere? (GitHub Pages can serve from docs/)
3. Should it be cleaned during Phase 2?

### Investigation Needed

```bash
# Check if docs/ is current
diff -r docs/ dist/

# Check git history
git log --oneline docs/ | head -10

# Check GitHub Pages settings
# Go to: Settings → Pages → Source
# Is it set to "docs/" or "gh-pages" branch?
```

### Recommendation: Clean docs/ During Phase 2

**Action items for Phase 2:**

1. **Verify docs/ is not actively served**
   - Check GitHub Pages settings
   - If serving from docs/, switch to dist/ or disable
   - Wait 24 hours for DNS propagation

2. **Remove docs/ directory**
   ```bash
   git rm -r docs/
   git commit -m "Remove stale GEO 42 build artifacts from docs/"
   ```

3. **Add to .gitignore**
   ```
   # .gitignore
   dist/
   docs/  # Don't commit built sites
   ```

4. **If docs/ is intentionally there for some other reason:**
   - Document why in README
   - Or rename to `examples/geo42/build/` (move with Phase 2 extraction)

**Updated Phase 2 actions:**
- Extract GEO 42 data to examples/geo42/
- Clean root configs (generic defaults)
- **NEW:** Remove docs/ directory (or move to examples/geo42/build/)

---

## Summary: Revised Plan Expectations

### Phase 1: Decouple (Not "Freeze")
- **What it does:** Stops CI auto-deploy to MagUpSite
- **What it doesn't:** Lock MagUpSite repo from manual edits
- **Timeline:** 30 minutes (unchanged)

### Phase 2: Extract + Clean
- **Added action:** Remove or move docs/ directory
- **Timeline:** 2-3 hours (up from 1-2)

### Phase 3: Genericize + Fallbacks
- **Added complexity:** Three.js opt-in architecture
- **Added complexity:** Schema documentation + {% if %} guards for ALL optional fields
- **Timeline:** 2-3 weeks (up from 1-2, due to fallback design)

### Phase 4: Incremental Persona Integration
- **Revised scope:** Start with 1 persona, add incrementally
- **Revised timeline:** 4-6 weeks for 3-5 personas (up from 2-3 weeks)
- **Milestone 1:** Document Analyst only (2 weeks)
- **Milestone 2:** + Copywriter + SEO (4 weeks)
- **Milestone 3:** + Brand + Accessibility (6 weeks)

### Phase 5: Pipeline Fixes
- **Timeline:** 1 week (unchanged, but now includes docs/ cleanup verification)

### Phase 6: Documentation
- **Timeline:** 3-4 days (unchanged)

### Total Revised Timeline: 8-10 weeks (up from 6.5 weeks)

---

## Architectural Decisions Required Before Phase 3

| Decision | Options | Recommendation | Blocker For |
|----------|---------|----------------|-------------|
| **Three.js handling** | Always included / Opt-in / Template variants | Opt-in + static fallback | Phase 3 |
| **Missing schema fields** | Strip from templates / Enhance merge.js / Use enrich.js | Use enrich.js (Phase 4) | Phase 3 |
| **Phase 4 scope** | All personas / Incremental rollout | Incremental (start with 1) | Phase 4 |
| **docs/ directory** | Keep / Remove / Move to examples | Remove or move | Phase 2 |
| **MagUpSite "lock"** | Repo protection / Trust-based / CI decoupling only | CI decoupling (sufficient) | Phase 1 |

---

## Action Items Before Execution

- [ ] **Review this addendum** — confirm architectural decisions
- [ ] **Investigate docs/ directory** — check if it's actively served
- [ ] **Approve revised timelines** — 8-10 weeks vs. 6.5 weeks
- [ ] **Decide on Three.js approach** — opt-in vs. always included
- [ ] **Document full pageContent.json schema** — what do templates expect?
- [ ] **Set Phase 4 milestones** — which persona first?

---

## Appendix: Full pageContent.json Schema (To Be Documented)

**Task for Phase 3 prep:**
Extract the complete schema from current templates.

**Method:**
```bash
# Find all pageContent references in templates
grep -r "pageContent\." src/ | \
  sed 's/.*pageContent\.\([a-zA-Z0-9_\.]*\).*/\1/' | \
  sort | uniq
```

**Output (partial, needs completion):**
```
hero.headline
hero.subheadline
hero.ctaText
hero.ctaUrl
hero.backgroundVideo
about.title
about.description
services.title
services.items[]
roadmap.phases[]        # ← Not in merge.js
industries[]            # ← Not in merge.js
faqs[].question         # ← Not in merge.js
faqs[].answer           # ← Not in merge.js
stats.clients           # ← Not in merge.js
methodology.steps[]     # ← Not in merge.js
challenges[]            # ← Not in merge.js
case_studies[]          # ← Not in merge.js
```

**Deliverable:** `docs/pageContent-schema.md` with full schema, required vs. optional fields, and which phase populates each field.

---

**END OF ADDENDUM**
