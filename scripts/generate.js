#!/usr/bin/env node

/**
 * Pipeline Orchestrator
 *
 * Runs the full pipeline: extract → scrape → merge → build.
 * This script coordinates all phases and runs audit checks between them.
 *
 * Usage:
 *   node scripts/generate.js --pdf source-pdf/doc.pdf --url https://example.com
 *   npm run generate -- --pdf source-pdf/doc.pdf --url https://example.com
 */

const { execSync } = require("child_process");
const path = require("path");

const ROOT = path.join(__dirname, "..");

// ---------------------------------------------------------------------------
// CLI argument parsing
// ---------------------------------------------------------------------------

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--pdf" && args[i + 1]) options.pdf = args[++i];
    if (args[i] === "--url" && args[i + 1]) options.url = args[++i];
    if (args[i] === "--skip-scrape") options.skipScrape = true;
    if (args[i] === "--skip-audit") options.skipAudit = true;
  }
  if (!options.pdf) {
    console.error("Usage: node scripts/generate.js --pdf <path> [--url <url>] [--skip-scrape] [--skip-audit]");
    process.exit(1);
  }
  return options;
}

// ---------------------------------------------------------------------------
// Pipeline runner
// ---------------------------------------------------------------------------

function run(cmd, label) {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`  ${label}`);
  console.log("=".repeat(60) + "\n");

  try {
    execSync(cmd, { cwd: ROOT, stdio: "inherit" });
    return true;
  } catch (err) {
    console.error(`\n✗ ${label} failed.`);
    return false;
  }
}

function main() {
  const options = parseArgs();

  console.log("MagUpUS Pipeline");
  console.log("================");
  console.log(`  PDF: ${options.pdf}`);
  console.log(`  URL: ${options.url || "(none — using default design)"}`);
  console.log("");

  // Phase 1: Extract content from PDF
  if (!run(`node scripts/extract-pdf.js --pdf "${options.pdf}"`, "PHASE 1: PDF Extraction (Stream A)")) {
    process.exit(1);
  }

  // Phase 2: Scrape styles from URL (optional)
  if (options.url && !options.skipScrape) {
    if (!run(`node scripts/scrape-styles.js --url "${options.url}"`, "PHASE 2: Style Scraping (Stream B)")) {
      console.log("Warning: Style scraping failed. Continuing with default design.");
    }
  } else if (!options.url) {
    console.log("\n  Skipping style scraping (no URL provided).");
    console.log("  Using default design tokens.");
  }

  // Phase 3: Merge streams
  if (!run("node scripts/merge.js", "PHASE 3: Merge (Synthesizer)")) {
    process.exit(1);
  }

  // Phase 4: Build site
  if (!run("npm run build", "PHASE 4: Build (Eleventy + Tailwind)")) {
    process.exit(1);
  }

  // Summary
  console.log(`\n${"=".repeat(60)}`);
  console.log("  PIPELINE COMPLETE");
  console.log("=".repeat(60));
  console.log("\nGenerated site is in dist/");
  console.log("Run `npm run dev` to preview at http://localhost:8080");
  console.log("Run `npm run audit` for quality checks.");
}

main();
