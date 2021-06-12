'use strict'

const { ImagePool } = require('@squoosh/lib/build/index')

class Minifier {

    constructor(options) {
        let targets = null
        if (Array.isArray(options.include)) {
            targets = options.include
        } else {
            targets = [options.include]
        }
        this._targets = targets.map(target => new RegExp(target))
    }

    matches(path) {
        return this._targets.some(target => target.test(path))
    }

    async minifyBuffer(buffer) {
        const imagePool = new ImagePool();
        const image = imagePool.ingestImage(buffer)

        await image.decoded //Wait until the image is decoded before running preprocessors
        await image.preprocess()
        await image.encode({
            mozjpeg: {}, //an empty object means 'use default settings'
            webp: {},
            avif: {},
            jxl: {},
            wp2: {},
            oxipng: {}
        })

        try {
            for (const encodedImage of Object.values(image.encodedWith)) {
                const encoded = await encodedImage
                return (await encodedImage).binary
            }
        } finally {
            await imagePool.close()
        }
    }
}

module.exports = Minifier