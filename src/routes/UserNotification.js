const express = require('express');

const routes = express.Router();

const UserNotificationController = require('../controllers/UserNotificationController');

// middlewares
const authentication = require('../middleware/Authentication');

// USERS NOTIFICATIONS
routes
	.get('/', authentication, UserNotificationController.getUserNotifications)
	.post('/read-notification', authentication, UserNotificationController.setNotificationReaded);

module.exports = routes;