const jwt = require('jsonwebtoken');
const knex = require('../config/knex');

// services
const PaypalService = require('../services/PaypalService');

module.exports = {
    async createPaypalOrder(req, res, next) {
        try {
            const params = req.body;
            const order = await PaypalService.createOrder(params.email_address, params.value);

            params.order_id = order.id;
            await knex.transaction(async () => {
                await knex('users_withdraws').insert(params);
            });

            return res.status(200).json({ order });
        } catch (error) {
            next(error);
        }
    },

    async capturePaypalOrder(req, res, next) {
        try {
            const { order_id } = req.body;
            const orderCaptured = await PaypalService.captureOrder(order_id);

            return res.status(200).json(orderCaptured);
        } catch (error) {
            next(error);
        }
    }
};