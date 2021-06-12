'use strict'

const BroccoliImageMin = require('../../lib/index')

module.exports = new BroccoliImageMin('app', {
    include: '.*.(jpg|png)'
})