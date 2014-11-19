var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var templateCache = require('gulp-angular-templatecache');
var replace = require('gulp-replace');
var clean = require('gulp-clean');
var shell = require('gulp-shell');
var zip = require('gulp-zip');
var runSequence = require('run-sequence');

var paths = {
    sass: ['./scss/*'],
    templates: ['./www/js/**/*.tpl.html']
};

var WAR_DEST = './bin';

gulp.task('default', ['watch', 'sass', 'templates']);

gulp.task('compile', function (callback) {
    runSequence('clearbin', 'sass', 'templates', 'requirejs', 'copyfiles',
        callback);
});

gulp.task('compilezip', function (callback) {
    runSequence('clearbin', 'sass', 'templates', 'requirejs', 'copyfiles', 'buildzip',
        callback);
});

gulp.task('requirejs', shell.task([
    'r.js.cmd -o build.js' //optimize=none
], {
    cwd: './www/'
}));

gulp.task('copyfiles', function (done) {

    gulp.src([
        './www/css/**',
        './www/img/**',
        './www/lib/ionic/fonts/**',
        './www/all.js',
        './www/index.html',
        './www/icon.png',
        './www/icon@2x.png',
        './www/icon-hdpi.png',
        './www/icon-mdpi.png',
        './www/icon-xhdpi.png',
        './www/icon-xxhdpi.png',
        './www/icon-xxxhdpi.png',
        './www/config.xml'
    ], {base: "./www"}).pipe(gulp.dest(WAR_DEST)).on('end', done);

});

gulp.task('clearbin', function () {
    return gulp.src([
        WAR_DEST
    ], {read: false}).pipe(clean({force: true}));

});

gulp.task('buildzip', function () {
    return gulp.src(WAR_DEST + '/**')
        .pipe(zip('dropbyke.zip'))
        .pipe(gulp.dest(WAR_DEST));

});

gulp.task('templates', function (done) {
    gulp.src(paths.templates)
        .pipe(templateCache({
            filename: 'dropbike.templates.js',
            standalone: true,
            'module': 'dropbike.templates',
            moduleSystem: 'RequireJS'
        }))
        .pipe(gulp.dest('www/js/')).on('end', done);
});

gulp.task('sass', function (done) {
    gulp.src('./scss/ionic.app.scss')
        .pipe(sass())
        .pipe(gulp.dest('./www/css/'))
        .pipe(minifyCss({
            keepSpecialComments: 0
        }))
        .pipe(rename({ extname: '.min.css' }))
        .pipe(gulp.dest('./www/css/'))
        .on('end', done);
});

gulp.task('watch', function () {
    gulp.watch(paths.sass, ['sass']);
    gulp.watch(paths.templates, ['templates']);
});

gulp.task('install', ['git-check'], function () {
    return bower.commands.install()
        .on('log', function (data) {
            gutil.log('bower', gutil.colors.cyan(data.id), data.message);
        });
});

gulp.task('git-check', function (done) {
    if (!sh.which('git')) {
        console.log(
            '  ' + gutil.colors.red('Git is not installed.'),
            '\n  Git, the version control system, is required to download Ionic.',
            '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
            '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
        );
        process.exit(1);
    }
    done();
});
