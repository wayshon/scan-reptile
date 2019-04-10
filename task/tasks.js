const schedule = require('node-schedule');
const gameTask = require('./GameTask');
const wallpaperTask = require('./WallpaperTask');
const foodTask = require('./FoodTask');
const plantTask = require('./PlantTask');
const girlTask = require('./GirlTask');

const scheduleGameTask = () => {
    // 每 周1 的 3 时 1 分 1 秒触发
    schedule.scheduleJob('1 1 3 * * 1', function () {
        try {
            gameTask()
        } catch (e) {
            console.log(e)
        }
    });
}

const scheduleWallpaperTask = () => {
    // 每 周2 的 3 时 1 分 1 秒触发
    schedule.scheduleJob('1 1 3 * * 2', function () {
        try {
            wallpaperTask()
        } catch (e) {
            console.log(e)
        }
    });
}

const scheduleFoodTask = () => {
    // 每 周3 的 3 时 1 分 1 秒触发
    schedule.scheduleJob('1 1 3 * * 3', function () {
        try {
            foodTask()
        } catch (e) {
            console.log(e)
        }
    });
}

const schedulePlantTask = () => {
    // 每 周4 的 3 时 1 分 1 秒触发
    schedule.scheduleJob('1 1 3 * * 4', function () {
        try {
            plantTask()
        } catch (e) {
            console.log(e)
        }
    });
}

const scheduleGirlTask = () => {
    // 每 周5 的 3 时 1 分 1 秒触发
    schedule.scheduleJob('1 1 3 * * 5', function () {
        try {
            girlTask()
        } catch (e) {
            console.log(e)
        }
    });
}

module.exports = {
    gameTask,
    scheduleGameTask,
    wallpaperTask,
    scheduleWallpaperTask,
    foodTask,
    scheduleFoodTask,
    plantTask,
    schedulePlantTask,
    girlTask,
    scheduleGirlTask
};