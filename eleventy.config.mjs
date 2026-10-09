// [claude-esm-config] This file was renamed from eleventy.config.js to .mjs and converted from CommonJS
// (require / module.exports) to ESM (import / export default). The image plugin is ESM, and a single
// file can't mix the two styles ("Cannot use import statement outside a module"). The .mjs extension
// makes Node treat it as ESM without changing "type" in package.json.
import { DateTime } from "luxon";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";

export default function (eleventyConfig) {
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
  // every .md file it finds, including drafts in "working-folder" and the READMEs.
  // (Globs are case sensitive, hence both spellings of README.)
  // [claude-site-structure] changed: was "working folder/**" (with a space). The folder was renamed to
  // "working-folder", so the old glob stopped matching and the drafts and notes were being published.
  eleventyConfig.ignores.add("working-folder/**");
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
  eleventyConfig.addPassthroughCopy(`collections/**/*.${MEDIA}`);

  // [claude-site-structure] Built with assistance from Claude (Anthropic), October 8, 2026.
  // Search the repo for "claude-site-structure" to find every piece: this config, the collection
  // data files (collections/*/*.11tydata.json), the layouts in _includes/, tags.njk, search-index.njk,
  // the list pages (anecdotes.md, case-studies.md, playground.md, notes.md, about.md) and netlify.toml redirects.
  //
  // The template stylesheets stay in working-folder (the one copy you edit) and are published under
  // /css/. Only these two files are copied; nothing else in working-folder is published.
  // (changed: replaced the "template-*/**" copies, which pointed at folders that moved into working-folder)
  eleventyConfig.addPassthroughCopy({
    "working-folder/template-article/styles.css": "css/article.css",
    "working-folder/template-story/styles.css": "css/story.css",
  });

  // The content types, in the order tag pages list them. `tag` is the collection marker each
  // collection folder's *.11tydata.json adds; it's never shown or linked as a topic tag.
  // label/href/icon are the card's breadcrumb; heading/id are the tag page section.
  // Notes are switched off for now (see collections/notes/notes.11tydata.json), so their section stays empty.
  const CONTENT_TYPES = [
    { tag: "case-study", label: "case study", href: "/case-studies/", icon: "fa-sparkles", heading: "case studies", id: "case-studies" },
    { tag: "anecdote", label: "anecdote", href: "/anecdotes/", icon: "fa-up-left", heading: "anecdotes", id: "anecdotes" },
    { tag: "playground", label: "playground", href: "/playground/", icon: "fa-sparkles", heading: "playground", id: "playground" },
    { tag: "about", label: "about", href: "/about/", icon: "fa-up-left", heading: "about", id: "about" },
    { tag: "note", label: "note", href: "/notes/", icon: "fa-up-left", heading: "notes", id: "notes" },
  ];
  const TYPE_TAGS = CONTENT_TYPES.map((t) => t.tag);
  eleventyConfig.addGlobalData("contentTypes", CONTENT_TYPES);
  eleventyConfig.addGlobalData("typeTags", TYPE_TAGS);

  const slugify = eleventyConfig.getFilter("slugify");
  const topicTags = (tags) => (tags || []).filter((t) => !TYPE_TAGS.includes(t));

  // Every topic tag used by the content types, one entry per slug, so "UX Operations" and
  // "ux operations" share a page. tags.njk makes one /tags/<slug>/ page per entry.
  eleventyConfig.addCollection("tagList", (api) => {
    const bySlug = new Map();
    for (const item of api.getFilteredByTags()) {
      if (!TYPE_TAGS.some((t) => (item.data.tags || []).includes(t))) continue;
      for (const name of topicTags(item.data.tags)) {
        const slug = slugify(name);
        if (!bySlug.has(slug)) bySlug.set(slug, { name, slug });
      }
    }
    return [...bySlug.values()].sort((a, b) => a.name.localeCompare(b.name));
  });

  // Where a card links. Playground items have no page of their own, so their folder data file
  // sets `cardUrl` to their section of /playground/ instead.
  const itemUrl = (item) => item.data.cardUrl || item.url;

  // Filters for the layouts:
  //   topicTags   -> tags without the collection markers (for printing tag lists)
  //   withTag     -> items in a collection that carry a tag, compared by slug (case-insensitive)
  //   newestFirst -> a copy of a collection sorted by date, newest first
  //   byOrder     -> sorted by the `order:` front matter (1, 2, 3...), then newest first
  //   itemUrl     -> the URL a card or search result should link to
  //   toCard      -> the fields _includes/article-card.njk needs, from a collection item.
  //                  Pass extra keys to add or override, e.g. item | toCard({ body: item.content })
  //   monthYear   -> July 2026
  eleventyConfig.addFilter("topicTags", topicTags);
  eleventyConfig.addFilter("withTag", (items, tag) =>
    (items || []).filter((item) => (item.data.tags || []).some((t) => slugify(t) === slugify(tag)))
  );
  eleventyConfig.addFilter("newestFirst", (items) => [...(items || [])].sort((a, b) => b.date - a.date));
  eleventyConfig.addFilter("byOrder", (items) =>
    [...(items || [])].sort((a, b) => (a.data.order ?? Infinity) - (b.data.order ?? Infinity) || b.date - a.date)
  );
  eleventyConfig.addFilter("itemUrl", itemUrl);
  eleventyConfig.addFilter("toCard", (item, extra = {}) => ({
    title: item.data.title,
    url: itemUrl(item),
    tags: item.data.tags,
    label: item.data.label,
    summary: item.data.summary,
    stats: item.data.stats,
    ...extra,
  }));
  eleventyConfig.addFilter("monthYear", (d) => DateTime.fromJSDate(d, { zone: TZ }).toFormat("LLLL yyyy"));

  // Drafts: add `draft: true` to any item's front matter. It shows under `npm start` so you can see it
  // while writing, but `npm run build` (what Netlify runs) leaves it out of the site entirely.
  eleventyConfig.addPreprocessor("drafts", "*", (data) => {
    if (data.draft && process.env.ELEVENTY_RUN_MODE === "build") return false;
  });
  // [/claude-site-structure]

  // [claude-image-plugin] Added at Jason's request (the plugin choice and docs link are his).
  // Rewrites every <img> in the built pages: generates resized AVIF/WebP/JPEG versions into _site/img/
  // and wraps them in <picture>. Markdown image syntax is unchanged. Registered inside the single config
  // function above; a second `export default` would have been ignored. Add alt text to every image.
  eleventyConfig.addPlugin(eleventyImageTransformPlugin);
}
