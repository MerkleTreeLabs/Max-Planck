const axios = require('axios');
const helper = require('../helpers');
const config = require('../../config.json');

async function balance(address, denomination) {
	try {

		const response = await axios.post(`http://${config.zondPubAPI}`, {
			jsonrpc: '2.0',
			method: 'zond_getBalance',
			params: [`0x${address}`, 'latest'],
			id: 1,
		}, {
			headers: {
				'Content-Type': 'application/json',
			},
		});
		// format the balance to human readable
		const hexString = response.data.result;
		return await helper.hexToDec(hexString, denomination);
	}
	catch (error)	{
        throw new Error(`Error occurred: ${error.message}`);
	}
}

module.exports = balance;
