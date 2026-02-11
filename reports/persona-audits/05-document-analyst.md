# Document Analyst -- Site Audit Report

**Persona:** Document Analyst (Persona 05)
**Audit Date:** 2026-02-11
**Files Analyzed:**
- `data/raw-extract.json` -- Source extraction (18-slide deck + user notes, 24 sections, 8 tables)
- `data/merged-blueprint.json` -- Bridge/merge output
- `src/_data/pageContent.json` -- Final site content data
- `whitelabel.config.js` -- Brand identity configuration
- `src/sections.njk` -- Custom section template with table rendering
- `src/index.njk` -- Homepage template
- `src/about.njk` -- About page template
- `src/contact.njk` -- Contact page template
- `src/services.njk` -- Services page template
- `src/team.njk` -- Team page template
- `src/_data/site.js` -- Site metadata (derived from whitelabel config)
- `src/_data/nav.js` -- Navigation structure (reads from merged-blueprint)

---

## Executive Summary

The content extraction pipeline achieves high textual fidelity -- the core narrative from all 24 raw-extract sections is preserved through the pipeline, and body content is carried word-for-word in most cases. However, three critical structural problems undermine the output: (1) a brand identity split where the whitelabel config layer rebrands to "GEO 42" while body content still references "MagUp", (2) four sections present in the raw extraction and merged blueprint are missing from the root-level `custom_sections` array that drives page generation, creating dead navigation links (404 errors), and (3) three structured tables were silently dropped from the renderable `tables` array. One data point was also silently altered ("Enterprises served: 1000+" became "Enterprise reach: Global"), losing a specific quantitative metric.

---

## Critical Issues (Must Fix)

### C1. Brand Identity Split: MagUp vs GEO 42

The raw extraction identifies the brand as **"MagUp"** with contact `hello@magup.io` and URL `https://www.magup.io`. The merged blueprint preserves this identity. However, the whitelabel config and the top-level nodes in `pageContent.json` have been overwritten to **"GEO 42"** with `hello@geo42.ai` and `https://geo42.ai`.

| Data Point | raw-extract.json | merged-blueprint.json | whitelabel.config.js | pageContent.json (root) |
|---|---|---|---|---|
| Company name | MagUp | MagUp | **GEO 42** | **GEO 42** |
| Tagline | Content Marketing Brain for 1000+ Global Enterprises | (same) | **The Answer Engine for Enterprise Brands** | **The Answer Engine for Enterprise Brands** |
| Email | hello@magup.io | hello@magup.io | **hello@geo42.ai** | **hello@geo42.ai** |
| URL | https://www.magup.io | https://www.magup.io | **https://www.geo42.ai** | **https://geo42.ai** |
| Industry | MarTech / AI-Powered Content Marketing | (same) | **AI Visibility & Generative Engine Optimization** | MarTech / AI-Powered Content Marketing |

Meanwhile, the `pageContent.json` file has a **nested `content` sub-object** that preserves the original MagUp branding, and the `custom_sections` body text throughout the file still references "MagUp" (e.g., "MagUp's Visibility Flywheel Growth Model", "MagUp tracks and optimizes...", "MagUp provides...").

**Result:** The site header, footer, contact page, JSON-LD structured data, and Open Graph metadata all render "GEO 42" with `hello@geo42.ai` (sourced via `site.js` from `whitelabel.config.js`). But every section page body reads "MagUp does X" and "MagUp provides Y". Visitors see two different brand names on the same site.

**Recommendation:** Align on a single brand identity. If the rebrand to "GEO 42" is intentional, update all `custom_sections` body text and the nested `content` sub-object to reference "GEO 42" instead of "MagUp". If MagUp is the correct brand, revert `whitelabel.config.js` and the top-level `pageContent.json` nodes.

### C2. Four Sections Missing from Page Generation -- Dead Navigation Links

The raw extraction contains **24 sections** (including About MagUp and MagUp Delivery Team). The root-level `custom_sections` array in `pageContent.json` -- which `sections.njk` paginates over to generate individual pages -- contains only **18 entries**. Four sections are present in the raw extraction and in `merged-blueprint.json` but are **absent from the root-level `custom_sections`**:

