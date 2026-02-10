# SEO Specialist -- Site Audit

**Site:** https://alexroessner.github.io/MagUpSite/
**Persona:** SEO Specialist
**Date:** 2026-02-10
**Overall Rating:** 6/10

---

## CRITICAL ISSUES

### 1. Sitemap URL Doubling Bug
All sitemap URLs 404. The `site.url` + `| url` Eleventy filter doubles the `/MagUpSite/` path prefix. Example:
- Generated: `https://alexroessner.github.io/MagUpSite/MagUpSite/about/`
- Should be: `https://alexroessner.github.io/MagUpSite/about/`

Google is being sent to broken URLs. **This is actively preventing indexing.**

### 2. No og:image
Every social share on LinkedIn/Twitter/Slack renders with a blank card. Zero visual preview. This is a major missed opportunity for organic distribution.

---

## HIGH ISSUES

### 3. FAQ Schema Mismatch
7 FAQ items on page but only 4 in JSON-LD structured data. Google may flag this as inconsistent markup.

### 4. Missing robots.txt
No robots.txt file found. While not blocking crawling, it's a signal of site maturity.

### 5. "GEO" Not Expanded
The term "GEO" (Generative Engine Optimization) is never expanded above the fold. For SEO purposes, the full phrase should appear early for search engines to understand the topic.

---

## MEDIUM ISSUES

### 6. Thin Inner Pages
- About page: Moderate content but broken link to `/7-ai-agents/`
- Contact page: Just a mailto link, no form
- Style guide: Completely disconnected from actual design

### 7. Missing Breadcrumb Schema
No BreadcrumbList structured data for inner pages.

### 8. No Blog/Content Hub
No content marketing infrastructure. A blog or resource section would significantly improve organic search presence for GEO-related queries.

---

## WHAT'S WORKING

- **JSON-LD structured data** with Organization, WebSite, WebPage, FAQPage schemas
- **Canonical URL** present on all pages
- **`llms.txt`** file present (forward-thinking for AI crawlers)
- **Open Graph meta tags** present (just missing the image)
- **Clean URL structure** with trailing slashes
- **Good meta description** on homepage

---

## RECOMMENDATIONS

1. **Fix sitemap URL doubling** -- CRITICAL, blocking Google indexing
2. **Add og:image** to all pages -- design a 1200x630 social card
3. **Sync FAQ schema** with actual page content (all 7 items)
4. **Add robots.txt** with sitemap reference
5. **Expand "GEO"** to "Generative Engine Optimization" in hero subhead
6. **Add BreadcrumbList schema** to inner pages
7. **Fix broken `/7-ai-agents/` link** on About page
8. **Consider blog infrastructure** for organic content marketing
