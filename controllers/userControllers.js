const User = require('../models/usersModel');
const factory = require('./handleFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.createUser = (req, res) => {
	res.status(500).json({
		status: 'error',
		message: 'This route is not defined! Please use /signup instead',
	});
};

exports.updateUser = (req, res) => {
	res.status(500).json({
		status: 'error',
		message: 'This route is not defined! Please use /updateMe instead',
	});
};

exports.deleteUser = (req, res) => {
	res.status(500).json({
		status: 'error',
		message: 'This route is not defined! Please use /deleteMe instead',
	});
};

exports.updateMe = catchAsync(async (req, res, next) => {
	if (req.body.password || req.body.passwordConfirm) {
		return next(
			new AppError(
				`This route is not for password update, Please use /updateMyPAssword.`,
				400
			)
		);
	}
	const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, {
		new: true,
		runValidators: true,
	});

	res.status(200).json({
		status: 'success',
		data: {
			user: updatedUser,
		},
	});
});

exports.getMe = (req, res, next) => {
	req.params.id = req.user.id;
	next();
};

exports.deleteMe = catchAsync(async (req, res, next) => {
	await User.findByIdAndDelete(req.user.id);

	res.status(204).json({
		status: 'success',
		data: null,
	});
});

exports.getAllUser = factory.getAll(User);
exports.getOneUser = factory.getOne(User, 'user');
