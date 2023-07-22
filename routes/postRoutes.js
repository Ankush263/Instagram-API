const express = require('express');
const { cleanCahe } = require('../utils/cache');

const {
	createPost,
	getAllPost,
	getOnePost,
	updatePost,
	deletePost,
} = require('../controllers/postControllers');

const router = express.Router();

router.route('/').get(getAllPost).post(cleanCahe, createPost);

router.route('/:id').get(getOnePost).patch(updatePost).delete(deletePost);

module.exports = router;
