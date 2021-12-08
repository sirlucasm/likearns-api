const express = require('express');

const routes = express.Router();

const InstagramController = require('../controllers/social_media/InstagramController');

// middlewares
const authentication = require('../middleware/Authentication');
const instagramTokenValidator = require('../middleware/InstagramTokenValidator');

// INSTAGRAM
routes
	.post('/login', authentication, InstagramController.login)
	.post('/posts/like', authentication, instagramTokenValidator, InstagramController.likePost)
	.post('/followers/follow', authentication, instagramTokenValidator, InstagramController.followUser)
	.get('/posts/getMediaData', authentication, InstagramController.getMediaData);

module.exports = routes;