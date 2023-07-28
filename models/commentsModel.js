const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
	{
		createdAt: {
			type: Date,
			default: Date.now(),
		},
		updatedAt: {
			type: Date,
			default: Date.now(),
		},
		contents: {
			type: String,
			required: [true, 'Comment must have some content'],
		},
		post: {
			type: mongoose.Schema.ObjectId,
			ref: 'Post',
			required: [true, 'Comment must belongs to a post'],
		},
		user: {
			type: mongoose.Schema.ObjectId,
			ref: 'User',
			required: [true, 'Comment must belongs to a user'],
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
