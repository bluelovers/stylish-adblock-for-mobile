/**
 * Created by user on 2017/4/7.
 */

const fs = require('fs');
const glob = require('glob');
const path = require('path');

const dir = '../src/';

const target_file = path.resolve(__dirname, dir, '_include_site.scss');

const cwd = path.resolve(__dirname, dir);

module.exports = (cb) =>
{
	return glob("site/**/*.scss", {
		cwd: cwd,
	}, function (err, files) {

		let data = '';

		let sites = [];
		let content_farm = [];

		const dirkey_all = '_alldomain';

		let scache = {};
		scache[dirkey_all] = [];

		for (let file of files)
		{
			//let domain = path.basename(file, '.scss');
			let filename = path.basename(file).replace(/[\\\/]/g, '_');
			let domain = path.basename(filename, '.scss');

			let dirkey = path.dirname(file);
			dirkey = dirkey.replace(/^site(\/|$)/, '').replace(/[\-\s]+/g, '_');

			//dirkey = dirkey || '_';

			data += `/* dirkey: ${dirkey} */\n`;
			data += `/* site: ${domain} */\n`;

			if (domain == '_all')
			{
				data += `\$domain_all: '${filename}';\n`;
			}
			else
			{
				sites.push(domain);
			}

			(scache[dirkey_all] = scache[dirkey_all] || [], scache[dirkey_all]).push(domain);

			if (dirkey)
			{
				dirkey = '_include_' + dirkey;

				let a = dirkey.replace(/([_]+)/g, '$1').split(/[\\\/]/);

				if (a.length > 1)
				{
					(scache[dirkey] = scache[dirkey] || [], scache[dirkey]).push(domain);
				}

				(scache[a[0]] = scache[a[0]] || [], scache[a[0]]).push(domain);
			}

			if (/content_farm/.test(file))
			{
				content_farm.push(domain);
			}

			/*
			if (domain == '_all')
			{

			}
			else
			{
				data += `
@-moz-document domain("${domain}")
{
	%ad_${domain}
	{
		@include display-important(none);
	}
}`;
			}
			*/

			data += `\$domain: '${filename}';
@import "${file}";
\n`;
		}

		console.log(scache);

		let data2 = '';

		for (let dirkey in scache)
		{
			let domains = scache[dirkey];

			domains = domains.map((v) =>
			{
				return `domain("${v}")`;
			}, '').join(', ');

			let file = path.resolve(cwd, '_include', `${dirkey}.scss`);

			let _data = `/* ${dirkey} */\n\$domain_${dirkey.replace(/^_+/g, '')}: '${dirkey}';\n\$domain: '${dirkey}';
@-moz-document ${domains}
{
	@include site-init-here($domain, $domain_${dirkey.replace(/^_+/g, '')});
	
	@import "../include/${dirkey}.scss";
}`;

			data2 += `\$domain: '${dirkey}';
@import "_include/${dirkey}.scss";
\n`;

			fs.writeFileSync(file, _data);

			let file2 = path.resolve(cwd, 'include', `${dirkey}.scss`);

			if (!fs.existsSync(file2))
			{
				fs.writeFileSync(file2, '');
			}
		}

		data = `// this file is auto build, don't edit this\n/* sites: ${sites.join(", ")} ... and others.*/\n${data2}\n${data}`;

//		content_farm = content_farm.map((v) =>
//		{
//			return `domain("${v}")`;
//		}, '').join(', ');
//
//		fs.writeFile(path.resolve(cwd, '_include_site_content_farm.scss'), `
///* content_farm */
//\$domain_include_content_farm: 'content_farm';
//\$domain: 'content_farm';
//@-moz-document ${content_farm}
//{
//	@include content-farm-include($domain);
//}
//`, function (err)
//		{
//
//		});

		fs.writeFile(target_file, data, function (err)
		{
			if (typeof cb == 'function')
			{
				cb(err);
			}
			else if (err)
			{
				console.error(err);
			}
			else
			{
				//console.log(target_file, data);
			}
		});
	});
};

