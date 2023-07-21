const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema(
	{
		createdAt: {
			type: Date,
			default: Date.now,
		},
		updatedAt: {
			type: Date,
			default: Date.now,
		},
		fullname: {
			type: String,
			required: [true, 'Must have a fullname'],
		},
		username: {
			type: String,
			unique: true,
			required: [true, 'Must have a username'],
		},
		bio: {
			type: String,
		},
		avater: {
			type: String,
		},
		phone: {
			type: String,
			required: [true, 'Must have a phone number'],
			unique: true,
			validate: [
				validator.isMobilePhone,
				'please provide a valid phone number',
			],
		},
		email: {
			type: String,
			required: [true, 'Must have an email'],
			unique: true,
			lowercase: true,
			validate: [validator.isEmail, 'please provide a valid email'],
		},
		password: {
			type: String,
			required: [true, 'please provide a password'],
			minlength: 8,
			select: false,
		},
		status: {
			type: String,
			enum: ['public', 'private'],
			default: 'public',
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

const User = mongoose.model('User', userSchema);

module.exports = User;
