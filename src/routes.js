const express = require('express');

const routes = express.Router();
const authentication = require('./middleware/Authentication');

const UserController = require('./controllers/UserController');

// USERS
routes
	// current user
    // .get('/me', authentication, UserController.me)
    .get('/', UserController.index)
    .get('/users', UserController.index);

module.exports = routes;