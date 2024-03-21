const axios = require('axios');
const config = require('../../config.json');

async function estimateGas(transaction) {
	try {
		const response = await axios.post(`http://${config.zondPubAPI}`, {
			jsonrpc: '2.0',
			method: 'zond_estimateGas',
			params: [transaction],
			id: 1,
		}, {
			headers: {
				'Content-Type': 'application/json',
			},
		});
		return response.data.result;
	}
	catch (error)	{
		const errorMessage = `Error occurred while running estimateGas: ${error.message}`;
		console.error(errorMessage);
		return new Error(errorMessage);
	}
}

module.exports = estimateGas;

// zond_estimateGas


// zond.estimateGas({"from":"0x203062aa62de98c466625a3c03319338ee1f9158","to":"0x203062aa62de98c466625a3c03319338ee1f9158","gasLimit":"21000","type":"0x2","value":"0xde0b6b3a7640000","chainId":"0x7e7e","nonce":"0x0"})
