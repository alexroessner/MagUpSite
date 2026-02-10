# Content Architecture Audit: GEO 42

**Site:** https://alexroessner.github.io/MagUpSite/
**Persona:** Content Architect
**Date:** 2026-02-10

---

## Site Inventory

**Pages:** 4 (Homepage, About, Contact, Style Guide)
**Homepage Sections:** 15
**Total word count:** ~3,500 words on homepage

---

## Key Findings

### Structural Issues

1. **Proof before Problem** -- Case study (section 4) and KPI stats (section 5) appear before the visitor understands what GEO is (sections 6-8). Classic persuasion structure is Problem -> Solution -> Evidence.

2. **9 of 15 sections are dead ends** -- No CTA, no forward navigation. Only 33% of sections have any call to action. Critical sections like SEO-vs-GEO (highest conceptual stakes) have zero conversion path.

3. **15 sections is too many** -- Creates scroll fatigue. Several sections are thin:
   - Industries: 4 cards with single sentences
   - Market Data: 2 stat cards
   - KPI Stats: 4 cards (duplicates case study data)

4. **"GEO" never expanded in hero** -- First-time visitors won't know what Generative Engine Optimization means

5. **Empty `testimonials[]` array** -- Zero social proof from actual customers

6. **Broken `/7-ai-agents/` link** on About page -- returns 404

### Missing Content

- Contact form (mailto-only kills enterprise conversion)
- Team/founder bios
- Pricing or engagement model
- Methodology explanation
- Named case studies with timelines
- Customer testimonials

### Recommended Resequence

```
1. Hero (hook)
2. Client Logos (social proof)
3. Market Data + SEO vs GEO (the shift / why now)
4. 6 Walls (your pain points)
5. Case Study + KPIs (proof it works)
6. Flywheel (our model)
7. Services (what we do)
8. Dashboard Carousel (product preview)
9. Platform Coverage (breadth)
10. FAQ (objection handling)
11. CTA (take action)
```

### Section-Level Recommendations

- **Carousel**: Most interactive section leads nowhere. Add CTA after it ("See Your Brand's AI Visibility")
- **Case Study**: Needs real client name or at minimum a named industry vertical
- **Services**: Descriptions need benefit framing, not feature lists
- **Industries**: Too thin to stand alone -- merge into Services or expand significantly
- **Market Data**: Orphaned from context -- integrate into SEO-vs-GEO section
- **KPI Stats**: +450% already in Case Study. Merge remaining stats into Case Study section
