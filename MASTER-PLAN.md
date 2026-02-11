# MASTER PLAN
## The Definitive Blueprint for GEO 42 Platform Evolution

**Status:** Active Development Blueprint
**Created:** 2026-02-11
**Owner:** Alex Roessner / MagUpUS
**Version:** 1.0.0

---

## EXECUTIVE SUMMARY

This document is the single source of truth for the GEO 42 platform evolution. It consolidates:
- **Phase 0:** 56 immediate fixes to the current MagUpUS site
- **Phase 1:** Autonomous content generation (Horizon 1)
- **Phase 2:** Autonomous pipeline infrastructure (Horizon 2)
- **Phase 3:** Platform-as-a-service vision (Horizon 3)

All work flows from this document. Every commit, every decision, every architectural choice traces back here.

---

## ENTITY DEFINITIONS

### MagUpUS
- **Type:** Client-facing marketing site
- **Tech:** Eleventy 3.1.2, Tailwind CSS 4.1.18, Three.js
- **Repository:** `/home/user/MagUpUS`
- **Purpose:** Showcase GEO 42 methodology, convert visitors to clients
- **Current State:** Feature-complete pending client content (D1-D6)

### DeckSiteAgent
- **Type:** Autonomous deck generation engine
- **Tech:** Node.js, Anthropic API, LangChain
- **Repository:** `/home/user/DeckSiteAgent`
- **Purpose:** Generate pitch decks from company data using 11-persona workflow
- **Current State:** Working prototype with 11-persona audit system

### GEO 42 Platform
- **Type:** Future unified platform
- **Purpose:** End-to-end business intelligence → content generation → multi-format output
- **Target Customers:** Strategic consultants, investment firms, corporate development teams
- **Revenue Model:** SaaS subscriptions + white-label licensing

---

## SEPARATION STRATEGY

### Current Problem
MagUpUS and DeckSiteAgent share overlapping concerns:
- Both generate content
- Both use 11-persona workflow
- Both target similar audiences
- Both need brand consistency

### Solution: Clear Boundaries

#### MagUpUS Owns:
1. Marketing site (`/home/user/MagUpUS`)
2. Brand system (colors, typography, voice)
3. GEO 42 methodology documentation
4. Client-facing content (case studies, testimonials)
5. Landing pages and conversion funnels

#### DeckSiteAgent Owns:
1. Autonomous generation engine (`/home/user/DeckSiteAgent`)
2. 11-persona workflow implementation
3. API integrations (Anthropic, data sources)
4. Template systems (Reveal.js, PDF, etc.)
5. Pipeline orchestration

#### Shared Infrastructure (Future):
- Centralized brand config (imported by both)
- Persona definitions (single source, dual import)
- Content quality metrics
- Decision logging system

### Implementation Rules
1. **No code duplication** — shared code lives in `@geo42/core` package
2. **No cross-imports** — MagUpUS never imports DeckSiteAgent code
3. **Config inheritance** — both projects import from `whitelabel.config.js`
4. **Independent deploys** — each project has its own build pipeline

---

## PHASE 0: FOUNDATION (56 IMMEDIATE FIXES)

**Goal:** Ship the polished MagUpUS site with all audit findings addressed.
**Timeline:** 1-2 weeks (client content dependent)
**Success Metrics:**
- Zero accessibility violations (WCAG 2.1 AA)
- 90+ Lighthouse scores across all categories
- Complete brand consistency
- All dead-end pages converted to conversion paths

### 0.1 ACCESSIBILITY (12 items)

#### Critical
- [ ] **A1:** Add skip-to-content link (index.njk:1)
- [ ] **A2:** Implement focus visible styles across all interactive elements
- [ ] **A3:** Add aria-labels to all icon-only buttons
- [ ] **A4:** Fix heading hierarchy (no h1→h3 jumps)

#### High Priority
- [ ] **A5:** Add alt text to all decorative images (empty string for decorative)
- [ ] **A6:** Ensure color contrast meets WCAG AA (4.5:1 text, 3:1 UI)
- [ ] **A7:** Make Three.js hero scene keyboard navigable (tab stops)
- [ ] **A8:** Add aria-live regions for dynamic content updates

#### Medium Priority
- [ ] **A9:** Test with screen readers (NVDA, VoiceOver)
- [ ] **A10:** Add proper form labels and error states
- [ ] **A11:** Implement reduced-motion preferences
- [ ] **A12:** Add landmark roles where missing (nav, main, aside)

### 0.2 BRAND CONSISTENCY (14 items)

