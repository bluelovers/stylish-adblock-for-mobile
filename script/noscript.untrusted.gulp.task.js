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

	{
		let untrusted = fs.readFileSync(path.resolve(src_dir, 'noscript/noscript.untrusted.txt'));

		untrusted = untrusted.toString().split(/\r\n|\r|\n|\s+/g);

		domains = domains.concat(untrusted);

		domains = array_unique(domains);

		domains = domains.filter((v) => {
			return !!v;
		});
	}

	fs.writeFileSync(path.resolve(dist_dir, 'noscript.untrusted.txt'), domains.join(' ').trim());

	done();
};

/**
 * @see http://www.jstips.co/zh_tw/javascript/deduplicate-an-array/
 */
function array_unique(arr)
{
	return Array.from(new Set(arr));
}
