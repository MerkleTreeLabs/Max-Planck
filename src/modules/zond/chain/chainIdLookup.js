require('module-alias/register');

const axios = require('axios');
const config = require('@config');

async function getChainId() {
	try {
		const chainId = await axios.post(`http://${config.zondPubAPI}`, {
			jsonrpc: '2.0',
			method: 'zond_chainId',
			params: [],
			id: 1,
		}, {
			headers: {
				'Content-Type': 'application/json',
			},
		});
		return chainId.data.result;
	}
	catch (error) {
		const errorMessage = `Error caught trying the chainIdLookup: ${error.message}`;
		console.error(errorMessage);
		return new Error(errorMessage);
	}
}

module.exports = getChainId;
