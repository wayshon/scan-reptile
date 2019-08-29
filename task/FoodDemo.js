const cheerio = require('cheerio');
// const FoodModel = require('../model/food');
const http = require('http');
const url = require('url');

/**
 * 定义请求地址
 * @type {*}
 */
// 根路径
const _Host = 'www.2717.com';
// 食物
const _Food = '/meishitupian/';
// 绝对路径
const _PATH = `https://${_Host}${_Food}`;

/**
 * 发请求，获取首页数据
 */
const fetchHome = async (urlStr) => {

    http.get(`http://${_Host}${_Food}`,(res) => {
        console.log(`状态码: ${res.statusCode}`);
        res.setEncoding('hex');

        let rawData = '';
        res.on('data', (chunk) => { rawData += chunk; });
        res.on('end', () => {
            console.log(rawData)
        });
    }).on('error', (e) => {
        console.error(`出现错误: ${e.message}`);
    });


    // const urlObj = url.parse(urlStr);
    // const { host, protocol, path } = urlObj;
    // return new Promise((resolve, reject) => {
    //     const options = {
    //         hostname: host,
    //         port: /https/.test(protocol) ? 443 : 80,
    //         path: path,
    //         method: 'GET',
    //         timeout: 10000,
    //         headers: {
    //             'Referer': 'https://www.google.com',
    //             'Accept': 'image/webp,image/*,*/*;q=0.8',
    //             'Accept-Encoding': 'gzip, deflate',
    //             'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.93 Safari/537.36',
    //         }
    //     };

    //     const req = http.request(options, (res) => {
    //         console.log(`状态码: ${res.statusCode}`);
    //         console.log(res);
    //         // if (res.headers.location) {
    //         //     console.log(`重定向: ${res.headers.location}`);
    //         //     fetchHome(res.headers.location);
    //         //     return;
    //         // }
    //         // res.setEncoding('utf-8');
    //         res.on('data', (chunk) => {
    //             console.log(`响应主体: ${chunk}`);
    //         });
    //         res.on('end', () => {
    //             console.log('响应中已无数据。');
    //         });
    //     });

    //     req.on('error', (e) => {
    //         console.error(`请求遇到问题: ${e.message}`);
    //     });

    //     req.end();
    // });
};

/**
 * 获取详情页面的数据
 */
const fetchDetail = async (url) => {
    // return new Promise((resolve, reject) => {
    // 	superagent
    // 		.get(`${_Host}${url}`)
    // 		.set('Referer', 'https://www.google.com')
    // 		.set('Accept', 'image/webp,image/*,*/*;q=0.8')
    // 		.set('Accept-Encoding', 'gzip, deflate')
    // 		.set(
    // 			'User-Agent',
    // 			'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.93 Safari/537.36'
    // 		)
    // 		.charset('gbk')
    // 		.end(function (err, res) {
    // 			if (err) {
    // 				reject(err);
    // 			} else {
    // 				resolve(res.text);
    // 			}
    // 		});
    // });
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
            await parse(`${path}/${href}`);
        }
    };

    await parse(url);

    return results;
};

/**
 * 插入mongodb
 */
const insertMongo = (data) => {
    // let food = new FoodModel(data);
    // food.save((err, res) => {
    // 	if (err) {
    // 		console.log('insert fail');
    // 	}
    // 	if (res) {
    // 		console.log('insert ok _id : ', res._id);
    // 	}
    // });
};

/**
 * 核心业务
 * 解析数据
 */
const foodTask = async () => {
    let resText;
    try {
        resText = await fetchHome(_PATH);
    } catch (e) {
        console.log(e);
        return;
    }
    console.log(resText)

    // const $ = cheerio.load(resText);

    // /**
    //  * 遍历首页的内容数组，调用mongo存储
    //  * @param {Documents li} lis 
    //  */
    // const insert = async (lis) => {
    // 	lis.each((i, elem) => {
    // 		const _this = $(elem);
    // 		let item = {
    // 			title: _this.find('a.tit').attr('title'),
    // 			img: _this.find('img').attr('src'),
    // 			images: []
    // 		}

    // 		const href = _this.find('a').attr('href');
    // 		if (href) {
    // 			parseImages(href).then(images => item.images = images).catch(e => console.log(e)).then(() => insertMongo(item));
    // 		} else {
    // 			insertMongo(item);
    // 		}
    // 	});
    // };

    // insert($('div.MeinvTuPianBox li'));

    // const parseNext = async (url) => {
    // 	let resText;
    // 	try {
    // 		resText = await fetchHome(url);
    // 	} catch (e) {
    // 		console.log(e);
    // 		return;
    // 	}

    // 	insert($('div.MeinvTuPianBox li'));
    // };

    // const last = $('div.NewPages a').last();
    // const lastName = last.text();
    // if (lastName === '末页') {
    // 	const lastHref = last.attr('href');
    // 	let allPages, path;
    // 	try {
    // 		let arr = lastHref.split('_');
    // 		allPages = +arr.pop().split('.').shift();
    // 		path = arr.join('_');
    // 	} catch (e) {
    // 		console.log(e);
    // 	}
    // 	if (allPages && path) {
    // 		let i = 2;
    // 		while (i < allPages) {
    // 			let url = `${_Food}${path}_${i}.html`;
    // 			try {
    // 				await parseNext(url);
    // 			} catch (e) {
    // 				console.log(e)
    // 			}
    // 			i++;
    // 		}
    // 	}
    // }
};

module.exports = foodTask;