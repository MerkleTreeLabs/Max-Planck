const axios = require('axios');
const config = require('../../../config.json');


async function rawTx(signedTx) {
	try {
		const txHash = await axios.post(`http://${config.zondPubAPI}`, {
			jsonrpc: '2.0',
			method: 'zond_sendRawTransaction',
			params: [signedTx.rawTransaction],
			id: 1,
		}, {
			headers: {
				'Content-Type': 'application/json',
			},
		});
		return txHash.data;
	}
	catch (error) {
		const errorMessage = `Error occurred while sendTx was executed: ${error.message}`;
		console.error(errorMessage);
		return new Error(errorMessage);
	}
}

module.exports = rawTx;
