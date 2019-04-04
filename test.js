const fs = require('fs');
const path = require('path');
const superagent = require('superagent');
const cheerio = require('cheerio');
const charset = require('superagent-charset');
charset(superagent); //设置字符
superagent.buffer['text/html'] = true;
/**
 * 定义请求地址
 * @type {*}
 */
// 根路径
const _Host = 'https://www.2717.com';
// 游戏原画
const _Game = '/game/youxijietu/';

/**
 * 发请求，获取首页数据
 */
const fetchHome = async (url) => {
	return new Promise((resolve, reject) => {
		superagent
			.get(`${_Host}${url}`)
			.set('Referer', 'https://www.google.com')
			.set('Accept', 'image/webp,image/*,*/*;q=0.8')
			.set('Accept-Encoding', 'gzip, deflate')
			.set(
				'User-Agent',
				'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.93 Safari/537.36'
			)
			.charset('gbk')
			.end(function(err, res) {
				if (err) {
					reject(err);
				} else {
					resolve(res.text);
				}
			});
	});
};

/**
 * 核心业务
 * 解析数据
 */
const gameTask = async () => {
	let resText;
	try {
		resText = await fetchHome(_Game);
	} catch (e) {
		console.log(e);
		return;
	}

	const $ = cheerio.load(resText);

	let list = [],
		promiseList = [];

	const insert = async (lis) => {
		lis.each((i, elem) => {
			const _this = $(elem);
			let item = {
				title: _this.find('span').text(),
				img: _this.find('img').attr('src'),
				images: []
			};

			let p = new Promise(async (resolve, reject) => {
				const href = _this.find('a').attr('href');
				if (href) {
					item.images = await parseImages(href);
					list.push(item);
					resolve();
				} else {
					list.push(item);
					resolve();
				}
			});

			promiseList.push(p);
		});
	};

	insert($('ul.pic_list li'));

	const parseNext = async (url) => {
		let resText;
		try {
			resText = await fetchHome(url);
		} catch (e) {
			console.log(e);
			return;
        }
        
        insert($('ul.pic_list li'));
	};

	const last = $('div.NewPages a').last();
	const lastName = last.text();
	if (lastName === '末页') {
		const lastHref = last.attr('href');
		let allPages, path;
		try {
			let arr = lastHref.split('_');
			allPages = +arr.pop().split('.').shift();
			path = arr.join('_');
		} catch (e) {
			console.log(e);
		}
		if (allPages && path) {
            let i = 2;
            while(i < allPages) {
                let url = `${_Game}${path}_${i}.html`;
                parseNext(url);
                i++;
            }
		}
	}

    await Promise.all(promiseList);
    
    console.log(list.length)

	// fs.writeFile(path.join(__dirname, 'test.json'), JSON.stringify({
	//     data: list
	// }), function (err) {
	//     if (err) throw err;
	//     console.log('写入完成');
	// });
};

module.exports = gameTask;