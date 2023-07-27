const express = require('express');

const {
	createPostTag,
	getAllPostTag,
	setUser,
	deletePostTag,
	checkOwner,
} = require('../controllers/postTagControllers');

const { protect } = require('../controllers/authControllers');

const router = express.Router();

router.use(protect);

router.route('/').get(getAllPostTag).post(setUser, createPostTag);
router.route('/:id').delete(checkOwner, deletePostTag);

module.exports = router;
