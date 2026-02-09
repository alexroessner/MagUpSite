#!/usr/bin/env node

/**
 * Multi-persona Audit System
 *
 * Runs audit checks across all four gates:
 *   Gate A: Post-extraction (Document Analyst)
 *   Gate B: Post-scrape (Style Cloner + Accessibility)
 *   Gate C: Post-merge (Synthesizer + Content Architect)
 *   Gate D: Post-build (All personas)
 *
 * Usage:
 *   node scripts/audit.js [--gate A|B|C|D|all]
 *   npm run audit
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const DATA = path.join(ROOT, "data");

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function parseArgs() {
  const args = process.argv.slice(2);
  let gate = "all";
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--gate" && args[i + 1]) gate = args[++i].toUpperCase();
  }
  return { gate };
}

// ---------------------------------------------------------------------------
// Audit utilities
// ---------------------------------------------------------------------------

let passed = 0;
let warned = 0;
let failed = 0;

function check(label, condition, detail) {
  if (condition) {
    console.log(`  ✓ ${label}`);
    passed++;
  } else {
    console.log(`  ✗ ${label}${detail ? " — " + detail : ""}`);
    failed++;
  }
}

function warn(label, detail) {
  console.log(`  ⚠ ${label}${detail ? " — " + detail : ""}`);
  warned++;
}

function loadJSON(filePath) {
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Gate A: Post-extraction audit (Document Analyst)
// ---------------------------------------------------------------------------

function auditA() {
  console.log("\n--- AUDIT GATE A: Post-Extraction (Document Analyst) ---\n");

  const extract = loadJSON(path.join(DATA, "raw-extract.json"));

  check("raw-extract.json exists", !!extract);
  if (!extract) return;

  check("Extraction metadata present", !!extract._meta);
  check("Raw text extracted", extract.rawText?.length > 0, `${extract.rawText?.length || 0} chars`);
  check("Sections detected", extract.sections?.length > 0, `${extract.sections?.length || 0} sections`);
  check("Company identity extracted", !!extract.identity?.name || !!extract.identity?.description);

  if (!extract.contact?.email && !extract.contact?.phone) {
    warn("No contact information found", "PDF may not contain contact details");
  } else {
    check("Contact information found", true);
  }

  if (extract.services?.length === 0) {
    warn("No services detected", "Review sections for service content");
  } else {
    check("Services detected", true, `${extract.services.length} services`);
  }

  if (extract.tables?.length > 0) {
    check("Tables detected", true, `${extract.tables.length} tables`);
  }

  // Check for potential extraction issues
  if (extract.rawText?.length < 500) {
    warn("Very short text extracted", "PDF may be image-based or protected");
  }
}

// ---------------------------------------------------------------------------
// Gate B: Post-scrape audit (Style Cloner + Accessibility)
// ---------------------------------------------------------------------------

function auditB() {
  console.log("\n--- AUDIT GATE B: Post-Scrape (Style Cloner + Accessibility) ---\n");

  const scraped = loadJSON(path.join(DATA, "scraped-styles.json"));

  if (!scraped) {
    warn("scraped-styles.json not found", "Style scraping was skipped or failed");
    return;
  }

  check("scraped-styles.json exists", true);
  check("Colors extracted", scraped.colors?.all?.length > 0, `${scraped.colors?.all?.length || 0} colors`);
  check("Primary color identified", !!scraped.colors?.primary?.base);
  check("Accent color identified", !!scraped.colors?.accent?.base);
  check("Typography extracted", !!scraped.typography?.bodyFont);
  check("Layout patterns extracted", !!scraped.layout);

  // WCAG contrast check (simplified — checks primary-700 on white)
  if (scraped.colors?.primary?.base) {
    const hex = scraped.colors.primary.base;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    const contrast = luminance < 0.5;
    check("Primary color has sufficient contrast on white", contrast,
      contrast ? "" : "Color may be too light for text on white backgrounds");
  }

  if (scraped.components?.navigation?.length > 0) {
    check("Navigation items scraped", true, `${scraped.components.navigation.length} items`);
  } else {
    warn("No navigation items scraped", "Reference site may use JS-rendered nav");
  }
}

// ---------------------------------------------------------------------------
// Gate C: Post-merge audit (Synthesizer + Content Architect)
// ---------------------------------------------------------------------------

function auditC() {
  console.log("\n--- AUDIT GATE C: Post-Merge (Synthesizer + Content Architect) ---\n");

  const blueprint = loadJSON(path.join(DATA, "merged-blueprint.json"));

  check("merged-blueprint.json exists", !!blueprint);
  if (!blueprint) return;

  check("Company name set", !!blueprint.identity?.name && blueprint.identity.name !== "Company Name");
  check("Company description set", !!blueprint.identity?.description);
  check("Navigation structure defined", !!blueprint.navigation?.pages);
  check("Design tokens present", !!blueprint.tokens?.colors);

  // Check page count
  const pageCount = Object.keys(blueprint.navigation?.pages || {}).length;
  check("At least 2 pages defined", pageCount >= 2, `${pageCount} pages`);

  // Check for empty pages
  const content = loadJSON(path.join(ROOT, "src", "_data", "pageContent.json"));
  if (content) {
    if (content.about?.content) {
      check("About page has content", content.about.content.length > 20);
    }
    if (content.services?.length > 0) {
      const emptyServices = content.services.filter((s) => !s.description);
      if (emptyServices.length > 0) {
        warn(`${emptyServices.length} services lack descriptions`);
      } else {
        check("All services have descriptions", true);
      }
    }
  }

  // Check whitelabel config was updated
  check("whitelabel.config.js updated", fs.existsSync(path.join(ROOT, "whitelabel.config.js")));
  check("target-audience.md generated", fs.existsSync(path.join(ROOT, "personas", "target-audience.md")));

  // Check input.css was updated
  const inputCSS = fs.readFileSync(path.join(ROOT, "src", "css", "input.css"), "utf-8");
  check("CSS theme tokens present", inputCSS.includes("@theme"));
}

// ---------------------------------------------------------------------------
// Gate D: Post-build audit (All personas)
// ---------------------------------------------------------------------------

function auditD() {
  console.log("\n--- AUDIT GATE D: Post-Build (All Personas) ---\n");

  const distDir = path.join(ROOT, "dist");

  check("dist/ directory exists", fs.existsSync(distDir));
  if (!fs.existsSync(distDir)) return;

  // Check key output files exist
  check("index.html generated", fs.existsSync(path.join(distDir, "index.html")));
  check("sitemap.xml generated", fs.existsSync(path.join(distDir, "sitemap.xml")));
  check("robots.txt generated", fs.existsSync(path.join(distDir, "robots.txt")));
  check("llms.txt generated", fs.existsSync(path.join(distDir, "llms.txt")));
  check("style.css generated", fs.existsSync(path.join(distDir, "css", "style.css")));

  // Check index.html has real content (not just template placeholders)
  const indexHtml = fs.readFileSync(path.join(distDir, "index.html"), "utf-8");
  check("HTML has doctype", indexHtml.startsWith("<!DOCTYPE html>"));
  check("HTML has lang attribute", indexHtml.includes('lang="en"'));
  check("HTML has viewport meta", indexHtml.includes("viewport"));
  check("HTML has skip link", indexHtml.includes("skip-link") || indexHtml.includes("Skip to"));
  check("HTML has JSON-LD", indexHtml.includes("application/ld+json"));
  check("HTML has main landmark", indexHtml.includes('id="main"'));
  check("HTML has footer", indexHtml.includes("</footer>"));

  // Check CSS has content
  const cssPath = path.join(distDir, "css", "style.css");
  if (fs.existsSync(cssPath)) {
    const css = fs.readFileSync(cssPath, "utf-8");
    check("CSS is non-empty", css.length > 100, `${css.length} bytes`);
  }

  console.log("\n  For full linting, run: npm run lint");
  console.log("  (Requires dev server running for a11y and link checks)");
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  const { gate } = parseArgs();

  console.log("MagUpUS Audit System");
  console.log("====================");

  if (gate === "A" || gate === "ALL") auditA();
  if (gate === "B" || gate === "ALL") auditB();
  if (gate === "C" || gate === "ALL") auditC();
  if (gate === "D" || gate === "ALL") auditD();

  console.log(`\n${"─".repeat(50)}`);
  console.log(`  Results: ${passed} passed, ${warned} warnings, ${failed} failed`);
  console.log("─".repeat(50));

  if (failed > 0) {
    console.log("\nAudit FAILED. Address the issues above before proceeding.");
    process.exit(1);
  } else if (warned > 0) {
    console.log("\nAudit PASSED with warnings. Review warnings before proceeding.");
  } else {
    console.log("\nAudit PASSED. All checks green.");
  }
}

main();
