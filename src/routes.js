const express = require('express');

const routes = express.Router();
const authentication = require('./middleware/Authentication');

const UserController = require('./controllers/UserController');

routes
    .get('/', (req, res, next) => {
        res.send("Welcome to Likearns API");
    })

    
    // USERS
    .get('/users', UserController.index)
    .post('/users', UserController.create)
    .put('/users', authentication, UserController.update)
    .delete('/users', authentication, UserController.delete)
    .get('/users/me', authentication, UserController.me); // current user

module.exports = routes;