const Follow = require('../models/followModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/usersModel');
const client = require('../redis/client');
const { userKey, allUserKey } = require('../redis/utils/keys');

const cleanCache = async (selfId, toId) => {
	await client.HDEL(allUserKey(), userKey(selfId));
	await client.HDEL(allUserKey(), userKey(toId));
};

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

	const follow = await Follow.findOne({ self: req.user.id, to: req.body.to });

	if (follow) {
		return next(new AppError(`You can't follow one person twice`, 404));
	}

	cleanCache(req.user.id, req.body.to);

	const doc = await Follow.create(req.body);
	res.status(200).json({
		status: 'success',
		data: {
			data: doc,
		},
	});
});

exports.unfollow = catchAsync(async (req, res, next) => {
	const follow = await Follow.findById(req.params.id);
	if (!follow) {
		return next(new AppError(`No document found with that Id`, 404));
	}
	cleanCache(req.user.id, follow.to);
	const doc = await Follow.findByIdAndDelete(req.params.id);
	res.status(204).json({
		status: 'success',
		data: null,
	});
});
