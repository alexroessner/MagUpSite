# Copywriter -- Site Audit Report

## Executive Summary

The GEO 42 website demonstrates strong conceptual messaging and a clear editorial voice that speaks confidently to enterprise MarTech decision-makers. The "binary vs. linear" framing is distinctive and memorable, the FAQ section is sharp, and most CTAs are well-crafted. However, the site suffers from three systemic copy issues: (1) several key claims lack sourcing or attribution, (2) the homepage repeats the same CTA label ("See It in Action") and the same closing paragraph verbatim across sections, creating monotony, and (3) the `pageContent.json` hero and about copy contain bland, feature-listing language that undercuts the sharp voice found in the handcrafted templates.

---

## Critical Issues (Must Fix)

### C1. Unsourced "34x" and "1000x" statistics
**Files:** `/home/user/MagUpUS/src/index.njk` lines 184-196, `/home/user/MagUpUS/src/_data/pageContent.json` lines 129, 189
**Problem:** The stats "34x gap between traditional search volume and AI search adoption" and "AI chatbot traffic has grown 1000x" appear in prominent glass-cards on the homepage and in at least two custom sections. No source, date, methodology, or footnote is provided.
**Risk:** Enterprise buyers will Google these numbers. Without attribution (e.g., "Source: Gartner, Q3 2025" or "Per SimilarWeb data"), they read as fabricated marketing claims and erode trust -- exactly what the "Credibility Wall" section warns against.
**Recommendation:** Add a small-print source citation beneath each stat card (e.g., `<p class="text-[10px] text-primary-600 mt-2">Source: SimilarWeb, 2025</p>`). If no public source exists, reframe as directional language ("orders-of-magnitude growth" rather than "1000x").

### C2. "Trusted by leading enterprise brands worldwide" -- unsubstantiated trust badge
**File:** `/home/user/MagUpUS/src/index.njk` line 35
**Problem:** The hero opens with "Trusted by leading enterprise brands worldwide" as a trust signal. The client marquee below shows HP, Ford, Nike, McDonald's, Samsung, Amazon, etc. -- but there is no indication these are actual GEO 42 clients vs. aspirational logos. For a company founded in 2025, claiming trust from brands of this caliber without case studies, quotes, or "as seen in" proof is a credibility risk.
**Risk:** If these are not verified clients, this is potentially misleading. If they are real, the site needs proof (testimonials, logos used with permission, or "clients include" language).
**Recommendation:** Either (a) add a qualifier like "Brands we serve" or "Optimized for enterprise brands including..." with permission, or (b) replace with a verifiable trust signal ("Monitoring 10+ AI platforms" or "Tracking 2,847+ AI citations weekly").

### C3. Identical closing paragraph used verbatim 3 times
**Files:**
- `/home/user/MagUpUS/src/index.njk` line 1171
- `/home/user/MagUpUS/src/contact.njk` line 19
- `/home/user/MagUpUS/src/about.njk` line 203
**Problem:** The exact sentence "See how GEO 42 can transform your brand from invisible to indispensable across every AI platform" appears verbatim in three locations. The contact page adds "in weeks, not months" -- the only variation.
**Risk:** Repetition signals low editorial effort to discerning readers. It also weakens the phrase through overexposure.
**Recommendation:** Write unique closing copy for each context:
- Homepage CTA: "Your competitors are already optimizing for AI answers. The only question is whether you'll be the brand that gets cited -- or the one that gets erased."
- Contact page: "Tell us your category and we'll show you exactly where you stand in AI search -- free, in 15 minutes."
- About page: "We built GEO 42 because we saw the future of search changing. Let us show you what it looks like for your brand."

