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
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

const Post = mongoose.model('Post', postTagSchema);

module.exports = Post;
