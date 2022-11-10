const path = require("path");
const Image = require("@11ty/eleventy-img");

function getImageOpt(inputPath, outputPath) {
    return {
        widths: [320, 560, 800, 1040],
        formats: ["webp", null], //multiple types like "webp", null will generate <picture>tag in html
        urlPath: inputPath, ///assets/images/uploads
        outputDir: outputPath, //public/assets/images/uploads
        filenameFormat: function (id, src, width, format, options) {
            const extension = path.extname(src);
            const name = path.basename(src, extension);

            return `${name}-${width}.${format}`;
        }
    }
}

function processImage(imgSrc, imgOpts, inputFullPath) {
    try {
        Image(imgSrc, imgOpts)
    } catch (error) {
        console.log('🚨 error...:', error);
    }

    let metadata;
    try {
        metadata = Image.statsSync(inputFullPath, imgOpts)
    } catch (error) {
        console.log('error:', error);
    }
    // console.log('🐛🐛🐛🐛🐛🐛🐛🐛 af metadata- METADATA:', metadata);
    return metadata;
}

function generateImageHtml(metadata, htmlOpts) {
    const generated = Image.generateHTML(metadata, {
        sizes: '(max-width: 768px) 100vw, 768px',
        ...htmlOpts
    })
    // console.log('🤡🤡🤡🤡🤡:', generated);
    return generated;
}

function getHtmlOpts(imgTitle, imgAlt) {
    return {
        title: imgTitle,
        alt: imgAlt,
        loading: 'lazy',
        decoding: 'async'
    }
}

function getImagePath(imgSrc) {
    let commonPath = path.dirname(imgSrc);
    imgSrc = path.join("./src", imgSrc)
    let inputFullPath = path.join(path.join("./src", commonPath), path.parse(imgSrc).base);
    let outputPath = path.join("./public", commonPath)

    return { commonPath, src: imgSrc, inputFullPath, outputPath }
}

const imageShortcode = function (
    imgSrc,
    alt,
    className = undefined,
    widths = [320, 560, 800, 1040],
    formats = [null],
    sizes = '100vw'
) {
    console.log('👀 imageShortcode... imgSrc:', imgSrc);
    
    let { commonPath, src, inputFullPath, outputPath } = getImagePath(imgSrc);

    let htmlOpts = getHtmlOpts(path.parse(src).base, alt);
    const imgOpts = getImageOpt(commonPath, outputPath);
    const metadata = processImage(src, imgOpts, inputFullPath);
    let generated = generateImageHtml(metadata, htmlOpts);
    console.log('🌻🌻🌻 generatd...:', generated);
    return generated
};

module.exports = {
    getImageOpt,
    processImage,
    generateImageHtml,
    getHtmlOpts,
    getImagePath,
    imageShortcode
}