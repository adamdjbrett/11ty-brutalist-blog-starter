const { DateTime } = require("luxon");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const navigationPlugin = require("@11ty/eleventy-navigation");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const customNavigationPlugin = require('./eleventyNavigationPlugin.js');
const yaml = require("js-yaml");

module.exports = function(eleventyConfig) {
  // Plugins
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(navigationPlugin);
  eleventyConfig.addPlugin(customNavigationPlugin);

  // Copy the static assets to the output folder
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy({ "src/favicon.svg": "favicon.svg" });

  // Add filters
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("dd LLL yyyy");
  });
eleventyConfig.addDataExtension("yaml", (contents) => yaml.load(contents));
  eleventyConfig.addFilter("htmlDateString", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("yyyy-LL-dd");
  });

  eleventyConfig.addFilter("getYear", () => {
    return new Date().getFullYear();
  });

  // Get the first `n` elements of a collection
  eleventyConfig.addFilter("head", (array, n) => {
    if(!Array.isArray(array) || array.length === 0) {
      return [];
    }
    return array.slice(0, n);
  });

  // Return the smallest number argument
  eleventyConfig.addFilter("min", (...numbers) => {
    return Math.min.apply(null, numbers);
  });

  // Create a collection for all blog posts
  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/posts/*.md");
  });

  // Create a collection for featured posts
  eleventyConfig.addCollection("featuredPosts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/posts/*.md").filter(item => {
      return item.data.featured;
    });
  });

  // Configure markdown
  const markdownLibrary = markdownIt({
    html: true,
    breaks: true,
    linkify: true
  }).use(markdownItAnchor, {
    permalink: markdownItAnchor.permalink.ariaHidden({
      placement: "after",
      class: "direct-link",
      symbol: "#",
      level: [1, 2, 3, 4]
    }),
    slugify: eleventyConfig.getFilter("slugify")
  });
  eleventyConfig.setLibrary("md", markdownLibrary);

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      layouts: "_layouts",
      data: "_data"
    },
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    passthroughFileCopy: true
  };
};