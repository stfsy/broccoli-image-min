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