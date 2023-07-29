const Comment = require('../models/commentsModel');
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

exports.updateComment = catchAsync(async (req, res, next) => {
	const doc = await Comment.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	if (!doc) {
		return next(new AppError('No document found with that Id', 404));
	}
	const comment = await Comment.findById(req.params.id);
	await client.HDEL(allPostKey(), postKey(comment.post));

	res.status(200).json({
		status: 'success',
		data: {
			data: doc,
		},
	});
});

exports.deleteComment = catchAsync(async (req, res, next) => {
	const comment = await Comment.findById(req.params.id);
	if (!comment) {
		return next(new AppError('No document found with that Id', 404));
	}
	await client.HDEL(allPostKey(), postKey(comment.post));
	const doc = await Comment.findByIdAndDelete(req.params.id);
	res.status(204).json({
		status: 'success',
		data: null,
	});
});

exports.createComment = factory.createOne(Comment);
exports.getAllComment = factory.getAll(Comment);
exports.getOneComment = factory.getOne(Comment);
