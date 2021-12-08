const express = require('express');

const routes = express.Router();

const UserController = require('../controllers/UserController');

// middlewares
const authentication = require('../middleware/Authentication');
const verifyAccount = require('../middleware/VerifyAccount');
const authPointsToken = require('../middleware/AuthPointsToken');
const rewardToken = require('../middleware/RewardToken');
// USERS
routes
	.post('/', UserController.create)
	.put('/', authentication, UserController.update)
	.post('/delete', authentication, UserController.delete)
	.get('/me', authentication, UserController.me) // current user
	.post('/login', UserController.login)
	.post('/verify-account', verifyAccount, UserController.verifyAccount)
	.get('/gain-points/following', authentication, authPointsToken, UserController.gainPointsFollowing)
	.get('/gain-points/liking', authentication, authPointsToken, UserController.gainPointsLiking)
	.get('/verify-followed', authentication, UserController.verifyIfUserFollowed)
	.get('/verify-liked', authentication, UserController.verifyIfUserPostLiked)
	.post('/verify-authenticity', authentication, UserController.verifyUserAuthenticity)
	.post('/reset-password', verifyAccount, UserController.resetPassword)
	.get('/top-sharers', UserController.getTopSharers)
	.get('/is-verified-email', authentication, UserController.isVerifiedEmail)
	.post('/claim-reward', authentication, rewardToken, UserController.claimReward)
	.post('/reset-reward', authentication, rewardToken, UserController.resetReward)
	.post('/import-profile-picture', authentication, UserController.importProfilePicture);

module.exports = routes;