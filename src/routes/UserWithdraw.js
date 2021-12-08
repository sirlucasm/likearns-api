const express = require('express');

const routes = express.Router();

const UserWithdrawController = require('../controllers/UserWithdrawController');

// middlewares
const authentication = require('../middleware/Authentication');

// USERS WITHDRAWS
routes
	.get('/', authentication, UserWithdrawController.index)
	.post('/paypal/orders', authentication, UserWithdrawController.createPaypalOrder);
	
module.exports = routes;