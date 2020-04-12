'use strict'

const imagemin = require('imagemin')
const mozjpeg = require('imagemin-mozjpeg')
const pngquant = require('imagemin-pngquant')
const gifsicle = require('imagemin-gifsicle')
const svgo = require('imagemin-svgo')
const fs = require('fs-promise')
const globby = require('globby')
const resolve = require('path').resolve
const join = require('path').join

class Minifier {

    constructor(options) {
        this._targets = options.include.map(target => new RegExp(target))
    }

    matches(path) {
        return this._targets.some(target => target.matches(path))
    }

    minify(inputPath, outputPath) {
        return globby(this.options.include, { nodir: true, cwd: inputPath }).then((paths) => {
            return this.minifyFiles(paths, inputPath, join(outputPath, this.options.destination))
        })
    }

    minifyFiles(paths, inputPath, outputPath) {
        return Promise.all(paths.map((path) => {
            return this.minifyFile(path, inputPath, outputPath)
        }))
    }

    minifyFile(path, inputPath, outputPath) {
        return fs.readFile(resolve(inputPath, path)).then((contents) => {
            return this.minifyBuffer(contents)
        }).then((contents) => {
            return fs.outputFile(resolve(outputPath, path), contents)
        })
    }

    minifyBuffer(buffer) {
        return imagemin.buffer(buffer, {
            plugins: [
                mozjpeg({ progressive: true, quality: '75' }),
                pngquant({ quality: [0.6, 0.8], nofs: true }),
                gifsicle({ optimizationlevel: 3, colors: 32, interlaced: false }),
                svgo({ minifyStyles: true, removeComments: true, cleanupAttrs: true, removeEmptyAttrs: true, removeHiddenElements: true, removeEmptyText: true, cleanupNumericValues: true, cleanupIDs: true, convertColors: true })
            ]
        })
    }
}

module.exports = Minifier