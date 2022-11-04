const { DateTime } = require("luxon");
const Image = require("@11ty/eleventy-img");
const path = require("path");
const fs = require("fs");

function getDirectories(path) {
  return fs.readdirSync(path).filter(function (file) {
    return fs.statSync(path+'/'+file).isDirectory();
  });
}

const assetPath = "./src/assets";

//visit every directory
async function visitImageDirectories(pathName){
  const dirArr = getDirectories(pathName);

  for (const d of dirArr){
    console.log('dirArr d-:', d);
    const fileNames = fs.readdirSync(path.join(pathName, d));
    console.log('💛💛💛FILENAMES:', fileNames);
    
    for (const fileName of fileNames) {
      let inputPath = path.join(pathName, d);
      // let outputPath = path.join("./public/assets", d);
      // console.log('💜💜💜💜💜💜💜outputPath:', outputPath);
      
      let filePath = path.join(inputPath, fileName)
      try {
        // await processImage(filePath, inputPath, outputPath);
        await processImage(filePath, inputPath, inputPath);
      } catch (error){
        console.log('error...:', error);
      }
    }
  }
}

visitImageDirectories(assetPath);


async function processImage(url, urlPath, outputDir){
  try {
    let stats = await Image(url, {
      widths: [320, 560, 800, 1040],
      formats: [null],
      urlPath,
      outputDir,
      filenameFormat: function (id, src, width, format, options) {
        const extension = path.extname(src);
        const name = path.basename(src, extension);
    
        return `${name}-${width}.${format}`;
      }
    });
  
    console.log( stats );
  } catch (error){
    console.log('error...:', error);
    
  }
}

// let url = "./src/assets/test/colorful-netherlands.jpg";
// (async() => {
//   await processImage(url);
// })();

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy('./src/style.css')
  eleventyConfig.addPassthroughCopy('./src/assets')
  eleventyConfig.addPassthroughCopy("./src/admin");
  eleventyConfig.addFilter("postDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED);
  });
  // eleventyConfig.addShortcode('image', imageShortcode);
  return {
    dir: {
      input: "src",
      output: "public",
    },
  };
};
