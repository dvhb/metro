var gulp = require('gulp'),
    unglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    webserver = require('gulp-webserver');

var src = {
    lib: [
        './src/subwaymap.js',
        './src/metro.svg'
    ],
    demo: [
        './src/subwaymap.js',
        './src/metro.svg',
        './src/components/angularjs/angular.min.js'
    ]
} 
  

gulp.task('demo', function () {
    gulp.src(src.demo)
        .pipe(gulp.dest('./demo'))  
});


gulp.task('min', function () {
    gulp.src('./src/subwaymap.js')
        .pipe(unglify())
        .pipe(rename({extname: '.min.js'}))
        .pipe(gulp.dest('./lib'));
});


gulp.task('build', ['min'], function () {
    gulp.src(src.lib)
        .pipe(gulp.dest('./lib'))    
});


gulp.task('watch', function () {
    gulp.watch(src.lib, ['build'])  
});


gulp.task('webserver', function () {
    gulp.src('./demo')
        .pipe(webserver({
            host: '0.0.0.0',
            livereload: true,
            open: false,
            port: 8000,
            fallback: 'index.html'
        }))
});

gulp.task('default', ['build', 'demo', 'webserver', 'watch']);