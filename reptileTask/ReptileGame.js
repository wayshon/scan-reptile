/**
 * 获取依赖
 * @type {*}
 */
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
            await parse(`${path}/${href}`);
        }
    };

    await parse(url);
    
    return results;
};

/**
 * 核心业务
 * 解析数据
 */
const parseData = async () => {
	let resText;
	try {
		resText = await fetchHome(_Game);
	} catch (e) {
		console.log(e);
		return;
    }

	// 解析数据
	const $ = cheerio.load(resText);

    let list = [], promiseList = [];

	$('ul.pic_list li').each((i, elem) => {
		const _this = $(elem);
		let item = {
			title: _this.find('span').text(),
            img: _this.find('img').attr('src'),
            images: []
        }

        let p = new Promise(async (resolve, reject) => {
            const href = _this.find('a').attr('href');
            if (href) {
                item.images = await parseImages(href);
                list.push(item)
                resolve()
            } else {
                list.push(item)
                resolve()
            }
        })
        
        promiseList.push(p)
    });

    await Promise.all(promiseList);

	// 生成数据
	// 写入数据, 文件不存在会自动创建
    const reptileDataFolder = path.join(__dirname, '../reptileData');
	if (!fs.existsSync(reptileDataFolder)) {
	    fs.mkdirSync(reptileDataFolder);
    }
    const folder = path.join(reptileDataFolder, 'game');
	if (!fs.existsSync(folder)) {
	    fs.mkdirSync(folder);
	}

	fs.writeFile(folder + '/game.json', JSON.stringify({
	    status: 0,
	    list: list
	}), function (err) {
	    if (err) throw err;
	    console.log('写入完成');
    });
};

module.exports = parseData;
