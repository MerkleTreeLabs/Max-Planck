require('module-alias/register');
const axios = require('axios');
const config = require('@config');

// eslint-disable-next-line
async function getTransaction(tx_hash) {
	try {
		const data = JSON.stringify({
			// eslint-disable-next-line
			tx_hash,
		});

		const response = await axios.post(`http://${config.qrlPubAPI}/api/GetTransaction`, data, {
			jsonrpc: '2.0',
			headers: {
				'Content-Type': 'application/json',
			},
		});

		return response.data;
	}
	catch (error) {
		if (error.response) {
			console.error('Error response:', error.response.data);
		}
		else {
			console.error('Error:', error.message);
		}
		return new Error(`Error occurred in transactionLookup: ${error.message}`);
	}
}

module.exports = { getTransaction };
