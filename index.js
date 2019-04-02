/**
 * 获取依赖
 * @type {*}
 */
const superagent = require('superagent');
const cheerio = require('cheerio');
const fs = require('fs');
const charset = require("superagent-charset");
charset(superagent); //设置字符
/**
 * 定义请求地址
 * @type {*}
 */
// 根路径
const Host = "https://www.2717.com";
// 游戏原画
const Game = "/game/youxijietu/";

/**
 * 核心业务
 * 发请求，解析数据，生成数据
 */
superagent.get(`${Host}${Game}`)
    .set('Referer', 'https://www.google.com')
    .set('Accept', 'image/webp,image/*,*/*;q=0.8')
    .set('Accept-Encoding', 'gzip, deflate')
    .set('User-Agent', 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.93 Safari/537.36')
    .charset('gbk')
    .end(function (err, res) {
        
        // 抛错拦截
        if (err) {
            throw Error(err);
            return;
        }
        // 解析数据
        const $ = cheerio.load(res.text);

        let list = [];

        $('ul.pic_list li').each((i, elem) => {
            const _this = $(elem);
            const item = {
                title: _this.find('span').text(),
                img: _this.find('img').attr('src'),
                href: `${Host}${_this.find('a').attr('href')}`
            }
            list.push(item)
        });

        // 生成数据
        // 写入数据, 文件不存在会自动创建
        let folder = __dirname + '/list';
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder);
        }

        fs.writeFile(folder + '/list.json', JSON.stringify({
            status: 0,
            list: list
        }), function (err) {
            if (err) throw err;
            console.log('写入完成');
        });
    });