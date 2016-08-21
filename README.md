# Broccoli Imagemin Plugin

Broccoli plugin for minifying .jpg, .png, .svg and .gif with [imagemin](https://github.com/imagemin/imagemin).

## Example

```js
const BroccoliImageMin = require('broccoli-image-min')

const minified = new BroccoliImageMin('app', {
    include: ['images/**/*.{jpg,png}']
})

module.exports = minified
```

## Documentation

### `new BroccoliImageMin(inputNodes, options)`

* `inputNodes`: A single input node, an array of input nodes or a string pointing to a folder.

* `options`:

    * `include`: An array of glob patterns 
        
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