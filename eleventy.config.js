module.exports = function (eleventyConfig) {
  // Eleventy only outputs templates by default; copy static files as-is.
  eleventyConfig.addPassthroughCopy("styles.css");
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("llms.txt");
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("sitemap.xml");
  // Per-page stylesheets and assets in nested folders
  eleventyConfig.addPassthroughCopy("**/*.css");
  eleventyConfig.addPassthroughCopy("**/assets/**");
  eleventyConfig.addPassthroughCopy("**/*.{vtt,mov,mp4,webp,jpg,png,svg}");
};