| Missing Section | Present in raw-extract? | Present in merged-blueprint content.custom_sections? | Present in pageContent.json root custom_sections? | Page Generated? |
|---|---|---|---|---|
| **End-to-End Process** | Yes (section 17) | Yes | **NO** | **NO** |
| **Project Progress Tracking** | Yes (section 19) | Yes | **NO** | **NO** |
| **7 AI Agents** | Yes (section 21) | Yes | **NO** | **NO** |
| **Product Architecture** | Yes (section 22) | Yes | **NO** | **NO** |

These sections DO exist in the nested `pageContent.json` -> `content.custom_sections` sub-object (which has 22 entries), but the template `sections.njk` paginates over `pageContent.custom_sections` (the root level with 18 entries), so no pages are generated for them.

**However**, the navigation structure in `merged-blueprint.json` includes URLs for all four:
- `/end-to-end-process/`
- `/project-progress-tracking/`
- `/7-ai-agents/`
- `/product-architecture/`

The `nav.js` file reads page definitions from `merged-blueprint.json`, so these URLs appear in:
- `nav.all` (used in mobile menu and sitemap)
- `nav.footerGroups` "Resources" section (the regex `/case.study|geo|seo|agent|architecture|process/i` matches "7 AI Agents", "Product Architecture", and "End-to-End Process")

**Result:** The mobile navigation and footer contain links to pages that do not exist, producing **404 errors** for site visitors.

**Recommendation:** Add all four missing sections to the root-level `custom_sections` array in `pageContent.json`, ensuring they generate pages. Alternatively, remove them from the navigation if they are intentionally excluded.

### C3. Three Tables Silently Dropped

The raw extraction contains **8 structured tables**. The `merged-blueprint.json` `content.tables` array preserves all 8. However, the root-level `tables` array in `pageContent.json` (which `sections.njk` uses for rendering) contains only **5 tables**.

| Dropped Table | Columns | Rows | Associated Section | Impact |
|---|---|---|---|---|
| **7 AI Agents** | 3 (Agent, Role, Key Capabilities) | 7 | 7 AI Agents | No page exists (C2), so doubly lost |
| **Product Architecture -- Four Core Engines** | 2 (Engine, Capabilities) | 4 | Product Architecture | No page exists (C2), so doubly lost |
| **MagUp Delivery Team Structure** | 2 (Role, Responsibilities) | 5 | MagUp Delivery Team | Section rendered via about.njk hardcoded team, but table form lost |

All three dropped tables ARE present in the nested `content.tables` sub-object (8 entries), but since `sections.njk` references `pageContent.tables` (root level, 5 entries), they are not rendered.

**Recommendation:** Add the 3 missing tables to the root-level `tables` array in `pageContent.json`. This also requires fixing C2 first so the associated section pages exist for the tables to appear on.

### C4. Market Data Table Value Silently Altered

In the raw extraction's "Market Data" table:
- Row 3: `["Enterprises served", "1000+"]`

In both `pageContent.json` (root and nested):
- Row 3: `["Enterprise reach", "Global"]`

The specific quantitative metric "1000+" was replaced with the qualitative descriptor "Global", and the label "Enterprises served" was changed to "Enterprise reach". This loses a concrete data point that appears prominently in the source material (the tagline itself says "1000+ Global Enterprises").

**Recommendation:** Restore the original value: `["Enterprises served", "1000+"]`.

---

## Warnings (Should Fix)

### W1. Duplicate Content Structure in pageContent.json

The `pageContent.json` file has a confusing dual-layer structure:
- **Root level:** `company`, `hero`, `about`, `services`, `team`, `contact`, `custom_sections` (18), `tables` (5), `roadmap`, `industries` -- uses GEO 42 branding
- **Nested `content` sub-object:** `company`, `hero`, `about`, `services`, `team`, `contact`, `custom_sections` (22), `tables` (8), `industries` -- uses MagUp branding

This duplication means the same content exists in two places with different branding and different completeness levels. The nested `content` object is more complete (22 sections, 8 tables) but the templates use the root level (18 sections, 5 tables).

**Recommendation:** Flatten to a single layer. The root-level data should be the canonical, complete dataset.

### W2. About Section Content Differs Between Layers

Raw extraction `About MagUp` section:
> "MagUp is a Content Marketing Brain for 1000+ Global Enterprises. The platform combines GEO (Generative Engine Optimization) and SEO content marketing to efficiently acquire global customers. MagUp helps brands get discovered by both traditional search engines and AI-powered answer engines like ChatGPT, Perplexity, Claude, Gemini, and Google AI Overviews. MagUp deeply cultivates niche industries, helping enterprises quickly build AI content marketing systems overseas."

