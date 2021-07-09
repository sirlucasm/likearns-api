const express = require('express');

const routes = express.Router();

// middlewares
const authentication = require('./middleware/Authentication');
const verifyAccount = require('./middleware/VerifyAccount');
const authPointsToken = require('./middleware/AuthPointsToken');
const rewardToken = require('./middleware/RewardToken');
const instagramTokenValidator = require('./middleware/InstagramTokenValidator');

const UserController = require('./controllers/UserController');
const MailerController = require('./controllers/MailerController');
const GainFollowerController = require('./controllers/GainFollowerController');
const GainLikeController = require('./controllers/GainLikeController');
const UserLikeController = require('./controllers/UserLikeController');
const UserFollowerController = require('./controllers/UserFollowerController');
const UserNotificationController = require('./controllers/UserNotificationController');
const UserWithdrawController = require('./controllers/UserWithdrawController');
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
    .post('/users/delete', authentication, UserController.delete)
    .get('/users/me', authentication, UserController.me) // current user
    .post('/users/login', UserController.login)
    .post('/users/verify-account', verifyAccount, UserController.verifyAccount)
    .get('/users/gain-points/following', authentication, authPointsToken, UserController.gainPointsFollowing)
    .get('/users/gain-points/liking', authentication, authPointsToken, UserController.gainPointsLiking)
    .get('/users/verify-followed', authentication, UserController.verifyIfUserFollowed)
    .get('/users/verify-liked', authentication, UserController.verifyIfUserPostLiked)
    .post('/users/verify-authenticity', authentication, UserController.verifyUserAuthenticity)
    .post('/users/reset-password', verifyAccount, UserController.resetPassword)
    .get('/users/top-sharers', UserController.getTopSharers)
    .get('/users/is-verified-email', authentication, UserController.isVerifiedEmail)
    .post('/users/claim-reward', authentication, rewardToken, UserController.claimReward)
    .post('/users/reset-reward', authentication, rewardToken, UserController.resetReward)
    .post('/users/import-profile-picture', authentication, UserController.importProfilePicture)
    // MAILER
    .get('/mail/send-verification', authentication, MailerController.sendConfirmationEmail)
    .post('/mail/send-reset-password', MailerController.sendResetPasswordEmail)
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
    // TWITTER
    .get('/twitter/followers/list', authentication, TwitterController.followersListIds)
    .get('/twitter/followers/check-friendship', authentication, TwitterController.verifyFriendship)
    .get('/twitter/users/search', authentication, TwitterController.searchUser)
    .post('/twitter/followers/follow', authentication, TwitterController.followUser)
    .post('/twitter/posts/like', authentication, TwitterController.likePost)
    .get('/twitter/auth', authentication, TwitterController.login)
    .post('/twitter/auth/callback', authentication, TwitterController.callback)
    // INSTAGRAM
    .post('/instagram/login', authentication, InstagramController.login)
    .post('/instagram/posts/like', authentication, instagramTokenValidator, InstagramController.likePost)
    .post('/instagram/followers/follow', authentication, instagramTokenValidator, InstagramController.followUser)
    .get('/instagram/posts/getMediaData', authentication, InstagramController.getMediaData)
    // USERS NOTIFICATIONS
    .get('/users-notifications', authentication, UserNotificationController.getUserNotifications)
    .post('/users-notifications/read-notification', authentication, UserNotificationController.setNotificationReaded)
    // USERS WITHDRAWS
    .post('/users-withdraws/paypal', authentication, UserWithdrawController.withPaypal);

module.exports = routes;