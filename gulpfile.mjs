import gulp from 'gulp';
import less from 'gulp-less';
import rename from 'gulp-rename';
import cleanCSS from 'gulp-clean-css';
import changed from 'gulp-changed';
import browserSync from 'browser-sync';
import { fileURLToPath } from 'url';
import { deleteAsync } from 'del';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const paths = {
  styles: {
    src: ['src/less/**/*.less', '!src/less/**/_*.less'],
    dest: 'build/css',
  },
  images: {
    src: 'src/assets/images/**/*',
    dest: 'build/assets/images',
  },
  fonts: {
    src: 'src/assets/fonts/**/*',
    dest: 'build/assets/fonts',
  },
  html: {
    src: 'src/*.html',
    dest: 'build',
  },
};

const clean = () => deleteAsync(['build']);

function styles() {
  return gulp
    .src(paths.styles.src)
    .pipe(
      less({
        paths: [path.join(__dirname, 'less', 'includes')],
      })
    )
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(
      rename({
        suffix: '.min',
      })
    )
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browserSync.stream());
}

function images() {
  return gulp
    .src(paths.images.src, { encoding: false })
    .pipe(changed(paths.images.dest))
    .pipe(gulp.dest(paths.images.dest))
    .pipe(browserSync.stream());
}

function fonts() {
  return gulp
    .src(paths.fonts.src)
    .pipe(gulp.dest(paths.fonts.dest))
    .pipe(browserSync.stream());
}

function html() {
  return gulp.src(paths.html.src).pipe(gulp.dest(paths.html.dest));
}

function watch() {
  browserSync.init({
    server: {
      baseDir: 'build',
    },
  });

  gulp.watch(paths.styles.src[0], styles);
  gulp.watch(paths.images.src, images);
  gulp.watch(paths.fonts.src, fonts);
  gulp.watch(paths.html.src, html);
  gulp.watch('src/*.html').on('change', browserSync.reload);
}

const build = gulp.series(
  clean,
  gulp.parallel(styles, images, fonts, html),
  watch
);

export { clean, styles, images, fonts, html, watch };
export default build;
