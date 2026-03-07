module.exports = function(eleventyConfig) {
  // Copy assets to output
  eleventyConfig.addPassthroughCopy("src/assets");

  // Copy favicon files
  eleventyConfig.addPassthroughCopy("src/favicons");

  // Dynamic sitemap using collections.all
  eleventyConfig.addPassthroughCopy("src/robots.txt");

  // Brand facts for AEO crawlers
  eleventyConfig.addPassthroughCopy("src/brand-facts.json");

  // Strip HTML tags from product descriptions
  eleventyConfig.addFilter('stripHtml', function(value) {
    if (!value) return '';
    return value.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
  });

  // Truncate text to a given length
  eleventyConfig.addFilter('truncate', function(value, length) {
    if (!value) return '';
    length = length || 120;
    if (value.length <= length) return value;
    return value.substring(0, length).replace(/\s+\S*$/, '') + '...';
  });

  // Slugify category names for use as IDs/classes
  eleventyConfig.addFilter('slugify', function(value) {
    if (!value) return '';
    return value.toString().toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  });

  // Product slug: uses url_component, falls back to product id for uniqueness
  eleventyConfig.addFilter('productSlug', function(product) {
    var slug = (product.url_component || '').toString().toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    if (!slug) {
      slug = 'product-' + product.id;
    }
    return slug;
  });

  // Set input and output directories
  return {
    dir: {
      input: "src",
      output: "_site"
    }
  };
};
