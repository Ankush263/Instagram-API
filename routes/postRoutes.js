const express = require('express');
const { cleanCahe } = require('../redis/utils/cache');

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

router.route('/').get(getAllPost).post(setUser, cleanCahe, createPost);

router
	.route('/:id')
	.get(getOnePost)
	.patch(checkOwner, updatePost)
	.delete(checkOwner, deletePost);

module.exports = router;
