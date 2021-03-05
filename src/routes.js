const express = require('express');

const routes = express.Router();
const authentication = require('./middleware/Authentication');
const verifyAccount = require('./middleware/VerifyAccount');

const UserController = require('./controllers/UserController');
const MailerController = require('./controllers/MailerController');
const GainFollowerController = require('./controllers/GainFollowerController');
const GainLikeController = require('./controllers/GainLikeController');

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
    .post('/gain/likes/publish', authentication, GainLikeController.create);

module.exports = routes;