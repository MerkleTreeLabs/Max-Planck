require('module-alias/register');
const axios = require('axios');

const config = require('@config');

async function isValidAddress(address) {
	try {
		const data = JSON.stringify({
			address,
		});
		const response = await axios.post(`http://${config.qrlPubAPI}/api/IsValidAddress`, data, {
			jsonrpc: '2.0',
		}, {
			headers: {
				'Content-Type': 'application/json',
			},
		});
		return response.data;
	}
	catch (error)	{
		const errorMessage = `Error occurred in IsValidAddressLookup: ${error.message}`;
		console.error(errorMessage);
		return new Error(errorMessage);
	}
}

module.exports = { isValidAddress };
