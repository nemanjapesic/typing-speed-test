'use strict';
const gulp = require('gulp');
const uglify = require('gulp-uglify-es').default;
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
var sass = require('gulp-sass');

sass.compiler = require('node-sass');


// Copy ALL HTML files
gulp.task('copyHTML', async () => {
    gulp.src('src/*.html')
        .pipe(gulp.dest('dist'));
});

// Transpile SASS
gulp.task('sass', async () => {
    return gulp.src('src/scss/style.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('src/css'));
  });

// Autoprefix and Minify CSS
gulp.task('css', async () => {
    gulp.src('src/css/*.css')
    .pipe(autoprefixer({
        cascade: false
    }))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('dist/css'));
})

// Minify JS
gulp.task('scripts', async () => {
    gulp.src('src/js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

// Watch for changes
gulp.task('watch', async () => {
    gulp.watch('src/*.html', gulp.series('copyHTML'));
    gulp.watch('src/scss/*.scss', gulp.series('sass'));
    gulp.watch('src/css/*.css', gulp.series('css'));
    gulp.watch('src/js/*.js', gulp.series('scripts'));
});

// Default
gulp.task('default', gulp.series('copyHTML', 'sass', 'css', 'scripts'));