// const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const uniqueSlug = require('./filters/uniqueSlug');
const fs = require('node:fs');
const path = require('node:path');

module.exports = function(eleventyConfig) {
  // Add Nunjucks as a templating engine
  eleventyConfig.setTemplateFormats(["njk", "md", "html"]);
  eleventyConfig.setNunjucksEnvironmentOptions({
    trimBlocks: true,
    lstripBlocks: true
  });

  // Add a random filter
  eleventyConfig.addFilter("random", function(arr) {
    if (!Array.isArray(arr) || arr.length === 0) return null;
    return arr[Math.floor(Math.random() * arr.length)];
  });

  // Pass through static assets
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/ads.txt");
  eleventyConfig.addPassthroughCopy("src/robots.txt");
  eleventyConfig.addPassthroughCopy({"src/rootFiles": "/"});


  // // Add Eleventy Navigation plugin
  // // eleventyConfig.addPlugin(eleventyNavigationPlugin);
  // eleventyConfig.addFilter("uniqueSlug", uniqueSlug(eleventyConfig.collections.all));

  const uniqueSlugFilter = uniqueSlug();

  // Add the filter
  eleventyConfig.addFilter("uniqueSlug", uniqueSlugFilter);


  eleventyConfig.addFilter("debug", function (value) {
    // console.log("DEBUG:", JSON.stringify(value, null, 2));
    // console.log('DEBUG: ', Object.keys(value));
    console.log('DEBUG: ', value);
    // console.log('DEBUG length: ', value.length);
    return 'debugging...';
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      layouts: "_layouts",
      data: "_data"
    },
    templateFormats: ["njk", "md", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk"
  };
};