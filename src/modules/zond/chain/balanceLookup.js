require('module-alias/register');
const axios = require('axios');

const config = require('@config');

async function balance(address) {
	try {
		const response = await axios.post(`http://${config.zondPubAPI}`, {
			jsonrpc: '2.0',
			method: 'zond_getBalance',
			params: [`0x${address}`, 'latest'],
			id: 1,
		}, {
			headers: {
				'Content-Type': 'application/json',
			},
		});
		return response.data;
	}
	catch (error)	{
		const errorMessage = `Error occurred in BalanceLookup: ${error.message}`;
		console.error(errorMessage);
		return new Error(errorMessage);
	}
}

module.exports = { balance };
