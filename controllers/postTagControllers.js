const PostTag = require('../models/postTagModel');
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

exports.checkOwner = catchAsync(async (req, res, next) => {
	const post = await PostTag.findById(req.params.id);
	if (post.user.id !== req.user.id) {
		return next(new AppError(`You are not owner of this post`, 404));
	}
	next();
});

exports.createPostTag = factory.createOne(PostTag);
exports.getAllPostTag = factory.getAll(PostTag);
exports.deletePostTag = factory.deleteOne(PostTag);
