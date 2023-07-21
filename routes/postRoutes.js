const express = require('express');

const {
	createPost,
	getAllPost,
	getOnePost,
	updatePost,
	deletePost,
} = require('../controllers/postControllers');

const router = express.Router();

router.route('/').get(getAllPost).post(createPost);

router.route('/:id').get(getOnePost).patch(updatePost).delete(deletePost);

module.exports = router;
