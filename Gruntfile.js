
module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		jshint: {
			options: {
				jshintrc: true
			},
			all: ['Gruntfile.js', 'Brocfile.js', 'index.js']
		},

		clean: {
			dist: ['dist']
		},

		watch: {
			all: {
				files: ['Gruntfile.js', 'Brocfile.js', 'index.js'],
				tasks: ['jshint']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['clean', 'jshint']);
};