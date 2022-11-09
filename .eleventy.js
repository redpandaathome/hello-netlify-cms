const { DateTime } = require("luxon");
const path = require("path");
const markdown = require('markdown-it')()
const {getImageOpt, processImage, generateImageHtml, getHtmlOpts, getImagePath, imageShortcode} = require('./imageProcesser.js');

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy('./src/style.css')
  eleventyConfig.addPassthroughCopy('./src/assets')
  eleventyConfig.addPassthroughCopy("./src/admin");
  eleventyConfig.addFilter("postDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED);
  });

  // markdown.renderer.rules.image = function (tokens, idx, options, env, self) {
  //   const token = tokens[idx]
  //   let imgSrc = token.attrGet('src')
  //   const imgAlt = token.content
  //   const imgTitle = token.attrGet('title')
    
  //   let {commonPath, src, inputFullPath, outputPath} = getImagePath(imgSrc);
    
  //   const htmlOpts = getHtmlOpts(imgTitle, imgAlt);
  //   const imgOpts = getImageOpt(commonPath, outputPath);
  //   const metadata = processImage(src, imgOpts, inputFullPath);
  //   return generateImageHtml(metadata, htmlOpts);
  // }

  eleventyConfig.addShortcode('imageShortCode', imageShortcode);  
  // eleventyConfig.setLibrary('md', markdown)
  return {
    dir: {
      input: "src",
      output: "public",
    },
  };
};