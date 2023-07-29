const express = require('express');
const { cleanCacheUser, cleanCachePost } = require('../redis/utils/cache');

const {
	createPost,
	getAllPost,
	getOnePost,
	updatePost,
	deletePost,
	setUser,
	checkOwner,
	getAllMyPosts,
	getPostsByUsers,
} = require('../controllers/postControllers');

const { protect } = require('../controllers/authControllers');

const router = express.Router();

router.use(protect);

router.route('/myposts').get(getAllMyPosts);
router.route('/postByUser/:userId').get(getPostsByUsers);

router.route('/').get(getAllPost).post(setUser, cleanCacheUser, createPost);

router
	.route('/:id')
	.get(getOnePost)
	.patch(checkOwner, cleanCacheUser, cleanCachePost, updatePost)
	.delete(checkOwner, cleanCacheUser, cleanCachePost, deletePost);

module.exports = router;
