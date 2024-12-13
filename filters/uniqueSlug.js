const slugify = require("@11ty/eleventy/src/Filters/Slugify");

function uniqueSlug(collection) {
  const slugs = new Map();
  return function(title, date) {
    if (!title) {
      throw new Error("Title is required for uniqueSlug.");
    }
    let slug = slugify(title);
    
    // if (slugs.has(slug)) {
      // If the slug already exists, append the date
      const formattedDate = date instanceof Date
        ? date.toISOString().split("T")[0] // Format: YYYY-MM-DD
        : date; // Handle cases where the date is not a Date object
      slug = `${slug}-${formattedDate}`;
    // }
    
    slugs.set(slug, true);
    return slug;
  };
}

module.exports = uniqueSlug;