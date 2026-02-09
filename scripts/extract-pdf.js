#!/usr/bin/env node

/**
 * Stream A: PDF Content Extraction
 *
 * Extracts structured content from a PDF document and outputs
 * data/raw-extract.json. This script is the Document Analyst's tool.
 *
 * Usage:
 *   node scripts/extract-pdf.js --pdf source-pdf/document.pdf
 *   npm run extract -- --pdf source-pdf/document.pdf
 */

const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");

// ---------------------------------------------------------------------------
// CLI argument parsing
// ---------------------------------------------------------------------------

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--pdf" && args[i + 1]) {
      options.pdf = args[++i];
    }
  }
  if (!options.pdf) {
    console.error("Usage: node scripts/extract-pdf.js --pdf <path-to-pdf>");
    process.exit(1);
  }
  return options;
}

// ---------------------------------------------------------------------------
// Text structure analysis
// ---------------------------------------------------------------------------

/**
 * Attempt to detect section headings from text patterns.
 * Headings are typically short lines (< 80 chars) that are followed by
 * longer paragraph text. We also look for ALL-CAPS lines and numbered
 * section patterns.
 */
function detectSections(text) {
  const lines = text.split("\n");
  const sections = [];
  let currentSection = null;
  let buffer = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) {
      if (buffer.length > 0 && currentSection) {
        currentSection.content += buffer.join(" ") + "\n\n";
        buffer = [];
      }
      continue;
    }

    const isLikelyHeading =
      (line.length < 80 && line.length > 2 && !line.endsWith(".") && !line.endsWith(",")) &&
      (isUpperCase(line) ||
        /^\d+[\.\)]\s/.test(line) ||
        (i + 1 < lines.length && lines[i + 1].trim() === "") ||
        /^(about|services|contact|team|our |the |introduction|overview|mission|vision|history)/i.test(line));

    if (isLikelyHeading) {
      // Save previous section
      if (currentSection) {
        currentSection.content += buffer.join(" ");
        currentSection.content = currentSection.content.trim();
        sections.push(currentSection);
        buffer = [];
      }
      currentSection = {
        heading: cleanHeading(line),
        level: isUpperCase(line) ? 1 : 2,
        content: "",
      };
    } else {
      buffer.push(line);
    }
  }

  // Save last section
  if (currentSection) {
    currentSection.content += buffer.join(" ");
    currentSection.content = currentSection.content.trim();
    sections.push(currentSection);
  } else if (buffer.length > 0) {
    sections.push({
      heading: "Content",
      level: 1,
      content: buffer.join(" ").trim(),
    });
  }

  return sections;
}

function isUpperCase(str) {
  const letters = str.replace(/[^a-zA-Z]/g, "");
  return letters.length > 3 && letters === letters.toUpperCase();
}

function cleanHeading(text) {
  // Remove leading numbers/bullets and normalize case
  let cleaned = text.replace(/^\d+[\.\)]\s*/, "").trim();
  if (isUpperCase(cleaned)) {
    cleaned = cleaned.charAt(0) + cleaned.slice(1).toLowerCase();
  }
  return cleaned;
}

// ---------------------------------------------------------------------------
// Contact information extraction
// ---------------------------------------------------------------------------

function extractContactInfo(text) {
  const contact = {};

  // Email
  const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w{2,}/);
  if (emailMatch) contact.email = emailMatch[0];

  // Phone (various formats)
  const phoneMatch = text.match(
    /(?:phone|tel|call)[:\s]*([+\d\s\-().]{10,})/i
  );
  if (phoneMatch) contact.phone = phoneMatch[1].trim();
  else {
    const genericPhone = text.match(
      /(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/
    );
    if (genericPhone) contact.phone = genericPhone[0];
  }

  // Fax
  const faxMatch = text.match(/(?:fax)[:\s]*([+\d\s\-().]{10,})/i);
  if (faxMatch) contact.fax = faxMatch[1].trim();

  // Website URL
  const urlMatch = text.match(/https?:\/\/[\w.-]+(?:\/[\w.-]*)*\/?/);
  if (urlMatch) contact.url = urlMatch[0];

  // Address (heuristic: look for state abbreviation + zip code patterns)
  const addressMatch = text.match(
    /(\d+\s+[\w\s]+(?:Street|St|Avenue|Ave|Drive|Dr|Road|Rd|Boulevard|Blvd|Lane|Ln|Way|Court|Ct|Circle|Cir|Suite|Ste|Floor|Fl)[\w\s.,]*\b[A-Z]{2}\s+\d{5}(?:-\d{4})?)/i
  );
  if (addressMatch) contact.address_raw = addressMatch[1].trim();

  return contact;
}

// ---------------------------------------------------------------------------
// Table detection
// ---------------------------------------------------------------------------

