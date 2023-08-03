const mongoose = require('mongoose');

const reelSchema = new mongoose.Schema(
	{
		createdAt: {
			type: Date,
			default: Date.now,
		},
		url: {
			type: String,
			required: [true, 'Must provide a post url'],
		},
		user: {
			type: mongoose.Schema.ObjectId,
			ref: 'User',
		},
		caption: {
			type: String,
		},
		likesNum: {
			type: Number,
			default: 0,
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

reelSchema.pre(/^find/, function (next) {
	this.populate({
		path: 'user',
		select: 'avater username',
	});

	next();
});

reelSchema.virtual('comments', {
	ref: 'Comment',
	foreignField: 'reel',
	localField: '_id',
});

reelSchema.virtual('likes', {
	ref: 'Like',
	foreignField: 'reel',
	localField: '_id',
});

const Reel = mongoose.model('Reel', reelSchema);

module.exports = Reel;
