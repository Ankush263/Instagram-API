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

exports.createLikes = factory.createOne(Like);
exports.deleteLike = factory.deleteOne(Like);
