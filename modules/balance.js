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
		const hexString = response.data.result
		const hexWithoutPrefix = hexString.slice(2);
		console.log(`hexWithoutPrefix:\t${hexWithoutPrefix}`)
		const decimalNumber = new BigNumber(hexWithoutPrefix, 18);
		console.log(`balance:\t${decimalNumber}`)
		return decimalNumber;
	}
	catch (error)	{
		throw new Error('Error occurred:', error);
	}
}

module.exports = balance;
