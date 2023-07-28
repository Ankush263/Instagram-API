const Comment = require('../models/commentsModel');
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

exports.createComment = factory.createOne(Comment);
exports.getAllComment = factory.getAll(Comment);
exports.getOneComment = factory.getOne(Comment);
exports.updateComment = factory.updateOne(Comment);
exports.deleteComment = factory.deleteOne(Comment);
