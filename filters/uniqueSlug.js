const slugify = require('@11ty/eleventy/src/Filters/Slugify');

function uniqueSlug(collection) {
  const slugs = new Map();
  
  return function(title, date) {
    let slug = slugify(title);
    
    if (slugs.has(slug)) {
      // If the slug already exists, append the date
      const formattedDate = date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
      slug = `${slug}-${formattedDate}`;
    }
    
    slugs.set(slug, true);
    return slug;
  };
}

module.exports = uniqueSlug;