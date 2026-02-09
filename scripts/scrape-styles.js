#!/usr/bin/env node

/**
 * Stream B: Web Style Scraping
 *
 * Scrapes the visual design system from a reference URL and outputs
 * data/scraped-styles.json. This script is the Style Cloner's tool.
 *
 * Usage:
 *   node scripts/scrape-styles.js --url https://example.com
 *   npm run scrape -- --url https://example.com
 *
 * Sub-agents (all run within this script):
 *   1. Color Scraper — extracts all color values
 *   2. Typography Scraper — extracts font families, sizes, weights
 *   3. Layout Scraper — extracts containers, grids, spacing
 *   4. Component Scraper — extracts button, card, nav patterns
 *   5. Asset Scraper — downloads logo, favicon, key images
 */

const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer-core");

// Use system-installed Chromium (Playwright's or any available)
const CHROME_PATH = process.env.CHROME_PATH ||
  "/root/.cache/ms-playwright/chromium-1194/chrome-linux/chrome";

// ---------------------------------------------------------------------------
// CLI argument parsing
// ---------------------------------------------------------------------------

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--url" && args[i + 1]) {
      options.url = args[++i];
    }
  }
  if (!options.url) {
    console.error("Usage: node scripts/scrape-styles.js --url <url>");
    process.exit(1);
  }
  return options;
}

// ---------------------------------------------------------------------------
// Color utilities
// ---------------------------------------------------------------------------

function rgbToHex(r, g, b) {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = Math.round(x).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
}

function parseColor(colorStr) {
  if (!colorStr || colorStr === "transparent" || colorStr === "inherit" || colorStr === "initial") return null;

  // hex
  const hexMatch = colorStr.match(/^#([0-9a-f]{3,8})$/i);
  if (hexMatch) return colorStr.substring(0, 7).toUpperCase();

  // rgb/rgba
  const rgbMatch = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (rgbMatch) {
    return rgbToHex(parseInt(rgbMatch[1]), parseInt(rgbMatch[2]), parseInt(rgbMatch[3]));
  }

  return null;
}

/**
 * Generate a 10-shade scale from a base color.
 * Uses simple lightness interpolation.
 */
function generateColorScale(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  const shades = {};
  const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
  const factors = [0.9, 0.8, 0.6, 0.4, 0.2, 0, -0.2, -0.4, -0.6, -0.8];

  for (let i = 0; i < steps.length; i++) {
    const factor = factors[i];
    let nr, ng, nb;
    if (factor >= 0) {
      // Lighten: blend toward white
      nr = r + (255 - r) * factor;
      ng = g + (255 - g) * factor;
      nb = b + (255 - b) * factor;
    } else {
      // Darken: blend toward black
      nr = r * (1 + factor);
      ng = g * (1 + factor);
      nb = b * (1 + factor);
    }
    shades[steps[i]] = rgbToHex(nr, ng, nb);
  }
  return shades;
}

// ---------------------------------------------------------------------------
// Sub-agent 1: Color Scraper
// ---------------------------------------------------------------------------

async function scrapeColors(page) {
  console.log("  [Color Scraper] Extracting colors...");

  const rawColors = await page.evaluate(() => {
    const colors = new Map();
    const elements = document.querySelectorAll("*");

    for (const el of elements) {
      const style = window.getComputedStyle(el);
      const props = [
        "color",
        "backgroundColor",
        "borderColor",
        "borderTopColor",
        "borderBottomColor",
        "borderLeftColor",
        "borderRightColor",
      ];
      for (const prop of props) {
        const val = style[prop];
        if (val && val !== "rgba(0, 0, 0, 0)" && val !== "transparent") {
          const count = colors.get(val) || 0;
          colors.set(val, count + 1);
        }
      }
    }

    return Array.from(colors.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 50);
  });

  // Parse and deduplicate
  const colorMap = new Map();
  for (const [raw, count] of rawColors) {
    const hex = parseColor(raw);
    if (hex && hex !== "#000000" && hex !== "#FFFFFF" && hex !== "#FFFFFF") {
      colorMap.set(hex, (colorMap.get(hex) || 0) + count);
    }
  }

  // Sort by frequency
  const sorted = Array.from(colorMap.entries())
    .sort((a, b) => b[1] - a[1]);

  // Identify primary (most used non-gray color) and accent (second most)
  const isGrayish = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    return (max - min) < 30;
  };

  const brandColors = sorted.filter(([hex]) => !isGrayish(hex));
  const primary = brandColors[0]?.[0] || "#006699";
  const accent = brandColors[1]?.[0] || "#CC3300";

  console.log(`    Primary: ${primary} (${brandColors[0]?.[1] || 0} uses)`);
  console.log(`    Accent: ${accent} (${brandColors[1]?.[1] || 0} uses)`);

  return {
    primary: { base: primary, scale: generateColorScale(primary) },
    accent: { base: accent, scale: generateColorScale(accent) },
    all: sorted.slice(0, 20).map(([hex, count]) => ({ hex, count })),
  };
}