### C4. `pageContent.json` hero copy is generic and disconnected from the actual site
**File:** `/home/user/MagUpUS/src/_data/pageContent.json` lines 10-21
**Problem:** The JSON hero block contains `"headline": "GEO 42"` and a `"subheadline"` that is identical to the company description (line 6). The CTA labels are "Contact Us" and "Learn More" -- both generic. Meanwhile, the actual rendered hero in `index.njk` is dramatically better ("Become the Answer on [ChatGPT]"). This means any system consuming `pageContent.json` directly (e.g., LLM context, API consumers) gets a vastly inferior version of the brand message.
**Recommendation:** Update `pageContent.json` hero to match the live site:
```json
{
  "headline": "Become the Answer on Every AI Engine",
  "subheadline": "GEO 42 makes your brand the definitive answer across ChatGPT, Perplexity, Gemini, and beyond. Track visibility, optimize citations, and dominate generative search.",
  "cta_primary": { "text": "See It in Action", "url": "/contact/" },
  "cta_secondary": { "text": "View Case Study", "url": "/case-study-regaining-ai-voice-share/" }
}
```

---

## Warnings (Should Fix)

### W1. "See It in Action" CTA overused (7+ occurrences)
**Files:** Throughout `/home/user/MagUpUS/src/index.njk` (lines 50, 500, 937, 1176), `/home/user/MagUpUS/src/services.njk` (line 71), `/home/user/MagUpUS/src/contact.njk` (lines 59, 89), `/home/user/MagUpUS/src/sections.njk` (line 90), `/home/user/MagUpUS/src/_includes/base.njk` (line 233)
**Problem:** "See It in Action" appears as a CTA button on virtually every page and multiple times on the homepage. While consistency in primary CTA is good, this level of repetition causes banner blindness. The header nav also uses it, meaning a user sees it on every single page load.
**Recommendation:** Vary the CTA text based on funnel position:
- Hero: "See It in Action" (keep -- it's the signature)
- After product showcase: "See Your Brand's AI Visibility" (already used at line 500 -- good)
- After case study: "Get Your Free AI Visibility Audit"
- After flywheel: "Start Your Flywheel" (already used at line 775 -- good)
- After dashboard: "Get Your 90-Day Visibility Forecast" (already used at line 937 -- good)
- Footer CTA: "Book a 15-Minute Demo"
- Sections template: "Explore [Service Name]" instead of generic repeat

Note: The homepage actually has excellent CTA variety in its mid-page links ("See how GEO 42 breaks through", "See these numbers for your brand", "Map your AI blind spots", "Start your flywheel", "Be part of what's next", "Still have questions? Let's talk"). These are strong. The issue is that the *button* CTAs all collapse to the same label.

### W2. Services page uses "Learn more" as link text (7 times)
**File:** `/home/user/MagUpUS/src/services.njk` line 57
**Problem:** Every service card ends with "Learn more" as the link text. This is the weakest possible CTA and provides no accessibility context (screen readers hear "Learn more, Learn more, Learn more...").
**Recommendation:** Use service-specific link text:
- "Track your AI visibility" (for Visibility & Brand Presence)
- "Discover untapped prompts" (for Prompt Intelligence)
- "Analyze your AI citations" (for Citation Analytics)
- "Optimize for AI crawlers" (for Crawler Analytics)
- "Prove your AI ROI" (for Traffic Attribution)
- "Get your products recommended" (for Shopping Visibility)
- "See the full GEO+SEO workflow" (for Content Marketing)

### W3. About page "By the Numbers" card has a vague metric
**File:** `/home/user/MagUpUS/src/about.njk` lines 34-51
**Problem:** The "By the Numbers" card displays four metrics: "Global" (Enterprise Reach), "10+" (AI Platforms), "7" (AI Agents), "+450%" (Brand Mentions). "Global" is not a number -- it's a meaningless geographic claim. And "+450%" without a baseline or timeframe is an orphaned metric.
**Recommendation:**
- Replace "Global" with a concrete metric: "4 Continents", "15+ Countries", or the actual client count
- Qualify "+450%" with context: "+450% Brand Mentions (90-day avg.)" or link it to the case study

### W4. Team "bios" are role descriptions, not personal bios
**File:** `/home/user/MagUpUS/src/_data/pageContent.json` lines 57-87
**Problem:** The team entries are generic role descriptions ("Responsible for campaign scheduling, content strategy design...") rather than human bios. Names are role titles ("Project Leader", "Data Analysts", "Knowledge Base Architects"). This is a placeholder pattern, not actual content.
**Recommendation:** Either (a) populate with real team member names and bios (pending item D3), or (b) reframe the section as "Your Dedicated GEO Team" (which the about page already does at line 141) and remove the pretense that these are individual bios. The about.njk template already has a better version of this content in the "Delivery Model" section (lines 136-173).

### W5. Some wall names in "6 Walls" section don't match `pageContent.json`
**File:** `/home/user/MagUpUS/src/index.njk` lines 633-640 vs `/home/user/MagUpUS/src/_data/pageContent.json` line 119
**Problem:** The homepage uses wall names like "Discovery Wall", "Credibility Wall", "Capability Wall", "Operations Wall", "ROI Wall". The `pageContent.json` uses "Rule Wall", "Trust Wall", "Brand Wall", "Talent Wall", "Operation Wall", "Funding Wall". These are two different naming schemes for the same concept. The homepage versions are better (more action-oriented, more specific to AI visibility), but the inconsistency means the custom section page and the homepage tell different stories.
**Recommendation:** Align on one naming convention. The homepage names are stronger for the web audience. Update `pageContent.json` to match, or add a note explaining the evolution.

### W6. Contact page form heading repeats CTA label
**File:** `/home/user/MagUpUS/src/contact.njk` line 59
**Problem:** The form card heading is "See It in Action" -- the same as the button label. This is tautological. The heading should describe what happens after form submission.
**Recommendation:** Change to "Request Your AI Visibility Audit" or "Get Your Personalized Demo" -- the body copy already says "personalized AI visibility audit", so lean into that.

### W7. Case study avoids naming the actual brand
**File:** `/home/user/MagUpUS/src/_data/pageContent.json` line 204, `/home/user/MagUpUS/src/index.njk` line 564
**Problem:** The case study repeatedly refers to "the client's brand" and "the client's robot vacuum" instead of naming the company. On the homepage, the "AFTER" mockup says "the client's robot vacuum" -- which breaks the immersion of the before/after demo.
**Risk:** Unnamed case studies carry significantly less proof value. Enterprise buyers want to see brands they recognize.
**Recommendation:** This is pending item D1 (needs client approval). In the interim, consider using a disguised but plausible framing: "a top-5 robot vacuum brand" rather than the awkward "the client's brand."

---

## Observations (Nice to Have)

### O1. Typewriter word list is well-curated
**File:** `/home/user/MagUpUS/src/index.njk` line 40
**Content:** `data-typewriter="ChatGPT|Perplexity|Gemini|Google AI|DeepSeek|Claude"`
**Assessment:** The list is parallel (all AI platform names), ordered logically (most recognizable first: ChatGPT, then Perplexity/Gemini as rising challengers, then Google AI, then emerging players). Solid.
**Minor suggestion:** Consider whether "Google AI" should be "Google AI Overviews" for specificity, and whether to add "Copilot" to match the 10-platform claim elsewhere.

### O2. Homepage headline is excellent -- consider making it the site-wide tagline
**File:** `/home/user/MagUpUS/src/index.njk` lines 38-41
**Content:** "Become the Answer on [ChatGPT]"
**Assessment:** This is the single strongest line on the entire site. It's concrete, aspirational, and differentiating. The company tagline in `pageContent.json` ("The Answer Engine for Enterprise Brands") is decent but less punchy. Consider adopting "Become the Answer" as the brand's campaign line across all touchpoints.

### O3. "SEO is Linear. GEO is Binary." section is the site's best content
**File:** `/home/user/MagUpUS/src/index.njk` lines 120-178
**Assessment:** The binary vs. linear framing, the visual bar charts, and "There is no page two" are extremely effective. This is where the site's voice is at its sharpest. This section should be the model for all other copy on the site.

### O4. FAQ section headline "GEO, Decoded" is clever but may confuse
**File:** `/home/user/MagUpUS/src/index.njk` line 1120
**Problem:** "GEO, Decoded" is punchy but doesn't clearly signal FAQ content. Users scanning the page for answers to their questions might skip it.
**Recommendation:** Consider "GEO, Decoded: Your Questions Answered" or "Everything You Need to Know About GEO" -- more explicitly inviting for information seekers.

### O5. Industry descriptions in `pageContent.json` are template-quality, not persuasive
**File:** `/home/user/MagUpUS/src/_data/pageContent.json` lines 404-420
**Examples:**
- "Helping software and AI companies maximize brand visibility in AI-powered search and answer engines."
- "Supporting manufacturing enterprises in building global AI content marketing systems."
- "Enabling professional services firms to become the authoritative answer in AI-driven search."
**Problem:** These read like placeholder copy. They all follow the pattern "[Gerund] [industry] [companies/enterprises/firms] [vague benefit]." None cite specific pain points or outcomes.
**Recommendation:** Rewrite with industry-specific stakes:
- Software & AI: "When developers ask AI for tool recommendations, is your product the one that gets cited? We make sure it is."
- Advanced Manufacturing: "Your buyers research on AI before they ever call your sales team. We put your brand in those early conversations."
- E-commerce & Consumer: "ChatGPT Shopping is becoming a product discovery channel. We get your products into those AI-generated recommendations."
- Professional Services: "When a CEO asks Perplexity for consulting firm recommendations, your firm should be the answer."

### O6. Service descriptions in `pageContent.json` are well-written
**File:** `/home/user/MagUpUS/src/_data/pageContent.json` lines 27-55
**Assessment:** The seven service descriptions are strong. They follow a consistent pattern: benefit-first opening, concrete detail, outcome framing. Examples: "Know exactly where you appear -- and where you don't" (Visibility), "Discover what millions of people ask AI before your competitors do" (Prompt Intelligence). These are well-calibrated for the audience.

### O7. Meta descriptions need length optimization
**Files:** Front matter of all page templates:
- `/home/user/MagUpUS/src/index.njk` line 5: "GEO 42 is the AI visibility platform that makes your brand the definitive answer across every generative engine -- ChatGPT, Perplexity, Gemini, and beyond." (154 chars -- good)
- `/home/user/MagUpUS/src/about.njk` line 4: "GEO 42 is the AI visibility platform helping global enterprises get cited by AI answer engines." (96 chars -- too short, wastes SERP real estate)
- `/home/user/MagUpUS/src/services.njk` line 4: "GEO 42's 7 service pillars: AI visibility tracking, prompt intelligence, citation analytics, crawler optimization, traffic attribution, shopping visibility, and GEO+SEO content marketing." (188 chars -- too long, will be truncated)
- `/home/user/MagUpUS/src/contact.njk` line 4: "Get in touch with GEO 42 to learn how AI visibility optimization can make your brand the top answer across every generative engine." (131 chars -- good but generic "get in touch" opening wastes prime real estate)
- `/home/user/MagUpUS/src/team.njk` line 4: "GEO 42's hub-and-spoke delivery team: Project Leader, Data Analysts, Knowledge Base Architects, Content Channel Leads, and Content Operations." (143 chars -- good length, but reads like an org chart, not a click-driver)

**Recommendations:**
- About: Expand to ~150 chars: "GEO 42 is the AI visibility platform trusted by global enterprises to become the definitive answer across ChatGPT, Perplexity, Gemini, and 10+ AI engines."
- Services: Trim to ~155 chars: "7 service pillars covering AI visibility tracking, prompt intelligence, citation analytics, and more. See how GEO 42 makes your brand the AI answer."
- Contact: Lead with value: "Request a free AI visibility audit. See where your brand stands across ChatGPT, Perplexity, and 10+ AI engines -- in 15 minutes."
- Team: Reframe: "Meet the dedicated GEO delivery team: data analysts, knowledge architects, and content specialists who make your brand the AI answer."

### O8. Custom section pages (`sections.njk`) have a generic CTA
**File:** `/home/user/MagUpUS/src/sections.njk` lines 87-93
**Problem:** Every custom section page (there are 16+ of them) ends with the identical CTA: "Ready to see these capabilities in action?" + "See It in Action" button. This is low-effort and doesn't relate to the specific section content.
**Recommendation:** Use the section title to generate a contextual CTA. For example, "Case Study: Regaining AI Voice Share" should end with "Want results like these for your brand?" not a generic "Ready to see these capabilities?"

### O9. 404 page copy is functional but could have more brand personality
**File:** `/home/user/MagUpUS/src/404.njk` lines 10-18
**Current copy:** "Page Not Found" / "The page you're looking for doesn't exist or has been moved."
**Recommendation:** Inject brand voice: "This page is invisible to AI -- and to you." or "In AI search, being absent means being invisible. Looks like this page got the same treatment." Then: "Let's get you back on track" with a search box or suggested pages.

### O10. `pageContent.json` about content is a single dense paragraph
**File:** `/home/user/MagUpUS/src/_data/pageContent.json` lines 22-26
**Problem:** The about content is a wall of text starting with "GEO 42 is the AI visibility platform trusted by leading global enterprises." It crams company positioning, product description, market scope, and target audience into one paragraph. The template renders it as a single `<p>` tag.
**Recommendation:** Break into 2-3 focused paragraphs or use the `highlights` array (currently empty) to surface key differentiators as scannable bullet points.

### O11. Roadmap descriptions are well-written and differentiated
**File:** `/home/user/MagUpUS/src/_data/pageContent.json` lines 354-402
**Assessment:** Each phase has a distinct description with concrete deliverables. "Foundation", "Intelligence Layer", "Global Expansion", "Content Brain", "Commerce Intelligence", "Predictive Engine", "Agentic Workflows", "Enterprise Intelligence Network" -- the naming is evocative and progressive. This is good roadmap copy.

---

## What's Working Well

### 1. The "Binary vs. Linear" Core Narrative
The site's central framing -- that GEO is fundamentally different from SEO because it's binary (cited or invisible) rather than linear (gradual ranking improvement) -- is the strongest editorial asset. It appears consistently across the homepage, FAQ, about page, and custom sections. It's simple, memorable, and defensible. This is the kind of insight that enterprise buyers remember.

### 2. Homepage Section Structure Follows the Buyer's Journey
The homepage is organized as: HOOK (hero) -> PROBLEM (SEO vs GEO, market data) -> PRODUCT (dashboard preview) -> PROOF (case study, 6 walls) -> SOLUTION (flywheel, services) -> HOW (intelligence dashboard) -> TRUST (platforms, industries, roadmap) -> ACTION (FAQ, CTA). This is a well-structured conversion narrative.

### 3. Contextual Mid-Page CTAs on Homepage
The homepage uses excellent variety in its mid-page text links: "See how GEO 42 breaks through" (line 201), "See these numbers for your brand" (line 693), "Map your AI blind spots" (line 1007), "Start your flywheel" (line 775), "Be part of what's next" (line 1100), "Still have questions? Let's talk" (line 1150). These are specific, action-oriented, and contextually appropriate. They should be the model for all CTAs.

### 4. FAQ Answers Are Sharp and Non-Generic
The FAQ section (index.njk lines 1124-1132) provides genuinely useful answers. "How quickly can I see results?" gets a concrete answer: "within the first 30 days." "How do I get started?" references the specific CTA label. These are well-crafted.

### 5. Voice Consistency Across Handcrafted Pages
The index.njk, about.njk, and contact.njk maintain a consistent voice: confident, direct, slightly urgent, technically informed but not jargon-heavy. The tone is that of a strategic advisor speaking to a VP of Marketing -- authoritative without being condescending.

### 6. "There is no page two" Micro-Copy
The line "There is no page two" (index.njk line 127) is the site's best micro-copy moment. It reframes the entire competitive landscape in six words. It works because it subverts a familiar SEO concept ("nobody goes to page two of Google") and makes it more extreme.

### 7. Print Artifacts: None Found
A search for print-oriented language ("see page", "above", "below", "appendix", "attached", "enclosed", "as shown", "the next page") returned zero results. The content has been properly adapted for web.

### 8. No Buzzword Abuse
A search for overused marketing superlatives ("industry-leading", "cutting-edge", "best-in-class", "world-class", "state-of-the-art", "unparalleled", "revolutionary", "game-changing", "next-generation") returned zero matches. The site avoids these cliches entirely.

---

## Detailed Findings

### Page: Home (`/home/user/MagUpUS/src/index.njk`)

| Line(s) | Element | Finding | Severity | Suggested Rewrite |
|---------|---------|---------|----------|-------------------|
| 35 | Trust signal | "Trusted by leading enterprise brands worldwide" -- unsourced claim | Critical | "Powering AI visibility for enterprise brands" or "Monitoring 10+ AI platforms for enterprise brands" |
| 39-41 | H1 | "Become the Answer on [ChatGPT]" -- excellent | Strong | Keep as-is |
| 44 | Hero subhead | Dense but effective. Defines GEO and states the value prop. | Good | Consider breaking the em-dash clause into its own line for scannability |
| 50 | Primary CTA | "See It in Action" -- strong for hero | Good | Keep for hero only |
| 55 | Secondary CTA | "View Case Study" -- specific and appropriate | Good | Keep |
| 122-127 | H2 + subhead | "SEO is Linear. GEO is Binary." / "There is no page two." -- site's best section | Excellent | Keep as-is |
| 185-195 | Stat cards | "34x" and "1000x" without attribution | Critical | Add source citations |
| 214-220 | H2 | "Your AI Command Center" -- clear and benefit-oriented | Good | Keep |
| 500 | CTA | "See Your Brand's AI Visibility" -- specific, personalized | Excellent | Keep; use as model for other CTAs |
| 518-519 | H2 | "From Invisible to #1" -- concise proof headline | Excellent | Keep |
| 564 | Case study mock | "the client's robot vacuum" -- breaks immersion | Warning | "a top-5 robot vacuum brand" |
| 624-629 | H2 + subhead | "6 Walls Enterprises Face" / "GEO 42 breaks through all six" -- good problem framing | Good | Consider: "6 Walls Between You and AI Visibility" |
| 668-669 | H2 | "The GEO 42 Platform" -- states topic, not value | Weak | "The Numbers Behind AI Dominance" or "Platform at a Glance" |
| 711-715 | H2 + subhead | "How Visibility Compounds" -- strong conceptual headline | Good | Keep |
| 807-811 | H2 | "Every Dimension of AI Discovery" -- strong | Good | Keep |
| 870 | H2 | "90 Days Later: The Dashboard View" -- excellent narrative framing | Excellent | Keep |
| 937 | CTA | "Get Your 90-Day Visibility Forecast" -- specific, time-bound | Excellent | Keep; best CTA on the site |
| 955-956 | H2 | "Every AI Engine. One Dashboard." -- punchy, parallel structure | Excellent | Keep |
| 1021-1022 | H2 | "Tuned for Your Industry" -- warm, personalized | Good | Keep |
| 1060-1061 | H2 | "Where We're Headed" -- conversational, forward-looking | Good | Keep |
| 1100 | CTA | "Be part of what's next" -- aspirational | Good | Keep |
| 1119-1120 | H2 | "GEO, Decoded" -- clever but may not signal FAQ | Observation | Add subtitle: "Your Questions, Answered" |
| 1167-1168 | H2 | "Ready to Become the AI Answer?" -- strong closing | Good | Keep |
| 1171 | Subhead | Verbatim repeat of contact page copy | Warning | Write unique closing copy |

### Page: About (`/home/user/MagUpUS/src/about.njk`)

| Line(s) | Element | Finding | Severity | Suggested Rewrite |
|---------|---------|---------|----------|-------------------|
| 4 | Meta desc | 96 chars -- underutilizes SERP space | Warning | Expand to ~150 chars with AI platform names |
| 13-14 | H1 | "The Answer Engine for Enterprise Brands" -- strong | Good | Keep |
| 36-37 | Stat | "Global" / "Enterprise Reach" -- not a number | Warning | Replace with concrete metric |
| 48-49 | Stat | "+450%" / "Brand Mentions" -- no baseline or timeframe | Warning | Add "(90-day case study)" qualifier |
| 54 | Section | "Trusted By" heading with first 8 client names | Good | Keep; simple trust signal |
| 72-73 | H2 | "The People Behind the Platform" -- generic | Weak | "Your Delivery Team" or "The Specialists Behind Your GEO Campaign" |
| 99-100 | H2 | "The Trilogy: From Indexing to Recommendation" -- interesting but "trilogy" feels oddly literary | Observation | "Three Stages to AI Authority" |
| 111 | Subhead | "Expand Sources / Ensure Being Found" -- "Ensure Being Found" is awkward passive | Warning | "Get Found by AI" |
| 119-120 | Subhead | "Build Reputation / Ensure Being Recognized" -- same pattern | Warning | "Earn AI Trust" |
| 127-128 | Subhead | "Gain Recommendations / Ensure Being Adopted" -- same pattern | Warning | "Drive AI Recommendations" |
| 140-141 | H2 | "Your Dedicated GEO Team" -- good, personal | Good | Keep |
| 180 | Card title | "7 AI Agents" -- clear but could be more compelling | Observation | "7 AI Agents Working for You" |
| 199-200 | H2 | "Ready to Get Started?" -- generic closing | Weak | "Ready to Become the Answer?" (mirrors the main site narrative) |

### Page: Services (`/home/user/MagUpUS/src/services.njk`)

| Line(s) | Element | Finding | Severity | Suggested Rewrite |
|---------|---------|---------|----------|-------------------|
| 4 | Meta desc | 188 chars -- too long, will truncate | Warning | Trim to ~155 chars |
| 32-33 | H1 | "Full-Stack AI Visibility" -- borrows dev jargon effectively | Good | Keep |
| 35-37 | Subhead | "Seven service pillars covering every dimension..." -- clear | Good | Keep |
| 57 | Link text | "Learn more" x7 -- generic, poor accessibility | Warning | Use service-specific link text (see W2) |
| 71 | CTA | "See It in Action" -- homepage CTA repeated | Observation | "Build Your AI Visibility Stack" |

### Page: Contact (`/home/user/MagUpUS/src/contact.njk`)

| Line(s) | Element | Finding | Severity | Suggested Rewrite |
|---------|---------|---------|----------|-------------------|
| 4 | Meta desc | 131 chars -- "Get in touch" wastes prime SERP space | Warning | Lead with value proposition |
| 15-16 | H1 | "Ready to Become the AI Answer?" -- strong, matches site narrative | Good | Keep |
| 19 | Subhead | Near-verbatim repeat from homepage CTA | Warning | Write unique contact-specific copy |
| 59 | Form heading | "See It in Action" -- repeats CTA label | Warning | "Request Your AI Visibility Audit" |
| 61 | Form subhead | "personalized AI visibility audit" -- good promise | Good | Keep |
| 86 | Placeholder | "Tell us about your AI visibility goals" -- good guidance | Good | Keep |
| 89 | Submit button | "Request a Demo" -- clear, specific | Good | Keep; stronger than "See It in Action" for a form submit |
| 105 | Back-links text | "Learn more about our platform:" -- generic | Observation | "While you wait, explore:" or simply remove the prefacing text |

### Page: Team (`/home/user/MagUpUS/src/team.njk`)

| Line(s) | Element | Finding | Severity | Suggested Rewrite |
|---------|---------|---------|----------|-------------------|
| 4 | Meta desc | 143 chars -- reads like org chart | Warning | Reframe around value: "Meet the dedicated team..." |
| 7 | Intro | "hub-and-spoke delivery team structure ensuring every GEO campaign has dedicated expertise" -- functional but dry | Observation | "Every GEO 42 campaign is run by a dedicated cross-functional team..." |
| 12-15 | Bios | Uses role titles as "names" (Project Leader, Data Analysts) -- placeholder quality | Warning | Awaiting D3 content; consider restructuring as role descriptions rather than faux bios |

### Page: Sections Template (`/home/user/MagUpUS/src/sections.njk`)

| Line(s) | Element | Finding | Severity | Suggested Rewrite |
|---------|---------|---------|----------|-------------------|
| 10 | Meta desc | Auto-generated via `truncate(155)` from section content -- acceptable for scale but produces suboptimal descriptions | Observation | Consider hand-writing meta descriptions for high-value sections (case study, core value of GEO, SEO vs GEO) |
| 88-91 | CTA | Generic "Ready to see these capabilities in action?" for all 16+ sections | Warning | Use section-aware contextual CTAs |

### Page: 404 (`/home/user/MagUpUS/src/404.njk`)

| Line(s) | Element | Finding | Severity | Suggested Rewrite |
|---------|---------|---------|----------|-------------------|
| 11-13 | Copy | Standard 404 copy, no brand personality | Observation | "This page is as invisible as a brand without GEO." |
| 17 | CTA | "Back to Home" -- functional | Good | Keep; 404 pages should prioritize clarity |

### Data: `pageContent.json` (`/home/user/MagUpUS/src/_data/pageContent.json`)

| Line(s) | Element | Finding | Severity | Suggested Rewrite |
|---------|---------|---------|----------|-------------------|
| 6 | Company desc | Dense but accurate | Good | Keep for structured data; the templates override with better copy |
| 10-21 | Hero block | Generic headline/CTA disconnected from actual site | Critical | Sync with live hero (see C4) |
| 22-26 | About content | Single dense paragraph, empty highlights array | Warning | Break into paragraphs; populate highlights |
| 57-87 | Team entries | Role descriptions posing as bios | Warning | Awaiting D3; restructure or relabel |
| 96 | Testimonials | Empty array `[]` | Observation | Awaiting D2 |
| 114 | Certifications | Empty array `[]` | Observation | Populate if applicable |
| 119 | 6 Walls content | Naming doesn't match homepage | Warning | Align naming conventions (see W5) |
| 162-164 | Proven Results | "7x visibility growth multiples" -- vague, no specifics | Warning | Cite specific case study metrics: "from 0% to #1 Share of Voice in 90 days" |
| 404-420 | Industry descs | Template-quality placeholder copy | Observation | Rewrite with industry-specific pain points (see O5) |

### Reading Level Assessment

The site copy is calibrated appropriately for MarTech decision-makers (VP Marketing, Head of Digital, CMO). The vocabulary assumes familiarity with SEO concepts (which it then reframes as GEO), uses enterprise-appropriate language ("citation analytics", "crawler optimization", "attribution"), and avoids both oversimplification and unnecessary jargon. The FAQ section successfully bridges the knowledge gap for executives who may not yet understand GEO.

Estimated Flesch-Kincaid grade level: 10-12 (college-level), which is appropriate for B2B enterprise SaaS marketing. The short, declarative sentences in key sections ("You are either the cited answer or you are invisible. There is no page two.") bring the reading level down to make impact statements more punchy -- this is a deliberate and effective technique.

### Voice Consistency Assessment

**Overall:** The handcrafted template copy (index.njk, about.njk, contact.njk) maintains a consistent voice: confident, direct, strategically urgent, tech-savvy but accessible. The voice persona reads as a seasoned MarTech strategist -- someone who has worked in SEO and sees the AI shift coming.

**Tone breaks identified:**
1. `pageContent.json` descriptions are noticeably more bland and feature-listing than the template copy. This is most evident in the hero, about, and industry descriptions. They feel like they were written by a different (more cautious, more generic) voice.
2. The about.njk "Trilogy" section (lines 111-130) uses "Ensure Being Found / Ensure Being Recognized / Ensure Being Adopted" -- an awkward passive construction that breaks from the otherwise active, direct voice.
3. The team bios in `pageContent.json` read like job descriptions, not brand content. Lines like "Responsible for campaign scheduling, content strategy design, package optimization" feel like an internal HR document.

**No major voice breaks** between the core marketing pages (index, about, services, contact). The site reads as one editorial voice across these pages.

---

## Summary of Recommended Priority Actions

1. **Source the 34x and 1000x statistics** with verifiable citations (Critical)
2. **Qualify the client marquee** -- either confirm permission or add contextual framing (Critical)
3. **Sync `pageContent.json` hero** with the live site's superior copy (Critical)
4. **Eliminate verbatim copy repetition** across closing CTAs (Critical)
5. **Replace generic "Learn more" links** on services page with service-specific text (Warning)
6. **Rewrite meta descriptions** for About, Services, Contact, Team pages (Warning)
7. **Diversify button CTA labels** across pages and sections (Warning)
8. **Add context to "By the Numbers" metrics** (timeframes, baselines) (Warning)
9. **Rewrite industry descriptions** with sector-specific pain points (Nice to Have)
10. **Add contextual CTAs** to sections template based on section content (Nice to Have)
