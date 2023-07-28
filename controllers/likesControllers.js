const Like = require('../models/likesModel');
const factory = require('./handleFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/usersModel');

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

exports.createLikes = factory.createOne(Like);
exports.deleteLike = factory.deleteOne(Like);
