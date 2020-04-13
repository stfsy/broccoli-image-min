'use strict'

const Minifier = require('../../lib/minifier')
const expect = require('chai').expect
const resolve = require('path').resolve
const fs = require('fs')
const fixtures = require('../fixtures.js')

describe('Minifier', () => {

    let minifier = null

    beforeEach(() => {
        minifier = new Minifier({
            include: '.*.(jpg|JPG|gif|GIF|png|PNG|svg)',
        })
    })

    describe('.matches', () => {
        it('matches jpg images', () => {
            fixtures.jpgs.forEach(jpg => expect(minifier.matches(jpg)).to.be.true)
        })

        it('matches jpg images in root folders', () => {
            expect(minifier.matches('image.jpg')).to.be.true
        })

        it('matches gif images', () => {
            fixtures.gifs.forEach(gif => expect(minifier.matches(gif)).to.be.true)
        })

        it('matches png images', () => {
            fixtures.pngs.forEach(png => expect(minifier.matches(png)).to.be.true)
        })

        it('matches svg images', () => {
            fixtures.svgs.forEach(svg => expect(minifier.matches(svg)).to.be.true)
        })

        it('does not match docx files', () => {
            expect(minifier.matches('abc/def/docx')).to.be.false
        })
    })

    describe('.minify', () => {
        const minifyAndCompareBufferSize = (file, expectedRatio) => {
            const inBuffer = fs.readFileSync(fixtures.path + '/' + file)
            return minifier.minifyBuffer(inBuffer).then((outBuffer) => {
                expect(outBuffer.length / inBuffer.length).to.be.below(expectedRatio)
            })
        }
        it('should minify jpeg images', () => {
            return Promise.all(fixtures.jpgs.map((jpg) => {
                return minifyAndCompareBufferSize(jpg, 0.5)
            }))
        })

        it('should minify gif images', () => {
            return Promise.all(fixtures.gifs.map((gif) => {
                return minifyAndCompareBufferSize(gif, 0.75)
            }))
        })

        it('should minify png images', () => {
            return Promise.all(fixtures.pngs.map((png) => {
                return minifyAndCompareBufferSize(png, 0.5)
            }))
        })

        it('should minify svg images', () => {
            return Promise.all(fixtures.svgs.map((svg) => {
                return minifyAndCompareBufferSize(svg, 0.55)
            }))
        })
    })
})