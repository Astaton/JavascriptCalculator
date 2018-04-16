const gulp = require('gulp');
const gulpAutoprefix = require('gulp-autoprefixer');
const gulpHtmlMini = require('gulp-htmlmin');

const src_html = 'public/*.html';
const src_css = 'src/*.css';
const dest_html = 'public/';
const dest_css = 'src/';

gulp.task('prefixes', function (){
	gulp.src(src_css)
		.pipe(gulpAutoprefix({
			browsers:['cover 99.5% in US']
		}))
		.pipe(gulp.dest(dest_css))
});

gulp.task('htmlMini', function(){
	gulp.src(src_html)
		.pipe(gulpHtmlMini({
			collapseWhitespace: true,
			minifyCSS: true
		}))
		.pipe(gulp.dest(dest_html))
});