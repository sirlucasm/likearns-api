const jwt = require('jsonwebtoken');
const knex = require('../config/knex');
const axios = require('axios');

const PAYPAL_OAUTH_API = 'https://api-m.sandbox.paypal.com/v1/oauth2/token/';
const PAYPAL_ORDER_API = 'https://api-m.sandbox.paypal.com/v2/checkout/orders/';

module.exports = {
    async withPaypal(req, res, next) {
        try {
            const { email_address, value } = req.body;
            const basicAuth = Buffer.from(`${process.env.PAYPAL_CLIENT}:${process.env.PAYPAL_SECRET}`, 'utf8').toString('base64')
            const params = {
                intent: 'CAPTURE',
                purchase_units: [{
                    amount: {
                        currency_code: 'BRL',
                        value
                    },
                    payee: { email_address }
                }]
            };

            // get access token with OAuth
            const { data: auth } = await axios({
                url: PAYPAL_OAUTH_API,
                method: 'post',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: `Basic ${basicAuth}`
                },
                params: {
                    grant_type: "client_credentials"
                }
            });

            const { data: order } = await axios.post(PAYPAL_ORDER_API, params, {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${auth.access_token}`
                },
            });

            return res.status(200).json({ order });
        } catch (error) {
            // console.error(error)
            next(error);
        }
    },
};