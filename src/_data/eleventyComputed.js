module.exports = {
  eleventyNavigation: {
    key: (data) => data.eleventyNavigation?.key,
    parent: (data) => data.eleventyNavigation?.parent,
    order: (data) => data.eleventyNavigation?.order
  }
};