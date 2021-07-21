const axios = require('axios');
const { PAYPAL_OAUTH_API, PAYPAL_ORDER_API } = require('../constants/paypal');

const OAuth = async () => {
    try {
        // base64 crypt Basic OAuth
        const basicAuth = Buffer.from(`${process.env.PAYPAL_CLIENT}:${process.env.PAYPAL_SECRET}`, 'utf8').toString('base64');

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
                grant_type: 'client_credentials'
            }
        });

        return auth;
    } catch (error) {
        return error.response;
    }
}

module.exports = {
    createOrder: async (email_address, value) => {
        try {
            const auth = await OAuth();
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

            const { data: order } = await axios.post(PAYPAL_ORDER_API, params, {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${auth.access_token}`
                },
            });

            return order;
        } catch (error) {
            return error.response;
        }
    },

    captureOrder: async (orderId) => {
        try {
            const auth = await OAuth();
            const { dada: orderCaptured } = await axios.post(`${PAYPAL_ORDER_API}${orderId}/capture`, {}, {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${auth.access_token}`
                },
            });

            return orderCaptured;
        } catch (error) {
            return error.response;
        }
    }
}