const express = require('express');

const routes = express.Router();

const TwitterController = require('../controllers/social_media/TwitterController');

// middlewares
const authentication = require('../middleware/Authentication');

// TWITTER
routes
	.get('/followers/list', authentication, TwitterController.followersListIds)
	.get('/followers/check-friendship', authentication, TwitterController.verifyFriendship)
	.get('/users/search', authentication, TwitterController.searchUser)
	.post('/followers/follow', authentication, TwitterController.followUser)
	.post('/posts/like', authentication, TwitterController.likePost)
	.get('/auth', authentication, TwitterController.login)
	.post('/auth/callback', authentication, TwitterController.callback);

module.exports = routes;