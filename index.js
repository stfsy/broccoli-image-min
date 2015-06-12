var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');
var walkSync = require('walk-sync');
var RSVP = require('rsvp');
var readCompat = require('broccoli-read-compat');
var Imagemin = require('imagemin');
var prettyBytes = require('pretty-bytes');

var writeFile = RSVP.denodeify(fs.writeFile);

function makeDictionary() {
	var cache = Object.create(null);

	cache['_dict'] = null;
	delete cache['_dict'];
	return cache;
}

var acceptableExtensions = [
	'.png',
	'.gif',
	'.jpg',
	'.jpeg',
	'.svg'
];


function ImageMinify(inputTree, options) {

	if (!(this instanceof ImageMinify)) { return new ImageMinify(inputTree, options); }

	this.inputTree = inputTree;

	// got these from broccoli-funnel
	// are they needed?
	this._includeFileCache = makeDictionary();
	this._destinationPathCache = makeDictionary();

	options = options || {};

	for (var key in options) {
		if (options.hasOwnProperty(key)) {
			this[key] = options[key];
		}
	}

	this.destDir = this.destDir || '/';
	this.files = this.files || ['**/*'];
}

ImageMinify.prototype.constructor = ImageMinify;

ImageMinify.prototype.rebuild = function() {

	var promises = [];

	walkSync(this.inputPath)
		.forEach(function(relativePath) {
			if (_shouldProcessFile(relativePath)) {
				console.log(relativePath);
				promises.push(this.minify(relativePath));
				// this.writeFile(relativePath);
			}
		}, this);

	return RSVP.all(promises);
};

ImageMinify.prototype.minify = function(relativePath) {

	options = {
		interlaced: true,
		optimizationLevel: 3,
		progressive: true
	};
	
	var fullInputPath = path.join(this.inputPath, relativePath);
	var fullOutputPath = path.join(this.outputPath, this.destDir);

	mkdirp.sync(path.dirname(fullOutputPath));

	var imagemin = new Imagemin()
		.src(fullInputPath)
		.dest(fullOutputPath)
		.use(Imagemin.jpegtran(options))
		.use(Imagemin.gifsicle(options))
		.use(Imagemin.optipng(options))
		.use(Imagemin.svgo({plugins: options.svgoPlugins || []}));

	var fileStatus = fs.statSync(fullInputPath);

	return new RSVP.Promise(function(resolve, reject) {
		imagemin.run(function (err, data) {

			if (err) {
				console.warn('error in processing: ' + fullOutputPath);
				return;
			}

			var origSize = fileStatus.size;
			var diffSize = origSize - data[0].contents.length;

			console.log(relativePath + ' saved ' + prettyBytes(diffSize) + ' - ' + (diffSize / origSize * 100).toFixed + '%');

			resolve();
		});
	});
};

// for testing purposes
ImageMinify.prototype.writeFile = function(relativePath) {
	console.log(relativePath);

	var fullOutputPath = path.join(this.outputPath, this.destDir, relativePath);

	mkdirp.sync(path.dirname(fullOutputPath));
	fs.writeFileSync(fullOutputPath);
};


function _shouldProcessFile(relativePath) {
	return _matchingFileExtension(relativePath);
}

function _matchingFileExtension(relativePath) {
	// currently this just checks if the relativePath has an extension
	// eventially I'll have it match to an option input
	var ext = path.extname(relativePath);

	return acceptableExtensions.indexOf(ext) > -1;
}

readCompat.wrapFactory(ImageMinify);

module.exports = ImageMinify;