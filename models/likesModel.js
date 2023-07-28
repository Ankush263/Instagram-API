const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema(
	{
		createdAt: {
			type: Date,
			default: Date.now(),
		},
		post: {
			type: mongoose.Schema.ObjectId,
			ref: 'Post',
			required: [true, 'likes must belongs to a post'],
		},
		user: {
			type: mongoose.Schema.ObjectId,
			ref: 'User',
			required: [true, 'likes must belongs to a user'],
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;
