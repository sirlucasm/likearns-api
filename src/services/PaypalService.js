const axios = require('axios');
const { PAYPAL_PAYMENT_API, RETURN_URL } = require('../constants/paypal');

module.exports = {
	createOrder: async (params) => {
		try {
			const data = {
				actionType: "PAY", // Payment action type
				currencyCode: "BRL", // Payment currency code
				receiverList: {
					receiver: [{
						amount: params.value, // Payment amount
						email: params.email_address // Receiver's email address
					}]
				},
				returnUrl: RETURN_URL, // Redirect URL after approval
				cancelUrl: RETURN_URL, // Redirect URL after cancellation
				requestEnvelope: {
					errorLanguage: "pt_BR", // Language used to display errors
					detailLevel: "ReturnAll" // Error detail level
				}
			}

			const { data: order } = await axios.post(PAYPAL_PAYMENT_API, data, {
				headers: {
					'X-PAYPAL-SECURITY-USERID': process.env.PAYPAL_SECURITY_USERID,
					'X-PAYPAL-SECURITY-PASSWORD': process.env.PAYPAL_SECURITY_PASSWORD,
					'X-PAYPAL-SECURITY-SIGNATURE': process.env.PAYPAL_SECURITY_SIGNATURE,
					'X-PAYPAL-REQUEST-DATA-FORMAT': 'JSON',
					'X-PAYPAL-RESPONSE-DATA-FORMAT': 'JSON',
					'X-PAYPAL-APPLICATION-ID': process.env.PAYPAL_APPLICATION_ID
				},
			});

			return order;
		} catch (error) {
			return error.response;
		}
	}
}