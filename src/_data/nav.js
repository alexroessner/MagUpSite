// Single source of truth for all page URLs.
//
// main:         items shown in the header navigation bar (5-6 max)
// footerGroups: categorized groups shown in the footer
// all:          flat list of every page (for sitemaps, mobile menu, etc.)

const fs = require("fs");
const path = require("path");

// Default pages that every generated site has
const corePages = {
  home: { title: "Home", url: "/" },
  about: { title: "About", url: "/about/" },
  services: { title: "Services", url: "/services/" },
  contact: { title: "Contact", url: "/contact/" },
};

// Try to load dynamically generated pages from blueprint
const blueprintPath = path.join(__dirname, "..", "..", "data", "merged-blueprint.json");
let allPages = { ...corePages };
let customPages = [];

if (fs.existsSync(blueprintPath)) {
  try {
    const blueprint = JSON.parse(fs.readFileSync(blueprintPath, "utf-8"));
    if (blueprint.navigation?.pages) {
      allPages = {};
      for (const [key, page] of Object.entries(blueprint.navigation.pages)) {
        allPages[key] = { title: page.title, url: page.url };
      }

      // Separate core from custom section pages
      const coreKeys = ["home", "about", "services", "contact", "team"];
      customPages = Object.entries(allPages)
        .filter(([k]) => !coreKeys.includes(k))
        .map(([, v]) => v);
    }
  } catch (e) {
    // Fall back to defaults if blueprint is malformed
  }
}

// Find the case study page (high-value for conversion)
const caseStudy = customPages.find((p) =>
  /case.study/i.test(p.title)
);

module.exports = {
  // Header nav — buyer's journey:
  // Awareness (Home) → Evaluation (Services, Case Study) → Interest (About) → Decision (Contact)
  main: [
    allPages.home || corePages.home,
    allPages.services || corePages.services,
    caseStudy,
    allPages.about || corePages.about,
    allPages.contact || corePages.contact,
  ].filter(Boolean),

  // Footer nav — pages organized by category
  footerGroups: [
    {
      heading: "Company",
      items: [allPages.home, allPages.about, allPages.team].filter(Boolean),
    },
    {
      heading: "Services",
      items: [allPages.services].filter(Boolean),
    },
    {
      heading: "Resources",
      items: customPages.filter((p) =>
        /case.study|geo|seo|agent|architecture|process/i.test(p.title)
      ).slice(0, 6),
    },
  ],

  // Flat list of every page (for sitemaps, mobile menu, etc.)
  all: Object.values(allPages),
};
