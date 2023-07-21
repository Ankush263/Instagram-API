const express = require('express');

const {
	createUser,
	getAllUser,
	getOneUser,
	updateUser,
	deleteUser,
} = require('../controllers/userControllers');

const router = express.Router();

router.route('/').get(getAllUser).post(createUser);

router.route('/:id').get(getOneUser).patch(updateUser).delete(deleteUser);

module.exports = router;
