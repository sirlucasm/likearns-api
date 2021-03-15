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
    .get('/users/verify-followed', authentication, UserController.verifyIfUserFollowed)
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
    // PUPPETEER
    .get('/puppeteer/instagram/login', authentication, PuppeteerController.twitterLogin)
    .get('/twitter/followers/list', authentication, TwitterController.followersListIds)
    .get('/twitter/followers/check-friendship', authentication, TwitterController.verifyFriendship)
    .get('/twitter/users/search', authentication, TwitterController.searchUser)
    .post('/twitter/followers/follow', authentication, TwitterController.followUser)
    .get('/twitter/auth', authentication, TwitterController.login)
    .post('/twitter/auth/callback', authentication, TwitterController.callback);

module.exports = routes;