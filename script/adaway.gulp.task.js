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

const blockip = '0.0.0.0';

module.exports = (done) =>
{
	let domains = fs.readFileSync(path.resolve(dist_dir, 'leechblock.list.txt'));

	domains = domains.toString().split(/\r\n|\r|\n/g);

	let r = /^\s*(?:([^\s+]+)\s+)?(?:[^\s]*\.)?([^\.]+(?:\.(?:co|com|org|net|edu|gov|mil|nom|[^\.\d]{1,2}))?\.[^\.]+)$/;

	{
		let d = domains.reduce((a, line) =>
		{
			let m = line.match(r);

			let ip = m[1];
			let domain = m[2];

			a[domain] = a[domain] || [];

			if (!ip)
			{
				line = `${blockip} ${line}`;
			}

			if (a[domain].indexOf(line) == -1)
			{
				a[domain].push(line);
			}

			return a;

		}, {});

		let data = [];

		for (let k in d)
		{
			if (!d[k].length)
			{
				continue;
			}

			data.push(`\n# [${k}]\n`);

			//console.log(d[k]);

			data = data.concat(d[k]);
		}

		domains = data;
	}

	//domains = domains.map((v) => `127.0.0.1 ${v}`);

	fs.writeFileSync(path.resolve(dist_dir, 'adaway.hosts.txt'), `# ======== AdAway Lazy blocklist ========\n# =================================\n\n${domains.join(LF)}\n`.replace(/\n{3,}/g, "\n\n"));

	done();
};