`pageContent.json` root `about.content`:
> "GEO 42 is the AI visibility platform trusted by leading global enterprises. The platform combines GEO (Generative Engine Optimization) with SEO content marketing to efficiently acquire customers worldwide. GEO 42 helps brands get discovered by both traditional search engines and AI-powered answer engines like ChatGPT, Perplexity, Claude, Gemini, and Google AI Overviews. The platform serves specialized verticals, helping enterprises rapidly build AI-optimized content systems across global markets."

The rewrite changed the meaning subtly -- "1000+ Global Enterprises" was removed, "MagUp deeply cultivates niche industries" became a generic statement. Some brand-specific language was lost.

`pageContent.json` nested `content.about.content` preserves the original MagUp text verbatim, but the `about.njk` template uses the root-level `pageContent.about.content` (the rewritten version).

### W3. "MagUp Delivery Team" Section Handled via Hardcoded Template

The raw extraction has a dedicated "MagUp Delivery Team" section (section 24) with specific content about the hub-and-spoke model. In the final site:
- The `team` data array is rendered on the `about.njk` page (hardcoded team cards) and on `team.njk`
- The delivery team section is NOT a custom_section, so it does not get its own page
- The `about.njk` template has a hardcoded "Your Dedicated GEO Team" section with roles (Data Analysts, KB Architects, Content Leads, Content Ops) embedded directly in the template -- not pulled from data

This means changes to the delivery team content in the data files would not reflect on the About page without also editing the template.

### W4. Service Descriptions Rewritten in pageContent.json Root

The raw extraction's 7 services have specific descriptions. The `pageContent.json` root `services` array has rewritten descriptions (more marketing-oriented, more concise). The nested `content.services` preserves the originals. Examples:

**Raw extraction -- AI Visibility & Brand Presence Tracking:**
> "Track how often your brand appears in AI answers, monitor brand mentions, measure share of visibility, analyze source citations, assess brand sentiment, and optimize content AEO performance across all major AI answer engines."

**pageContent.json root:**
> "Know exactly where you appear -- and where you don't. Real-time monitoring across 10+ AI platforms shows your brand's visibility score, citation rate, and competitive position so you can act before competitors do."

The rewrite loses specific metric names (AEO, source citations, brand sentiment) in favor of benefit-oriented copy. Whether this is appropriate depends on whether the site should mirror the source PDF precisely or adapt for web marketing.

### W5. Roadmap Section Added Without Source Material

The `pageContent.json` root includes a `roadmap` array with 8 phases (Q1 2025 through Q4 2026) that does **not appear anywhere in the raw extraction**. This content was fabricated during the pipeline, not extracted from the source PDF.

While this may be intentionally added to enhance the site, it represents content that cannot be traced back to the source document and should be flagged for client verification.

### W6. "By the Numbers" Stats on About Page Are Inconsistent

The `about.njk` template hardcodes these stats:
- "Global" (Enterprise Reach) -- differs from raw extraction's "1000+"
- "10+" (AI Platforms)
- "7" (AI Agents)
- "+450%" (Brand Mentions)

These values are embedded directly in the template, not pulled from data. The "Global" label contradicts the raw extraction's "1000+ Global Enterprises" tagline. If these metrics change, both the template AND the data files would need updating.

---

## Observations (Nice to Have)

### O1. Dashboard Metrics Hardcoded in index.njk

The homepage has a "Product Preview" carousel (slides 1-5) with specific dashboard mockup data (Visibility Rate: 28.75%, Recommendation Rate: 18.44%, AI Answers: 320, Sources: 97). These values come from the raw extraction's "Real-Time Monitoring Dashboard" section but are hardcoded in the template rather than pulled from data. This is appropriate for a mockup but limits dynamic updates.

### O2. About Page "GEO Optimization Strategy" Is Extra Content

The `about.njk` template includes a "The Trilogy: From Indexing to Recommendation" section with three stages (Expand Sources, Build Reputation, Gain Recommendations). This content does not appear in the raw extraction and was added as editorial enhancement. It may represent content from slide screenshots that was interpreted rather than extracted verbatim.

### O3. FAQ Schema Added Without Source Material

The `base.njk` template includes a JSON-LD FAQPage schema with 7 questions and answers that do not appear in the raw extraction. These were editorially created for SEO value. While beneficial, they should be reviewed for accuracy against the source material.

### O4. Platform List Expanded Beyond Source

