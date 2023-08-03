const mongoose = require('mongoose');
const Post = require('./postModel');
const Story = require('./storyModel');
const Reel = require('./reelModel');

const likeSchema = new mongoose.Schema(
	{
		createdAt: {
			type: Date,
			default: Date.now(),
		},
		post: {
			type: mongoose.Schema.ObjectId,
			ref: 'Post',
		},
		story: {
			type: mongoose.Schema.ObjectId,
			ref: 'Story',
		},
		reel: {
			type: mongoose.Schema.ObjectId,
			ref: 'Reel',
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

likeSchema.statics.calcLikesNumber = async function (postId) {
	const stats = await this.aggregate([
		{
			$match: { post: postId?._id },
		},
		{
			$group: {
				_id: '$post',
				nLikes: { $sum: 1 },
			},
		},
	]);

	if (stats.length > 0) {
		await Post.findByIdAndUpdate(postId?._id, {
			likesNum: stats[0].nLikes,
		});
	} else {
		await Post.findByIdAndUpdate(postId?._id, {
			likesNum: 0,
		});
	}
};

likeSchema.statics.calcLikesNumberOfStory = async function (storyId) {
	const stats = await this.aggregate([
		{
			$match: { story: storyId?._id },
		},
		{
			$group: {
				_id: '$story',
				nLikes: { $sum: 1 },
			},
		},
	]);

	if (stats.length > 0) {
		await Story.findByIdAndUpdate(storyId?._id, {
			likesNum: stats[0].nLikes,
		});
	} else {
		await Story.findByIdAndUpdate(storyId?._id, {
			likesNum: 0,
		});
	}
};

likeSchema.statics.calcLikesNumberOfReels = async function (reelId) {
	const stats = await this.aggregate([
		{
			$match: { reel: reelId?._id },
		},
		{
			$group: {
				_id: '$reel',
				nLikes: { $sum: 1 },
			},
		},
	]);

	if (stats.length > 0) {
		await Reel.findByIdAndUpdate(reelId?._id, {
			likesNum: stats[0].nLikes,
		});
	} else {
		await Reel.findByIdAndUpdate(reelId?._id, {
			likesNum: 0,
		});
	}
};

likeSchema.post('save', function () {
	this.constructor.calcLikesNumber(this.post);
	this.constructor.calcLikesNumberOfStory(this.story);
	this.constructor.calcLikesNumberOfReels(this.reel);
});

likeSchema.pre(/^findOneAnd/, async function (next) {
	this.r = await this.findOne();
	next();
});

likeSchema.post(/^findOneAnd/, async function () {
	await this.r?.constructor.calcLikesNumber(this.r.post);
	await this.r?.constructor.calcLikesNumberOfStory(this.r.story);
	await this.r?.constructor.calcLikesNumberOfReels(this.r.reel);
});

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;
