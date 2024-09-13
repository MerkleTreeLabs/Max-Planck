require('module-alias/register');

const axios = require('axios');
const config = require('@config');

async function listAddresses() {
	try {
		const response = await axios.get(`http://${config.qrlPubAPI}/api/ListAddresses`, {
			jsonrpc: '2.0',
			params: [],
		}, {
			headers: {
				'Content-Type': 'application/json',
			},
		});
		return response.data.addresses;
	}
	catch (error)	{
		const errorMessage = `Error occurred while fetching the QRL latest height: ${error.message}`;
		console.error(errorMessage);
		return new Error(errorMessage);
	}
}

module.exports = { listAddresses };
