const axios = require('axios');

async function getTransaction(txHash) {
	try {
		const response = await axios.post('http://127.0.0.1:8545', {
			jsonrpc: '2.0',
			method: 'zond_getTransactionReceipt',
			params: [txHash],
			id: 1,
		}, {
			headers: {
				'Content-Type': 'application/json',
			},
		});

		return response.data.result;
	}
	catch (error) {
		throw new Error(`Error occurred: ${error.message}`);
	}
}

module.exports= getTransaction;
