const express = require('express');

const routes = express.Router();

// middlewares
const authentication = require('../middleware/Authentication');

const UserFollowerController = require('../controllers/UserFollowerController');

// USERS FOLLOWERS
routes
	.get('/', authentication, UserFollowerController.index)
	.get('/history', authentication, UserFollowerController.followersHistory);

module.exports = routes;