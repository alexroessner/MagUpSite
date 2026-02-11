# AGENTS.md for GEO 42

GEO 42 — The Answer Engine for Enterprise Brands. AI visibility platform
website built with Eleventy and Tailwind CSS v4.

## About This Project

- Static site: Eleventy (11ty) + Tailwind CSS v4
- Deployed via GitHub Pages (push to main triggers CI build + deploy)
- See `README.md` for setup and commands
- See `/style-guide/` page for design principles and patterns
- See `brand-book/` for the full design system documentation

## Running Commands

Key commands:
- `npm run build` — Build CSS + Eleventy
- `npm run dev` — Development server with live reload (localhost:8080)
- `npm run check` — Full build + all linters
- `npm run lint` — Linters only (requires dev server running)

Some commands require specific permissions:
- **`npm run check`** and **`npm run lint`** — Require permissions for pa11y-ci headless browser
- The dev server (`npm run dev`) must be running before `lint` or `check`
  because pa11y-ci and linkinator test against `http://localhost:8080`.

## Principles

- **Be proactive about warnings and errors.** When npm, linters, or other
  tools emit warnings, investigate immediately. Explain what's causing
  them and recommend a course of action.
- **Own the coherence of the codebase.** If a new change reveals that a
  previous decision no longer makes sense, say so and fix it.
- **Debug before delegating.** When a command fails, check env vars,
  paths, configs, and error messages before concluding it needs manual
  intervention.
- **Preserve visual fidelity.** This is a live production site. Any
  change must maintain the current look and feel unless explicitly
  asked to change it.

## Design Approach

When changing colors, fonts, or spacing:
1. Update `src/css/input.css` first (source of truth for `@theme` tokens)
2. Update `src/style-guide.njk` to reflect rationale and examples
3. Verify visually on the style guide page (`/style-guide/`)
4. Check against `brand-book/` for consistency

This project uses Tailwind CSS v4 with CSS-based configuration via
`@theme` in `input.css`. The `tailwind.config.js` file is kept for
reference but is not used.

## Content Editing

- **Company info:** `whitelabel.config.js` (name, tagline, contact, colors, fonts)
- **Page content:** `src/_data/pageContent.json` (hero, about, services, team, etc.)
- **Navigation:** `src/_data/nav.js` (reads from `data/merged-blueprint.json`)
- **Design tokens:** `src/css/input.css` `@theme` block

## Git Workflow

### Pre-commit checklist

1. **Related docs are updated.** If you changed a command, tool, workflow,
   or design decision, check README.md, AGENTS.md, and style-guide.njk.
2. **Build succeeds.** Run `npm run build` before committing.
3. **Ask the developer** to review the commit message before committing.

### Other guidance

- When you encounter a new constraint or learn something about the
  development environment, update AGENTS.md immediately.
- Small, frequent commits following imperative mood subject lines.
