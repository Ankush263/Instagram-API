const Reel = require('../models/reelModel');
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
	const reel = await Reel.findById(req.params.id);
	if (reel.user.id !== req.user.id) {
		return next(new AppError(`You are not owner of this reel`, 404));
	}
	next();
});

exports.getAllMyReels = catchAsync(async (req, res, next) => {
	const allMyReels = await Reel.find({ user: req.user.id });
	res.status(200).json({
		status: 'success',
		data: {
			data: allMyReels,
		},
	});
});

exports.getReelsByUsers = catchAsync(async (req, res, next) => {
	const reel = await Reel.find({ user: req.params.userId });

	res.status(201).json({
		status: 'success',
		data: {
			data: reel,
		},
	});
});

exports.createReel = factory.createOne(Reel);
exports.getAllReel = factory.getAll(Reel);
exports.getOneReel = factory.getOneWithoutCache(Reel, {
	path: 'comments likes',
});
exports.updateReel = factory.updateOne(Reel);
exports.deleteReel = factory.deleteOne(Reel);
