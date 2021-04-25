const Post = require('../models/Post');
const factory = require('./handlerFactory');

exports.getPostLimit = factory.limit(Post);
exports.getAllPosts = factory.getAll(Post);
exports.getPost = factory.getOne(Post);
exports.getWithSlug = factory.getOneWithSlug(Post);
exports.createPost = factory.createOne(Post);
exports.updatePost = factory.updateOne(Post);
exports.deletePost = factory.deleteOne(Post);
