const express = require('express');
const router = express.Router();

const {
	createStory,
	deleteStory,
	setUser,
	checkOwner,
	getMyStories,
	getStoriesByUserId,
	getStoriesByFollows,
} = require('../controllers/storyControllers');

const { protect } = require('../controllers/authControllers');

// Middleware to protect routes - Apply to all routes below
router.use(protect);

// Routes for story endpoints
router.route('/myStory').get(getMyStories);
router.route('/followersStories').get(getStoriesByFollows);
router.route('/storyByUserId/:id').get(getStoriesByUserId);
router.route('/').post(setUser, createStory);
router.route('/:id').delete(checkOwner, deleteStory);

module.exports = router;
