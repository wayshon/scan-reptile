/**
 * 获取依赖
 * @type {*}
 */
const superagent = require('superagent');
const cheerio = require('cheerio');
const charset = require('superagent-charset');
const PlantModel = require('../model/plant');

charset(superagent); //设置字符
superagent.buffer['text/html'] = true;
/**
 * 定义请求地址
 * @type {*}
 */
// 根路径
const _Host = 'https://www.2717.com';
// 游戏原画
const _Plant = '/zhiwu/';

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
 * 获取详情页面的数据
 */
const fetchDetail = async (url) => {
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
 * 获取详情页图片数组
 */
const parseImages = async (url) => {
	let paths = url.split('/');
	paths.pop();
	const path = paths.join('/');
	let results = [];

	const parse = async (url) => {
		if (!url) return;
		try {
			resText = await fetchDetail(url);
		} catch (e) {
			// console.log(e);
			return;
		}
		const $ = cheerio.load(resText);

		const src = $('#picBody img').attr('src');
		if (src) {
			results.push(src);
		}

		const href = $('#picBody a').attr('href');
		if (href && !/\//.test(href)) {
			try {
				await parse(`${path}/${href}`);
			} catch (e) {
				console.log(e);
			}
		}
	};

	try {
		await parse(url);
	} catch (e) {
		console.log(e);
	}

	return results;
};

/**
 * 插入mongodb
 */
const insertMongo = (data) => {
	let plant = new PlantModel(data);
	plant.save((err, res) => {
		if (err) {
			console.log('insert fail');
		}
		if (res) {
			console.log('insert ok _id : ', res._id);
		}
	});
};

/**
 * 核心业务
 * 解析数据
 */
const plantTask = async () => {
	let resText;
	try {
		resText = await fetchHome(_Plant);
	} catch (e) {
		console.log(e);
		return;
	}

	const $ = cheerio.load(resText);

	const insert = async (lis) => {
		lis.each((i, elem) => {
			const _this = $(elem);
			let item = {
				title: _this.find('span').text(),
				img: _this.find('img').attr('src'),
				images: []
			};

			const href = _this.find('a').attr('href');
			if (href) {
				parseImages(href).then(images => item.images = images).catch(e => console.log(e)).then(() => insertMongo(item));
			} else {
				insertMongo(item);
			}
		});
	};

	insert($('ul.Zw_PicList li'));

	const parseNext = async (url) => {
		let resText;
		try {
			resText = await fetchHome(url);
		} catch (e) {
			console.log(e);
			return;
		}

		insert($('ul.Zw_PicList li'));
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
			while (i < allPages) {
				let url = `${_Plant}${path}_${i}.html`;
				try {
					await parseNext(url);
				} catch (e) {
					console.log(e);
				}
				i++;
			}
		}
	}
};

module.exports = plantTask;
