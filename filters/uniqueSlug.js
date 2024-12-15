const slugify = require("@11ty/eleventy/src/Filters/Slugify");

const random = (digits) => {
  const min = Math.pow(10, digits - 1);
  const max = Math.pow(10, digits) - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

function uniqueSlug(collection) {
  const slugs = new Map(); // this is being set on the initial launch, and then it's not being reset, so we are just adding to it at each resave
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
      slug = `${slug}-${formattedDate}`+random(5);
    // }
    
    slugs.set(slug, true);
    return slug;
  };
}

module.exports = uniqueSlug;