// ---------------------------------------------------------------------------
// Sub-agent 2: Typography Scraper
// ---------------------------------------------------------------------------

async function scrapeTypography(page) {
  console.log("  [Typography Scraper] Extracting fonts...");

  const typography = await page.evaluate(() => {
    const fonts = new Map();
    const headingFonts = new Map();
    const sizes = new Map();
    const weights = new Map();
    const lineHeights = new Map();

    const elements = document.querySelectorAll("*");
    const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");

    for (const el of elements) {
      const style = window.getComputedStyle(el);
      const family = style.fontFamily;
      const size = style.fontSize;
      const weight = style.fontWeight;
      const lh = style.lineHeight;

      if (family) fonts.set(family, (fonts.get(family) || 0) + 1);
      if (size) sizes.set(size, (sizes.get(size) || 0) + 1);
      if (weight) weights.set(weight, (weights.get(weight) || 0) + 1);
      if (lh && lh !== "normal") lineHeights.set(lh, (lineHeights.get(lh) || 0) + 1);
    }

    for (const el of headings) {
      const style = window.getComputedStyle(el);
      const family = style.fontFamily;
      if (family) headingFonts.set(family, (headingFonts.get(family) || 0) + 1);
    }

    // Find Google Fonts links
    const googleFontsLinks = [];
    const links = document.querySelectorAll('link[href*="fonts.googleapis.com"]');
    for (const link of links) {
      googleFontsLinks.push(link.href);
    }

    return {
      bodyFont: Array.from(fonts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] || "",
      headingFont: Array.from(headingFonts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] || "",
      sizes: Array.from(sizes.entries()).sort((a, b) => b[1] - a[1]).slice(0, 10),
      weights: Array.from(weights.entries()).sort((a, b) => b[1] - a[1]),
      lineHeights: Array.from(lineHeights.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5),
      googleFontsUrls: googleFontsLinks,
    };
  });

  console.log(`    Body font: ${typography.bodyFont.substring(0, 60)}`);
  console.log(`    Heading font: ${typography.headingFont.substring(0, 60)}`);

  return typography;
}

// ---------------------------------------------------------------------------
// Sub-agent 3: Layout Scraper
// ---------------------------------------------------------------------------

async function scrapeLayout(page) {
  console.log("  [Layout Scraper] Extracting layout patterns...");

  const layout = await page.evaluate(() => {
    const body = document.body;
    const bodyStyle = window.getComputedStyle(body);

    // Find max-width containers
    const containers = [];
    const allElements = document.querySelectorAll("*");
    for (const el of allElements) {
      const style = window.getComputedStyle(el);
      const maxWidth = style.maxWidth;
      if (maxWidth && maxWidth !== "none" && maxWidth !== "0px") {
        const px = parseInt(maxWidth);
        if (px >= 600 && px <= 2000) {
          containers.push(maxWidth);
        }
      }
    }

    // Header structure
    const header = document.querySelector("header, [role='banner'], nav");
    const headerInfo = header
      ? {
          exists: true,
          tagName: header.tagName,
          height: header.getBoundingClientRect().height + "px",
          background: window.getComputedStyle(header).backgroundColor,
        }
      : { exists: false };

    // Footer structure
    const footer = document.querySelector("footer, [role='contentinfo']");
    const footerInfo = footer
      ? {
          exists: true,
          tagName: footer.tagName,
          background: window.getComputedStyle(footer).backgroundColor,
        }
      : { exists: false };

    // Section spacing patterns
    const sections = document.querySelectorAll("section, main > div, .section");
    const sectionSpacing = [];
    for (const section of sections) {
      const style = window.getComputedStyle(section);
      sectionSpacing.push({
        paddingTop: style.paddingTop,
        paddingBottom: style.paddingBottom,
        marginTop: style.marginTop,
        marginBottom: style.marginBottom,
      });
    }

    return {
      containers: [...new Set(containers)],
      header: headerInfo,
      footer: footerInfo,
      sectionSpacing: sectionSpacing.slice(0, 5),
      bodyBackground: bodyStyle.backgroundColor,
    };
  });

  console.log(`    Containers: ${layout.containers.join(", ") || "none detected"}`);
  console.log(`    Header: ${layout.header.exists ? "found" : "not found"}`);
  console.log(`    Footer: ${layout.footer.exists ? "found" : "not found"}`);

  return layout;
}

// ---------------------------------------------------------------------------
// Sub-agent 4: Component Scraper
// ---------------------------------------------------------------------------

