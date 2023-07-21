const Post = require('../models/postModel');
const factory = require('./handleFactory');

exports.createPost = factory.createOne(Post);
exports.getAllPost = factory.getAll(Post);
exports.getOnePost = factory.getOne(Post);
exports.updatePost = factory.updateOne(Post);
exports.deletePost = factory.deleteOne(Post);
