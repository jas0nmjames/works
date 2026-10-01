const { DateTime } = require("luxon");

module.exports = function (eleventyConfig) {
  // Dates are authored and displayed as Eastern Time. YAML turns `date: 2026-10-01`
  // into a Date at UTC midnight, so reinterpret its wall-clock fields as Eastern.
  // Write dates as `2026-10-01` or `2026-10-01T14:30:00` (no offset). An explicit offset such
  // as `-04:00` would be read as UTC first and then mislabeled as Eastern.
  const TZ = "America/New_York";
  // Only affects `page.date`, so templates must print page.date rather than front-matter `date`.
  eleventyConfig.addDateParsing((value) => {
    if (value instanceof Date) {
      return DateTime.fromObject(
        {
          year: value.getUTCFullYear(), month: value.getUTCMonth() + 1, day: value.getUTCDate(),
          hour: value.getUTCHours(), minute: value.getUTCMinutes(), second: value.getUTCSeconds(),
        },
        { zone: TZ }
      ).toJSDate();
    }
    if (typeof value === "string") {
      const dt = DateTime.fromISO(value, { zone: TZ });
      if (dt.isValid) return dt.toJSDate();
    }
  });
  // Filters for printing page.date in Eastern: isoDate -> 2026-10-01 (datetime attr), displayDate -> October 1, 2026.
  eleventyConfig.addFilter("isoDate", (d) => DateTime.fromJSDate(d, { zone: TZ }).toISODate());
  eleventyConfig.addFilter("displayDate", (d) =>
    DateTime.fromJSDate(d, { zone: TZ }).toLocaleString(DateTime.DATE_FULL, { locale: "en-US" })
  );

  // Keep private and internal files out of the published site. Without this Eleventy renders
  // every .md file it finds, including drafts in "working folder" and the READMEs.
  // (Globs are case sensitive, hence both spellings of README.)
  eleventyConfig.ignores.add("working folder/**");
  eleventyConfig.ignores.add("**/README.md");
  eleventyConfig.ignores.add("**/readme.md");

  // Eleventy only outputs templates by default; without these, CSS, images and video 404 under --serve.
  eleventyConfig.addPassthroughCopy("styles.css");
  eleventyConfig.addPassthroughCopy("assets"); // includes per-anecdote media in assets/anecdotes/<slug>/
  eleventyConfig.addPassthroughCopy("llms.txt");
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("sitemap.xml");
  // Per-page stylesheets and media. These are limited to the public folders ON PURPOSE:
  // `ignores` above only affects templates, not passthrough copies, so a catch-all glob like
  // "**/assets/**" would publish private files from "working folder/assets/" (PDFs, recordings).
  const MEDIA = "{css,vtt,mov,mp4,webp,jpg,png,svg}";
  eleventyConfig.addPassthroughCopy(`template-*/**/*.${MEDIA}`);
  eleventyConfig.addPassthroughCopy("template-*/assets/**");
  eleventyConfig.addPassthroughCopy(`collections/**/*.${MEDIA}`);
};
