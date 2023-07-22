const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');
const catchAsync = require('./catchAsync');
const { postKey } = require('./keys');
const client = require('../redis/client');

const exec = mongoose.Query.prototype.exec;

/*
  Create a clean cache middleware.
    - Whenever we create any record, we are going to delete the old record

  Creating cache should be attach with single item call.

  Create a serialize and a deserialize function. (for changing the location)
*/

exports.cleanCahe = catchAsync(async (req, res, next) => {
	const response = await client.del(JSON.stringify(postKey(req.params.id)));
	next();
});

// exports.createCache = async (id) => {
// 	const cacheValue = await client.hGetAll(JSON.stringify(postKey(id)));

// 	if (Object.keys(cacheValue).length === 0) {
// 		console.log('No object exists, create a new one');
// 		// create a hash
// 	}

// 	// pass to next
// };
