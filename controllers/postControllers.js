const Post = require('../models/postModel');
const factory = require('./handleFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const client = require('../redis/client');
const { postKey } = require('../utils/keys');

exports.createPost = factory.createOne(Post);
exports.getAllPost = factory.getAll(Post);

exports.getOnePost = catchAsync(async (req, res, next) => {
	const cacheValue = await client.HGETALL(postKey(req.params.id));

	let doc;

	if (Object.keys(cacheValue).length === 0) {
		console.log('MEMORY IS EMPTY 🫗🫗🫗');

		let query = Post.findById(req.params.id);
		doc = await query;

		if (!doc) {
			return next(new AppError('No document found with that Id', 404));
		}

		client.HSET(postKey(req.params.id), 'doc', JSON.stringify(doc));
		res.status(200).json({
			status: 'success',
			data: {
				data: doc,
			},
		});
		return;
	}
	console.log('MEMORY HAS ITEMS 🌝🌝');

	doc = JSON.parse(cacheValue.doc);

	res.status(200).json({
		status: 'success',
		data: {
			data: doc,
		},
	});
});

exports.updatePost = factory.updateOne(Post);
exports.deletePost = factory.deleteOne(Post);
