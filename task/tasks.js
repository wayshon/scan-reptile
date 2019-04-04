const schedule = require('node-schedule');
const gameTask = require('./GameTask');
const wallpaperTask = require('./WallpaperTask');
const foodTask = require('./FoodTask');

const scheduleGameTask = () => {
    // 每小时的 1 分 1 秒触发
    schedule.scheduleJob('1 1 * * * *', function () {
        try {
            gameTask()
        } catch (e) {
            console.log(e)
        }
    });
}

const scheduleWallpaperTask = () => {
    // 每小时的 10 分 1 秒触发
    schedule.scheduleJob('1 10 * * * *', function () {
        try {
            wallpaperTask()
        } catch (e) {
            console.log(e)
        }
    });
}

const scheduleFoodTask = () => {
    // 每小时的 20 分 1 秒触发
    schedule.scheduleJob('1 20 * * * *', function () {
        try {
            foodTask()
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
    scheduleFoodTask
};