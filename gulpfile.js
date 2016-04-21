var gulp = require('gulp'),
  bsync = require('browser-sync').create(),
  reload = bsync.reload,
  jade = require('gulp-jade'),
  sass = require('gulp-sass'),
  jscs = require('gulp-jscs'),
  jshint = require('gulp-jshint'),
  gutil = require('gulp-util'),
  gprint = require('gulp-print'),
  gif = require('gulp-if'),
  args = require('yargs').argv;

gulp.task('jade', function() {
  return gulp
    .src('./src/**/*.jade')
    .pipe(jade({pretty: true})).on('error', jadeErrorHandler)
    .pipe(gulp.dest('./build/dev/'));
});

gulp.task('jade-refresh', ['jade'], function() {
  reload();
});

gulp.task('sass', function() {
  return gulp
    .src('./src/scss/**/*.scss')
    .pipe(sass({outputStyle:'expanded'}).on('error', sassErrorHandler))
    .pipe(gulp.dest('./build/dev/css/'));
});

gulp.task('sass-refresh', ['sass'], function() {
  reload();
});

gulp.task('vetjs', function() {
  return gulp
    .src([
      './*.js',
      './src/**/*.js',
      '!./src/js/jquery-?.?.?.js',
      '!./src/js/jquery-?.?.?.min.js'
    ])
    .pipe(gif(!args.q, gprint()))
    .pipe(jscs())
    .pipe(jscs.reporter('jscs-stylish'))
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(gulp.dest('./build/dev/'));
});

gulp.task('js-refresh', ['vetjs'], function() {
  reload();
});

gulp.task('bsync', ['jade', 'sass', 'vetjs'], function() {
  bsync.init({
    server: {
      baseDir: './build/dev/'
    }
  });
});

gulp.task('default', ['bsync'], function() {
  gulp.watch('./src/**/*.jade', ['jade-refresh']);
  gulp.watch('./src/scss/**/*.scss', ['sass-refresh']);
  gulp.watch(['./src/**/*.js', './*.js'], ['js-refresh']);
});

//////////////////////////////////////////////////////////

function jadeErrorHandler(err) {
  gutil.log(gutil.colors.red.underline('*** Jade Error ***\n') +
            gutil.colors.yellow.bold(err.message) + '\n');
  this.emit('end');
}
function sassErrorHandler(err) {
  gutil.log(gutil.colors.red.underline('*** Sass Error ***\n') +
            gutil.colors.yellow.bold(err.message));
  this.emit('end');
}
