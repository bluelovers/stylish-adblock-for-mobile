/**
 * Created by user on 2017/5/8.
 */

'use strict';

const fs = require('fs');
const glob = require('glob');
const path = require('path');
const Promise = require("bluebird");

const common = require("./lib/common");

const LF = "\n";

const dir = '../src/';

const src_dir = path.resolve(__dirname, dir);
const dist_dir = path.resolve(__dirname, '../dist');
const cwd = path.resolve(__dirname, dir);

module.exports = async (done) =>
{
	//let domains = fs.readFileSync(path.resolve(src_dir, 'leechblock/leechblock.list.txt'));

	let domains = await common.readFileGlobby(["leechblock/**/*.txt"], {
		cwd: cwd,
	});

	domains = array_unique(domains.toString().replace(/^\s*#.*$/mg, '').split(/\r\n|\r|\n/g));

	domains = domains
		.map((v) => v.toString().trim())
		.filter((el, i, arr) => el)
	;

	domains.sort();

	fs.writeFileSync(path.resolve(dist_dir, 'leechblock.list.txt'), domains.join(LF));

	done();
};

/**
 * @see http://www.jstips.co/zh_tw/javascript/deduplicate-an-array/
 */
function array_unique(arr)
{
	return Array.from(new Set(arr));
}
