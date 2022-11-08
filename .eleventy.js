const { DateTime } = require("luxon");
const Image = require("@11ty/eleventy-img");
const path = require("path");
const markdown = require('markdown-it')()

function getImageOpt(inputPath, outputPath){
  return {
    widths: [320, 560, 800, 1040],
    formats: [null], //multiple types like "webp", null will generate <picture>tag in html
    urlPath: inputPath, ///assets/blog
    outputDir: outputPath, //public/assets/blog
    filenameFormat: function (id, src, width, format, options) {
      const extension = path.extname(src);
      const name = path.basename(src, extension);
  
      return `${name}-${width}.${format}`;
    }
  }
}

function processImage(imgSrc, imgOpts, inputFullPath){
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
  return metadata;
}

function generateImageHtml(metadata, htmlOpts){
  const generated = Image.generateHTML(metadata, {
    sizes: '(max-width: 768px) 100vw, 768px',
    ...htmlOpts
  })
  console.log('🤡🤡🤡🤡🤡:', generated);
  return generated;
}

function getHtmlOpts(imgTitle, imgAlt){
  return {
    title: imgTitle,
    alt: imgAlt,
    loading: 'lazy',
    decoding: 'async'
  }
}

const imageShortcode = function (
  imgSrc,
  alt,
  className = undefined,
  widths= [320, 560, 800, 1040],
  formats= [null],
  sizes = '100vw'
) {
  console.log('👀👀👀👀👀👀👀 imageShortcode...:', );
  

  let commonPath = path.dirname(imgSrc);
  imgSrc = path.join("./src", imgSrc)
  let imgTitle = path.parse(imgSrc).base
  let imgAlt = alt;

  let inputFullPath = path.join(path.join("./src", commonPath), path.parse(imgSrc).base);
  let outputPath = path.join("./public", commonPath)
  let htmlOpts = getHtmlOpts(imgTitle, imgAlt);
  const imgOpts = getImageOpt(commonPath, outputPath);
  const metadata = processImage(imgSrc, imgOpts, inputFullPath);
  let generated = generateImageHtml(metadata, htmlOpts);
  console.log('🌻🌻🌻 generatd...:', generated);
  return generated
};

markdown.renderer.rules.image = function (tokens, idx, options, env, self) {
  const token = tokens[idx]
  let imgSrc = token.attrGet('src')
  const imgAlt = token.content
  const imgTitle = token.attrGet('title')
  
  let commonPath = path.dirname(imgSrc);
  imgSrc = path.join("./src", imgSrc)
  let inputFullPath = path.join(path.join("./src", commonPath), path.parse(imgSrc).base);
  let outputPath = path.join("./public", commonPath)
  
  const htmlOpts = getHtmlOpts(imgTitle, imgAlt);
  const imgOpts = getImageOpt(commonPath, outputPath);
  const metadata = processImage(imgSrc, imgOpts, inputFullPath);
  return generateImageHtml(metadata, htmlOpts);
}


module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy('./src/style.css')
  eleventyConfig.addPassthroughCopy('./src/assets')
  eleventyConfig.addPassthroughCopy("./src/admin");
  eleventyConfig.addFilter("postDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED);
  });
  eleventyConfig.addShortcode('image', imageShortcode);
  // eleventyConfig.addNunjucksShortcode('image', imageShortcode);
  
  
  // eleventyConfig.setLibrary('md', markdown)
  return {
    dir: {
      input: "src",
      output: "public",
    },
  };
};