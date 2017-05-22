/**
 * Created by user on 2017/5/8.
 */

class AdblockParser
{
	constructor(source)
	{
		let r = /^(?:[\|@]+)?(?:https?:\/\/)?([^#\^\?\/\$\|@]*)/;

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
//						case '@':
//							a[line[0]] = a[line[0]] || [];
//
//							if (a[line[0]].indexOf(line) == -1)
//							{
//								a[line[0]].push(line);
//							}
//
//							break;
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

		let data3 = Object.keys(data)
			.sort()
			.reduce(function (a, v)
			{
				let m = v.match(/\.?([^\.]+(?:\.(?:co|com|org|net|edu|gov|mil|nom|[^\.\d]{1,2}))?\.[^\.]+)$/);

				//console.log(v, m);

				if (m && m[1])
				{
					a[m[1]] = a[m[1]] || [];
					a[m[1]][m[1]] = a[m[1]][m[1]] || [];
					a[m[1]][v] = a[m[1]][v] || [];

					a[m[1]][v] = data[v].sort();
				}
				else
				{
					a[v] = a[v] || [];

					a[v] = data[v].sort();
				}

				return a;
			}, {});

		//console.log('data3', data3);

		Object.keys(data3)
			.sort()
			.forEach(function (v, i)
			{
				if (Object.keys(data3[v]).length)
				{
					data2[v] = data3[v];
				}
			});

		//console.log('data2', data2);

		//console.log(data2);
		this.data = data2;
	}

	toArray(mode)
	{

		let fn = (a, domain) =>
		{
			let b = [];

			for (let k in a)
			{
				let v = a[k];

				if (Array.isArray(v))
				{
					//console.log(444, domain, k, (k + 0) != (k + 0));

					if (domain && (k != domain))
					{
						b.push(`!\n! [${k}]\n!`);
					}

					b = b.concat(fn(v, domain))
				}
				else
				{
					if (v[0] == '@')
					{
						b.unshift(v);
					}
					else
					{
						b.push(v);
					}
				}
			}

			return b;
		};

		return Object.keys(this.data)
			.reduce((a, b) =>
			{

				if (Object.keys(this.data[b]).length)
				{
					//console.log(777, b);

					let d = '';

					if (Object.keys(this.data[b]).length != this.data[b].length)
					{
						let a = Object.keys(this.data[b]);
						//a.shift();

						if (a.length > 1)
						{
							d = ' Sites: ' + a.join(', ') + "\n!";

							d = d.replace(/\s+$/g, '');
						}
					}

					a = a.concat([`!\n! [${b}] =============>\n!${d}`], fn(this.data[b], b), [`!\n! ------------------------------------------`]);
				}

				return a;
			}, []);
		;
	}

	toString()
	{
		return this.toArray().join("\n").replace(/(\!\n){2,}/g, "$1");
	}

	static load(source)
	{
		return new AdblockParser(source);
	}
}

module.exports.Parser = AdblockParser;
