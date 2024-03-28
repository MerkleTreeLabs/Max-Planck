const axios = require('axios');
const config = require('../../../config.json');

async function getTransaction(txHash) {
	try {
		const response = await axios.post(`http://${config.zondPubAPI}`, {
			jsonrpc: '2.0',
			method: 'zond_getTransactionReceipt',
			params: [`0x${txHash}`],
			id: 1,
		}, {
			headers: {
				'Content-Type': 'application/json',
			},
		});

		return response.data.result;
	}
	catch (error) {
		const errorMessage = `Error occurred while fetching the transactionLookup: ${error.message}`;
		console.error(errorMessage);
		return new Error(errorMessage);
	}
}

module.exports = getTransaction;
