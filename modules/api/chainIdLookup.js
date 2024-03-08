const config = require('../../config.json');
const axios = require('axios');

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
		console.log(`error caught: ${error}`);
	}
}

module.exports = getChainId;
