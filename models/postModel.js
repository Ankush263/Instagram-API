const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
	{
		createdAt: {
			type: Date,
			default: Date.now,
		},
		updatedAt: {
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
		location: [
			{
				type: {
					type: String,
					default: 'Point',
					enum: ['Point'],
				},
				coordinates: [Number],
				description: String,
			},
		],
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

postSchema.pre(/^find/, function (next) {
	this.populate({
		path: 'user',
		select: 'avater username',
	});

	next();
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
