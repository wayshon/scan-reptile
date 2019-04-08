const mongoose = require('mongoose');
const { mongo } = require('../config/index');
mongoose.connect(`mongodb://${mongo.username}:${mongo.password}@${mongo.ip}:${mongo.port}/${mongo.db}`, { useNewUrlParser: true });

mongoose.connection.on('error', () => console.error('连接数据库失败'));
mongoose.connection.once('open',()=>{
    console.log('成功连接')
})
module.exports = mongoose;
