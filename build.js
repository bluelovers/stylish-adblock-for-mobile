#!/usr/bin/env node

'use strict';

const sass = require('node-sass');
const fs = require('fs');

require('./script/build-site.js')();

const scss_filename = 'src/stylish.adblock.mobile.scss';

const options = {
	file: scss_filename,

	includePaths: [
		'src',
	],

	outFile: 'dist/stylish.adblock.mobile.css',
	sourceMap: 'dist/stylish.adblock.mobile.css.map',
	sourceComments: true,

	indentType: "tab",
	indentWidth: 1,

	outputStyle: 'expanded',

};

sass.render(options, function (err, result)
{
	if (!err)
	{
		console.log(result);

		// No errors during the compilation, write this result on the disk
		fs.writeFile(options.outFile, result.css, function (err)
		{
			if (err)
			{
				console.error(err);
			}
			else
			{
				console.log(options.outFile);
			}
		});

		fs.writeFile(options.sourceMap, result.map, function (err)
		{
			if (err)
			{
				console.error(err);
			}
			else
			{
				console.log(options.sourceMap);
			}
		});
	}
	else
	{
		console.error(err, result);
	}
});
