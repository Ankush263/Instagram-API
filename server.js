const mongoose = require('mongoose');
const app = require('./app');

const port = 5000;

const server = app.listen(port, () => {
	console.log(`You are listening to the port ${port}`);
});
