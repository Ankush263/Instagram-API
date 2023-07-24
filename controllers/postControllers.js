const Post = require('../models/postModel');
const factory = require('./handleFactory');

exports.createPost = factory.createOne(Post);
exports.getAllPost = factory.getAll(Post);
exports.getOnePost = factory.getOne(Post, 'post');
exports.updatePost = factory.updateOne(Post, 'post');
exports.deletePost = factory.deleteOne(Post, 'post');
