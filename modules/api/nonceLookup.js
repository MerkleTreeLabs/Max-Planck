const config = require('../../config.json');
const axios = require('axios');
const helper = require('../helpers');

async function getNonce(address) {
	try {
		// get the nonce from the chain
		const nonceCount = await axios.post(`http://${config.zondPubAPI}`, {
			jsonrpc: '2.0',
			method: 'zond_getTransactionCount',
			params: [address, 'latest'],
			id: 1,
		}, {
			headers: {
				'Content-Type': 'application/json',
			},
		});
		const nonce = parseInt(helper.hexToDec(nonceCount.data.result, 'wei'));
		// get a count of any pending transactions in the que
		const pendingTxns = await axios.post(`http://${config.zondPubAPI}`, {
			jsonrpc: '2.0',
			method: 'zond_pendingTransactions',
			params: [],
			id: 1,
		}, {
			headers: {
				'Content-Type': 'application/json',
			},
		});
		const txCount = pendingTxns.data.result.length;
		// nextNonce is sum of found pending and the on-chain nonce
		const nextNonce = nonce + txCount;
		return nextNonce;
	}
	catch (error) {
		const errorMessage = `Error occurred while fetching the next nonce: ${error.message}`;
		console.error(errorMessage);
		return new Error(errorMessage);
	}
}

module.exports = getNonce;
