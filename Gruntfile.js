module.exports = function(grunt) {
    grunt.initConfig({
	    
		pkg: grunt.file.readJSON('package.json'),
		
		meta: {
            banner: '/**\n * <%= pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            ' * <%= pkg.homepage %>\n' +
            ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
            ' * License: <%= pkg.license %>\n */\n'
        },
		
		files: {
		    // '<%= files.autocomplete %>'
            autocomplete: [
			    'src/vs-google-autocomplete.js'
			],
			// '<%= files.validator %>'
			validator: [
			    'src/vs-autocomplete-validator.js'
			]
        },
		
		jshint: {
		    // jshint:autocomplete
			autocomplete: [
			    '<%= files.autocomplete %>'
			],
			// jshint:validator
			validator: [
				'<%= files.validator %>'
			]
        },
		
		concat: {
		    // concat:autocomplete
	    	autocomplete: {
			    options: {
                    banner: '<%= meta.banner %>'
                },
                src: ['src/js.prefix', '<%= files.autocomplete %>', 'src/js.suffix'],
                dest: 'dist/vs-google-autocomplete.js'
            },
			// concat:validator
			validator: {
			    options: {
                    banner: '<%= meta.banner %>'
                },
                src: ['src/js.prefix', '<%= files.validator %>', 'src/js.suffix'],
                dest: 'dist/vs-autocomplete-validator.js'
            }
		},
		
		uglify: {
		    // uglify:autocomplete
            autocomplete: {
                files: {
                    'dist/vs-google-autocomplete.min.js': ['<%= concat.autocomplete.dest %>']
                }
            },
			// uglify:validator
            validator: {
                files: {
                    'dist/vs-autocomplete-validator.min.js': ['<%= concat.validator.dest %>']
                }
            }
        },
				
		watch: {
		    // watch:src
            src: {
                files: ['<%= files.autocomplete %>', '<%= files.validator %>'],
                tasks: ['jshint'],
                options: {
                    interrupt: true
                }
            }
        }
	});
	
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
		
	// build autocomplete
	grunt.registerTask('build-autocomplete', ['jshint:autocomplete', 'concat:autocomplete', 'uglify:autocomplete']);
	
	// build validator
	grunt.registerTask('build-validator', ['jshint:validator', 'concat:validator', 'uglify:validator']);
	
	// build
	grunt.registerTask('build', ['build-autocomplete', 'build-validator']);
	
	// default
	grunt.registerTask('default', ['build']);
};