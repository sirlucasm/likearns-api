const express = require('express');

const routes = express.Router();

// middlewares
const authentication = require('../middleware/Authentication');

const UserLikeController = require('../controllers/UserLikeController');

// USERS LIKES
routes
	.get('', authentication, UserLikeController.index)
	.get('/history', authentication, UserLikeController.likesHistory);
	
module.exports = routes;