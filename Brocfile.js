// Brocfile for testing the plugin

var funnel = require('broccoli-funnel');
var mergeTrees = require('broccoli-merge-trees');

var imagemin = require('./');

// first try with string path

var stringPath = imagemin('test/fixtures', {
	destDir: 'images-string-path'
});

// then with created tree

var treePath = funnel('test/fixtures');
treePath = imagemin(treePath, {
	destDir: 'images-tree-path'
});

module.exports = mergeTrees([stringPath, treePath]);