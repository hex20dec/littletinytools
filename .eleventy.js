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




  // Create a folder for skipped files
  const errorFolder = '_error_files';
  if (!fs.existsSync(errorFolder)) {
    fs.mkdirSync(errorFolder); // Create the folder if it doesn't exist
  }

  // Catch errors during file processing
  eleventyConfig.on('beforeWatch', (changedFiles) => {
    console.log('Watching files for changes:', changedFiles);
  });

  // Add a transform to handle syntax errors in templates
  eleventyConfig.addTransform('catch-errors', async (content, outputPath) => {
    try {
      // Ensure the file is being processed normally
      return content;
    } catch (error) {
      console.error(`Error transforming file: ${outputPath}`);
      console.error(error.message);

      // Move the problematic file to the error folder
      const fileName = path.basename(outputPath);
      const destination = path.join(errorFolder, fileName);
      fs.renameSync(outputPath, destination);

      // Skip rendering for this file
      return '';
    }
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