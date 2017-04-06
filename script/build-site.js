/**
 * Created by user on 2017/4/7.
 */

const fs = require('fs');
const glob = require('glob');
const path = require('path');

const dir = '../src/';

const target_file = path.resolve(__dirname, dir, '_include_site.scss');

glob("site/*.scss", {
	cwd: path.resolve(__dirname, dir),
}, function (err, files) {

	let data = `// this file is auto build, don't edit this\n/* sites */\n`;

	for (let file of files)
	{
		data += `/* site: ${file} */\n@import "${file}";\n`;
	}

	fs.writeFile(target_file, data, function (err)
	{
		if (err)
		{
			console.error(err);
		}
		else
		{
			//console.log(target_file, data);
		}
	});

});
