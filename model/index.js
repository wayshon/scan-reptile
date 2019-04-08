const mongoose = require('mongoose');
const { mongo } = require('../config/index');
mongoose.connect(`mongodb://${mongo.username}:${mongo.password}@${mongo.ip}:${mongo.port}/${mongo.db}`);

module.exports = mongoose;
