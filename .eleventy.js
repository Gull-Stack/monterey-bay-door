module.exports = function(eleventyConfig) {
  // Copy assets to output
  eleventyConfig.addPassthroughCopy("src/assets");
  
  // Copy favicon files
  eleventyConfig.addPassthroughCopy("src/favicons");
  
  // Dynamic sitemap using collections.all
  eleventyConfig.addPassthroughCopy("src/robots.txt");
  
  // Set input and output directories
  return {
    dir: {
      input: "src",
      output: "_site"
    }
  };
};