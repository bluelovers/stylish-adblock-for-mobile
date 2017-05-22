/**
 * Created by user on 2017/5/8.
 */

'use strict';

const fs = require('fs');
const glob = require('glob');
const path = require('path');
const Promise = require("bluebird");

const LF = "\n";

const dir = '../src/';

const src_dir = path.resolve(__dirname, dir);
const dist_dir = path.resolve(__dirname, '../dist');
const cwd = path.resolve(__dirname, dir);

module.exports = (done) =>
{
	let domains = fs.readFileSync(path.resolve(dist_dir, 'leechblock.list.txt'));

	domains = domains.toString().split(/\r\n|\r|\n/g);

	let data1 = domains.map((v) => `${v};1;BLOCK;WINDOWS,TABS,ALERTS;0`);

	try
	{
		fs.mkdirSync(path.resolve(dist_dir, 'adblockpopups'));
	}
	catch (e)
	{}

	fs.writeFileSync(path.resolve(dist_dir, 'adblockpopups/adblockpopups.ini'), `[Adblock Plus Pop-up Addon]\n${data1.join(LF)}\n`);

	done();
};
