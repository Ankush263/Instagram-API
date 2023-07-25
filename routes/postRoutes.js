const express = require('express');
const { cleanCahe } = require('../utils/cache');

const {
	createPost,
	getAllPost,
	getOnePost,
	updatePost,
	deletePost,
	setUser,
} = require('../controllers/postControllers');

const { protect } = require('../controllers/authControllers');

const router = express.Router();

router.use(protect);

router.route('/').get(getAllPost).post(setUser, createPost);

router.route('/:id').get(getOnePost).patch(updatePost).delete(deletePost);

module.exports = router;
