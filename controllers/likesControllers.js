const Like = require('../models/likesModel');
const factory = require('./handleFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/usersModel');
const client = require('../redis/client');
const { postKey, allPostKey } = require('../redis/utils/keys');

exports.setUser = catchAsync(async (req, res, next) => {
	const userProfile = await User.findById(req.user.id);
	if (!userProfile) {
		return next(new AppError(`Please create an account`, 404));
	}
	if (!req.body.user) req.body.user = userProfile;
	next();
});

exports.check = catchAsync(async (req, res, next) => {
	const existingLike = await Like.findOne({
		user: req.user.id,
		post: req.body.post,
	});
	if (existingLike) {
		return next(new AppError('You already liked this post', 404));
	}
	next();
});

exports.deleteLike = catchAsync(async (req, res, next) => {
	const like = await Like.findById(req.params.id);
	if (!like) {
		return next(new AppError('No document found with that Id', 404));
	}

	await client.HDEL(allPostKey(), postKey(like.post));
	const doc = await Like.findByIdAndDelete(req.params.id);
	res.status(204).json({
		status: 'success',
		data: null,
	});
});

exports.createLikes = factory.createOne(Like);
