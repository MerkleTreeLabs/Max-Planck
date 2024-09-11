require('module-alias/register');

const axios = require('axios');
const config = require('@config');

async function getPendingBaseFee() {
	try {
		const pendingBaseFee = await axios.post(`http://${config.zondPubAPI}`, {
			jsonrpc: '2.0',
			method: 'zond_getBlockByNumber',
			params: ['pending', true],
			id: 1,
		}, {
			headers: {
				'Content-Type': 'application/json',
			},
		});
		return pendingBaseFee.data.result.baseFeePerGas;
	}
	catch (error) {
		const errorMessage = `Error occurred while fetching the pendingBaseFeeLookup: ${error.message}`;
		console.error(errorMessage);
		return new Error(errorMessage);
	}
}

module.exports = getPendingBaseFee;
