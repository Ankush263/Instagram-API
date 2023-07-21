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
		user_id: {
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

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
