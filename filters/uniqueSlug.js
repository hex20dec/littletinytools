const slugify = require("@11ty/eleventy/src/Filters/Slugify");
const crypto = require("node:crypto");
// const crc1 = require('crc/crc1');

const random = (digits) => {
  const min = Math.pow(10, digits - 1);
  const max = Math.pow(10, digits) - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

function uniqueSlug(collection) {
  // const slugs = new Map(); // this is being set on the initial launch, and then it's not being reset, so we are just adding to it at each resave
  return function(title, page) {
    const date = page.date;
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

    const hash = crypto.createHash('md5')
      .update(title+page.fileSlug+formattedDate)
      .digest('base64url');
    slug = `${slug}-${hash}`;


    
    // let crcString = crc1(title+page.fileSlug+formattedDate);
    // crcString = crcString.toString(36);
    // slug = `${slug}-${crcString}`;

    // slugs.set(slug, true);
    return slug;
  };
}

module.exports = uniqueSlug;