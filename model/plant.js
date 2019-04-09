const mongoose = require("./index")

const plantSchema = new mongoose.Schema(
	{
		title: { type: String },
		img: { type: String },
		images: [ String ]
	},
	{
		collection: 'plant'
	}
);

module.exports = mongoose.model('Plant', plantSchema);