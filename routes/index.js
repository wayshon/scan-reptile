const path = require('path');
const fs = require('fs');
const router = require('koa-router')();

const resultPath = path.join(__dirname, '../reptileData/game/game.json');

router.get('/', async (ctx, next) => {
	await ctx.render('index', {
		msg: 'Hello!'
	});
});

router.get('/game', async (ctx, next) => {
	try {
		const jsonFile = fs.readFileSync(resultPath);
	    const result = JSON.parse(jsonFile);
		if (result && Array.isArray(result.data) && result.data.length > 0) {
            ctx.body = {
				code: 200,
				data: result.data
            };
		} else {
			throw new TypeError('result error');
		}
	} catch (e) {
		console.log(e);
		ctx.throw(500);
	}
});

module.exports = router;
