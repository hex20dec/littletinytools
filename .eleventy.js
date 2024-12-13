// const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const uniqueSlug = require('./filters/uniqueSlug');
console.log("Loading Eleventy config...");

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

  // // Add Eleventy Navigation plugin
  // // eleventyConfig.addPlugin(eleventyNavigationPlugin);
  // eleventyConfig.addFilter("uniqueSlug", uniqueSlug(eleventyConfig.collections.all));

  const uniqueSlugFilter = uniqueSlug();

  // Add the filter
  eleventyConfig.addFilter("uniqueSlug", uniqueSlugFilter);

  // Custom collection for blog posts
  // eleventyConfig.addCollection("posts", function(collectionApi) {
  //   // return collectionApi.getFilteredByGlob("src/posts/*.md");

  //   return collectionApi.getAll().map((item, idx) => {
  //     // Generate and add a unique slug to each item
  //     item.data.uniqueSlug = uniqueSlugFilter(item.data.title, item.date);
  //     return item;
  //   });
  // });



  // eleventyConfig.addCollection("posts", function (collectionApi) {
  //   return collectionApi.getFilteredByGlob("src/posts/*.html").map((item) => {
  //     // Ensure date is available and process the uniqueSlug
  //     const title = item.data.title;
  //     const date = new Date(item.date);
  //     item.data.uniqueSlug = uniqueSlugFilter(title, date);

  //     // Update permalink dynamically based on uniqueSlug
  //     item.data.permalink = `/${item.data.uniqueSlug}/`;
  //     return item;
  //   });
  // });


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