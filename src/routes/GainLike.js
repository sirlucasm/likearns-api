const express = require('express');

const routes = express.Router();

const GainLikeController = require('../controllers/GainLikeController');

// middlewares
const authentication = require('../middleware/Authentication');

// GAIN LIKES
routes
	.get('/', authentication, GainLikeController.index)
	.delete('/:id', authentication, GainLikeController.delete)
	.post('/publish', authentication, GainLikeController.create);

module.exports = routes;