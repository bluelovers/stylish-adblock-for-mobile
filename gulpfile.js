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

gulp.task('build-site', function (done)
{
	require('./script/build-site.js')(done);
});

gulp.task('sass', gulp.series('build-site', function ()
{
	return gulp.src(scss_glob)
		.pipe(sourcemaps.init())
			.pipe(sass(options).on('error', sass.logError))
			.pipe(autoprefixer())
		.pipe(sourcemaps.write({
			addComment: true,
			loadMaps: true,
			includeContent: true,
		}))
	.pipe(gulp.dest('./dist'));
}));

gulp.task('sass:watch', function ()
{
	gulp.watch(scss_glob, ['sass']);
});



gulp.task('leechblock', function (done)
{
	require('./script/leechblock.js')(done);
});

gulp.task('adaway', gulp.series('leechblock', function (done)
{
	require('./script/adaway.gulp.task.js')(done);
}));

gulp.task('noscript.untrusted', gulp.series('leechblock', function (done)
{
	require('./script/noscript.untrusted.gulp.task.js')(done);
}));

gulp.task('adblockpopups', gulp.series('leechblock', function (done)
{
	require('./script/adblockpopups.gulp.task.js')(done);
}));

gulp.task('adblock', gulp.series('leechblock', 'adblockpopups', function (done)
{
	require('./script/adblock.gulp.task.js')(done);
}));

gulp.task('hosts', gulp.series('adaway', function (done)
{
	require('./script/hosts.gulp.task.js')(done);
}));

gulp.task('all', gulp.series(

	'leechblock',

	'adaway',
	'noscript.untrusted',

	'adblockpopups',
	'adblock',

	'hosts',

	'sass'

, function (done)
{
	done();
}));
