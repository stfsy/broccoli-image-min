'use strict'

const CachingWriter = require('broccoli-caching-writer')
const Minifier = require('./minifier')

class BroccoliImageMin extends CachingWriter {

    constructor(inputNodes, options) {
        super(Array.isArray(inputNodes) ? inputNodes : [inputNodes])

        this.minifier = new Minifier(options)
    }

    build() {
        return Promise.all(this.inputPaths.map(((inputPath) => {
            return this.minifier.minify(inputPath, this.outputPath)
        })))
    }
}

module.exports = BroccoliImageMin