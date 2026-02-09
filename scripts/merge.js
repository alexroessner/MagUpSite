#!/usr/bin/env node

/**
 * Merge / Synthesizer
 *
 * Combines Stream A (raw-extract.json from PDF) and Stream B
 * (scraped-styles.json from URL) into a unified site blueprint.
 * This script is the Synthesizer persona's tool.
 *
 * Usage:
 *   node scripts/merge.js
 *   npm run merge
 *
 * Inputs:
 *   data/raw-extract.json     — PDF extraction output
 *   data/scraped-styles.json  — Style scraping output (optional)
 *
 * Outputs:
 *   data/merged-blueprint.json  — Unified site blueprint
 *   whitelabel.config.js        — Updated brand configuration
 *   src/_data/pageContent.json   — Structured content for templates
 *   src/css/input.css            — Updated @theme design tokens
 *   personas/target-audience.md — Generated audience persona
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const DATA = path.join(ROOT, "data");

// ---------------------------------------------------------------------------
// Load inputs
// ---------------------------------------------------------------------------

function loadJSON(filePath) {
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

// ---------------------------------------------------------------------------
// Merge company identity
// ---------------------------------------------------------------------------

function mergeIdentity(extract) {
  return {
    name: extract.identity?.name || "Company Name",
    tagline: extract.identity?.tagline || "",
    description: extract.identity?.description || "",
    industry: extract.identity?.industry || "",
    founded: extract.identity?.founded || "",
  };
}

// ---------------------------------------------------------------------------
// Merge contact info
// ---------------------------------------------------------------------------

function mergeContact(extract) {
  const raw = extract.contact || {};
  const address = {};

  if (raw.address_raw) {
    // Attempt to parse structured address from raw string
    const parts = raw.address_raw.split(",").map((s) => s.trim());
    address.street = parts[0] || "";
    if (parts.length >= 2) {
      const cityStateZip = parts[parts.length - 1];
      const stateZipMatch = cityStateZip.match(/([A-Z]{2})\s+(\d{5}(?:-\d{4})?)/);
      if (stateZipMatch) {
        address.state = stateZipMatch[1];
        address.zip = stateZipMatch[2];
        address.city = cityStateZip.replace(stateZipMatch[0], "").trim();
      } else {
        address.city = parts[1] || "";
      }
    }
    address.country = "US";
  }

  return {
    email: raw.email || "",
    phone: raw.phone || "",
    fax: raw.fax || "",
    address,
  };
}

// ---------------------------------------------------------------------------
// Merge design tokens
// ---------------------------------------------------------------------------

function mergeDesignTokens(scraped) {
  const defaults = {
    colors: {
      primary: {
        base: "#006699",
        scale: {
          50: "#E6F0F5", 100: "#CCE1EB", 200: "#99C3D7", 300: "#66A5C3", 400: "#3387AF",
          500: "#006699", 600: "#00527A", 700: "#003D5C", 800: "#00293D", 900: "#00141F",
        },
      },
      accent: {
        base: "#CC3300",
        scale: {
          50: "#FEF3EF", 100: "#FDE7DF", 200: "#FBCFBF", 300: "#F9B79F", 400: "#F79F7F",
          500: "#CC3300", 600: "#A32900", 700: "#7A1F00", 800: "#521400", 900: "#290A00",
        },
      },
    },
    typography: {
      headingFont: "Georgia, 'Times New Roman', serif",
      bodyFont: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      monoFont: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
      googleFontsUrl: "",
    },
  };

  if (!scraped) return defaults;

  return {
    colors: {
      primary: scraped.colors?.primary || defaults.colors.primary,
      accent: scraped.colors?.accent || defaults.colors.accent,
    },
    typography: {
      headingFont: scraped.typography?.headingFont || defaults.typography.headingFont,
      bodyFont: scraped.typography?.bodyFont || defaults.typography.bodyFont,
      monoFont: defaults.typography.monoFont,
      googleFontsUrl: scraped.typography?.googleFontsUrls?.[0] || "",
    },
  };
}

// ---------------------------------------------------------------------------
// Map content to pages
// ---------------------------------------------------------------------------

function mapContentToPages(extract) {
  const pages = {
    home: { title: "Home", url: "/" },
  };

  // Always create About if there's any about-like content
  const aboutSections = extract.sections?.filter((s) =>
    /about|overview|introduction|company|who we are|mission|history/i.test(s.heading)
  );
  if (aboutSections?.length > 0 || extract.identity?.description) {
    pages.about = { title: "About", url: "/about/" };
  }

  // Services page if services were extracted
  if (extract.services?.length > 0) {
    pages.services = { title: "Services", url: "/services/" };
  }

  // Team page if team members were extracted
  if (extract.team?.length > 0) {
    pages.team = { title: "Team", url: "/team/" };
  }

  // Contact page if any contact info exists
  if (extract.contact?.email || extract.contact?.phone || extract.contact?.address_raw) {
    pages.contact = { title: "Contact", url: "/contact/" };
  }

  // Custom sections that don't fit standard categories
  const standardKeywords = /about|overview|introduction|company|services|capabilities|team|contact|leadership|staff/i;
  const customSections = extract.sections?.filter(
    (s) => !standardKeywords.test(s.heading) && s.content?.length > 100
  );

  for (const section of customSections || []) {
    const slug = section.heading
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    if (slug && !pages[slug]) {
      pages[slug] = { title: section.heading, url: `/${slug}/` };
    }
  }

  return pages;
}

// ---------------------------------------------------------------------------
// Build navigation structure
// ---------------------------------------------------------------------------

function buildNavigation(pages) {
  const pageList = Object.values(pages);
  const companyPages = [pages.home, pages.about].filter(Boolean);
  const servicePages = [pages.services].filter(Boolean);
  const connectPages = [pages.contact].filter(Boolean);

  // Any page not in the above groups goes to a "More" category
  const categorized = new Set(
    [...companyPages, ...servicePages, ...connectPages].map((p) => p.url)
  );
  const otherPages = pageList.filter((p) => !categorized.has(p.url));

  const footerGroups = [
    { heading: "Company", items: companyPages },
    { heading: "Services", items: [...servicePages, ...otherPages] },
    { heading: "Connect", items: connectPages },
  ].filter((g) => g.items.length > 0);

  return {
    pages,
    main: pageList,
    footerGroups,
    all: pageList,
  };
}

// ---------------------------------------------------------------------------
// Build pageContent.json
// ---------------------------------------------------------------------------

function buildContent(extract) {
  const aboutSections = extract.sections?.filter((s) =>
    /about|overview|introduction|company|who we are|mission|history/i.test(s.heading)
  ) || [];

  const aboutContent = aboutSections.map((s) => s.content).join("\n\n");

  return {
    _schema: "DeckSiteAgent content schema v1. Generated by scripts/merge.js.",
    company: mergeIdentity(extract),
    hero: {
      headline: extract.identity?.name || "",
      subheadline: extract.identity?.description || "",
      cta_primary: { text: "Contact Us", url: "/contact/" },
      cta_secondary: { text: "Learn More", url: "/about/" },
    },
    about: {
      title: "About",
      content: aboutContent || extract.identity?.description || "",
      highlights: [],
    },
    services: (extract.services || []).map((s) => ({
      name: s.name,
      description: s.description,
    })),
    team: (extract.team || []).map((t) => ({
      name: t.name,
      title: t.title,
      bio: t.bio || "",
      image: "",
    })),
    contact: mergeContact(extract),
    testimonials: [],
    clients: [],
    certifications: [],
    custom_sections: (extract.sections || [])
      .filter(
        (s) =>
          !/about|overview|introduction|company|services|capabilities|team|contact|leadership|staff/i.test(
            s.heading
          ) && s.content?.length > 100
      )
      .map((s) => ({
        title: s.heading,
        content: s.content,
      })),
  };
}

// ---------------------------------------------------------------------------
// Update whitelabel.config.js
// ---------------------------------------------------------------------------

function writeWhitelabelConfig(identity, contact, tokens) {
  const config = `// White-label configuration — auto-generated by scripts/merge.js
// Edit this file to override any values before building.

module.exports = {
  company: {
    name: ${JSON.stringify(identity.name)},
    tagline: ${JSON.stringify(identity.tagline)},
    description: ${JSON.stringify(identity.description)},
    industry: ${JSON.stringify(identity.industry)},
    founded: ${JSON.stringify(identity.founded)},
  },
  author: {
    name: "",
    email: ${JSON.stringify(contact.email)},
    jobTitle: "",
  },
  contact: {
    email: ${JSON.stringify(contact.email)},
    phone: ${JSON.stringify(contact.phone)},
    fax: ${JSON.stringify(contact.fax)},
    address: ${JSON.stringify(contact.address, null, 6).replace(/\n/g, "\n    ")},
  },
  colors: {
    primary: ${JSON.stringify(tokens.colors.primary.base)},
    accent: ${JSON.stringify(tokens.colors.accent.base)},
  },
  fonts: {
    heading: ${JSON.stringify(tokens.typography.headingFont)},
    body: ${JSON.stringify(tokens.typography.bodyFont)},
    mono: ${JSON.stringify(tokens.typography.monoFont)},
    googleFontsUrl: ${JSON.stringify(tokens.typography.googleFontsUrl)},
  },
  siteUrl: "",
  pathPrefix: "/",
};
`;

  fs.writeFileSync(path.join(ROOT, "whitelabel.config.js"), config);
}

// ---------------------------------------------------------------------------
// Update src/css/input.css @theme block
// ---------------------------------------------------------------------------

function updateInputCSS(tokens) {
  const inputPath = path.join(ROOT, "src", "css", "input.css");
  let css = fs.readFileSync(inputPath, "utf-8");

  const primaryScale = tokens.colors.primary.scale;
  const accentScale = tokens.colors.accent.scale;

  // Build new @theme block
  const newTheme = `@theme {
  /* ===== Typography ===== */
  --font-heading: ${tokens.typography.headingFont};
  --font-sans: ${tokens.typography.bodyFont};
  --font-mono: ${tokens.typography.monoFont};
  --text-body: 1.0625rem;
  --text-body--line-height: 1.7;

  /* ===== Colors ===== */

  /* Primary scale — base: ${tokens.colors.primary.base} */
  --color-primary-50: ${primaryScale[50]};
  --color-primary-100: ${primaryScale[100]};
  --color-primary-200: ${primaryScale[200]};
  --color-primary-300: ${primaryScale[300]};
  --color-primary-400: ${primaryScale[400]};
  --color-primary-500: ${primaryScale[500]};
  --color-primary-600: ${primaryScale[600]};
  --color-primary-700: ${primaryScale[700]};
  --color-primary-800: ${primaryScale[800]};
  --color-primary-900: ${primaryScale[900]};

  /* Accent scale — base: ${tokens.colors.accent.base} */
  --color-accent-50: ${accentScale[50]};
  --color-accent-100: ${accentScale[100]};
  --color-accent-200: ${accentScale[200]};
  --color-accent-300: ${accentScale[300]};
  --color-accent-400: ${accentScale[400]};
  --color-accent-500: ${accentScale[500]};
  --color-accent-600: ${accentScale[600]};
  --color-accent-700: ${accentScale[700]};
  --color-accent-800: ${accentScale[800]};
  --color-accent-900: ${accentScale[900]};
}`;

  // Replace existing @theme block
  css = css.replace(/@theme\s*\{[\s\S]*?\n\}/, newTheme);

  fs.writeFileSync(inputPath, css);
}

// ---------------------------------------------------------------------------
// Generate target audience persona
// ---------------------------------------------------------------------------

function generateAudiencePersona(identity, services) {
  const serviceList = services.map((s) => s.name).join(", ");
  const industry = identity.industry || "this industry";

  const persona = `# Target Audience

