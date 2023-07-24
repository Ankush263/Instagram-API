const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/usersModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};

const createAndSendToken = (user, statusCode, res) => {
	const token = signToken(user._id);
	const cookieOptions = {
		expires: new Date(
			Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
		),
		httpOnly: true,
	};

	if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
	res.cookie('jwt', token, cookieOptions);
	user.password = undefined;

	res.status(statusCode).json({
		status: 'success',
		token,
		data: {
			user,
		},
	});
};

exports.signup = catchAsync(async (req, res, next) => {
	const newUser = await User.create(req.body);
	createAndSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return next(new AppError(`Please provide email & password`, 404));
	}
	const user = await User.findOne({ email }).select('+password');

	if (!user || !(await user.correctPassword(password, user.password))) {
		return next(new AppError(`Incorrect email or password`, 401));
	}
	createAndSendToken(user, 200, res);
});

exports.logout = (req, res) => {
	res.cookie('jwt', 'loggedout', {
		expires: new Date(Date.now() + 10 * 1000),
		httpOnly: true,
	});
	res.status(200).json({ status: 'success' });
};

exports.protect = catchAsync(async (req, res, next) => {
	let token;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		token = req.headers.authorization.split(' ')[1];
	} else if (req.cookies.jwt) {
		token = req.cookies.jwt;
	}
	if (!token) {
		return next(
			new AppError(`You aren't logged in! Please log in to get access`, 401)
		);
	}

	const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
	const freshUser = await User.findById(decoded.id);
	if (!freshUser) {
		return next(
			new AppError(`The user belonging to this token does no longer exist`, 401)
		);
	}
	if (freshUser.changedPasswordAfter(decoded.iat)) {
		return next(
			new AppError(`User recently changed password! Please log in again`, 401)
		);
	}

	req.user = freshUser;
	next();
});

exports.isLoggedIn = async (req, res, next) => {
	try {
		if (req.cookies.jwt) {
			const decoded = await promisify(jwt.verify)(
				req.cookies.jwt,
				process.env.JWT_SECRET
			);
			const freshUser = await User.findById(decoded.id);
			if (!freshUser) {
				return next();
			}
			if (freshUser.changedPasswordAfter(decoded.iat)) {
				return next();
			}
			res.locals.user = freshUser;
			return next();
		}
	} catch (error) {
		return next();
	}
	next();
};

exports.restrictTo = (...types) => {
	return (req, res, next) => {
		if (!types.includes(req.user.status)) {
			return next(
				new AppError(`You don't have permission to perform this action`, 403)
			);
		}
		next();
	};
};
