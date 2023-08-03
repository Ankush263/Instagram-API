const Post = require('../models/postModel');
const factory = require('./handleFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/usersModel');
const Reel = require('../models/reelModel');

exports.setUser = catchAsync(async (req, res, next) => {
	const userProfile = await User.findById(req.user.id);
	if (!userProfile) {
		return next(new AppError(`Please create an account`, 404));
	}
	if (!req.body.user) req.body.user = userProfile;
	next();
});

exports.checkOwner = catchAsync(async (req, res, next) => {
	const post = await Post.findById(req.params.id);
	if (post.user.id !== req.user.id) {
		return next(new AppError(`You are not owner of this post`, 404));
	}
	next();
});

exports.getAllpostAndReels = catchAsync(async (req, res, next) => {
	const post = await Post.find().select('url -user');
	const reel = await Reel.find().select('url -user');

	const allData = [];
	allData.push(post, reel);

	res.status(200).json({
		status: 'success',
		data: {
			data: allData,
		},
	});
});

exports.getAllMyPosts = catchAsync(async (req, res, next) => {
	const allMyPosts = await Post.find({ user: req.user.id });
	res.status(200).json({
		status: 'success',
		data: {
			data: allMyPosts,
		},
	});
});

exports.getPostsByUsers = catchAsync(async (req, res, next) => {
	const posts = await Post.find({ user: req.params.userId });

	res.status(201).json({
		status: 'success',
		data: {
			data: posts,
		},
	});
});

exports.createPost = factory.createOne(Post);
exports.getAllPost = factory.getAll(Post);
exports.getOnePost = factory.getOne(Post, { path: 'tags comments likes' });
exports.updatePost = factory.updateOne(Post);
exports.deletePost = factory.deleteOne(Post);
