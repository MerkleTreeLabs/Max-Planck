const config = require('../../config.json');
const axios = require('axios');


async function getNonce(address) {
	try {
		const nonce = await axios.post(`http://${config.zondPubAPI}`, {
			jsonrpc: '2.0',
			method: 'zond_getTransactionCount',
			params: [`0x${address}`, 'latest'],
			id: 1,
		}, {
			headers: {
				'Content-Type': 'application/json',
			},
		});
		return nonce.data.result;
	}
	catch (error) {
		console.log(`error caught: ${error}`);
	}
}

module.exports = getNonce;
