var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    cssnano = require('gulp-cssnano'),
    concatCss = require('gulp-concat-css'),
    gulpIf = require('gulp-if'),
    imagemin = require('gulp-imagemin'),
    runSequence = require('run-sequence'),
    del = require('del'),
    useref = require('gulp-useref'),
    uglify = require('gulp-uglify'),
    ts = require('gulp-typescript'),
    tsProject = ts.createProject("tsconfig.json");

gulp.task('browserSync', () => {
    browserSync.init({
        server: {
            baseDir: 'src'
        },
        browser: ['firefox']
    })
});

gulp.task('reload', () => {
    browserSync.reload();
})

gulp.task('sass', () => {
    return gulp.src('src/scss/**/*.+(sass|scss)')
        .pipe(sass())
        .pipe(gulp.dest('src/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('ts', () => {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest('src/js'))
        .pipe(browserSync.reload({
            stream: true
        }))
})

gulp.task('clean:dist', () => {
    return del.sync('dist')
})

gulp.task('movecss', () => {
    return gulp.src('src/css/**/*.css')
        .pipe(gulp.dest('dist/css'))
})

gulp.task('movejs', () => {
    return gulp.src('src/js/**/*.js')
        .pipe(gulp.dest('dist/js'))
})

gulp.task('movehtml', () => {
    return gulp.src('src/**/*.html')
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.reload({
            stream: true
        }))
})

gulp.task('watch', ['browserSync', 'sass', 'ts'], () => {
    gulp.watch('src/scss/**/*.+(scss|sass)', () => {runSequence('sass', ['movecss'])});
    gulp.watch('src/ts/*.ts', () => {runSequence('ts', ['movejs'])});
    gulp.watch('src/*.html', () => {runSequence('movehtml')});
})

gulp.task('default', () => {
    runSequence(['movecss', 'movejs', 'movehtml', 'watch'])
})
