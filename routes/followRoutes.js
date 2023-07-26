const express = require('express');

const { createFollow, unfollow } = require('../controllers/followControllers');
const { protect } = require('../controllers/authControllers');

const router = express.Router();

router.use(protect);

router.route('/').post(createFollow);
router.route('/:id').delete(unfollow);

module.exports = router;
