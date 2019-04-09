const mongoose = require("./index")

const wallpaperSchema = new mongoose.Schema(
	{
		title: { type: String },
		img: { type: String },
		images: [ String ]
	},
	{
		collection: 'wallpaper'
	}
);

module.exports = mongoose.model('Wallpaper', wallpaperSchema);