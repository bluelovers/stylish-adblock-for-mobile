/**
 * Created by user on 2017/5/8.
 */

'use strict';

const fs = require('fs');
const glob = require('glob');
const path = require('path');
const Promise = require("bluebird");

const LF = "\n";

const common = require("./lib/common");

const dir = '../src/';

const src_dir = path.resolve(__dirname, dir);
const dist_dir = path.resolve(__dirname, '../dist');
const cwd = path.resolve(__dirname, dir);

const blockip = '0.0.0.0';

module.exports = async (done) =>
{
	//let domains = fs.readFileSync(path.resolve(dist_dir, 'leechblock.list.txt'));

	let domains = await common.readFileGlobbyList(["hosts/**/*.txt"], {
		cwd: cwd,
	});

	let r = /^\s*(?:([^\s+]+)\s+)?((?:[^\s]*\.)?([^\.]+(?:\.(?:co|com|org|net|edu|gov|mil|nom|cn|tw|[^\.\d]{1,2}))?\.[^\.]+))$/;
	//let r = /^\s*(?:([^\s+]+)\s+)?((?:[^\s]*\.)?[^\.]+(?:\.(?:co|com|org|net|edu|gov|mil|nom|[^\.\d]{1,2}))?\.[^\.]+)$/;

	let data = [];

	for (let file in domains)
	{
		domains[file] = array_unique(domains[file].toString().replace(/^\s*(#.*)?$/mg, '').split(/\r\n|\r|\n/g));

		if (!domains[file] || !domains[file].length)
		{
			continue;
		}

		let f = path.basename(file, '.txt');

		let d = domains[file].sort().reduce((a, line) =>
		{
			if (line)
			{
				let m = line.match(r);
				let ip;
				let domain, host;

				if (m)
				{
					ip = m[1];
					host = m[2];
					domain = m[3];
				}

				a[f] = a[f] || [];

				//line = `${ip} ${domain}`;

				if (!ip)
				{
					line = `${blockip} ${line}`;
				}
				else if (ip == '127.0.0.1' || ip == '0.0.0.0')
				{
					ip = blockip;

					line = `${ip} ${host}`;
				}

				console.log(m, line, ip, domain);

				if (a[f].indexOf(line) == -1)
				{
					a[f].push(line);
				}
			}

			return a;

		}, {});

		//let data = [];

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

		//data2 = data2.concat(data);
	}

	//domains = domains.map((v) => `127.0.0.1 ${v}`);

	let header = `# Copyright (c) 1993-2009 Microsoft Corp.
#
# This is a sample HOSTS file used by Microsoft TCP/IP for Windows.
#
# This file contains the mappings of IP addresses to host names. Each
# entry should be kept on an individual line. The IP address should
# be placed in the first column followed by the corresponding host name.
# The IP address and the host name should be separated by at least one
# space.
#
# Additionally, comments (such as these) may be inserted on individual
# lines or following the machine name denoted by a '#' symbol.
#
# For example:
#
#      102.54.94.97     rhino.acme.com          # source server
#       38.25.63.10     x.acme.com              # x client host

# localhost name resolution is handled within DNS itself.
#	127.0.0.1       localhost
#	::1             localhost
`;

	try
	{
		fs.mkdirSync(path.resolve(dist_dir, 'hosts'));
	}
	catch (e)
	{}

	let hosts = `# ======== Lazy HOSTS file ========\n# =================================\n\n${data.join(LF)}\n`;

	fs.writeFileSync(path.resolve(dist_dir, 'hosts', 'hosts.txt'), `${header}\n${hosts}`.replace(/\n{3,}/g, "\n\n"));
	fs.writeFileSync(path.resolve(dist_dir, 'hosts', 'hosts.source.txt'), hosts.replace(/\n{3,}/g, "\n\n"));

	let adaway = fs.readFileSync(path.resolve(dist_dir, 'adaway.hosts.txt'));

	fs.writeFileSync(path.resolve(dist_dir, 'hosts', 'hosts.adaway.txt'), `${header}\n${adaway}\n${hosts}`.replace(/\n{3,}/g, "\n\n"));

	done();
};
