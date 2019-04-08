const mongoose = require("./index")

const gameSchema = new mongoose.Schema(
	{
		title: { type: String },
		img: { type: String },
		images: [ String ]
	},
	{
		collection: 'game'
	}
);

module.exports = mongoose.model('Game', gameSchema);