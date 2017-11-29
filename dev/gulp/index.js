/* jslint node: true */
'use strict';

var config			= require('./config.js');

var gulp			= require('gulp');
var gulpSource		= gulp.src;

var gulpCache		= require('gulp-cached');
var gulpNotify		= require('gulp-notify');
var gulpPlumber		= require('gulp-plumber');
var gulpRemember	= require('gulp-remember');
var gulpSequence	= require('run-sequence');

var httpBrowserSync	= require('browser-sync');

var htmlMinify		= require('gulp-htmlmin');
var htmlTemplate	= require('gulp-nunjucks-render');

var cssCritical		= require('critical').stream;
var cssMinify		= require('gulp-clean-css');
var cssPrefix		= require('gulp-autoprefixer');
var cssSass			= require('gulp-sass');

var jsBabel			= require('gulp-babel');
var jsMinify		= require('gulp-uglify');
var jsonMinify		= require('gulp-jsonminify');

var scriptConcat	= require('gulp-concat');
var scriptSourceMap	= require('gulp-sourcemaps');

var imgMinify		= require('gulp-imagemin');
var imgResize		= require('gulp-responsive');

var utilDelete		= require('del');
var utilRename		= require('gulp-rename');


/*
*	Error handling
*/
gulp.src = function()
{
	return gulpSource

		.apply(gulp, arguments)

		.pipe(gulpPlumber(
		{
			errorHandler: function(error)
			{
				gulpNotify.onError(config.utils.notify)(error);
				console.error(error.toString());
				this.emit('end');
			}
		}))
	;
};


/*
*	HTML Tasks
*/
gulp.task('html:compile', function()
{
	return gulp

		.src(config.html.template.src)

			.pipe(htmlTemplate(config.html.template.options))

		.pipe(gulp.dest(config.html.template.dst))
	;
});

gulp.task('html:build', function()
{
	return gulp

		.src(config.html.src)

			.pipe(gulpCache('html', config.utils.cache))

			.pipe(htmlMinify(config.html.minify.options))

		.pipe(gulp.dest(config.html.dst))

		.pipe(httpBrowserSync.stream({ once: true }))
	;
});


/*
*	CSS Tasks
*/
gulp.task('sass:compile', function()
{
	return gulp

		.src(config.sass.src)

			.pipe(cssSass(config.sass.options))

		.pipe(gulp.dest(config.sass.dst))
	;
});

gulp.task('css:build', function()
{
	return gulp

		.src(config.css.src)

			.pipe(scriptConcat(config.css.concat.filename))

			.pipe(cssMinify(config.css.minify.options))

			.pipe(cssPrefix(config.css.prefix))

		.pipe(gulp.dest(config.css.dst))

		.pipe(httpBrowserSync.stream())
	;
});

gulp.task('css:critical', function()
{
	return gulp

		.src(config.css.critical.src)

			.pipe(cssCritical(config.css.critical.options))

		.pipe(gulp.dest(config.css.critical.dst))
	;
});


/*
*	JS Tasks
*/
gulp.task('js:build', function()
{
	return gulp

		.src(config.js.src)

			.pipe(jsBabel(config.js.babel))

			.pipe(scriptConcat(config.js.concat.filename))

			.pipe(jsMinify(config.js.minify))

		.pipe(gulp.dest(config.js.dst))

		.pipe(httpBrowserSync.stream({ once: true }))
	;
});

gulp.task('json:build', function()
{
	return gulp

		.src(config.json.src)

			.pipe(jsonMinify())

		.pipe(gulp.dest(config.json.dst))
	;
});


/*
*	Image Tasks
*/
gulp.task('img:minify', function()
{
	return gulp

		.src(config.img.minify.src)

			.pipe(gulpCache('imgminify', config.utils.cache))

			.pipe(imgMinify([imgMinify.svgo(config.img.minify.svgo)], { 'verbose': true }))

		.pipe(gulp.dest(config.img.minify.dst))

		.pipe(httpBrowserSync.stream({ once: true }))
	;
});

gulp.task('img:resize', function()
{
	return gulp

		.src(config.img.resize.src)

			.pipe(gulpCache('imgresize', config.utils.cache))

			.pipe(imgResize(config.img.resize.buildFormats, config.img.resize.options))

		.pipe(gulp.dest(config.img.resize.dst))

		.pipe(httpBrowserSync.stream({ once: true }))
	;
});


/*
*	Utility Tasks
*/
gulp.task('build:clean', function() { return utilDelete (config.utils.del.src, config.utils.del.options); });

gulp.task('http:init', function() { return httpBrowserSync.init(config.http.sync); });

gulp.task('static:copy', function()
{
	config.copy.forEach(function(file)
	{
		return gulp

			.src(file.src)

				.pipe(utilRename(file.rename))

			.pipe(gulp.dest(file.dst))
		;
	});
});


/*
*	Main Tasks
*/
gulp.task('html', function() { gulpSequence('html:compile', 'html:build'); });

gulp.task('css', function() { gulpSequence('sass:compile', 'css:build'); });

gulp.task('js', function() { gulpSequence('js:build'); });

gulp.task('json', function() { gulpSequence('json:build'); });

gulp.task('img', function() { gulpSequence('img:resize', 'img:minify'); });


/*
*	Gulp Default Tasks
*/
gulp.task('default', function()
{
	gulpSequence
	(
		['http:init', 'build:clean'],

		['html:compile', 'sass:compile', 'js:build', 'json:build'/*, 'img:resize'*/, 'img:minify', 'static:copy'],

		['html:build', 'css:build'],

		'watch'
	);
});


/*
*	Gulp Watch Tasks
*/
gulp.task('watch', function()
{
	var html = gulp.watch(config.html.src, ['html:build']);
	html.on('change', function(e) { if (e.type === 'deleted') { delete gulpCache.caches.html[e.path]; gulpRemember.forget('html', e.path); } });

	var template = gulp.watch(config.html.template.watch, ['html:compile']);
	template.on('change', function(e) { if (e.type === 'deleted') { delete gulpCache.caches.template[e.path]; gulpRemember.forget('template', e.path); } });

	var css = gulp.watch(config.css.src, ['css:build']);
	css.on('change', function(e) { if (e.type === 'deleted') { delete gulpCache.caches.css[e.path]; gulpRemember.forget('css', e.path); } });

	var sass = gulp.watch(config.sass.watch, ['sass:compile']);
	sass.on('change', function(e) { if (e.type === 'deleted') { delete gulpCache.caches.sass[e.path]; gulpRemember.forget('sass', e.path); } });

	var js = gulp.watch(config.js.src, ['js:build']);
	js.on('change', function(e) { if (e.type === 'deleted') { delete gulpCache.caches.js[e.path]; gulpRemember.forget('js', e.path); } });

	var json = gulp.watch(config.json.src, ['json:build']);
	json.on('change', function(e) { if (e.type === 'deleted') { delete gulpCache.caches.json[e.path]; gulpRemember.forget('json', e.path); } });

	var imgminify = gulp.watch(config.img.src, ['img:minify']);
	imgminify.on('change', function(e) { if (e.type === 'deleted') { delete gulpCache.caches.imgminify[e.path]; gulpRemember.forget('imgminify', e.path); } });

	var imgresize = gulp.watch(config.img.src, ['img:resize']);
	imgresize.on('change', function(e) { if (e.type === 'deleted') { delete gulpCache.caches.imgresize[e.path]; gulpRemember.forget('imgresize', e.path); } });
});