You understand the people this site is built for. ${identity.name}'s clients
are professionals and decision-makers in ${industry} who are evaluating
providers for ${serviceList || "the services described on this site"}.

They evaluate providers on expertise, track record, and trustworthiness --
not on marketing polish. They want to see evidence: case studies, client
lists, certifications, and clear descriptions of capabilities. They are
skeptical of vague claims and generic business language.

You think like someone who is looking to hire ${identity.name} or a
competitor. You care about: Does this company have experience with my
specific needs? Who else has trusted them? Can I see evidence of their
work? Is it easy to make contact?

You notice when the site's tone drifts toward empty marketing language.
You notice when important credibility signals (experience, clients,
certifications) are buried below generic copy. You notice when the
navigation makes it hard to find the evidence an evaluator would look for.

You evaluate every content and design decision through the lens: would
this build trust with a potential client? If the answer is no -- if it
feels like a generic template, or anything that prioritizes flash over
substance -- you say so.

This project's content is in \`src/_data/pageContent.json\`. The site metadata
is in \`src/_data/site.js\`. Read those to understand the company, then
bring your perspective to any content or design review.
`;

  fs.writeFileSync(path.join(ROOT, "personas", "target-audience.md"), persona);
}

// ---------------------------------------------------------------------------
// Main merge
// ---------------------------------------------------------------------------

