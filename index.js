var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');
var walkSync = require('walk-sync');
var RSVP = require('rsvp');
var readCompat = require('broccoli-read-compat');
var Imagemin = require('imagemin');
var prettyBytes = require('pretty-bytes');
var assign = require('lodash-node/modern/object/assign');
var symlinkOrCopy = require('symlink-or-copy');


// stole from broccoli-funnel
// TODO: is this needed?
function makeDictionary() {
	var cache = Object.create(null);

	cache['_dict'] = null;
	delete cache['_dict'];
	return cache;
}

var imageminDefaultOptions = {
	interlaced: true,
	optimizationLevel: 3,
	progressive: true
};

// acceptable extensions will not be used to filter what files the user want done
// just filter what files CAN be done
// TODO: should the user have the ability to filter these?
// or use broccoli-funnel ahead of this filter?
var acceptableExtensions = [
	'.png',
	'.gif',
	'.jpg',
	'.jpeg',
	'.svg'
];


// options
// -- srcDir
// -- imageminOptions
// -- TODO

function ImageMinify(inputTree, options) {

	if (!(this instanceof ImageMinify)) { return new ImageMinify(inputTree, options); }

	this.inputTree = inputTree;

	// got these from broccoli-funnel
	// are they needed?
	this._includeFileCache = makeDictionary();
	this._destinationPathCache = makeDictionary();

	// TODO: do I want to keep this way of handling options?
	options = options || {};

	for (var key in options) {
		if (options.hasOwnProperty(key)) {
			this[key] = options[key];
		}
	}

	// TODO: make these options actually come in through options
	this.destDir = this.destDir || '/';
	this.files = this.files || ['**/*'];
}

ImageMinify.prototype.constructor = ImageMinify;

ImageMinify.prototype.rebuild = function() {

	var promises = [];

	// TODO:
	// make this async, possibly use async.each or async.eachLimit
	// TODO: does that adhere to the promises interface? or do I need to wrap in RSVP?
	walkSync(this.inputPath)
		.forEach(function(relativePath) {
			if (_shouldProcessFile(relativePath)) {
				promises.push(this.minify(relativePath));
				// this.writeFile(relativePath);
			}
		}, this);

	// imagemin can be pretty heavy, so only do as many as a time as processors on this machine
	// TODO

	return RSVP.all(promises);
};

ImageMinify.prototype.minify = function(relativePath) {

	var options = assign(imageminDefaultOptions, this.imageminOptions || {});

	var fullInputPath = this._getFullInputFile(relativePath);
	var fullOutputPath = this._getFullOutputFile(relativePath);
	var outputDir = path.dirname(fullOutputPath);

	mkdirp.sync(outputDir);

	// Imagemin writes the file directly
	var imagemin = new Imagemin()
		.src(fullInputPath)
		.dest(outputDir)
		.use(Imagemin.jpegtran(options))
		.use(Imagemin.gifsicle(options))
		.use(Imagemin.optipng(options))
		.use(Imagemin.svgo({plugins: options.svgoPlugins || []}));

	if (options.use) {
		options.use.forEach(imagemin.use.bind(imagemin));
	}

	var fileStatus = fs.statSync(fullInputPath);

	return new RSVP.Promise(function(resolve, reject) {
		imagemin.run(function (err, data) {

			if (err) {
				console.warn('error in processing: ' + relativePath);
				return;
			}

			var origSize = fileStatus.size;
			var diffSize = origSize - data[0].contents.length;

			// TODO: find best way Broccoli wants me to output statuses like this
			console.log(relativePath + ' saved ' + prettyBytes(diffSize) + ' - ' + (diffSize / origSize * 100).toFixed() + '%');

			resolve();
		});
	});
};

// TODO:
// not currently being used, here for the case of the questions below
ImageMinify.prototype.writeFile = function(relativePath) {

	var outputPath = this._getFullOutputFile(relativePath);
	var outputDir = path.dirname(outputPath);

	mkdirp.sync(outputDir);

	symlinkOrCopy.sync(this._getFullInputFile(relativePath), outputPath);
};

ImageMinify.prototype._getFullInputFile = function(relativePath) {
	return path.join(this.inputPath, relativePath);
};

ImageMinify.prototype._getFullOutputFile = function(relativePath) {
	return path.join(this.outputPath, this.destDir, relativePath);
};

// TODO:
// should this filter have an include/exclude glob options?
// should files that are excluded just be passed through?
// or should the user use broccoli-filter prior to do that kind of filtering
// (Single Responsibility Principle)
function _shouldProcessFile(relativePath) {
	return _matchingFileExtension(relativePath);
}

// TODO:
// we should of course only process on correct file types
// but should we just ignore and pass through files that are not?
function _matchingFileExtension(relativePath) {
	// check if file has an aceptable extension to process
	// toLower() so it's not case sensitive
	var ext = path.extname(relativePath).toLower();
	return acceptableExtensions.indexOf(ext) > -1;
}

readCompat.wrapFactory(ImageMinify);

module.exports = ImageMinify;