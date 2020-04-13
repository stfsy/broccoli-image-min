'use strict'

const Minifier = require('../../lib/minifier')
const expect = require('chai').expect
const resolve = require('path').resolve
const fs = require('fs-promise')

describe('Minifier', () => {

    let minifier = null
    let jpgs = []
    let pngs = []
    let gifs = []
    let svgs = []

    before(() => {
        jpgs.push(('test/fixtures/test.jpg'))
        jpgs.push(('test/fixtures/test-uppercase.JPG'))

        gifs.push(('test/fixtures/test.gif'))
        gifs.push(('test/fixtures/test-uppercase.GIF'))

        pngs.push(('test/fixtures/test.png'))
        pngs.push(('test/fixtures/nested/nested/nested.png'))
        pngs.push(('test/fixtures/test-uppercase.PNG'))

        svgs.push(('test/fixtures/test.svg'))
    })

    beforeEach(() => {
        minifier = new Minifier({
            include: '.*.(jpg|JPG)',
        })
    })

    afterEach(() => {
        fs.removeSync(resolve('test/results'))
    })

    describe('.matches', () => {

    })

    describe('.minify', () => {
        const minifyAndCompareBufferSize = (file, expectedRatio) => {
            const inBuffer = fs.readFileSync(file)
            return minifier.minifyBuffer(inBuffer).then((outBuffer) => {
                expect(outBuffer.length / inBuffer.length).to.be.below(expectedRatio)
            })
        }
        it('should minify jpeg images', () => {
            return Promise.all(jpgs.map((jpg) => {
                return minifyAndCompareBufferSize(jpg, 0.5)
            }))
        })

        it('should minify gif images', () => {
            return Promise.all(gifs.map((gif) => {
                return minifyAndCompareBufferSize(gif, 0.75)
            }))
        })

        it('should minify png images', () => {
            return Promise.all(pngs.map((png) => {
                return minifyAndCompareBufferSize(png, 0.5)
            }))
        })

        it('should minify svg images', () => {
            return Promise.all(svgs.map((svg) => {
                return minifyAndCompareBufferSize(svg, 0.55)
            }))
        })
    })
})