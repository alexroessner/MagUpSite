# TODO

## Project Goals

- Build a general-purpose PDF-to-website generator
- Extract content from any PDF document describing a company
- Scrape design systems from any reference URL
- Merge content and design into a unified site blueprint
- Generate professional, accessible, SEO-optimized static websites
- Provide a repeatable pipeline: swap PDF + URL, get a new site

## Completed: Project Scaffolding

1. [x] Initialize project structure mirroring airfoils.com architecture
2. [x] Create package.json with Eleventy, Tailwind, and pipeline dependencies
3. [x] Create Eleventy configuration
4. [x] Create Tailwind CSS v4 theme system
5. [x] Create white-label configuration file
6. [x] Set up linter configs (HTML, CSS, a11y, links)
7. [x] Write all 10 persona files
8. [x] Write AGENTS.md, README.md, TODO.md
9. [x] Create data layer (site.js, nav.js, content schema)
10. [x] Create template system (base.njk, page.njk, index.njk)
11. [x] Create generated files (sitemap, robots.txt, llms.txt)
12. [x] Create style guide page
13. [x] Set up CI workflow

## Completed: Pipeline Scripts

14. [x] Build PDF extraction script (scripts/extract-pdf.js)
15. [x] Build web style scraping script (scripts/scrape-styles.js)
16. [x] Build merge/synthesizer script (scripts/merge.js)
17. [x] Build orchestrator script (scripts/generate.js)
18. [x] Build audit script (scripts/audit.js)

## Current Phase: Testing & Iteration

19. [ ] Test with first PDF document
20. [ ] Test with first reference URL
21. [ ] Run full pipeline end-to-end
22. [ ] Run audit cycle
23. [ ] Iterate on extraction quality
24. [ ] Iterate on merge logic
25. [ ] Iterate on template output

## Future Enhancements

- [ ] Support multi-page PDF extraction with page-range selection
- [ ] Support multiple reference URLs for style blending
- [ ] Add image optimization pipeline
- [ ] Add custom domain deployment support
- [ ] Add interactive configuration wizard
