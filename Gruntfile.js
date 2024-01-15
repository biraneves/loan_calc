module.exports = function (grunt) {
    // Grunt configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        less: {
            development: {
                files: {
                    'dev/assets/styles/main.css': 'src/assets/styles/main.less',
                },
            },
            production: {
                options: {
                    compress: true,
                },
                files: {
                    'dist/assets/styles/main.min.css': 'src/assets/styles/main.less',
                },
            },
        },
        watch: {
            less: {
                files: ['src/assets/styles/**/*.less'],
                tasks: ['less:development'],
            },
            html: {
                files: ['src/index.html'],
                tasks: ['replace:dev'],
            },
        },
        replace: {
            dev: {
                options: {
                    patterns: [
                        {
                            match: 'CSS_ADDRESS',
                            replacement: './assets/styles/main.css',
                        },
                        {
                            match: 'JS_ADDRESS',
                            replacement: '../src/assets/js/main.js',
                        },
                    ],
                },
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: ['src/index.html'],
                        dest: 'dev/',
                    },
                ],
            },
            dist: {
                options: {
                    patterns: [
                        {
                            match: 'CSS_ADDRESS',
                            replacement: './assets/styles/main.min.css',
                        },
                        {
                            match: 'JS_ADDRESS',
                            replacement: './assets/js/main.min.js',
                        },
                    ],
                },
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: ['prebuild/index.html'],
                        dest: 'dist/',
                    },
                ],
            },
        },
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true,
                },
                files: {
                    'prebuild/index.html': 'src/index.html',
                },
            },
        },
        clean: ['prebuild'],
        uglify: {
            target: {
                files: {
                    'dist/assets/js/main.min.js': 'src/assets/js/main.js',
                },
            },
        },
    });

    // Load plugins
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-replace');

    // Tasks
    grunt.registerTask('default', ['watch']);
    grunt.registerTask('build', ['less:production', 'htmlmin:dist', 'replace:dist', 'uglify', 'clean']);
};
