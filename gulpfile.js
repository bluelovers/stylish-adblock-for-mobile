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

gulp.task('sass', function ()
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
