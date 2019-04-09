const mongoose = require("./index")

const foodSchema = new mongoose.Schema(
	{
		title: { type: String },
		img: { type: String },
		images: [ String ]
	},
	{
		collection: 'food'
	}
);

module.exports = mongoose.model('Food', foodSchema);