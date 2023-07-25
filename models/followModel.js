const mongoose = require('mongoose');

const followSchema = new mongoose.Schema(
	{
		createdAt: {
			type: Date,
			default: Date.now(),
		},
		self: {
			type: mongoose.Schema.ObjectId,
			ref: 'User',
			require: [true, 'Must have a self user account'],
		},
		to: {
			type: mongoose.Schema.ObjectId,
			ref: 'User',
			require: [true, 'Must have a to user account'],
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

const Follow = mongoose.model('Follow', followSchema);

module.exports = Follow;
