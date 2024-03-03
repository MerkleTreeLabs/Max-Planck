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
		console.log("response.data.result:\t" + response.data.result)
		return response.data.result;
	}
	catch (error)	{
		throw new Error('Error occurred:', error);
	}
}

module.exports = block;
