require('module-alias/register');
const axios = require('axios');
const helper = require('@helper');
const config = require('@config');

async function blockByNumber(blockNumber) {
	try {
		console.log(`helper.decToHex(blockNumber): ${helper.decToHex(blockNumber)}`);
		const blockResponse = await axios.post(`http://${config.zondPubAPI}`, {
			jsonrpc: '2.0',
			method: 'zond_getBlockByNumber',
			params: [
				`0x${helper.decToHex(blockNumber)}`,
				true,
			],
			id: 1,
		}, {
			headers: {
				'Content-Type': 'application/json',
			},
		});
		return blockResponse.data;
	}
	catch (error) {
		const errorMessage = `Error caught trying the blockResponse lookup: ${error.message}`;
		console.error(errorMessage);
		return new Error(errorMessage);
	}
}

module.exports = { blockByNumber };
