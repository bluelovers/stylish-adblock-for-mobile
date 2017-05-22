/**
 * Created by user on 2017/5/8.
 */

'use strict';

const fs = require('fs');
const globby = require('globby');
const path = require('path');
const Promise = require("bluebird");
const LF = "\n";

const self = {

	fs: fs,
	globby: globby,
	path: path,
	Promise: Promise,

	LF: LF,

	/**
	 * @see http://www.jstips.co/zh_tw/javascript/deduplicate-an-array/
	 */
	array_unique(arr)
	{
		return Array.from(new Set(arr));
	},

};

Object.assign(module.exports, self, {

	readFileGlobby: async (a1, options = {}, ...args) =>
	{
		let data = await globby(a1, options).then(files => {
			let source = '';

			for (let file of files)
			{
				source += fs.readFileSync(options.cwd ? path.resolve(options.cwd, file) : file) + "\n";
			}

			return source;
		});

		return data;
	},

	readFileGlobbyList: async (a1, options = {}, ...args) =>
	{
		let data = await globby(a1, options).then(files => {
			let source = {};

			for (let file of files)
			{
				source[file] = fs.readFileSync(options.cwd ? path.resolve(options.cwd, file) : file) + "\n";
			}

			return source;
		});

		return data;
	},

});

Object.assign(global, self);
