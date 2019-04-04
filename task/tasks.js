const schedule = require('node-schedule');
const gameTask = require('./GameTask')

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

module.exports = {
    gameTask,
    scheduleGameTask
};