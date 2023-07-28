const express = require('express');

const {
	createLikes,
	deleteLike,
	setUser,
	check,
} = require('../controllers/likesControllers');
const { protect } = require('../controllers/authControllers');

const router = express.Router();

router.use(protect);

router.route('/').post(setUser, check, createLikes);
router.route('/:id').delete(deleteLike);

module.exports = router;
