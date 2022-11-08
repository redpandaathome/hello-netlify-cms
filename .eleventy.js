const { DateTime } = require("luxon");
const Image = require("@11ty/eleventy-img");
const path = require("path");
const fs = require("fs");
const markdown = require('markdown-it')()

markdown.renderer.rules.image = function (tokens, idx, options, env, self) {
  const token = tokens[idx]
  let imgSrc = token.attrGet('src')
  
  const imgAlt = token.content
  const imgTitle = token.attrGet('title')
  
  
  let fileName = path.parse(imgSrc).base;
  let commonPath = path.dirname(imgSrc);
  imgSrc = path.join("./src", imgSrc)

  let inputPath = path.join("./src", commonPath);
  let inputFullPath = path.join(inputPath, fileName);
  let outputPath = path.join("./public", commonPath)

  console.log('💛imgSrc:', imgSrc);
  console.log('💛commonPath:', commonPath);
  console.log('💛outputPath:', outputPath);
  console.log('💜:', fileName, inputPath, outputPath);
  
  const htmlOpts = {
    title: imgTitle,
    alt: imgAlt,
    loading: 'lazy',
    decoding: 'async'
  }

  const imgOpts = {
    widths: [320, 560, 800, 1040],
    formats: [null],
    urlPath: commonPath,
    outputDir: outputPath,
    filenameFormat: function (id, src, width, format, options) {
      const extension = path.extname(src);
      const name = path.basename(src, extension);
  
      return `${name}-${width}.${format}`;
    }
  }
  
  try{
    Image(imgSrc, imgOpts)
    
  }catch(error){
    console.log('🚨 error...:', error);
    
  }
  
  let metadata;
  try{
    metadata = Image.statsSync(inputFullPath, imgOpts)
  }catch(error){
    console.log('error:', error);
    
  }
  console.log('🐛🐛🐛🐛🐛🐛🐛🐛 af metadata- METADATA:', metadata);

  const generated = Image.generateHTML(metadata, {
    sizes: '(max-width: 768px) 100vw, 768px',
    ...htmlOpts
  })
  console.log('🤡🤡🤡🤡🤡:', generated);
  
  return generated
}


module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy('./src/style.css')
  eleventyConfig.addPassthroughCopy('./src/assets')
  eleventyConfig.addPassthroughCopy("./src/admin");
  eleventyConfig.addFilter("postDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED);
  });
  // eleventyConfig.addShortcode('image', imageShortcode);

  eleventyConfig.setLibrary('md', markdown)
  return {
    dir: {
      input: "src",
      output: "public",
    },
  };
};