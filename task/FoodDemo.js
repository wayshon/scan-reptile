const cheerio = require('cheerio');
// const FoodModel = require('../model/food');
const http = require('https');
const url = require('url');
const iconv = require('iconv-lite');

/**
 * 定义请求地址
 * @type {*}
 */
// 根路径
const _Host = 'https://www.2717.com';
// 食物
const _Food = '/meishitupian/';

/**
 * 发请求，获取首页数据
 */
const fetchHome = async (urlStr) => {
    // const urlObj = url.parse(urlStr);
    // const { host, path } = urlObj;
    // http
    // .request({
    //     url: urlStr,
    //     hostname: host,
    //     port: 443,
    //     path: path,
    //     method: 'GET',
    //     headers: {
    //         'Referer': 'https://www.google.com',
    //         'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.93 Safari/537.36',
    //     }
    // }, (res) => {
    //     console.log(`状态码: ${res.statusCode}`);
    //     // res.setEncoding('hex');

    //     let rawData = '';
    //     res.on('data', (chunk) => { rawData += chunk; });
    //     res.on('end', () => {
    //         const buffer = Buffer.from(rawData);
    //         const result = iconv.decode(buffer, 'gb2312');
    //         console.log(result)
    //     });
    // }).on('error', (e) => {
    //     console.error(`出现错误: ${e.message}`);
    // }).end();

    return new Promise((resolve, reject) => {
        http.get(urlStr, (res) => {
            console.log(`状态码: ${res.statusCode}`);
            // res.setEncoding('hex');
    
            let rawData = '';
            res.on('data', (chunk) => { rawData += chunk; });
            res.on('end', () => {
                const buffer = Buffer.from(rawData);
                const result = iconv.decode(buffer, 'gb2312');
                resolve(result);
            });
        }).on('error', (e) => {
            reject(e)
        });
    });
};

/**
 * 获取详情页面的数据
 */
const fetchDetail = async (url) => {
    return new Promise((resolve, reject) => {
        http.get(`${_Host}${url}`, (res) => {
            let rawData = '';
            res.on('data', (chunk) => { rawData += chunk; });
            res.on('end', () => {
                const buffer = Buffer.from(rawData);
                const result = iconv.decode(buffer, 'gb2312');
                resolve(result);
            });
        }).on('error', (e) => {
            reject(e)
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
    console.log('insert ================================= ', data);
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
        resText = await fetchHome(`${_Host}${_Food}`);
    } catch (e) {
        console.log(e);
        return;
    }

    const $ = cheerio.load(resText);

    /**
     * 遍历首页的内容数组，调用mongo存储
     * @param {Documents li} lis 
     */
    const insert = async (lis) => {
    	lis.each((i, elem) => {
    		const _this = $(elem);
    		let item = {
    			title: _this.find('a.tit').attr('title'),
    			img: _this.find('img').attr('src'),
    			images: []
    		}

    		const href = _this.find('a').attr('href');
    		if (href) {
    			parseImages(href).then(images => item.images = images).catch(e => console.log(e)).then(() => insertMongo(item));
    		} else {
    			insertMongo(item);
    		}
    	});
    };

    insert($('div.MeinvTuPianBox li'));

    const parseNext = async (url) => {
    	let resText;
    	try {
    		resText = await fetchHome(`${_Host}${url}`);
    	} catch (e) {
    		console.log(e);
    		return;
    	}

    	insert($('div.MeinvTuPianBox li'));
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
    			let url = `${_Food}${path}_${i}.html`;
    			try {
    				await parseNext(url);
    			} catch (e) {
    				console.log(e)
    			}
    			i++;
    		}
    	}
    }
};

module.exports = foodTask;