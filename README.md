# Broccoli Imagemin Plugin

[![Build Status](https://travis-ci.org/stfsy/broccoli-image-min.svg)](https://travis-ci.org/stfsy/broccoli-image-min)
[![Dependency Status](https://img.shields.io/david/stfsy/broccoli-image-min.svg)](https://github.com/stfsy/broccoli-image-min/blob/master/package.json)
[![DevDependency Status](https://img.shields.io/david/dev/stfsy/broccoli-image-min.svg)](https://github.com/stfsy/broccoli-image-min/blob/master/package.json)
[![Npm downloads](https://img.shields.io/npm/dm/broccoli-image-min.svg)](https://www.npmjs.com/package/broccoli-image-min)
[![Npm Version](https://img.shields.io/npm/v/broccoli-image-min.svg)](https://www.npmjs.com/package/broccoli-image-min)
[![Git tag](https://img.shields.io/github/tag/stfsy/broccoli-image-min.svg)](https://github.com/stfsy/broccoli-image-min/releases)
[![Github issues](https://img.shields.io/github/issues/stfsy/broccoli-image-min.svg)](https://github.com/stfsy/broccoli-image-min/issues)
[![License](https://img.shields.io/npm/l/broccoli-image-min.svg)](https://github.com/stfsy/broccoli-image-min/blob/master/LICENSE)


Broccoli plugin for minifying .jpg, .png, .svg and .gif with [imagemin](https://github.com/imagemin/imagemin).

## Examples

```js
const BroccoliImageMin = require('broccoli-image-min')

const minified = new BroccoliImageMin('app', {
    include: ['images/**/*.(jpg|png)']
})

module.exports = minified
```

```js
const BroccoliImageMin = require('broccoli-image-min')

const minified = new BroccoliImageMin('app/images', {
    include: ['**/*.(jpg|png)']
})

module.exports = minified
```


## Documentation

### `new BroccoliImageMin(inputNodes, options)`

* `inputNodes`: A single input node, an array of input nodes or a string pointing to a folder.

* `options`:

    * `include`: An array of Regexp patterns 


The returned output node contains minified images matching the `options.include` pattern with their directory structure preserved.

### Globbing patterns

Just a quick overview *from [Globbies](https://github.com/sindresorhus/globby) documentation* 

- `*` matches any number of characters, but not `/`
- `?` matches a single character, but not `/`
- `**` matches any number of characters, including `/`, as long as it's the only thing in a path part
- `{}` allows for a comma-separated list of "or" expressions
- `!` at the beginning of a pattern will negate the match

[Various patterns and expected matches.](https://github.com/sindresorhus/multimatch/blob/master/test.js)

## License

This project is distributed under the MIT license.