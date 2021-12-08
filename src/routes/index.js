const express = require('express');

const routes = express.Router();
const app = express();

const GainFollowerRoute = require('./GainFollower');
const GainLikeRoute = require('./GainLike');
const InstagramRoute = require('./Instagram');
const MailerRoute = require('./Mailer');
const ModeratorRoute = require('./Moderator');
const TwitterRoute = require('./Twitter');
const UserRoute = require('./User');
const UserFollowerRoute = require('./UserFollower');
const UserLikeRoute = require('./UserLike');
const UserNotificationRoute = require('./UserNotification');
const UserWithdrawRoute = require('./UserWithdraw');

app.use('/gain/followers', GainFollowerRoute);
app.use('/gain/likes', GainLikeRoute);
app.use('/instagram', InstagramRoute);
app.use('/mail', MailerRoute);
app.use('/moderators', ModeratorRoute);
app.use('/twitter', TwitterRoute);
app.use('/users', UserRoute);
app.use('/users-followers', UserFollowerRoute);
app.use('/users-likes', UserLikeRoute);
app.use('/users-notifications', UserNotificationRoute);
app.use('/users-withdraws', UserWithdrawRoute);

routes
    .get('/', (req, res, next) => {
        res.send('Welcome to Likearns API');
    });

module.exports = app;