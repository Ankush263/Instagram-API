const express = require('express');

const {
	createPostTag,
	getAllPostTag,
	setUser,
	deletePostTag,
	checkOwner,
	checkPost,
	getAllPostTagByPost,
} = require('../controllers/postTagControllers');

const { protect } = require('../controllers/authControllers');

const router = express.Router();

router.use(protect);

router.route('/tagsByPost/:postId').get(getAllPostTagByPost);

router.route('/').get(getAllPostTag).post(setUser, checkPost, createPostTag);
router.route('/:id').delete(checkOwner, deletePostTag);

module.exports = router;
