'use strict'

const rimraf = require('rimraf')
const fixtures = require('../fixtures')
const fs = require('fs')

const BroccoliRunner = require('broccoli-test-runner')
const runner = new BroccoliRunner('test/fixtures')

const expect = require('chai').expect

describe('BroccoliImageMin', () => {
    before(() => runner.build())
    after(() => runner.stop())
    after(() => new Promise((resolve) => {
        rimraf('test/fixtures/dist', resolve)
    }))

    const compareSizes = (file, minRatio, maxRatio) => {
        const inBuffer = fs.readFileSync(fixtures.path + '/' + file)
        const builtBuffer = fs.readFileSync(fixtures.buildPath + '/' + file)
        expect(builtBuffer.length / inBuffer.length).to.be.below(maxRatio)
        expect(builtBuffer.length / inBuffer.length).to.be.above(minRatio)
    }

    it('minifies jpgs', () => fixtures.jpgs.forEach(jpg => compareSizes(jpg, .40, .55)))
    it('minifies pngs', () => fixtures.pngs.forEach(png => compareSizes(png, .1, .2)))
})