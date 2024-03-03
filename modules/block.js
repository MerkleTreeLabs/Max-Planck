const axios = require('axios');

async function block() {
	try {
		const response = await axios.post('http://127.0.0.1:8545', {
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
