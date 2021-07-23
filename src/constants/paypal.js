const PAYPAL_API_URL = process.env.NODE_ENV !== 'production' ? 'https://api-m.sandbox.paypal.com/' : 'https://api-m.paypal.com/';
const PAYPAL_PAYMENT_API_URL = process.env.NODE_ENV !== 'production' ? 'https://svcs.sandbox.paypal.com/AdaptivePayments/' : 'https://svcs.paypal.com/AdaptivePayments/';
const PAYPAL_APPROVE_PAYMENT_URL = process.env.NODE_ENV !== 'production' ? `https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_ap-payment&paykey=` : `https://www.paypal.com/cgi-bin/webscr?cmd=_ap-payment&paykey=`

const RETURN_URL = `${process.env.REACT_APP_URL}/minha-conta/retiradas`;

module.exports = {
	PAYPAL_OAUTH_API: `${PAYPAL_API_URL}v1/oauth2/token/`,
	PAYPAL_ORDER_API: `${PAYPAL_API_URL}v2/checkout/orders/`,
	PAYPAL_PAYMENT_API: `${PAYPAL_PAYMENT_API_URL}Pay`,
	PAYPAL_APPROVE_PAYMENT_URL,

	RETURN_URL,
};