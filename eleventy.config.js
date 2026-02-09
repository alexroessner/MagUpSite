const fs = require("fs");
const path = require("path");

module.exports = function (eleventyConfig) {
  // Copy static assets
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/pdf");
  eleventyConfig.addPassthroughCopy("src/css/style.css");

  // Load merged blueprint if it exists, otherwise use defaults
  const blueprintPath = path.join(__dirname, "data", "merged-blueprint.json");
  if (fs.existsSync(blueprintPath)) {
    const blueprint = JSON.parse(fs.readFileSync(blueprintPath, "utf-8"));
    eleventyConfig.addGlobalData("blueprint", blueprint);
  }

  // Path prefix for deployment (e.g., GitHub Pages subdirectory)
  eleventyConfig.addGlobalData("pathPrefix", process.env.PATH_PREFIX || "/");

  // Current year for copyright notices
  eleventyConfig.addGlobalData("currentYear", new Date().getFullYear());

  return {
    dir: {
      input: "src",
      output: "dist",
      includes: "_includes",
    },
    pathPrefix: process.env.PATH_PREFIX || "/",
  };
};
