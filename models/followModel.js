const mongoose = require('mongoose');
const User = require('./usersModel');

const followSchema = new mongoose.Schema(
	{
		createdAt: {
			type: Date,
			default: Date.now(),
		},
		self: {
			type: mongoose.Schema.ObjectId,
			ref: 'User',
			required: [true, 'Must have a self user account'],
		},
		to: {
			type: mongoose.Schema.ObjectId,
			ref: 'User',
			required: [true, 'Must have a to user account'],
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

followSchema.statics.calcFollowing = async function (userProfileId) {
	const stats = await this.aggregate([
		{
			$match: { self: userProfileId._id },
		},
		{
			$group: {
				_id: '$self',
				nFollowing: { $sum: 1 },
			},
		},
	]);

	if (stats.length > 0) {
		await User.findByIdAndUpdate(userProfileId._id, {
			followingNum: stats[0].nFollowing,
		});
	} else {
		await User.findByIdAndUpdate(userProfileId._id, {
			followingNum: 0,
		});
	}
};

followSchema.statics.calcFollowers = async function (userProfileId) {
	const stats = await this.aggregate([
		{
			$match: { to: userProfileId._id },
		},
		{
			$group: {
				_id: '$to',
				nFollowers: { $sum: 1 },
			},
		},
	]);

	if (stats.length > 0) {
		await User.findByIdAndUpdate(userProfileId._id, {
			followersNum: stats[0].nFollowers,
		});
	} else {
		await User.findByIdAndUpdate(userProfileId._id, {
			followersNum: 0,
		});
	}
};

followSchema.post('save', function () {
	this.constructor.calcFollowing(this.self);
	this.constructor.calcFollowers(this.to);
});

followSchema.pre(/^findOneAnd/, async function (next) {
	this.r = await this.findOne();
	next();
});

followSchema.post(/^findOneAnd/, async function () {
	await this.r?.constructor.calcFollowing(this.r.self);
	await this.r?.constructor.calcFollowers(this.r.to);
});

const Follow = mongoose.model('Follow', followSchema);

module.exports = Follow;
