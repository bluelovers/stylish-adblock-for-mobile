/**
 * Created by user on 2017/4/7.
 */

const fs = require('fs');
const glob = require('glob');
const path = require('path');

const dir = '../src/';

const target_file = path.resolve(__dirname, dir, '_include_site.scss');

module.exports = (cb) =>
{
	return glob("site/**/*.scss", {
		cwd: path.resolve(__dirname, dir),
	}, function (err, files) {

		let data = '';

		let sites = [];
		let content_farm = [];

		for (let file of files)
		{
			//let domain = path.basename(file, '.scss');
			let filename = path.basename(file).replace(/[\\\/]/g, '_');
			let domain = path.basename(filename, '.scss');

			data += `/* site: ${domain} */\n`;

			if (domain == '_all')
			{
				data += `\$domain_all: '${filename}';\n`;
			}
			else
			{
				sites.push(domain);
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

		data = `// this file is auto build, don't edit this\n/* sites: ${sites.join(", ")} ... and others.*/\n${data}`;


		content_farm = content_farm.map((v) =>
		{
			return `domain("${v}")`;
		}, '').join(', ');

		fs.writeFile(path.resolve(__dirname, dir, '_include_site_content_farm.scss'), `
/* content_farm */
\$domain_content_farm: 'content_farm';
\$domain: 'content_farm';
@-moz-document ${content_farm}
{
	@include content-farm-include($domain);
}
`, function (err)
		{

		});

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

