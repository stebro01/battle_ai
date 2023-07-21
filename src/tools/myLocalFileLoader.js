
var fs = undefined
import UPNG from 'upng-js'

/**
 * 
 * @param {module} FS - the filesystem module 'fs'
 * @example
 *  
 *  // Import and Prepare
 *  import * as MYLOADER from 'src/tools/myLocalFileLoader'
    MYLOADER.init(window.electron.fs)
    
    //connect to CornerStone
    cornerstone.registerImageLoader('local', MYLOADER.loadImage)

    //load an image
    const imageId = 'local:///Users/ste/MyProjects/battle_ai/test/jest/__tests__/mockups/EXAMPLE_FOLDER/EXAMPLE_IMAGE.png'
    cornerstone.loadImage(imageId).then(function (image) {
        cornerstone.displayImage(element, image);
      });

 */

export function init(FS) {
    fs = FS
}

export function loadImage(imageId) {

    const filePath = imageId.substring(7);
    return {
        promise: new Promise((resolve) => {
            readImage(filePath).then(data => {
                var image = {
                    imageId: imageId,
                    minPixelValue: data.minPixelValue,
                    maxPixelValue: data.maxPixelValue,
                    slope: 1.0,
                    intercept: 0,
                    windowCenter: Math.round((data.maxPixelValue - data.minPixelValue - 1) / 2),
                    windowWidth: data.maxPixelValue - data.minPixelValue - 1,
                    getPixelData: () => { return data.buffer },
                    rows: data.height,
                    columns: data.width,
                    height: data.height,
                    width: data.width,
                    color: data.color,
                    invert: false,
                    columnPixelSpacing: 1,
                    rowPixelSpacing: 1,
                    sizeInBytes: data.buffer.length,
                };
                resolve(image);
            })

        }),
        cancelFn: undefined
    };
}

async function readImage(path) {
    const buffer = await fs.readFileSync(path)
    const png = UPNG.decode(buffer);
    // console.log(png)
    return { buffer: png.data, width: png.width, height: png.height, maxPixelValue: Math.pow(2, png.depth), minPixelValue: 0, color: png.ctype > 0 }
}
