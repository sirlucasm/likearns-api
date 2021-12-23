const express = require('express');

const routes = express.Router();

// middlewares
const onlyModerators = require('../middleware/OnlyModerators');

const ModeratorController = require('../controllers/ModeratorController');
const AlertsController = require('../controllers/AlertsController');

// MODERATORS
routes
	.get('/users-withdraws/paypal/orders', onlyModerators, ModeratorController.withdrawList)
	.get('/users-withdraws/paypal/orders/approve-url', onlyModerators, ModeratorController.getApprovePaypalOrderUrl)
	.post('/users-withdraws/paypal/orders/approve', onlyModerators, ModeratorController.approvePaypalOrderPayment)
	.post('/users-withdraws/paypal/orders/reject', onlyModerators, ModeratorController.rejectPaypalOrderPayment)
	.get('/total-data', onlyModerators, ModeratorController.totalData)
	.get('/users', onlyModerators, ModeratorController.usersList)
	.get('/alerts', AlertsController.all)
	.post('/alerts', onlyModerators, AlertsController.create)
	.patch('/alerts/:id', onlyModerators, AlertsController.update)
	.delete('/alerts/:id', onlyModerators, AlertsController.delete)
	.get('/social-medias', onlyModerators, ModeratorController.listSocialMedias);

module.exports = routes;