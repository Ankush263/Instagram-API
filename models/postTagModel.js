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
			required: [true, 'Must belongs to a user account'],
		},
		post: {
			type: mongoose.Schema.ObjectId,
			ref: 'Post',
			required: [true, 'Must belongs to a post'],
		},
		taggedPerson: {
			type: mongoose.Schema.ObjectId,
			ref: 'User',
			required: [true, 'Must have a tagged person'],
		},
		x: {
			type: Number,
			required: [true, 'Must have a distance in x axis'],
		},
		y: {
			type: Number,
			required: [true, 'Must have a distance in y axis'],
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

const PostTag = mongoose.model('PostTag', postTagSchema);

module.exports = PostTag;
