const express = require('express');
const router = express.Router();

const {
	createReel,
	getAllReel,
	getOneReel,
	updateReel,
	deleteReel,
	setUser,
	checkOwner,
	getAllMyReels,
	getReelsByUsers,
} = require('../controllers/reelControllers');

const { protect } = require('../controllers/authControllers');

// Middleware to protect routes - Apply to all routes below
router.use(protect);

router.route('/myReels').get(getAllMyReels);
router.route('/reelByUser/:userId').get(getReelsByUsers);

// Routes for story endpoints
router.route('/').post(setUser, createReel).get(getAllReel);
router
	.route('/:id')
	.patch(checkOwner, updateReel)
	.get(getOneReel)
	.delete(checkOwner, deleteReel);

module.exports = router;
