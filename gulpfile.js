const gulp = require('gulp')
const browserify = require('browserify')
const babelify   = require('babelify')
const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')
const clean = require('gulp-clean')
const uglify = require('gulp-uglify')

gulp.task('clean', () => {
    return gulp.src('dist/*', {
        read: false
    }).pipe(clean())
})

gulp.task('build', () => {
    return browserify(['./app.js'])
        .transform(babelify)
        .bundle()
        .pipe(source('bundle.gulp.js'))
        .pipe(gulp.dest('dist'))
        .pipe(buffer())
})

gulp.task('dev', ['clean', 'build'])