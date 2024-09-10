require('module-alias/register');
const axios = require('axios');

const config = require('@config');
// eslint-disable-next-line
async function blockByNumber(block_number) {
	try {
		const data = JSON.stringify({
			// eslint-disable-next-line
			block_number,
		});
		const response = await axios.post(`http://${config.qrlPubAPI}/api/GetBlockByNumber`, data, {
			jsonrpc: '2.0',
		}, {
			headers: {
				'Content-Type': 'application/json',
			},
		});
		return response.data.block;
	}
	catch (error)	{
		const errorMessage = `Error occurred in BalanceLookup: ${error.message}`;
		console.error(errorMessage);
		return new Error(errorMessage);
	}
}

module.exports = { blockByNumber };
