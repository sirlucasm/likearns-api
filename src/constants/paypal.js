const PAYPAL_API_URL = process.env.NODE_ENV !== 'production' ? 'https://api-m.sandbox.paypal.com/' : 'https://api-m.paypal.com/';

module.exports = {
	PAYPAL_OAUTH_API: `${PAYPAL_API_URL}v1/oauth2/token/`,
	PAYPAL_ORDER_API: `${PAYPAL_API_URL}v2/checkout/orders/`
};