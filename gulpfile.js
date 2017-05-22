/**
 * Created by user on 2017/4/7.
 */

'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');

const options = {

//	includePaths: [
//		'src',
//	],

	//sourceMap: true,
	sourceComments: true,

	indentType: "tab",
	indentWidth: 1,

	outputStyle: 'expanded',

};

const scss_glob = './src/stylish.*.scss';

gulp.task('sass', ['build-site'], function ()
{
	return gulp.src(scss_glob)
		.pipe(sourcemaps.init())
			.pipe(sass(options).on('error', sass.logError))
			.pipe(autoprefixer())
		.pipe(sourcemaps.write('.', {
			addComment: true
		}))
	.pipe(gulp.dest('./dist'));
});

gulp.task('sass:watch', function ()
{
	gulp.watch(scss_glob, ['sass']);
});

gulp.task('build-site', function (done)
{
	require('./script/build-site.js')(done);
});

gulp.task('leechblock', function (done)
{
	require('./script/leechblock.js')(done);
});

gulp.task('adaway', ['leechblock'], function (done)
{
	require('./script/adaway.gulp.task.js')(done);
});

gulp.task('noscript.untrusted', ['leechblock'], function (done)
{
	require('./script/noscript.untrusted.gulp.task.js')(done);
});

gulp.task('adblockpopups', ['leechblock'], function (done)
{
	require('./script/adblockpopups.gulp.task.js')(done);
});

gulp.task('adblock', ['leechblock', 'adblockpopups'], function (done)
{
	require('./script/adblock.gulp.task.js')(done);
});

gulp.task('hosts', ['adaway'], function (done)
{
	require('./script/hosts.gulp.task.js')(done);
});

gulp.task('all', [

	'leechblock',

	'adaway',
	'noscript.untrusted',

	'adblockpopups',
	'adblock',

	'hosts',

	'sass',

], function (done)
{
	done();
});