#### Critical
- [ ] **B1:** Replace all gold (#D4AF37) with purple (#7C3AED)
- [ ] **B2:** Unify typography (currently mixing system fonts)
- [ ] **B3:** Standardize button styles (4 variants currently)
- [ ] **B4:** Fix logo inconsistencies (waiting on client SVG)

#### High Priority
- [ ] **B5:** Apply voice guidelines to all copy (remove jargon, add specificity)
- [ ] **B6:** Standardize card shadows (3 different styles currently)
- [ ] **B7:** Unify CTA button text ("Get Started" vs "Start Now" vs "Learn More")
- [ ] **B8:** Fix icon style mixing (outlined vs filled)

#### Medium Priority
- [ ] **B9:** Create CSS custom properties for all brand tokens
- [ ] **B10:** Document component usage guidelines
- [ ] **B11:** Add brand checklist to PR template
- [ ] **B12:** Create visual regression tests
- [ ] **B13:** Unify animation timing (currently 0.2s, 0.3s, 0.5s)
- [ ] **B14:** Standardize spacing scale (use Tailwind defaults only)

### 0.3 CONTENT & CONVERSION (18 items)

#### Critical
- [ ] **C1:** Add CTAs to 6 dead-end sections (DONE)
- [ ] **C2:** Replace "we believe" claims with evidence
- [ ] **C3:** Add social proof to homepage hero
- [ ] **C4:** Create FAQ section (10-12 common questions)

#### High Priority
- [ ] **C5:** Write case study outlines (waiting on client: D1)
- [ ] **C6:** Add testimonials section (waiting on client: D2)
- [ ] **C7:** Create pricing page with tiers (waiting on client: D4)
- [ ] **C8:** Document methodology step-by-step (expand GEO 42 explainer)
- [ ] **C9:** Add team bios page (waiting on client: D3)

#### Medium Priority
- [ ] **C10:** Create resources/blog section
- [ ] **C11:** Add newsletter signup form
- [ ] **C12:** Create lead magnet (methodology PDF download)
- [ ] **C13:** Add live chat widget
- [ ] **C14:** Create contact form with qualification fields
- [ ] **C15:** Add exit-intent popup
- [ ] **C16:** Create retargeting pixel integration plan
- [ ] **C17:** Add client logo bar (waiting on client: D6)
- [ ] **C18:** Create video explainer script

### 0.4 TECHNICAL DEBT (8 items)

#### Critical
- [ ] **T1:** Fix iOS carousel bug (DONE)
- [ ] **T2:** Optimize Three.js bundle (currently 400KB)
- [ ] **T3:** Implement proper error boundaries
- [ ] **T4:** Add service worker for offline support

#### High Priority
- [ ] **T5:** Set up analytics (Google Analytics 4 + Plausible)
- [ ] **T6:** Implement proper meta tags (OG, Twitter cards)
- [ ] **T7:** Add structured data (Organization, LocalBusiness schemas)
- [ ] **T8:** Create sitemap.xml and robots.txt

### 0.5 SEO OPTIMIZATION (4 items)

#### Critical
- [ ] **S1:** Optimize all page titles (unique, keyword-rich, <60 chars)
- [ ] **S2:** Write meta descriptions (unique, compelling, <160 chars)
- [ ] **S3:** Fix image optimization (use WebP, lazy load)
- [ ] **S4:** Implement internal linking strategy

---

## PHASE 1: HORIZON 1 (AUTONOMOUS CONTENT GENERATION)

**Goal:** DeckSiteAgent generates complete, client-ready pitch decks from minimal input.
**Timeline:** 4-6 weeks
**Success Metrics:**
- 90%+ client acceptance rate without revisions
- <5 minutes generation time for 30-slide deck
- Passes all 11-persona quality gates

### 1.1 INPUT LAYER (Week 1-2)

#### 1.1.1 Data Acquisition
**Objective:** Gather all signal the generator needs.

**Implementation Steps:**
1. **Create unified input schema** (JSON Schema v7)
   ```json
   {
     "company": {
       "name": "string",
       "website": "url",
       "industry": "string",
       "stage": "pre-seed|seed|series-a|...",
       "founded": "date",
       "team_size": "number"
     },
     "product": {
       "description": "string",
       "value_prop": "string",
       "target_market": "string",
       "competitors": ["string"]
     },
     "metrics": {
       "revenue": "number",
       "growth_rate": "number",
       "customers": "number",
       "runway_months": "number"
     },
     "ask": {
       "amount": "number",
       "use_of_funds": "string",
       "timeline": "string"
     }
   }
   ```

2. **Build data enrichment pipeline**
   - [ ] Implement web scraper (Puppeteer + Cheerio)
   - [ ] Integrate Clearbit API for company data
   - [ ] Add Crunchbase integration for funding history
   - [ ] Create LinkedIn scraper for team backgrounds
   - [ ] Build competitor analysis tool (SEMrush API)

3. **Create data validation layer**
   - [ ] Implement Zod schema validation
   - [ ] Add data quality scoring (completeness, freshness, accuracy)
   - [ ] Create missing data inference rules
   - [ ] Build human-in-the-loop review interface

**Deliverables:**
- `src/input/schema.ts` — TypeScript types + Zod validators
- `src/input/enrichment.ts` — Data fetching and augmentation
- `src/input/validation.ts` — Quality checks and scoring
- `tests/input/` — Unit tests for all input modules

**Dependencies:** None
**Risk:** Low — well-defined problem, existing libraries

#### 1.1.2 Context Building
**Objective:** Transform raw data into rich, generation-ready context.

**Implementation Steps:**
1. **Create context assembly engine**
   - [ ] Build market analysis generator (industry trends, TAM/SAM/SOM)
   - [ ] Implement competitive positioning analyzer
   - [ ] Create financial projections engine (3-5 year models)
   - [ ] Build team story generator (backgrounds → narrative)

2. **Add narrative intelligence**
   - [ ] Implement story arc detector (problem → solution → traction → vision)
   - [ ] Create tension/resolution analyzer
   - [ ] Build credibility signal extractor
   - [ ] Add emotional resonance scorer

3. **Build persona-specific context views**
   - [ ] Create 11 context transformers (one per persona)
   - [ ] Implement perspective shifters (brand voice, SEO keywords, etc.)
   - [ ] Add persona-specific validation rules

**Deliverables:**
- `src/context/assembler.ts` — Main context building engine
- `src/context/narrative.ts` — Story intelligence
- `src/context/personas/` — 11 persona-specific transformers
- `tests/context/` — Context quality tests

**Dependencies:** 1.1.1 complete
**Risk:** Medium — narrative intelligence is hard to validate

### 1.2 GENERATION LAYER (Week 2-4)

#### 1.2.1 11-Persona Workflow
**Objective:** Each persona contributes their expertise to the deck.

**Current State:**
- ✅ 11 persona definitions exist
- ✅ Audit system implemented
- ❌ Generation workflow incomplete
- ❌ No inter-persona communication

**Implementation Steps:**
1. **Refactor persona system**
   - [ ] Move personas to `src/personas/definitions/`
   - [ ] Create base `Persona` class with common methods
   - [ ] Implement `generate()` method for each persona
   - [ ] Add `validate()` method for each persona
   - [ ] Create `collaborate()` method for cross-persona feedback

2. **Build orchestration engine**
   - [ ] Implement sequential workflow (accessibility → brand → content → ...)
   - [ ] Add parallel processing for independent personas
   - [ ] Create feedback loop system (personas review each other's work)
   - [ ] Implement revision workflow (max 3 rounds)

3. **Add quality gates**
   - [ ] Create persona-specific quality metrics
   - [ ] Implement automated testing for each persona's output
   - [ ] Build escalation system (human review if quality < threshold)
   - [ ] Add performance monitoring (generation time, API costs)

**Deliverables:**
- `src/personas/base.ts` — Base persona class
- `src/personas/definitions/*.ts` — 11 persona implementations
- `src/orchestration/workflow.ts` — Main orchestration engine
- `src/orchestration/quality.ts` — Quality gate system
- `tests/personas/` — Persona behavior tests

**Dependencies:** 1.1.2 complete
**Risk:** High — complex inter-persona dynamics, hard to debug

#### 1.2.2 Template System
**Objective:** Transform persona outputs into concrete slide content.

**Implementation Steps:**
1. **Create template architecture**
   - [ ] Design template schema (JSON-based)
   - [ ] Build template renderer (Handlebars or EJS)
   - [ ] Create default template library (10-12 standard decks)
   - [ ] Implement dynamic template selection (based on industry, stage, ask)

2. **Build slide generators**
   - [ ] Implement title slide generator
   - [ ] Create problem/solution slide generator
   - [ ] Build market analysis slide generator
   - [ ] Implement traction slide generator
   - [ ] Create team slide generator
   - [ ] Build financials slide generator
   - [ ] Implement ask slide generator
   - [ ] Create appendix generator

3. **Add layout intelligence**
   - [ ] Implement visual hierarchy rules
   - [ ] Create content-to-layout matching algorithm
   - [ ] Build responsive slide layouts
   - [ ] Add accessibility checks (contrast, font size, alt text)

**Deliverables:**
- `src/templates/schema.ts` — Template definition types
- `src/templates/library/` — Default templates
- `src/templates/renderer.ts` — Template rendering engine
- `src/templates/slides/` — Slide-specific generators
- `tests/templates/` — Template rendering tests

**Dependencies:** 1.2.1 complete
**Risk:** Medium — layout algorithm may need tuning

### 1.3 OUTPUT LAYER (Week 4-6)

#### 1.3.1 Multi-Format Export
**Objective:** Generate decks in multiple formats without quality loss.

**Implementation Steps:**
1. **Implement Reveal.js export**
   - [ ] Create Reveal.js template system
   - [ ] Build custom theme matching brand system
   - [ ] Add interactive features (speaker notes, navigation)
   - [ ] Implement live preview mode

2. **Implement PDF export**
   - [ ] Integrate Puppeteer for headless rendering
   - [ ] Create print-optimized CSS
   - [ ] Add vector graphics support
   - [ ] Implement multi-page layouts

3. **Implement PowerPoint export**
   - [ ] Integrate PptxGenJS library
   - [ ] Create PPTX template system
   - [ ] Add custom fonts and brand assets
   - [ ] Implement slide master support

4. **Implement Google Slides export**
   - [ ] Integrate Google Slides API
   - [ ] Create OAuth flow for user authentication
   - [ ] Build slide creation pipeline
   - [ ] Add sharing and permission controls

**Deliverables:**
- `src/export/reveal.ts` — Reveal.js export engine
- `src/export/pdf.ts` — PDF generation
- `src/export/pptx.ts` — PowerPoint export
- `src/export/gslides.ts` — Google Slides integration
- `tests/export/` — Format validation tests

**Dependencies:** 1.2.2 complete
**Risk:** Medium — format quirks, font embedding issues

#### 1.3.2 Quality Assurance
**Objective:** Every generated deck is client-ready.

**Implementation Steps:**
1. **Build automated QA system**
   - [ ] Implement visual regression testing (Percy or similar)
   - [ ] Create content quality checker (grammar, tone, facts)
   - [ ] Add brand compliance validator
   - [ ] Build performance profiler (load time, file size)

2. **Create human review workflow**
   - [ ] Build review interface (side-by-side comparison)
   - [ ] Implement feedback collection system
   - [ ] Add revision tracking
   - [ ] Create approval/rejection workflow

3. **Add analytics and monitoring**
   - [ ] Implement usage tracking (decks generated, formats, industries)
   - [ ] Create quality metrics dashboard
   - [ ] Add error logging and alerting
   - [ ] Build A/B testing framework for template variants

**Deliverables:**
- `src/qa/automated.ts` — Automated QA checks
- `src/qa/review-ui/` — Human review interface
- `src/qa/analytics.ts` — Usage and quality metrics
- `tests/qa/` — QA system tests

**Dependencies:** 1.3.1 complete
**Risk:** Low — well-understood problem

---

## PHASE 2: HORIZON 2 (AUTONOMOUS PIPELINE)

**Goal:** End-to-end automation from CRM trigger to delivered deck.
**Timeline:** 6-8 weeks
**Success Metrics:**
- Zero-touch generation for 80%+ of requests
- <10 minute end-to-end time (trigger → delivery)
- 95%+ client satisfaction scores

### 2.1 INTEGRATION LAYER (Week 1-2)

#### 2.1.1 CRM Integration
**Objective:** Trigger deck generation from CRM events.

**Implementation Steps:**
1. **Build HubSpot integration**
   - [ ] Implement OAuth flow
   - [ ] Create webhook listeners (deal stage changes, form submissions)
   - [ ] Build contact data sync
   - [ ] Add custom properties for deck preferences

2. **Build Salesforce integration**
   - [ ] Implement OAuth flow
   - [ ] Create Apex triggers for deck generation
   - [ ] Build opportunity data sync
   - [ ] Add custom objects for deck metadata

3. **Build Pipedrive integration**
   - [ ] Implement API authentication
   - [ ] Create webhook listeners
   - [ ] Build deal data sync
   - [ ] Add custom fields for deck configuration

**Deliverables:**
- `src/integrations/crm/hubspot.ts`
- `src/integrations/crm/salesforce.ts`
- `src/integrations/crm/pipedrive.ts`
- `tests/integrations/crm/` — Integration tests

**Dependencies:** Phase 1 complete
**Risk:** Medium — CRM APIs can be quirky

#### 2.1.2 Data Source Integration
**Objective:** Pull data from authoritative sources automatically.

**Implementation Steps:**
1. **Build financial data integrations**
   - [ ] QuickBooks API integration
   - [ ] Xero API integration
   - [ ] Stripe API integration (MRR, churn, LTV)
   - [ ] Custom CSV/Excel import

2. **Build market data integrations**
   - [ ] Crunchbase Pro API
   - [ ] PitchBook API
   - [ ] CB Insights API
   - [ ] Public stock data (Yahoo Finance)

3. **Build team data integrations**
   - [ ] LinkedIn API (team backgrounds)
   - [ ] GitHub API (engineering metrics)
   - [ ] AngelList API (startup profiles)

**Deliverables:**
- `src/integrations/data/financial.ts`
- `src/integrations/data/market.ts`
- `src/integrations/data/team.ts`
- `tests/integrations/data/` — Data validation tests

**Dependencies:** 2.1.1 complete
**Risk:** High — data quality and freshness concerns

### 2.2 ORCHESTRATION LAYER (Week 3-4)

#### 2.2.1 Pipeline Engine
**Objective:** Coordinate all systems into a single workflow.

**Implementation Steps:**
1. **Build workflow orchestrator**
   - [ ] Implement state machine (idle → triggered → generating → reviewing → delivered)
   - [ ] Create job queue system (BullMQ or similar)
   - [ ] Add retry logic with exponential backoff
   - [ ] Implement dead letter queue for failures

2. **Build pipeline configuration system**
   - [ ] Create YAML-based pipeline definitions
   - [ ] Implement conditional steps (if/else logic)
   - [ ] Add parallel execution support
   - [ ] Create pipeline versioning

3. **Add monitoring and observability**
   - [ ] Implement distributed tracing (OpenTelemetry)
   - [ ] Create pipeline metrics (duration, success rate, cost)
   - [ ] Add real-time status dashboard
   - [ ] Build alerting system (Slack, PagerDuty)

**Deliverables:**
- `src/pipeline/orchestrator.ts` — Main pipeline engine
- `src/pipeline/config/` — Pipeline definitions
- `src/pipeline/monitoring.ts` — Observability layer
- `tests/pipeline/` — Pipeline behavior tests

**Dependencies:** 2.1.2 complete
**Risk:** Medium — distributed systems are hard

#### 2.2.2 Decision Engine
**Objective:** Make intelligent choices without human intervention.

**Implementation Steps:**
1. **Build template selection algorithm**
   - [ ] Implement ML-based template recommender
   - [ ] Create rules engine for template constraints
   - [ ] Add A/B testing for template variants
   - [ ] Build template performance tracking

2. **Build content optimization engine**
   - [ ] Implement slide ordering optimizer (based on narrative flow)
   - [ ] Create content density balancer (avoid text-heavy slides)
   - [ ] Add visual variety maximizer
   - [ ] Build emotional arc optimizer

3. **Build quality threshold system**
   - [ ] Implement multi-dimensional quality scoring
   - [ ] Create escalation rules (when to involve humans)
   - [ ] Add auto-improvement system (learn from feedback)
   - [ ] Build confidence scoring for decisions

**Deliverables:**
- `src/decisions/template-selector.ts`
- `src/decisions/content-optimizer.ts`
- `src/decisions/quality-scorer.ts`
- `tests/decisions/` — Decision validation tests

**Dependencies:** 2.2.1 complete
**Risk:** High — ML models need training data

### 2.3 DELIVERY LAYER (Week 5-6)

#### 2.3.1 Distribution System
**Objective:** Deliver decks to the right people at the right time.

**Implementation Steps:**
1. **Build email delivery**
   - [ ] Integrate SendGrid or Postmark
   - [ ] Create email templates (notification, deck link, feedback request)
   - [ ] Add attachment handling (PDF direct attach)
   - [ ] Implement send scheduling

2. **Build CRM delivery**
   - [ ] Push deck links back to CRM
   - [ ] Update deal/opportunity records
   - [ ] Create tasks for follow-up
   - [ ] Add deck viewing analytics

3. **Build secure link sharing**
   - [ ] Implement expiring links (7-day default)
   - [ ] Add password protection option
   - [ ] Create view tracking (who opened, when, for how long)
   - [ ] Build download analytics

**Deliverables:**
- `src/delivery/email.ts`
- `src/delivery/crm.ts`
- `src/delivery/secure-links.ts`
- `tests/delivery/` — Delivery verification tests

**Dependencies:** 2.2.2 complete
**Risk:** Low — well-understood problem

#### 2.3.2 Feedback Loop
**Objective:** Learn from every deck to improve the next one.

**Implementation Steps:**
1. **Build feedback collection system**
   - [ ] Create in-deck feedback widget
   - [ ] Implement email-based surveys
   - [ ] Add CRM-based feedback capture
   - [ ] Build slide-level feedback (thumbs up/down per slide)

2. **Build analytics pipeline**
   - [ ] Track deck opens, views, time-on-slide
   - [ ] Implement conversion tracking (deck → meeting booked)
   - [ ] Create cohort analysis (industry, stage, template)
   - [ ] Build ROI calculator (deck quality → close rate)

3. **Build improvement engine**
   - [ ] Implement feedback → training data pipeline
   - [ ] Create automated template tuning
   - [ ] Add persona prompt optimization
   - [ ] Build A/B test result analyzer

**Deliverables:**
- `src/feedback/collection.ts`
- `src/feedback/analytics.ts`
- `src/feedback/improvement.ts`
- `tests/feedback/` — Feedback system tests

**Dependencies:** 2.3.1 complete
**Risk:** Medium — need critical mass of data

---

## PHASE 3: HORIZON 3 (PLATFORM VISION)

**Goal:** Launch GEO 42 Platform as a standalone SaaS product.
**Timeline:** 12-16 weeks
**Success Metrics:**
- 100 paying customers in first 6 months
- $50K MRR by month 12
- 40%+ gross margin
- <5% monthly churn

### 3.1 PRODUCTIZATION (Week 1-4)

#### 3.1.1 Multi-Tenancy
**Objective:** Support multiple customers with isolated data.

**Implementation Steps:**
1. **Build tenant management system**
   - [ ] Create tenant database schema (Postgres)
   - [ ] Implement tenant provisioning flow
   - [ ] Add tenant isolation (row-level security)
   - [ ] Build tenant admin interface

2. **Build white-labeling system**
   - [ ] Create customizable brand configuration
   - [ ] Implement custom domain support
   - [ ] Add logo/color upload interface
   - [ ] Build email template customization

3. **Build usage tracking and billing**
   - [ ] Implement usage metering (decks generated, API calls)
   - [ ] Integrate Stripe for subscription billing
   - [ ] Create usage-based pricing tiers
   - [ ] Build invoice generation

**Deliverables:**
- `src/platform/tenants/` — Tenant management
- `src/platform/whitelabel/` — Customization system
- `src/platform/billing/` — Usage and payments
- `tests/platform/tenants/` — Multi-tenancy tests

**Dependencies:** Phase 2 complete
**Risk:** High — data isolation is critical

#### 3.1.2 User Management
**Objective:** Teams can collaborate on deck generation.

**Implementation Steps:**
1. **Build authentication system**
   - [ ] Implement Auth0 or similar
   - [ ] Add SSO support (SAML, OAuth)
   - [ ] Create password reset flow
   - [ ] Implement MFA

2. **Build authorization system**
   - [ ] Create role-based access control (RBAC)
   - [ ] Define roles: Admin, Editor, Viewer
   - [ ] Implement permission checks
   - [ ] Add audit logging

3. **Build team collaboration features**
   - [ ] Implement real-time commenting (WebSocket)
   - [ ] Add deck sharing and permissions
   - [ ] Create activity feed
   - [ ] Build @mention notifications

**Deliverables:**
- `src/platform/auth/` — Authentication
- `src/platform/authz/` — Authorization
- `src/platform/collaboration/` — Team features
- `tests/platform/auth/` — Security tests

**Dependencies:** 3.1.1 complete
**Risk:** Medium — auth is table stakes

### 3.2 SCALABILITY (Week 5-8)

#### 3.2.1 Infrastructure
**Objective:** Handle 1000+ concurrent deck generations.

**Implementation Steps:**
1. **Build containerized architecture**
   - [ ] Create Dockerfile for all services
   - [ ] Implement Docker Compose for local dev
   - [ ] Add health checks and readiness probes
   - [ ] Build CI/CD pipeline (GitHub Actions)

2. **Deploy to cloud infrastructure**
   - [ ] Set up AWS/GCP account structure
   - [ ] Implement Infrastructure as Code (Terraform)
   - [ ] Deploy Kubernetes cluster (EKS or GKE)
   - [ ] Configure auto-scaling policies

3. **Add performance optimization**
   - [ ] Implement Redis caching layer
   - [ ] Add CDN for static assets (CloudFront)
   - [ ] Build database read replicas
   - [ ] Implement connection pooling

**Deliverables:**
- `infrastructure/` — Terraform configs
- `k8s/` — Kubernetes manifests
- `.github/workflows/` — CI/CD pipelines
- `docs/deployment.md` — Deployment guide

**Dependencies:** 3.1.2 complete
**Risk:** High — cloud costs can spiral

#### 3.2.2 Reliability
**Objective:** 99.9% uptime SLA.

**Implementation Steps:**
1. **Build redundancy and failover**
   - [ ] Implement multi-AZ deployment
   - [ ] Add database backups (daily, 30-day retention)
   - [ ] Create disaster recovery plan
   - [ ] Build blue/green deployment system

2. **Add comprehensive monitoring**
   - [ ] Set up Prometheus + Grafana
   - [ ] Create SLI/SLO dashboards
   - [ ] Implement error budget tracking
   - [ ] Add synthetic monitoring (Pingdom)

3. **Build incident response**
   - [ ] Create on-call rotation (PagerDuty)
   - [ ] Write runbooks for common incidents
   - [ ] Implement automated remediation
   - [ ] Build postmortem process

**Deliverables:**
- `infrastructure/monitoring/` — Monitoring setup
- `docs/runbooks/` — Incident runbooks
- `docs/sla.md` — SLA documentation
- `tests/load/` — Load testing suite

**Dependencies:** 3.2.1 complete
**Risk:** Medium — incidents will happen

### 3.3 GO-TO-MARKET (Week 9-12)

#### 3.3.1 Marketing Site
**Objective:** Convert visitors to paying customers.

**Implementation Steps:**
1. **Evolve MagUpUS into platform site**
   - [ ] Reposition messaging (from consulting to platform)
   - [ ] Add product tour and demo videos
   - [ ] Create pricing page with clear tiers
   - [ ] Build ROI calculator

2. **Build content marketing engine**
   - [ ] Launch blog with SEO-optimized content
   - [ ] Create lead magnets (templates, guides)
   - [ ] Build email nurture sequences
   - [ ] Add webinar registration

3. **Implement conversion optimization**
   - [ ] Add free trial signup flow
   - [ ] Create onboarding checklist
   - [ ] Build referral program
   - [ ] Implement retargeting campaigns

**Deliverables:**
- Updated MagUpUS site with platform positioning
- Content calendar (12 blog posts, 4 webinars)
- Email sequences (trial, onboarding, churn prevention)
- Analytics dashboard (conversion funnel, CAC, LTV)

**Dependencies:** 3.2.2 complete
**Risk:** Medium — product-market fit uncertain

#### 3.3.2 Sales Process
**Objective:** Repeatable motion from lead → customer.

**Implementation Steps:**
1. **Build sales assets**
   - [ ] Create demo script and environment
   - [ ] Write sales deck (ironic!)
   - [ ] Build ROI calculator for prospects
   - [ ] Create case studies (need 3-5 early customers)

2. **Implement sales tools**
   - [ ] Set up CRM (HubSpot or Salesforce)
   - [ ] Create sales stages and pipeline
   - [ ] Build qualification framework (BANT or MEDDIC)
   - [ ] Add contract templates

3. **Build customer success program**
   - [ ] Create onboarding playbook
   - [ ] Implement health scoring
   - [ ] Build expansion playbook (upsell/cross-sell)
   - [ ] Add churn prevention workflows

**Deliverables:**
- `sales/` — Sales playbook and assets
- CRM configured with pipelines and automation
- Customer success playbook
- Revenue dashboard (MRR, churn, expansion)

**Dependencies:** 3.3.1 complete
**Risk:** High — sales is hard

### 3.4 EXPANSION (Week 13-16)

#### 3.4.1 Adjacent Use Cases
**Objective:** Expand beyond pitch decks.

**Possible Directions:**
1. **Board reporting decks** — quarterly updates for investors
2. **Sales decks** — product demos, case studies
3. **Internal presentations** — all-hands, strategy reviews
4. **RFP responses** — automated proposal generation
5. **Grant applications** — non-profit, research funding

**Implementation:**
- [ ] Research each use case (interviews with 10-15 potential users)
- [ ] Build persona definitions for each use case
- [ ] Create templates and workflows
- [ ] Launch as add-on modules (pricing TBD)

**Dependencies:** 3.3.2 complete
**Risk:** Medium — focus risk (too many directions)

#### 3.4.2 Platform Ecosystem
**Objective:** Enable third-party developers to extend the platform.

**Implementation Steps:**
1. **Build public API**
   - [ ] Create REST API with OpenAPI spec
   - [ ] Add webhook system for event notifications
   - [ ] Implement API key management
   - [ ] Build rate limiting and quotas

2. **Create developer platform**
   - [ ] Write API documentation (developer.geo42.com)
   - [ ] Build SDKs (JavaScript, Python, Ruby)
   - [ ] Create sandbox environment
   - [ ] Launch developer community (Discord or Slack)

3. **Build marketplace**
   - [ ] Create template marketplace
   - [ ] Add persona plugin system
   - [ ] Implement revenue sharing (70/30 split)
   - [ ] Build review and rating system

**Deliverables:**
- Public API with comprehensive documentation
- SDKs in 3+ languages
- Marketplace with 10+ third-party templates/plugins
- Developer relations program

**Dependencies:** 3.4.1 complete
**Risk:** High — chicken-and-egg problem (need users to attract developers)

---

## DECISION LOG

### D1: Case Studies
**Status:** ⏸️ Blocked — waiting on client
**Decision:** Need 3-5 named case studies for MagUpUS homepage
**Options:**
1. Use anonymized case studies ("Series A SaaS company...")
2. Wait for client to provide named examples
3. Create fictional case studies (clearly labeled)

**Recommendation:** Option 2 (wait for client), fall back to Option 1 if >2 weeks

---

### D2: Testimonials
**Status:** ⏸️ Blocked — waiting on client
**Decision:** Need 5-8 testimonials for social proof
**Options:**
1. Request from past clients
2. Use LinkedIn recommendations
3. Create composite testimonials (ethically dubious)

**Recommendation:** Option 1, supplement with Option 2

---

### D3: Team Bios
**Status:** ⏸️ Blocked — waiting on client
**Decision:** Need team page with headshots and bios
**Options:**
1. Wait for client to provide
2. Use LinkedIn profiles
3. Skip team page entirely

**Recommendation:** Option 1, fall back to Option 2 if >1 week

---

### D4: Pricing
**Status:** ⏸️ Blocked — waiting on client
**Decision:** Need pricing tiers and structure
**Options:**
1. Custom pricing only (enterprise)
2. Tiered pricing (Starter/Pro/Enterprise)
3. Usage-based pricing (per deck)

**Recommendation:** Option 2 for MagUpUS site, Option 3 for platform launch

---

### D5: Methodology Documentation
**Status:** ⏸️ Blocked — waiting on client
**Decision:** Need detailed writeup of GEO 42 methodology
**Options:**
1. Wait for client to provide
2. Infer from existing materials and document
3. Schedule working session with client

**Recommendation:** Option 3 (most collaborative)

---

### D6: Client Logos
**Status:** ⏸️ Blocked — waiting on client
**Decision:** Need logo bar with past clients
**Options:**
1. Wait for client to provide SVGs
2. Use publicly available logos (legal risk)
3. Skip logo bar

**Recommendation:** Option 1, fall back to Option 3 if >2 weeks

---

### D7: Three.js Bundle Size
**Status:** 🟡 Open
**Decision:** Current bundle is 400KB, hurts mobile performance
**Options:**
1. Remove Three.js entirely (lose visual impact)
2. Lazy load Three.js (below the fold)
3. Use lighter alternative (Lottie animations)
4. Optimize bundle (tree-shaking, code splitting)

**Recommendation:** Option 4 first, fall back to Option 2 if insufficient

---

### D8: Template System Architecture
**Status:** 🟡 Open
**Decision:** How should templates be defined and managed?
**Options:**
1. JSON-based DSL (domain-specific language)
2. React components (more flexible, harder to edit)
3. Markdown + frontmatter (simple, limited)
4. Visual builder (no-code, complex to build)

**Recommendation:** Option 1 for MVP, Option 4 for platform launch

---

### D9: Persona Collaboration Model
**Status:** 🟡 Open
**Decision:** How should personas communicate during generation?
**Options:**
1. Sequential (one persona at a time)
2. Parallel (all personas generate, then merge)
3. Graph-based (personas call each other as needed)
4. Hierarchical (lead persona coordinates others)

**Recommendation:** Option 1 for MVP (simplest), Option 3 for scale (most powerful)

---

### D10: Quality Threshold Enforcement
**Status:** 🟡 Open
**Decision:** What happens when generated content fails quality checks?
**Options:**
1. Regenerate automatically (up to N tries)
2. Escalate to human review
3. Ship anyway with warning flag
4. Fail gracefully, notify user

**Recommendation:** Option 1 (3 tries) → Option 2 (human review) → Option 4 (fail)

---

## RISK REGISTER

### R1: Persona Quality Drift
**Probability:** HIGH
**Impact:** HIGH
**Description:** As personas iterate, their outputs may drift from brand standards.

**Mitigation:**
- Implement automated brand compliance checks after each generation
- Create regression test suite with known-good examples
- Add human spot-checks (10% sample rate)
- Version persona prompts and track changes

**Owner:** Engineering
**Status:** 🟡 Monitoring

---

### R2: API Cost Explosion
**Probability:** MEDIUM
**Impact:** HIGH
**Description:** Anthropic API costs could exceed revenue as usage scales.

**Mitigation:**
- Implement aggressive caching (dedupe similar requests)
- Add usage quotas per tenant
- Build cost dashboard with alerts (>$1K/day)
- Negotiate volume discounts with Anthropic

**Owner:** Engineering + Finance
**Status:** 🟡 Monitoring

---

### R3: Data Privacy Breach
**Probability:** LOW
**Impact:** CRITICAL
**Description:** Customer data could leak between tenants or to external parties.

**Mitigation:**
- Implement row-level security in database
- Add automated security scanning (Snyk, Dependabot)
- Conduct quarterly penetration tests
- Obtain SOC 2 Type II certification

**Owner:** Engineering + Legal
**Status:** 🟢 Under control (Phase 1 doesn't have multi-tenancy yet)

---

### R4: Template Lock-In
**Probability:** HIGH
**Impact:** MEDIUM
**Description:** Customers may become dependent on specific templates, making changes risky.

**Mitigation:**
- Version all templates (semantic versioning)
- Implement gradual rollout for template changes (10% → 50% → 100%)
- Add template preview mode (users can test before switching)
- Create migration guides for breaking changes

**Owner:** Product
**Status:** 🟡 Monitoring

---

### R5: Competitor Cloning
**Probability:** MEDIUM
**Impact:** MEDIUM
**Description:** Competitors could reverse-engineer our templates and personas.

**Mitigation:**
- Focus on execution speed (ship faster than competitors)
- Build moat through integrations (CRM, data sources)
- Create proprietary training data (feedback loops)
- Consider IP protection (patents on specific innovations)

**Owner:** Leadership
**Status:** 🟡 Monitoring

---

### R6: Anthropic API Deprecation
**Probability:** LOW
**Impact:** HIGH
**Description:** Anthropic could deprecate Claude models we depend on.

**Mitigation:**
- Abstract LLM calls behind provider interface
- Test with alternative providers (OpenAI, Cohere)
- Monitor Anthropic deprecation notices
- Maintain fallback provider (OpenAI GPT-4)

**Owner:** Engineering
**Status:** 🟢 Under control (provider abstraction exists)

---

### R7: Sales Execution Risk
**Probability:** HIGH
**Impact:** CRITICAL
**Description:** Product is great, but we can't sell it.

**Mitigation:**
- Hire experienced B2B SaaS sales leader early
- Run pilot program with 5-10 design partners
- Build sales playbook based on pilot learnings
- Consider channel partnerships (consulting firms)

**Owner:** Leadership
**Status:** 🔴 High risk (no sales team yet)

---

## METRICS & KPIS

### Phase 0 (Foundation) Metrics
- **Accessibility:** 0 WCAG violations (WAVE + axe-core)
- **Performance:** Lighthouse scores >90 (all categories)
- **SEO:** 20+ organic visitors/day within 30 days of launch
- **Conversion:** 5%+ form submission rate

### Phase 1 (Horizon 1) Metrics
- **Generation Quality:** 90%+ client acceptance rate
- **Generation Speed:** <5 minutes for 30-slide deck
- **Persona Performance:** Each persona passes quality gates >95% of time
- **Cost Per Deck:** <$2 in API costs

### Phase 2 (Horizon 2) Metrics
- **Automation Rate:** 80%+ zero-touch generation
- **End-to-End Time:** <10 minutes (trigger → delivery)
- **Pipeline Reliability:** 99%+ successful job completion
- **Client Satisfaction:** NPS >50

### Phase 3 (Horizon 3) Metrics
- **Revenue:** $50K MRR by month 12
- **Growth:** 20%+ month-over-month growth
- **Retention:** <5% monthly churn
- **Margin:** 40%+ gross margin
- **CAC Payback:** <12 months

---

## APPENDIX A: TECHNICAL STACK

### Current (MagUpUS)
- **Framework:** Eleventy 3.1.2
- **Styling:** Tailwind CSS 4.1.18
- **3D Graphics:** Three.js
- **Hosting:** Netlify
- **Analytics:** None (TBD: Google Analytics 4 + Plausible)

### Current (DeckSiteAgent)
- **Runtime:** Node.js 18+
- **Language:** JavaScript (considering TypeScript migration)
- **LLM:** Anthropic Claude (Sonnet 3.5)
- **Framework:** Custom (no framework currently)

### Future (Platform)
- **Backend:** Node.js + Express or Fastify
- **Database:** PostgreSQL 15+
- **Cache:** Redis 7+
- **Queue:** BullMQ
- **Auth:** Auth0 or Clerk
- **Hosting:** AWS or GCP (Kubernetes)
- **CDN:** CloudFront or Cloudflare
- **Monitoring:** Prometheus + Grafana
- **Logging:** Winston + Loki
- **Tracing:** OpenTelemetry

---

## APPENDIX B: DEPENDENCIES WAITING ON CLIENT

All Phase 0 work can proceed except these items:

1. **D1: Case Studies** — Need 3-5 named examples with metrics
2. **D2: Testimonials** — Need 5-8 quotes with attribution
3. **D3: Team Bios** — Need headshots and backgrounds
4. **D4: Pricing** — Need pricing strategy decision
5. **D5: Methodology** — Need detailed GEO 42 writeup
6. **D6: Client Logos** — Need SVG files for logo bar

**Impact:** These block ~15% of Phase 0 work (9 of 56 items)
**Workaround:** Proceed with other 47 items, use placeholders where needed
**Timeline:** Request client input by 2026-02-14, deadline 2026-02-28

---

## APPENDIX C: OPEN QUESTIONS

1. **Branding:** Should we rename "GEO 42" before platform launch?
2. **Pricing:** Value-based or usage-based pricing for platform?
3. **Target Market:** Strategic consultants vs. startups vs. enterprises?
4. **Sales Motion:** PLG (product-led growth) vs. sales-led?
5. **Fundraising:** Bootstrap vs. raise seed round?
6. **Team:** What roles to hire first? (Sales, engineering, design?)
7. **Partnerships:** Should we partner with CRMs (HubSpot, Salesforce)?
8. **Open Source:** Should we open-source parts of the platform?

---

## NEXT ACTIONS

1. **Immediate (This Week):**
   - [ ] Review this master plan with client
   - [ ] Get client input on D1-D6 (case studies, testimonials, etc.)
   - [ ] Start Phase 0 accessibility fixes (A1-A4)

2. **Short-Term (Next 2 Weeks):**
   - [ ] Complete Phase 0 accessibility fixes (all 12 items)
   - [ ] Complete Phase 0 brand consistency fixes (all 14 items)
   - [ ] Begin Phase 0 technical debt items (T1-T4)

3. **Medium-Term (Next 4 Weeks):**
   - [ ] Complete all Phase 0 work (56 items)
   - [ ] Launch polished MagUpUS site
   - [ ] Begin Phase 1 (Horizon 1) — start with input layer

4. **Long-Term (Next 12 Weeks):**
   - [ ] Complete Phase 1 (autonomous content generation)
   - [ ] Begin Phase 2 (autonomous pipeline)
   - [ ] Start Phase 3 planning (platform productization)

---

## CHANGELOG

### 2026-02-11 — v1.0.0
- Initial master plan created
- Consolidated FRONTIER-VISION.md, IMPLEMENTATION-PLAN.md, EDIT-LIST.md
- Added decision log, risk register, and separation strategy
- Defined all 4 phases with granular implementation steps

---

**END OF MASTER PLAN**
