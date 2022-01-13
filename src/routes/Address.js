const express = require('express');

const routes = express.Router();

// middlewares
const authentication = require('../middleware/Authentication');

const AddressController = require('../controllers/AddressController');

// USERS LIKES
routes
	.get('/:id', authentication, AddressController.find)
	.put('/', authentication, AddressController.update);

module.exports = routes;