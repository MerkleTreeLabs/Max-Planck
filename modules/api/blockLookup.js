const config = require('../../config.json');
const axios = require('axios');

async function block() {
	try {
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
		return parseInt(response.data.result, 16);
	}
	catch (error)	{
		throw new Error('Error occurred:', error);
	}
}

module.exports = block;
