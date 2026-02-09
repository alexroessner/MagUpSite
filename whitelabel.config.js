// White-label configuration — the single source of brand identity.
//
// This file is populated by the merge script (scripts/merge.js) which
// combines PDF-extracted content with scraped design tokens. You can also
// edit this file manually to override any values before building.
//
// After changes, run: npm run build

module.exports = {
  // Company identity (populated from PDF extraction)
  company: {
    name: "",
    tagline: "",
    description: "",
    industry: "",
    founded: "",
  },

  // Author / primary contact (populated from PDF extraction)
  author: {
    name: "",
    email: "",
    jobTitle: "",
  },

  // Contact details (populated from PDF extraction)
  contact: {
    email: "",
    phone: "",
    fax: "",
    address: {
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "",
    },
  },

  // Brand colors (populated from style scraping or PDF analysis)
  // Each should be a hex value at the 500 (midpoint) shade.
  // The build pipeline generates full 50-900 scales from these.
  colors: {
    primary: "#006699",
    accent: "#CC3300",
  },

  // Typography (populated from style scraping)
  fonts: {
    heading: "",
    body: "",
    mono: "",
    // Google Fonts URL if applicable
    googleFontsUrl: "",
  },

  // Deployment
  siteUrl: "",
  pathPrefix: "/",
};