function detectTables(text) {
  const tables = [];
  const lines = text.split("\n");
  let tableBuffer = [];
  let inTable = false;

  for (const line of lines) {
    // Heuristic: lines with multiple tab or multi-space separations suggest tabular data
    const columns = line.split(/\t|\s{3,}/).filter((c) => c.trim());
    if (columns.length >= 3) {
      inTable = true;
      tableBuffer.push(columns.map((c) => c.trim()));
    } else if (inTable && line.trim() === "") {
      if (tableBuffer.length >= 2) {
        tables.push({
          headers: tableBuffer[0],
          rows: tableBuffer.slice(1),
        });
      }
      tableBuffer = [];
      inTable = false;
    }
  }

  // Catch trailing table
  if (tableBuffer.length >= 2) {
    tables.push({
      headers: tableBuffer[0],
      rows: tableBuffer.slice(1),
    });
  }

  return tables;
}

// ---------------------------------------------------------------------------
// Company identity extraction
// ---------------------------------------------------------------------------

function extractCompanyIdentity(text, sections) {
  const identity = {
    name: "",
    tagline: "",
    description: "",
    industry: "",
  };

  // The company name is often the first substantial text or the first heading
  if (sections.length > 0) {
    const firstHeading = sections[0].heading;
    if (firstHeading && firstHeading !== "Content") {
      identity.name = firstHeading;
    }
  }

  // Description: first paragraph of substantial length
  for (const section of sections) {
    if (section.content && section.content.length > 50) {
      identity.description = section.content.split("\n\n")[0].substring(0, 300);
      break;
    }
  }

  return identity;
}

// ---------------------------------------------------------------------------
// Service / capability extraction
// ---------------------------------------------------------------------------

function extractServices(sections) {
  const services = [];
  const serviceKeywords = /services|capabilities|offerings|solutions|what we do|our work/i;

  for (const section of sections) {
    if (serviceKeywords.test(section.heading)) {
      // Try to split the content into individual services
      const items = section.content.split(/\n\n|(?=•|–|—|-\s)/);
      for (const item of items) {
        const trimmed = item.replace(/^[•–—-]\s*/, "").trim();
        if (trimmed.length > 10) {
          const parts = trimmed.split(/[:.]\s/);
          services.push({
            name: parts[0].substring(0, 100),
            description: (parts.slice(1).join(". ") || parts[0]).substring(0, 500),
          });
        }
      }
    }
  }

  return services;
}

// ---------------------------------------------------------------------------
// Team member extraction
// ---------------------------------------------------------------------------

function extractTeam(sections) {
  const team = [];
  const teamKeywords = /team|leadership|staff|people|our team|management/i;

  for (const section of sections) {
    if (teamKeywords.test(section.heading)) {
      // Look for name-title patterns
      const nameMatches = section.content.match(
        /([A-Z][a-z]+ [A-Z][a-z]+(?:\s[A-Z][a-z]+)?)\s*[-–—,]\s*([^\n]+)/g
      );
      if (nameMatches) {
        for (const match of nameMatches) {
          const parts = match.split(/\s*[-–—,]\s*/);
          team.push({
            name: parts[0].trim(),
            title: parts[1]?.trim() || "",
            bio: "",
          });
        }
      }
    }
  }

  return team;
}

// ---------------------------------------------------------------------------
// Main extraction
// ---------------------------------------------------------------------------

async function extract(pdfPath) {
  const absolutePath = path.resolve(pdfPath);

  if (!fs.existsSync(absolutePath)) {
    console.error(`File not found: ${absolutePath}`);
    process.exit(1);
  }

  console.log(`Extracting content from: ${absolutePath}`);

  const dataBuffer = fs.readFileSync(absolutePath);
  const data = await pdfParse(dataBuffer);

  console.log(`  Pages: ${data.numpages}`);
  console.log(`  Text length: ${data.text.length} characters`);

  // Run all extraction passes
  const sections = detectSections(data.text);
  const contact = extractContactInfo(data.text);
  const tables = detectTables(data.text);
  const identity = extractCompanyIdentity(data.text, sections);
  const services = extractServices(sections);
  const team = extractTeam(sections);

  console.log(`  Sections found: ${sections.length}`);
  console.log(`  Tables found: ${tables.length}`);
  console.log(`  Services found: ${services.length}`);
  console.log(`  Team members found: ${team.length}`);

  const result = {
    _meta: {
      source: path.basename(absolutePath),
      extractedAt: new Date().toISOString(),
      pages: data.numpages,
      textLength: data.text.length,
    },
    identity,
    sections,
    contact,
    tables,
    services,
    team,
    rawText: data.text,
  };

  // Write output
  const outputPath = path.join(__dirname, "..", "data", "raw-extract.json");
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));

  console.log(`\nExtraction complete: ${outputPath}`);
  console.log(
    "Run AUDIT A (Document Analyst) to verify extraction completeness."
  );

  return result;
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

const options = parseArgs();
extract(options.pdf).catch((err) => {
  console.error("Extraction failed:", err.message);
  process.exit(1);
});
