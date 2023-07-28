const express = require('express');

const {
	createComment,
	getAllComment,
	getOneComment,
	updateComment,
	deleteComment,
	setUser,
} = require('../controllers/commentControllers');

const { protect } = require('../controllers/authControllers');

const router = express.Router();

router.use(protect);

router.route('/').get(getAllComment).post(setUser, createComment);

router
	.route('/:id')
	.get(getOneComment)
	.patch(updateComment)
	.delete(deleteComment);

module.exports = router;
