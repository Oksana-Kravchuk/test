var gulp         = require('gulp');
var sass         = require('gulp-sass');
var watchSass    = require("gulp-watch-sass");
var autoprefixer = require('gulp-autoprefixer');
var cssnano      = require('gulp-cssnano');
var rename       = require("gulp-rename");
var sourcemaps   = require('gulp-sourcemaps');
var plumber      = require('gulp-plumber');
var notify       = require("gulp-notify");
var fileinclude  = require('gulp-file-include');
var babel        = require('gulp-babel');
var include      = require("gulp-include");
let uglify       = require('gulp-uglify-es').default;
var browserSync  = require('browser-sync').create();
var runSequence  = require('run-sequence');
var imagemin     = require('gulp-imagemin');
var del          = require('del');
var jquery       = require('gulp-jquery');

gulp.task('sass', function () {
	return gulp.src([
    'app/sass/main.sass',
    'app/sass/responsive.sass'
    ])
	.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
	.pipe(sourcemaps.init())
	.pipe(sass().on('error', sass.logError))
	.pipe(autoprefixer({
		browsers: ['last 2 versions'],
		cascade: false
	}))
	.pipe(cssnano())
	.pipe(rename({
    dirname: "",
    // basename: "main",
    prefix: "",
    suffix: ".min",
    extname: ".css"
  }))
  .pipe(sourcemaps.write())
	.pipe(gulp.dest('dist/css'));
});


gulp.task('html', function () {
  return gulp.src('app/*.html')
	.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
	.pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('js', function () {
	return gulp.src('app/js/**/*.*')
	.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
	.pipe(sourcemaps.init({loadMaps: true}))
	.pipe(babel())
	.pipe(include({
    extensions: "js",
    hardFail: true
  }))
  .pipe(uglify())
	.pipe(sourcemaps.write('.'))
	.pipe(gulp.dest('dist/js'));
});


gulp.task('server', function() {
    browserSync.init({
        server: {
            baseDir: "./dist"
        },
        files: ['dist/**/*.*']
    });
});

gulp.task('clean', function() {
  return del(['dist/'])
})
gulp.task('build', ['clean'], function() {
  runSequence(
      'sass',
      'html',
      'js',
      'fonts',
      'img'
  );
});

gulp.task('fonts', function () {
  return gulp.src('app/fonts/**/*.*')
      .pipe(gulp.dest('dist/fonts'));
});

gulp.task('img', function () {
  gulp.src([
          "app/img/**/*.*",
          "!app/img/noCompress/**/*.*"
        ])
    .pipe(gulp.dest('dist/img'));
  gulp.src('app/img/noCompress/**/*.*')
    .pipe(imagemin([
        imagemin.gifsicle({interlaced: true}),
        imagemin.jpegtran({progressive: true}),
        imagemin.optipng({optimizationLevel: 5}),
        imagemin.svgo({
        plugins: [
            {removeViewBox: false},
            {cleanupIDs: false}
        ]
    })
  ]))
    .pipe(gulp.dest('dist/img'))
});

gulp.task('libs', function () {
    gulp.src('app/js/libs/**/*.js')
        .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
        .pipe(babel())
        .pipe(include({
        extensions: "js",
        hardFail: true
        }))
        .pipe(gulp.dest('dist/js'));
     gulp.src('app/css/libs/**/*.css')
        .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
        .pipe(include({
        extensions: "css",
        hardFail: true
        }))
        .pipe(gulp.dest('dist/css'));
    });

 gulp.task('watch', function () {
	gulp.watch('app/sass/**/*.*', ['sass']);
	gulp.watch('app/**/*.html', ['html']);
	gulp.watch('app/js/**/*.js', ['js']);
	gulp.watch('app/fonts/**/*.*', ['fonts']);
	gulp.watch('app/img/**/*.*', ['img']);
  gulp.watch('app/js/libs/**/*.*', ['libs']);
});

 gulp.task('default', function() {
  runSequence(
      'build',
      'watch',
      'server'
  );
});