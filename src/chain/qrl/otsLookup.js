require('module-alias/register');
const axios = require('axios');

const config = require('@config');

async function otsIndex(address) {
	try {
		const data = JSON.stringify({
			address,
		});

		const response = await axios.post(`http://${config.qrlPubAPI}/api/GetOTS`, data, {
			jsonrpc: '2.0',
		}, {
			headers: {
				'Content-Type': 'application/json',
			},
		});
		return response.data.next_unused_ots_index;
	}
	catch (error)	{
		const errorMessage = `Error occurred in BalanceLookup: ${error.message}`;
		console.error(errorMessage);
		return new Error(errorMessage);
	}
}

module.exports = { otsIndex };