function merge() {
  console.log("Merging content and design streams...\n");

  // Load inputs
  const extract = loadJSON(path.join(DATA, "raw-extract.json"));
  const scraped = loadJSON(path.join(DATA, "scraped-styles.json"));

  if (!extract) {
    console.error(
      "Error: data/raw-extract.json not found. Run `npm run extract` first."
    );
    process.exit(1);
  }

  if (!scraped) {
    console.log("Note: data/scraped-styles.json not found. Using default design tokens.");
    console.log("Run `npm run scrape -- --url <url>` to scrape a reference design.\n");
  }

  // Merge identity and contact
  const identity = mergeIdentity(extract);
  const contact = mergeContact(extract);
  console.log(`  Company: ${identity.name}`);
  console.log(`  Contact: ${contact.email || "none"}`);

  // Merge design tokens
  const tokens = mergeDesignTokens(scraped);
  console.log(`  Primary color: ${tokens.colors.primary.base}`);
  console.log(`  Heading font: ${tokens.typography.headingFont.substring(0, 40)}`);

  // Map content to pages
  const pages = mapContentToPages(extract);
  const navigation = buildNavigation(pages);
  console.log(`  Pages: ${Object.keys(pages).length}`);

  // Build content data
  const content = buildContent(extract);

  // Build the unified blueprint
  const blueprint = {
    _meta: {
      mergedAt: new Date().toISOString(),
      contentSource: extract._meta?.source || "unknown",
      designSource: scraped?._meta?.source || "defaults",
    },
    identity,
    contact,
    navigation,
    tokens,
    content,
  };

  // Write all outputs
  console.log("\nWriting outputs...");

  // 1. Blueprint
  const blueprintPath = path.join(DATA, "merged-blueprint.json");
  fs.mkdirSync(path.dirname(blueprintPath), { recursive: true });
  fs.writeFileSync(blueprintPath, JSON.stringify(blueprint, null, 2));
  console.log(`  ✓ ${blueprintPath}`);

  // 2. Whitelabel config
  writeWhitelabelConfig(identity, contact, tokens);
  console.log("  ✓ whitelabel.config.js");

  // 3. Content data
  const contentPath = path.join(ROOT, "src", "_data", "pageContent.json");
  fs.writeFileSync(contentPath, JSON.stringify(content, null, 2));
  console.log("  ✓ src/_data/pageContent.json");

  // 4. CSS theme tokens
  updateInputCSS(tokens);
  console.log("  ✓ src/css/input.css @theme block");

  // 5. Target audience persona
  generateAudiencePersona(identity, extract.services || []);
  console.log("  ✓ personas/target-audience.md");

  console.log("\nMerge complete. Run AUDIT C to verify blueprint coherence.");
  console.log("Then run `npm run build` to generate the site.");
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

merge();
