require('module-alias/register');

const axios = require('axios');
const config = require('@config');

async function block() {
	try {
		console.log(`http://${config.zondPubAPI}`);
		const response = await axios.post(`http://${config.zondPubAPI}`, {
			jsonrpc: '2.0',
			method: 'zond_blockNumber',
			params: [],
			id: 1,
		}, {
			headers: {
				'Content-Type': 'application/json',
			},
		});
		// format the block to human readable
		// return parseInt(response.data.result, 16);
		return response.data;
	}
	catch (error)	{
		const errorMessage = `Error occurred while fetching the latest block: ${error.message}`;
		console.error(errorMessage);
		return new Error(errorMessage);
	}
}

module.exports = { block };