The homepage case study stats section lists 10 platforms: ChatGPT, Gemini, Perplexity, DeepSeek, Claude, Google AI, Copilot, Meta AI, Grok, Mistral. The raw extraction only mentions: ChatGPT, Google AI Overviews (SGE), Perplexity, Claude, Gemini, Microsoft Copilot, Doubao, DeepSeek, Tongyi Qianwen (Qwen), and Kimi. "Meta AI", "Grok", and "Mistral" were added; "Doubao", "Qwen", and "Kimi" (Chinese platforms) were dropped from this particular display.

### O5. Client List Faithfully Preserved

All 15 clients from the raw extraction are present and identical in both `pageContent.json` layers: HP, Ford, Nike, McDonald's, Samsung, Amazon, Shopee, Volkswagen, Lenovo, Huawei, DJI, Anker, SHEIN, Temu, TikTok Shop.

---

## What's Working Well

### Textual Content Fidelity
The body text of all 24 extracted sections is preserved verbatim through the pipeline in at least one layer. For the 18 sections that reach the root-level `custom_sections`, the text is word-for-word identical to the raw extraction (with "MagUp" intact in the body, though the brand name discrepancy exists in the chrome).

### Table Structure Preservation (5 of 8)
The 5 tables that made it to the root-level `tables` array maintain perfect structural integrity:
- **6 Walls:** 2 columns, 6 rows -- exact match
- **Visibility Flywheel:** 2 columns, 3 rows -- exact match
- **Market Data:** 2 columns, 3 rows -- headers and 2/3 values match (1 value altered, see C4)
- **SEO vs GEO Comparison:** 3 columns, 5 rows -- exact match
- **Case Study Results:** 3 columns, 5 rows -- exact match

### Table Rendering Template
The `sections.njk` template has a well-implemented table rendering system with proper `<caption>`, `<th scope="col">`, alternating row colors, responsive overflow handling, and fuzzy matching between section titles and table captions. The matching logic covers edge cases (e.g., "6 wall" substring match, "market size" to "market" match).

### Services Array Complete
All 7 services from the raw extraction are present in both layers of `pageContent.json` with their names intact. The root-level versions have rewritten descriptions (more marketing-oriented), while the nested versions preserve the originals.

### Industry Verticals Intact
All 4 industry verticals (Software & AI, Advanced Manufacturing, E-commerce & Consumer, Professional Services) are present with matching descriptions in both layers.

### Team Data Preserved
All 5 team roles from the raw extraction are present in `pageContent.json` with matching names, titles, and bios.

