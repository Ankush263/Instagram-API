const Follow = require('../models/followModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/usersModel');

exports.createFollow = catchAsync(async (req, res, next) => {
	if (!req.body.self) req.body.self = req.user.id;
	if (req.body.to == req.user.id) {
		return next(new AppError(`You can't follow yourself`, 404));
	}

	const user = await User.findById(req.body.to);
	if (!user) {
		return next(
			new AppError(`You can't follow anything other then users`, 404)
		);
	}

	const allFollows = await Follow.find();
	let allFollowsArr = [];
	allFollows.map((follow) => allFollowsArr.push(JSON.stringify(follow.to)));

	if (allFollowsArr.includes(JSON.stringify(req.body.to))) {
		return next(new AppError(`You can't follow one person twice`, 404));
	}

	const doc = await Follow.create(req.body);
	res.status(200).json({
		status: 'success',
		data: {
			data: doc,
		},
	});
});

exports.unfollow = catchAsync(async (req, res, next) => {
	const doc = await Follow.findByIdAndDelete(req.params.id);
	if (!doc) {
		return next(new AppError(`No document found with that Id`, 404));
	}
	res.status(204).json({
		status: 'success',
		data: null,
	});
});
