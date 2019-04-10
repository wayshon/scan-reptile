const mongoose = require("./index")

const girlSchema = new mongoose.Schema(
	{
		title: { type: String },
		img: { type: String },
		images: [ String ]
	},
	{
		collection: 'girl'
	}
);

module.exports = mongoose.model('Girl', girlSchema);