const mongoose = require('mongoose');

const postTagSchema = new mongoose.Schema(
	{
		createdAt: {
			type: Date,
			default: Date.now,
		},
		updatedAt: {
			type: Date,
			default: Date.now,
		},
		user: {
			type: mongoose.Schema.ObjectId,
			ref: 'User',
			require: [true, 'Must belongs to a user account'],
		},
		post: {
			type: mongoose.Schema.ObjectId,
			ref: 'Post',
			require: [true, 'Must belongs to a post'],
		},
		x: {
			type: Number,
			require: [true, 'Must have a distance in x axis'],
		},
		y: {
			type: Number,
			require: [true, 'Must have a distance in y axis'],
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

const PostTag = mongoose.model('PostTag', postTagSchema);

module.exports = PostTag;