async function scrapeComponents(page) {
  console.log("  [Component Scraper] Extracting component patterns...");

  const components = await page.evaluate(() => {
    // Buttons
    const buttons = document.querySelectorAll(
      'button, a.btn, a.button, [class*="btn"], [class*="button"], input[type="submit"]'
    );
    const buttonStyles = [];
    for (const btn of buttons) {
      const style = window.getComputedStyle(btn);
      buttonStyles.push({
        text: btn.textContent.trim().substring(0, 50),
        backgroundColor: style.backgroundColor,
        color: style.color,
        borderRadius: style.borderRadius,
        padding: style.padding,
        fontSize: style.fontSize,
        fontWeight: style.fontWeight,
        border: style.border,
      });
    }

    // Navigation links
    const navLinks = document.querySelectorAll("nav a, header a");
    const navItems = [];
    for (const link of navLinks) {
      navItems.push({
        text: link.textContent.trim().substring(0, 50),
        href: link.getAttribute("href"),
      });
    }

    // Cards (heuristic: elements with shadow, border-radius, and padding)
    const allElements = document.querySelectorAll("*");
    let cardCount = 0;
    const cardStyle = {};
    for (const el of allElements) {
      const style = window.getComputedStyle(el);
      if (
        style.boxShadow !== "none" &&
        parseInt(style.borderRadius) > 0 &&
        parseInt(style.padding) > 10 &&
        el.children.length > 0
      ) {
        cardCount++;
        if (!cardStyle.borderRadius) {
          cardStyle.borderRadius = style.borderRadius;
          cardStyle.boxShadow = style.boxShadow;
          cardStyle.padding = style.padding;
          cardStyle.backgroundColor = style.backgroundColor;
        }
      }
    }

    // Links
    const contentLinks = document.querySelectorAll("main a, article a, .content a, p a");
    const linkStyle = contentLinks.length > 0
      ? (() => {
          const style = window.getComputedStyle(contentLinks[0]);
          return {
            color: style.color,
            textDecoration: style.textDecoration,
          };
        })()
      : {};

    return {
      buttons: buttonStyles.slice(0, 5),
      navigation: navItems.slice(0, 15),
      cards: { count: cardCount, style: cardStyle },
      links: linkStyle,
    };
  });

  console.log(`    Buttons: ${components.buttons.length} found`);
  console.log(`    Nav items: ${components.navigation.length} found`);
  console.log(`    Cards: ${components.cards.count} found`);

  return components;
}

// ---------------------------------------------------------------------------
// Sub-agent 5: Asset Scraper
// ---------------------------------------------------------------------------

async function scrapeAssets(page, baseUrl) {
  console.log("  [Asset Scraper] Extracting brand assets...");

  const assets = await page.evaluate(() => {
    const result = { logos: [], favicon: "", images: [] };

    // Favicon
    const faviconLink = document.querySelector(
      'link[rel="icon"], link[rel="shortcut icon"]'
    );
    if (faviconLink) result.favicon = faviconLink.href;

    // Logo candidates (images in header, images with "logo" in src/alt/class)
    const logoImages = document.querySelectorAll(
      'header img, [class*="logo"] img, img[class*="logo"], img[alt*="logo" i], img[src*="logo" i]'
    );
    for (const img of logoImages) {
      result.logos.push({
        src: img.src,
        alt: img.alt,
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    }

    // Key images (first few meaningful images)
    const allImages = document.querySelectorAll("img");
    for (const img of allImages) {
      if (img.naturalWidth > 100 && img.naturalHeight > 100) {
        result.images.push({
          src: img.src,
          alt: img.alt,
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
      }
    }
    result.images = result.images.slice(0, 10);

    return result;
  });

  console.log(`    Logos: ${assets.logos.length} found`);
  console.log(`    Images: ${assets.images.length} found`);
  console.log(`    Favicon: ${assets.favicon ? "found" : "not found"}`);

  return assets;
}

// ---------------------------------------------------------------------------
// Main scraping orchestrator
// ---------------------------------------------------------------------------

async function scrape(url) {
  console.log(`Scraping design system from: ${url}\n`);

  const browser = await puppeteer.launch({
    headless: "new",
    executablePath: CHROME_PATH,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

    // Wait for fonts to load
    await page.evaluate(() => document.fonts.ready);

    // Run all sub-agents
    const [colors, typography, layout, components, assets] = await Promise.all([
      scrapeColors(page),
      scrapeTypography(page),
      scrapeLayout(page),
      scrapeComponents(page),
      scrapeAssets(page, url),
    ]);

    const result = {
      _meta: {
        source: url,
        scrapedAt: new Date().toISOString(),
        viewport: "1440x900",
      },
      colors,
      typography,
      layout,
      components,
      assets,
    };

    // Write output
    const outputPath = path.join(__dirname, "..", "data", "scraped-styles.json");
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));

    console.log(`\nScraping complete: ${outputPath}`);
    console.log(
      "Run AUDIT B (Style Cloner + Accessibility) to verify design system."
    );

    return result;
  } finally {
    await browser.close();
  }
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

const options = parseArgs();
scrape(options.url).catch((err) => {
  console.error("Scraping failed:", err.message);
  process.exit(1);
});
