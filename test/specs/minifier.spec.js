'use strict'

const Minifier = require('../../lib/minifier')
const expect = require('chai').expect
const resolve = require('path').resolve
const fs = require('fs-promise')

describe('Minifier', () => {

    let minifyJpg = null
    let minifyGif = null
    let minifyPng = null
    let minifySvg = null
    let jpgs = []
    let pngs = []
    let gifs = []
    let svgs = []

    before(() => {
        jpgs.push(('test.jpg'))
        jpgs.push(('test-uppercase.JPG'))

        gifs.push(('test.gif'))
        gifs.push(('test-uppercase.GIF'))

        pngs.push(('test.png'))
        pngs.push(('nested/nested/nested.png'))
        pngs.push(('test-uppercase.PNG'))

        svgs.push(('test.svg'))
    })

    beforeEach(() => {
        minifyJpg = new Minifier({
            include: '**.{jpg,JPG}',
        })
        minifyGif = new Minifier({
            include: '**/*.{gif,GIF}',
        })
        minifyPng = new Minifier({
            include: '**/*.{png,PNG}',
        })
        minifySvg = new Minifier({
            include: '**/*.{svg,SVG}',
        })
    })

    afterEach(() => {
        fs.removeSync(resolve('test/results'))
    })

    it('should minify jpeg images', (done) => {
        minifyJpg.minify('test/fixtures', 'test/results').then(() => {
            jpgs.forEach((jpg) => {
                const inputSize = fs.statSync(resolve('test', 'fixtures', jpg))['size']
                const outputSize = fs.statSync(resolve('test/results', jpg))['size']
                expect(outputSize / inputSize).to.be.below(0.5)
            })
        }).then(done, done)
    })

    it('should minify gif images', (done) => {
        minifyGif.minify('test/fixtures', 'test/results').then(() => {
            gifs.forEach((gif) => {
                const inputSize = fs.statSync(resolve('test', 'fixtures', gif))['size']
                const outputSize = fs.statSync(resolve('test', 'results', gif))['size']
                expect(outputSize / inputSize).to.be.below(0.75)
            })
        }).then(done, done)
    })

    it('should minify png images', (done) => {
        minifyPng.minify('test/fixtures', 'test/results').then(() => {
            pngs.forEach((png) => {
                const inputSize = fs.statSync(resolve('test', 'fixtures', png))['size']
                const outputSize = fs.statSync(resolve('test', 'results', png))['size']
                expect(outputSize / inputSize).to.be.below(0.5)
            })
        }).then(done, done)
    })

    it('should minify svg images', (done) => {
        minifySvg.minify('test/fixtures', 'test/results').then(() => {
            svgs.forEach((svg) => {
                const inputSize = fs.statSync(resolve('test', 'fixtures', svg))['size']
                const outputSize = fs.statSync(resolve('test', 'results', svg))['size']
                expect(outputSize / inputSize).to.be.below(0.6)
            })
        }).then(done, done)
    })

    describe('', () => {

        beforeEach(() => {
            minifySvg = new Minifier({
                include: '**.{svg,SVG}',
                destination: 'costum'
            })
        })

        it('should write to test/results/costum/', (done) => {
            minifySvg.minify('test/fixtures', 'test/results').then(() => {
                svgs.forEach((svg) => {
                    const inputSize = fs.statSync(resolve('test', 'fixtures', svg))['size']
                    const outputSize = fs.statSync(resolve('test', 'results', 'costum', svg))['size']
                    expect(outputSize / inputSize).to.be.below(0.6)
                })
            }).then(done, done)
        })
    })
})