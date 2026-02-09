// Single source of truth for all page URLs.
//
// This file is updated by the merge script based on extracted content.
// You can also edit it manually to add, remove, or reorder pages.
//
// main:         items shown in the header navigation bar
// footerGroups: categorized groups shown in the footer
// all:          flat list of every page (for sitemaps, mobile menu, etc.)

const fs = require("fs");
const path = require("path");

// Default pages that every generated site has
const defaultPages = {
  home: { title: "Home", url: "/" },
  about: { title: "About", url: "/about/" },
  services: { title: "Services", url: "/services/" },
  contact: { title: "Contact", url: "/contact/" },
};

// Try to load dynamically generated pages from blueprint
const blueprintPath = path.join(__dirname, "..", "..", "data", "merged-blueprint.json");
let pages = { ...defaultPages };

if (fs.existsSync(blueprintPath)) {
  try {
    const blueprint = JSON.parse(fs.readFileSync(blueprintPath, "utf-8"));
    if (blueprint.navigation?.pages) {
      pages = {};
      for (const [key, page] of Object.entries(blueprint.navigation.pages)) {
        pages[key] = { title: page.title, url: page.url };
      }
    }
  } catch (e) {
    // Fall back to defaults if blueprint is malformed
  }
}

module.exports = {
  // Header nav — maps to the visitor's journey:
  // Awareness (Home) → Interest (About) → Evaluation (Services) → Decision (Contact)
  main: Object.values(pages),

  // Footer nav — pages organized by category
  footerGroups: [
    {
      heading: "Company",
      items: [pages.home, pages.about].filter(Boolean),
    },
    {
      heading: "Services",
      items: [pages.services].filter(Boolean),
    },
    {
      heading: "Connect",
      items: [pages.contact].filter(Boolean),
    },
  ],

  // Flat list of every page (for sitemaps, mobile menu, etc.)
  all: Object.values(pages),
};
