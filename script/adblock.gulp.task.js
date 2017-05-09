/**
 * Created by user on 2017/5/8.
 */

'use strict';

const fs = require('fs');
const globby = require('globby');
const path = require('path');
const Promise = require("bluebird");

const Adblock = require("./lib/adblock");

const LF = "\n";

const dir = '../src/';

const src_dir = path.resolve(__dirname, dir);
const dist_dir = path.resolve(__dirname, '../dist');
const cwd = src_dir;

module.exports = async (done) =>
{
	let data = await globby(["adblock/**/*.ini", "adblock/**/*.txt"], {
		cwd: cwd,
	}).then(files => {
		let source = '';

		for (let file of files)
		{
			source += fs.readFileSync(path.resolve(src_dir, file)) + "\n";
		}

		//console.log(source);

		let data = new Adblock.Parser(source);

		return data;
	});

	//console.log(data.toArray());

	let header = `[Adblock Plus 2.0]
!
! Title: Adblock LazyList SC
! Homepage: https://github.com/bluelovers/stylish-adblock-for-mobile/blob/master/dist/adblock.ini
! Install: https://github.com/bluelovers/stylish-adblock-for-mobile/raw/master/dist/adblock.ini
! Expires: 1 days
!
! [Adblock LazyList SC]
! ------------------------------------------`;

	fs.writeFileSync(path.resolve(dist_dir, 'adblock.ini'), `${header}\n${data}\n!\n! [others]\n!\n`);

	done();
};
