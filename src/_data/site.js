// Site-wide metadata for SEO, structured data, and social sharing.
//
// Values are loaded from whitelabel.config.js, which is populated by the
// merge pipeline. You can also edit whitelabel.config.js manually.

const path = require("path");
const fs = require("fs");

// Load whitelabel config
const configPath = path.join(__dirname, "..", "..", "whitelabel.config.js");
let config = {};
if (fs.existsSync(configPath)) {
  config = require(configPath);
}

const pathPrefix = process.env.PATH_PREFIX || config.pathPrefix || "/";
const siteUrl = process.env.SITE_URL || config.siteUrl || "";

module.exports = {
  name: config.company?.name || "Company Name",
  url: siteUrl,
  tagline: config.company?.tagline || "",
  description: config.company?.description || "",
  industry: config.company?.industry || "",
  author: {
    name: config.author?.name || "",
    email: config.author?.email || config.contact?.email || "",
    jobTitle: config.author?.jobTitle || "",
  },
  contact: {
    email: config.contact?.email || "",
    phone: config.contact?.phone || "",
    fax: config.contact?.fax || "",
    url: config.contact?.url || "",
    address: config.contact?.address || {
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "",
    },
  },
  colors: config.colors || { primary: "#006699", accent: "#CC3300" },
  fonts: config.fonts || { heading: "", body: "", mono: "" },
};
