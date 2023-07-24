const User = require('../models/usersModel');
const factory = require('./handleFactory');

exports.createUser = factory.createOne(User);
exports.getAllUser = factory.getAll(User);
exports.getOneUser = factory.getOne(User, 'user');
exports.updateUser = factory.updateOne(User, 'user');
exports.deleteUser = factory.deleteOne(User, 'user');
