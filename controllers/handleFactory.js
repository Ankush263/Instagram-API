const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');
const { postKey, allPostKey, userKey, allUserKey } = require('../utils/keys');
const client = require('../redis/client');

exports.deleteOne = (Model) =>
	catchAsync(async (req, res, next) => {
		let key, field;
		if (keyType === 'post') {
			key = allPostKey();
			field = postKey(req.params.id);
		}
		if (keyType === 'user') {
			key = allUserKey();
			field = userKey(req.params.id);
		}
		await client.HDEL(key, field);
		const doc = await Model.findByIdAndDelete(req.params.id);
		if (!doc) {
			return next(new AppError('No document found with that Id', 404));
		}
		res.status(204).json({
			status: 'success',
			data: null,
		});
	});

exports.updateOne = (Model, keyType) =>
	catchAsync(async (req, res, next) => {
		let key, field;
		if (keyType === 'post') {
			key = allPostKey();
			field = postKey(req.params.id);
		}
		if (keyType === 'user') {
			key = allUserKey();
			field = userKey(req.params.id);
		}
		await client.HDEL(key, field);
		const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});

		if (!doc) {
			return next(new AppError('No document found with that Id', 404));
		}

		res.status(200).json({
			status: 'success',
			data: {
				data: doc,
			},
		});
	});

exports.createOne = (Model) =>
	catchAsync(async (req, res, next) => {
		const doc = await Model.create(req.body);

		res.status(201).json({
			status: 'success',
			data: {
				data: doc,
			},
		});
	});

exports.getOne = (Model, keyType, popOptions) =>
	catchAsync(async (req, res, next) => {
		let key, field, doc;

		if (keyType === 'post') {
			key = allPostKey();
			field = postKey(req.params.id);
		}
		if (keyType === 'user') {
			key = allUserKey();
			field = userKey(req.params.id);
		}
		const cacheValue = await client.HGET(key, field);

		if (!cacheValue) {
			console.log('MEMORY IS EMPTY 🫗🫗🫗');
			let query = Model.findById(req.params.id);
			if (popOptions) query = query.populate(popOptions);
			doc = await query;

			client.HSET(key, field, JSON.stringify(doc));

			if (!doc) {
				return next(new AppError('No document found with that Id', 404));
			}
			res.status(200).json({
				status: 'success',
				data: {
					data: doc,
				},
			});
			return;
		}
		console.log('MEMORY HAS ITEMS 🌝🌝');
		doc = JSON.parse(cacheValue);

		res.status(200).json({
			status: 'success',
			data: {
				data: doc,
			},
		});
	});

exports.getAll = (Model) =>
	catchAsync(async (req, res, next) => {
		let filter = {};
		if (req.params.userId) filter = { user: req.params.userId };

		const features = new APIFeatures(Model.find(filter), req.query)
			.filter()
			.sort()
			.limitFields();

		const doc = await features.query;

		res.status(200).json({
			status: 'success',
			results: doc.length,
			data: {
				data: doc,
			},
		});
	});
