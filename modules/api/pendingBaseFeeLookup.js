const config = require('../../config.json');
const axios = require('axios');


async function getPendingBaseFee() {
	try {
		const pendingBaseFee = await axios.post(`http://${config.zondPubAPI}`, {
			jsonrpc: '2.0',
			method: 'zond_getBlock',
			params: [],
			id: 1,
		}, {
			headers: {
				'Content-Type': 'application/json',
			},
		});
		console.log(pendingBaseFee.data);
		return pendingBaseFee.data.baseFeePerGas;
	}
	catch (error) {
		console.log(`error caught: ${error}`);
	}
}

module.exports = getPendingBaseFee;


// const pendingBaseFee = (await axios.get(`${config.zondPubAPI}/pendingBaseFee`)).data.result;
