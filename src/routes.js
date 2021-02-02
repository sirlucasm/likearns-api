const express = require('express');

const routes = express.Router();
const authentication = require('./middleware/Authentication');

const UserController = require('./controllers/UserController');

// USERS
routes
	// current user
    // .get('/me', authentication, UserController.me)
    .get('/api', (req, res, next) => {
        res.send("Welcome to Likearns API");
    });

module.exports = routes;