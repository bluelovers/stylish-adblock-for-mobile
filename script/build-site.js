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
	return glob("site/*.scss", {
		cwd: path.resolve(__dirname, dir),
	}, function (err, files) {

		let data = '';

		let sites = [];

		for (let file of files)
		{
			//let domain = path.basename(file, '.scss');
			let filename = path.basename(file);
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

		data = `// this file is auto build, don't edit this\n/* sites: ${sites.join(", ")} */\n${data}`;

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

