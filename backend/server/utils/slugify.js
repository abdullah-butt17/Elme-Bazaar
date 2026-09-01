/**
 * Converts a product name into a URL-friendly slug.
 * e.g. "Emerald Silk Kurta - Limited Edition!" -> "emerald-silk-kurta-limited-edition"
 */
const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // strip punctuation
    .replace(/[\s_]+/g, '-') // spaces/underscores -> hyphen
    .replace(/-+/g, '-') // collapse repeated hyphens
    .replace(/^-|-$/g, ''); // trim leading/trailing hyphens

module.exports = slugify;
