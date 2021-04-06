const express = require('express');

const routes = express.Router();

// middlewares
const authentication = require('./middleware/Authentication');
const verifyAccount = require('./middleware/VerifyAccount');
const authPointsToken = require('./middleware/AuthPointsToken');

const UserController = require('./controllers/UserController');
const MailerController = require('./controllers/MailerController');
const GainFollowerController = require('./controllers/GainFollowerController');
const GainLikeController = require('./controllers/GainLikeController');
const UserLikeController = require('./controllers/UserLikeController');
const UserFollowerController = require('./controllers/UserFollowerController');
const PuppeteerController = require('./controllers/PuppeteerController');
const InstagramController = require('./controllers/social_media/InstagramController');
const TwitterController = require('./controllers/social_media/TwitterController');

routes
    .get('/', (req, res, next) => {
        res.send("Welcome to Likearns API");
    })

    
    // USERS
    .get('/users', UserController.index)
    .post('/users', UserController.create)
    .put('/users', authentication, UserController.update)
    .delete('/users', authentication, UserController.delete)
    .get('/users/me', authentication, UserController.me) // current user
    .post('/users/login', UserController.login)
    .post('/users/verify-account', verifyAccount, UserController.verifyAccount)
    .get('/users/gain-points/following', authentication, authPointsToken, UserController.gainPointsFollowing)
    .get('/users/gain-points/liking', authentication, authPointsToken, UserController.gainPointsLiking)
    .get('/users/verify-followed', authentication, UserController.verifyIfUserFollowed)
    .get('/users/verify-liked', authentication, UserController.verifyIfUserPostLiked)
    .post('/users/verify-authenticity', authentication, UserController.verifyUserAuthenticity)
    // MAILER
    .get('/mail/send-verification', authentication, MailerController.sendConfirmationEmail)
    // GAIN
    // GAIN FOLLOWERS
    .get('/gain/followers', authentication, GainFollowerController.index)
    .post('/gain/followers/publish', authentication, GainFollowerController.create)
    .delete('/gain/followers/:id', authentication, GainFollowerController.delete)
    // GAIN LIKES
    .get('/gain/likes', authentication, GainLikeController.index)
    .delete('/gain/likes/:id', authentication, GainLikeController.delete)
    .post('/gain/likes/publish', authentication, GainLikeController.create)
    // USERS LIKES
    .get('/users-likes', authentication, UserLikeController.index)
    // USERS FOLLOWERS
    .get('/users-followers', authentication, UserFollowerController.index)
    // PUPPETEER
    .get('/puppeteer/instagram/login', authentication, PuppeteerController.twitterLogin)
    .get('/twitter/followers/list', authentication, TwitterController.followersListIds)
    .get('/twitter/followers/check-friendship', authentication, TwitterController.verifyFriendship)
    .get('/twitter/users/search', authentication, TwitterController.searchUser)
    .post('/twitter/followers/follow', authentication, TwitterController.followUser)
    .post('/twitter/posts/like', authentication, TwitterController.likePost)
    .get('/twitter/auth', authentication, TwitterController.login)
    .post('/twitter/auth/callback', authentication, TwitterController.callback);

module.exports = routes;