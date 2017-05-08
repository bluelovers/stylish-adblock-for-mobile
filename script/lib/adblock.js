/**
 * Created by user on 2017/5/8.
 */

class AdblockParser
{
	constructor(source)
	{
		let r = /^(?:\|+)?([^#\^\?\/\$]*)/;

		let data = (Array.isArray(source) ? source : source.toString().split(/\r\n|\r|\n/g))
			.reduce((a, b) =>
			{
				let line = b.toString().trim();

				if (line)
				{
					switch (line[0])
					{
						case '[':
						case '!':
							break;
						case '@':
							a[line[0]] = a[line[0]] || [];

							if (a[line[0]].indexOf(line) == -1)
							{
								a[line[0]].push(line);
							}

							break;
						default:
							let m = line.match(r);

							let domain = m[1];

							a[domain] = a[domain] || [];

							if (a[domain].indexOf(line) == -1)
							{
								a[domain].push(line);
							}

							break;
					}
				}

				return a;
			}, {})
		;

		let data2 = {
			'@': [],
			'': [],
		};

		Object.keys(data)
			.sort()
			.forEach(function (v, i)
			{
				data2[v] = data[v];
			});

		//console.log(data2);
		this.data = data2;
	}

	toArray()
	{
		return Object.keys(this.data)
			.reduce((a, b) => {

				if (this.data[b].length)
				{
					a = a.concat([`!\n! [${b}]\n!`], this.data[b]);
				}

				return a;
			}, []);
		;
	}

	toString()
	{
		return this.toArray().join("\n");
		;
	}

	static load(source)
	{
		return new AdblockParser(source);
	}
}

module.exports.Parser = AdblockParser;
