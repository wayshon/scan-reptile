const path = require('path');
const fs = require('fs');
const router = require('koa-router')();

const GameModel = require('../model/game');

const modelPromise = (Model, ...params) => {
	return new Promise((resolve, reject) => {
		Model.find(...params, (err, res) => {
			if (err) {
				reject(err);
			} else {
				resolve(res);
			}
		});
	})
}

router.get('/', async (ctx, next) => {
	await ctx.render('index', {
		msg: 'Hello!'
	});
});

router.get('/game', async (ctx, next) => {
	const currentPage = ctx.query.currentPage ? +ctx.query.currentPage : 1;
	const pageSize = ctx.query.pageSize ? +ctx.query.pageSize : 20;
	const count = (currentPage - 1) * pageSize;

	try {
		const res = await modelPromise(GameModel, {}, null, { limit: pageSize, skip: count });
		ctx.body = {
			code: 200,
			data: res
		};
	} catch (e) {
		ctx.throw(500);
	}
});

router.get('/wallpaper', async (ctx, next) => {
	GameModel.find({}, (err, res) => {
		if (err) {
			ctx.throw(500);
		} else if (res) {
			ctx.body = {
				code: 200,
				data: res
			};
		}
	});
});

router.get('/food', async (ctx, next) => {
	GameModel.find({}, (err, res) => {
		if (err) {
			ctx.throw(500);
		} else if (res) {
			ctx.body = {
				code: 200,
				data: res
			};
		}
	});
});

router.get('/plant', async (ctx, next) => {
	GameModel.find({}, (err, res) => {
		if (err) {
			ctx.throw(500);
		} else if (res) {
			ctx.body = {
				code: 200,
				data: res
			};
		}
	});
});

module.exports = router;