### Contact Data Preserved (In Nested Layer)
The original contact information (hello@magup.io, https://www.magup.io) is preserved in the nested `content.contact` object, even though it was overwritten at the root level.

### Comprehensive Navigation
The `merged-blueprint.json` navigation structure accounts for all sections with proper slugs and URLs. The `nav.js` module provides a buyer's-journey-optimized header nav (Home -> Services -> Case Study -> About -> Contact) and categorized footer groups.

---

## Detailed Findings

### Section-by-Section Comparison

| # | Raw Extraction Section | In root custom_sections? | Page Generated? | Table Present? | Text Fidelity |
|---|---|---|---|---|---|
| 1 | About MagUp | N/A (separate `about` object) | Yes (about.njk) | N/A | Rewritten for GEO 42 branding |
| 2 | 6 Walls Enterprises Face | Yes | Yes | Yes (6 rows, 2 cols) | Verbatim (says "MagUp") |
| 3 | Key Shift in Brand Growth | Yes | Yes | N/A | Verbatim (says "MagUp") |
| 4 | Search Demand Has Not Changed | Yes | Yes | N/A | Verbatim |
| 5 | AI Visibility & Brand Presence | Yes | Yes | N/A | Verbatim (says "MagUp") |
| 6 | Prompt & Demand Intelligence | Yes | Yes | N/A | Verbatim (says "MagUp") |
| 7 | AI Response & Citation Analytics | Yes | Yes | N/A | Verbatim (says "MagUp") |
| 8 | AI Crawler & Technical Optimization | Yes | Yes | N/A | Verbatim (says "MagUp") |
| 9 | Traffic & Attribution | Yes | Yes | N/A | Verbatim (says "MagUp") |
| 10 | Shopping & Product Visibility | Yes | Yes | N/A | Verbatim (says "MagUp") |
| 11 | Proven Results | Yes | Yes | N/A | Verbatim (says "MagUp") |
| 12 | Industry Verticals | Yes | Yes | N/A | Verbatim (says "MagUp") |
| 13 | AI Platform Coverage | Yes | Yes | N/A | Verbatim (says "MagUp") |
| 14 | Core Value of GEO | Yes | Yes | N/A | Verbatim |
| 15 | SEO vs GEO Comparison | Yes | Yes | Yes (5 rows, 3 cols) | Verbatim |
| 16 | Market Size Evolution | Yes | Yes | N/A | Verbatim (says "MagUp") |
| 17 | End-to-End Process | **NO** | **NO (404)** | N/A | Text in nested layer only |
| 18 | Real-Time Monitoring Dashboard | Yes | Yes | N/A | Verbatim (says "MagUp") |
| 19 | Project Progress Tracking | **NO** | **NO (404)** | N/A | Text in nested layer only |
| 20 | GEO Intelligent Dashboard | Yes | Yes | N/A | Verbatim |
| 21 | 7 AI Agents | **NO** | **NO (404)** | **DROPPED** (3 cols, 7 rows) | Text in nested layer only |
| 22 | Product Architecture | **NO** | **NO (404)** | **DROPPED** (2 cols, 4 rows) | Text in nested layer only |
| 23 | Case Study: Regaining AI Voice Share | Yes | Yes | Yes (5 rows, 3 cols) | Verbatim (says "MagUp") |
| 24 | MagUp Delivery Team | N/A (separate `team` array) | Yes (about.njk, team.njk) | **DROPPED** (2 cols, 5 rows) | Preserved in team data |

### Contact Audit

| Contact Point | Raw Extraction | Rendered on Site (via whitelabel.config.js -> site.js) | Status |
|---|---|---|---|
| Email | hello@magup.io | hello@geo42.ai | **ALTERED** |
| URL | https://www.magup.io | https://www.geo42.ai | **ALTERED** |
| Phone | (none) | (none) | N/A |
| Address | (none) | (none) | N/A |

The email appears in: contact page form action (Formspree), contact page display, footer, JSON-LD schema. All render the altered `hello@geo42.ai` address from `whitelabel.config.js`. The original `hello@magup.io` is preserved only in the nested `content.contact` sub-object but is never rendered.

### Structural Fidelity

The raw extraction uses a flat hierarchy: 1 level-1 heading (About MagUp) and 23 level-2 headings. The site preserves this as:
- Level 1 ("About MagUp") -> dedicated `about.njk` page with `<h1>` treatment
- Level 2 sections -> individual pages via `sections.njk` pagination, each with `<h1>` (via computed `title`)

This is an appropriate structural transformation from a flat document to a multi-page site. The heading hierarchy is correctly elevated from H2 in the source to H1 on individual pages.

### Merged Blueprint Assessment

The `merged-blueprint.json` file is the most faithful intermediate artifact. It:
- Preserves MagUp identity and contact information
- Contains complete navigation with all 24+ page URLs
- Nests the full content object with all 22 custom_sections and all 8 tables
- Adds design tokens (colors, typography) from the web scraping step

The fidelity loss occurs in the step from `merged-blueprint.json` to `pageContent.json`, where:
1. The top-level identity was overwritten to GEO 42
2. Four sections were removed from root custom_sections
3. Three tables were removed from root tables
4. One data value was altered (Market Data row 3)

---

## Summary of Required Actions

| Priority | Issue | Action |
|---|---|---|
| **CRITICAL** | C1: Brand identity split | Choose one brand name; update all layers to match |
| **CRITICAL** | C2: 4 missing section pages | Add End-to-End Process, Project Progress Tracking, 7 AI Agents, Product Architecture to root custom_sections |
| **CRITICAL** | C3: 3 missing tables | Add 7 AI Agents, Product Architecture, Delivery Team tables to root tables array |
| **CRITICAL** | C4: Market Data value altered | Restore "Enterprises served: 1000+" |
| **WARNING** | W1: Duplicate data structure | Flatten pageContent.json to single layer |
| **WARNING** | W2: About text rewritten | Verify intended about copy with stakeholders |
| **WARNING** | W3: Delivery team hardcoded | Pull from data instead of hardcoding in template |
| **WARNING** | W4: Service descriptions rewritten | Verify intended service copy with stakeholders |
| **WARNING** | W5: Roadmap fabricated | Verify roadmap content with client |
| **WARNING** | W6: Hardcoded stats on About | Pull from data for maintainability |
