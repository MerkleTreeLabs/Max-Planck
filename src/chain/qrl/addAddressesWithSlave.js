require('module-alias/register');

const axios = require('axios');
const config = require('@config');
// eslint-disable-next-line
async function addAddressesWithSlave(height, number_of_slaves, hash_function) {
	try {
		const data = JSON.stringify({
			height,
			// eslint-disable-next-line
			number_of_slaves,
			// eslint-disable-next-line
			hash_function,
		});
		console.log(data);
		const response = await axios.post(`http://${config.qrlPubSlavesAPI}/api/AddNewAddressWithSlaves `, data, {
			jsonrpc: '2.0',
		}, {
			headers: {
				'Content-Type': 'application/json',
			},
		});
		return response.data.address;
	}
	catch (error)	{
		const errorMessage = `Error occurred in addAddressesWithSlave: ${error.message}`;
		console.error(errorMessage);
		return new Error(errorMessage);
	}
}

module.exports = { addAddressesWithSlave };

