const axios = require('axios');
const config = require('../../config.json');

async function sendFaucetTx(address, amount) {
	console.log('sendFaucetTx called')
	try {
		const response = await axios.post('http://127.0.0.1:8545', {
			jsonrpc: '2.0',
			method: 'zond_sendTransaction',
			params: [config.faucet_address, address, amount, 21000],
			id: 1,
		}, {
			headers: {
				'Content-Type': 'application/json',
			},
		});
		// format the balance to human readable
		return response.data.result;
	}
	catch (error)	{
		throw new Error(`Error occurred: ${error.message}`);
	}
}

module.exports = sendFaucetTx;
