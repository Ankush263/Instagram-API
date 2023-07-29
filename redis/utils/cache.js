const catchAsync = require('../../utils/catchAsync');
const { postKey, allPostKey, userKey, allUserKey } = require('./keys');
const client = require('../client');

exports.cleanCacheUser = catchAsync(async (req, res, next) => {
	console.log('Users cache cleaned 👤');
	await client.HDEL(allUserKey(), userKey(req.user.id));
	next();
});

exports.cleanCachePost = catchAsync(async (req, res, next) => {
	console.log('Posts cache cleaned 📤');
	await client.HDEL(allPostKey(), postKey(req.body.post));
	next();
});
