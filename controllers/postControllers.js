const Post = require('../models/postModel');
const factory = require('./handleFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/usersModel');

exports.setUser = catchAsync(async (req, res, next) => {
	const userProfile = await User.findById(req.user.id);
	console.log(userProfile);
	if (!userProfile) {
		return next(new AppError(`Please create an account`, 404));
	}
	if (!req.body.user) req.body.user = userProfile;
	next();
});

exports.createPost = factory.createOne(Post);
exports.getAllPost = factory.getAll(Post);
exports.getOnePost = factory.getOne(Post, 'post');
exports.updatePost = factory.updateOne(Post, 'post');
exports.deletePost = factory.deleteOne(Post, 'post');
