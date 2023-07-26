const mongoose = require('mongoose');
const User = require('./usersModel');

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

postSchema.statics.calcPostNumber = async function (userProfileId) {
	const stats = await this.aggregate([
		{
			$match: { user: userProfileId._id },
		},
		{
			$group: {
				_id: '$user',
				nPost: { $sum: 1 },
			},
		},
	]);

	if (stats.length > 0) {
		await User.findByIdAndUpdate(userProfileId._id, {
			postNum: stats[0].nPost,
		});
	} else {
		await User.findByIdAndUpdate(userProfileId._id, {
			postNum: 0,
		});
	}
};

postSchema.post('save', function () {
	this.constructor.calcPostNumber(this.user);
});

postSchema.pre(/^findOneAnd/, async function (next) {
	this.r = await this.findOne();
	next();
});

postSchema.post(/^findOneAnd/, async function () {
	await this.r.constructor.calcPostNumber(this.r.user);
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
