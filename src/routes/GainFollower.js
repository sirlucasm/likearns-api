const express = require('express');

const routes = express.Router();

// middlewares
const authentication = require('../middleware/Authentication');

const GainFollowerController = require('../controllers/GainFollowerController');

// GAIN FOLLOWERS
routes
	.get('/', authentication, GainFollowerController.index)
	.post('/publish', authentication, GainFollowerController.create)
	.delete('/:id', authentication, GainFollowerController.delete);

module.exports = routes;