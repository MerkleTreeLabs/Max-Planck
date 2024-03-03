const axios = require('axios');
const BigNumber = require('bignumber.js');

async function balance(address) {
	try {
		const response = await axios.post('http://127.0.0.1:8545', {
			jsonrpc: '2.0',
			method: 'zond_getBalance',
			params: [address, 'latest'],
			id: 1,
		}, {
			headers: {
				'Content-Type': 'application/json',
			},
		});
		// format the balance to human readable
		const hexString = response.data.result;
		const hexNumber = new BigNumber(hexString);
		const decimalNumber = hexNumber.dividedBy('1e18');

		console.log(`balance:\t${decimalNumber.toString()}`);
		return decimalNumber;
	}
	catch (error)	{
		throw new Error('Error occurred:', error);
	}
}

module.exports = balance;
