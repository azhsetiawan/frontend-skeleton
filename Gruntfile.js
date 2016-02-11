'use strict';
module.exports = function(grunt) {
	// Load all tasks
	require('load-grunt-tasks')(grunt);
	// Show elapsed time
	require('time-grunt')(grunt);

	var jsFileList = [
		// Boostrap JS -----------
		'bower_components/bootstrap/js/transition.js',
		// 'bower_components/bootstrap/js/alert.js',
		'bower_components/bootstrap/js/button.js',
		// 'bower_components/bootstrap/js/carousel.js',
		'bower_components/bootstrap/js/collapse.js',
		'bower_components/bootstrap/js/dropdown.js',
		// 'bower_components/bootstrap/js/modal.js',
		'bower_components/bootstrap/js/tooltip.js',
		'bower_components/bootstrap/js/popover.js',
		// 'bower_components/bootstrap/js/scrollspy.js',
		'bower_components/bootstrap/js/tab.js',
		// 'bower_components/bootstrap/js/affix.js',

		'bower_components/imagesloaded/imagesloaded.pkgd.js',
		'bower_components/bootstrap-datepicker/dist/js/bootstrap-datepicker.js',
		'bower_components/jquery-validation/dist/jquery.validate.js',
		'bower_components/bootstrap-select/dist/js/bootstrap-select.js',
		'bower_components/bootstrap-confirmation2/bootstrap-confirmation.js',
		'bower_components/jQuery.dotdotdot/src/js/jquery.dotdotdot.js',
		'font-icons/liga.js',

		'src/js/main.js'
	];

	grunt.initConfig({
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			all: [
				'Gruntfile.js',
				'src/js/main.js'
			]
		},
		clean: {
			dev: ['src/css/_main-styl.css'],
			build: [
				'dist/css/*.css',
				'dist/css/bless/*.css',
				'dist/js/*.js',
				'dist/js/vendor/*.js'
			]
		},
		stylus: {
			options: {
				linenos	: false, // add comments to the css that points to the stylus file
				compress: false
			},
			compile: {
				files: {
					'src/css/_main-styl.css': [
						'src/styl/main.styl'
					]
				}
			}
		},
		less: {
			build: {
				files: {
					'src/css/main.concat.css': [
						'src/less/main.less'
					]
				},
				options: {
					compress: false, // this doesn't actually work
					// LESS source map
					// To enable, set sourceMap to true and update sourceMapRootpath based on your install
					sourceMap: true,
					sourceMapFilename: 'src/css/main.concat.css.map'
					// sourceMapRootpath: ''
				}
			}
		},
		match_media: {
			desktop: {
				files: {
					'src/css/no-media-queries.css': [
						'src/css/main.concat.css'
					]
				}
			}
		},
		concat: {
			options: {
				separator: ';',
			},
			dist: {
				files: {
					'src/js/scripts.concat.js' : [jsFileList]
				}
			},
		},
		uglify: {
			dist: {
				files: {
					'dist/js/scripts.min.js': [jsFileList],
					'dist/js/vendor/jquery.min.js' : 'bower_components/jquery/dist/jquery.min.js'
				}
			}
		},
		postcss: {
			options: {
				map: true, // inline sourcemaps
				// or
				// map: {
				// 	inline: false, // save all sourcemaps as separate files...
				// 	annotation: 'src/css/' // ...to the specified directory
				// },
				processors: [
					require('autoprefixer-core')({
						browsers: [
								'last 2 versions',
								'> 5%',
								'Android 2.3',
								'Android >= 4',
								'Chrome >= 20',
								'Firefox >= 24',
								'Explorer >= 8',
								'iOS >= 6',
								'Opera >= 12',
								'Safari >= 6'
							]
					}), // add vendor prefixes
					// require('pixrem')(), // add fallbacks for rem units
					// require('cssnano')() // minify the result
				]
			},
			dist: {
				src: 'src/css/main.concat.css'
			}
		},
		bless: {
			build: {
				options: {
					cacheBuster: true,
					compress: true,
					force: true,
					imports: true
				},
				files: {
					'src/css/bless.css': [
						'src/css/main.concat.css'
					]
				}
			}
		},
		cssmin: {
			options: {
				keepSpecialComments: 0,
				processImport: false,
				shorthandCompacting: false,
				roundingPrecision: -1,
				report: 'gzip'
			},
			build: {
				files: {
					'dist/css/main.min.css': ['src/css/main.concat.css']
					// 'dist/css/no-media-queries.min.css': ['src/css/no-media-queries.css'],
					// 'dist/css/bless.min.css': ['src/css/bless.css'],
					// 'dist/css/bless-blessed1.min.css': ['src/css/bless-blessed1.css']
				}
			}
		},
		modernizr: {
			build: {
				devFile: 'bower_components/modernizr/modernizr.js',
				outputFile: 'dist/js/vendor/modernizr.min.js',
				files: {
					'src': [
						['dist/js/scripts.min.js'],
						['dist/css/main.min.css']
					]
				},
				extra: {
					shiv: false
				},
				uglify: true,
				parseFiles: true
			}
		},
		version: {
			default: {
				options: {
					rename: true,
					format: false,
					algorithm: 'sha1',
					length: 4,
					manifest: 'src/manifest.json'
				},
				files: {
					'lib/scripts.php': [
						['dist/css/main.min.css'],
						['dist/js/scripts.min.js'],
						['dist/js/vendor/modernizr.min.js']
					]
				}
			}
		},
		watch: {
			styles: {
				files: [
					'src/styl/*',
					'src/styl/**/*',
					'src/less/*',
					'src/less/**/*',
					'font-icons/*.css',
					'fonts/*.css'
				],
				tasks: ['stylus', 'less', 'postcss','match_media','clean:dev']
			},
			js: {
				files: [
					jsFileList,
					'<%= jshint.all %>'
				],
				tasks: ['jshint', 'concat']
			},
			livereload: {
				// Browser live reloading
				// https://github.com/gruntjs/grunt-contrib-watch#live-reloading
				options: {
					livereload: false
				},
				files: [
					'src/css/main.concat.css',
					'src/js/scripts.concat.js',
					'templates/*.php',
					'templates/components/*.php',
					'*.php'
				]
			}
		},
		browserSync: {
			bsFiles: {
				src: [
					'src/css/main.concat.css',
					'src/js/scripts.concat.js',
					'templates/*.php',
					'templates/components/*.php',
					'*.php'
				]
			},
			options: {
				watchTask: true,
				// proxy: 'local.projectname.com',
				ghostMode: {
					clicks: true,
					forms: false,
					scroll: true
				}
			}
		}
	});

	// Register tasks
	grunt.registerTask('default', [
		'dev'
	]);

	// LOCAL AND DEV CODE
	// compiler and code quality checks
	grunt.registerTask('dev', [
		'jshint',
		'stylus',
		'less',
		'postcss',
		// 'match_media',
		// 'bless',
		'concat',
		'clean:dev',
		'browserSync',
		'watch'
	]);

	// LIVE PRODUCTION CODE
	// compression of code result from 'grunt dev'
	grunt.registerTask('build', [
		'clean:build',
		'clean:dev',
		'cssmin',
		'uglify',
		'modernizr'
	]);

	// BUILDS CODE FOR LOCAL, DEV, LIVE
	// 'grunt dev' and 'grunt build'
	grunt.registerTask('all', [
		'clean:build',
		'jshint',
		'stylus',
		'less',
		'postcss',
		// 'match_media',
		// 'bless',
		'concat',
		'cssmin',
		'clean:dev',
		'uglify',
		'modernizr',
		'watch'
	]);
};
