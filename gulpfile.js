var gulp = require('gulp'),
    unglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    annotate = require('gulp-ng-annotate'),
    del = require('del'),
    ghPages = require('gulp-gh-pages'),
    webserver = require('gulp-webserver');

var src = {
    scripts: [
        './src/module.js',
        './src/metro.js',
        './src/metro-station.js',
        './src/metro-info.js',
        './src/metro-group.js'
    ],
    lib: [
        './src/metro.js',
        './src/metro.svg'
    ],
    demo: [
        './src/metro.svg',
        './src/components/angularjs/angular.min.js',
        './src/components/jquery/dist/jquery.min.js'
    ]
} 

gulp.task('clean', function () {
    del(['./lib/*', './demo/*.js', './demo/metro.svg'])
})

gulp.task('build', ['clean'], function () {

    gulp.src(src.scripts)
        // full version
        .pipe(concat('dvhb_metro.js'))
        .pipe(gulp.dest('./lib'))    
        .pipe(gulp.dest('./demo'))    
        // minified
        .pipe(annotate())
        .pipe(unglify())
        .pipe(rename({extname: '.min.js'}))
        .pipe(gulp.dest('./lib'))
        .pipe(gulp.dest('./demo'));

    gulp.src(src.demo)
        .pipe(gulp.dest('./demo'))

    gulp.src('./src/metro.svg')
        .pipe(gulp.dest('./lib'))
});

gulp.task('watch', function () {
    gulp.watch(src.scripts, ['build'])  
    gulp.watch('./src/metro.svg', ['build'])  
});

gulp.task('ghPages', function () {
    return gulp.src('./demo/**/*')
        .pipe(ghPages({
            remoteUrl: 'git@github.com:dvhbru/dvhb-metro.git'
        }));
});


gulp.task('webserver', function () {
    gulp.src('./demo')
        .pipe(webserver({
            host: '0.0.0.0',
            // livereload: true,
            open: false,
            port: 8000,
            fallback: './demo/index.html'
        }))
});

gulp.task('default', ['build', 'webserver', 'watch']);