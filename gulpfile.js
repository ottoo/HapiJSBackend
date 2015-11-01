var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');
var babel = require('babelify');
var browserSync = require('browser-sync');

function compile(watch) {
  var bundler = watchify(browserify('./src/scripts/app.js', { debug: true }).transform(babel));

  function rebundle() {
    bundler.bundle()
      .on('error', function(err) { console.error(err); this.emit('end'); })
      .pipe(source('build.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./src/build'));
  }

  if (watch) {
    bundler.on('update', function() {
      console.log('-> bundling...');
      rebundle();
    });
  }

  rebundle();
}

function watch() {
  return compile(true);
};

gulp.task('browser-sync', function() {
  browserSync({
    ui: {
      port: 4001
    },
    port: 4000,
    proxy: 'http://localhost:3333',
    baseDir: "./src"
  });
});

gulp.task('bs-reload', function () {
  browserSync.reload();
});

gulp.task('build', function() { return compile(); });
gulp.task('watch', function() { return watch(); });

gulp.task('default', ['browser-sync', 'watch'], function() {
  gulp.watch("src/**/*.html", ['bs-reload']);
  gulp.watch("src/**/*.js", ['bs-reload']);
});
