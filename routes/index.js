const path = require('path');
const fs = require('fs');
const router = require('koa-router')();

const GameModel = require('../model/game');
const FoodModel = require('../model/food');
const WallpaperModel = require('../model/wallpaper');
const PlantModel = require('../model/plant');
const GirlModel = require('../model/girl');

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
	const currentPage = ctx.query.currentPage ? +ctx.query.currentPage : 1;
	const pageSize = ctx.query.pageSize ? +ctx.query.pageSize : 20;
	const count = (currentPage - 1) * pageSize;

	try {
		const res = await modelPromise(WallpaperModel, {}, null, { limit: pageSize, skip: count });
		ctx.body = {
			code: 200,
			data: res
		};
	} catch (e) {
		ctx.throw(500);
	}
});

router.get('/food', async (ctx, next) => {
	const currentPage = ctx.query.currentPage ? +ctx.query.currentPage : 1;
	const pageSize = ctx.query.pageSize ? +ctx.query.pageSize : 20;
	const count = (currentPage - 1) * pageSize;

	try {
		const res = await modelPromise(FoodModel, {}, null, { limit: pageSize, skip: count });
		ctx.body = {
			code: 200,
			data: res
		};
	} catch (e) {
		ctx.throw(500);
	}
});

router.get('/plant', async (ctx, next) => {
	const currentPage = ctx.query.currentPage ? +ctx.query.currentPage : 1;
	const pageSize = ctx.query.pageSize ? +ctx.query.pageSize : 20;
	const count = (currentPage - 1) * pageSize;

	try {
		const res = await modelPromise(PlantModel, {}, null, { limit: pageSize, skip: count });
		ctx.body = {
			code: 200,
			data: res
		};
	} catch (e) {
		ctx.throw(500);
	}
});

router.get('/girl', async (ctx, next) => {
	const currentPage = ctx.query.currentPage ? +ctx.query.currentPage : 1;
	const pageSize = ctx.query.pageSize ? +ctx.query.pageSize : 20;
	const count = (currentPage - 1) * pageSize;

	try {
		const res = await modelPromise(GirlModel, {}, null, { limit: pageSize, skip: count });
		ctx.body = {
			code: 200,
			data: res
		};
	} catch (e) {
		ctx.throw(500);
	}
});

module.exports = router;
