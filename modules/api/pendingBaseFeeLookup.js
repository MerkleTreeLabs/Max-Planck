const config = require('../../config.json');
const axios = require('axios');


async function getPendingBaseFee() {
	try {
		const pendingBaseFee = await axios.post(`http://${config.zondPubAPI}`, {
			jsonrpc: '2.0',
			method: 'zond_getMaxPriorityFeePerGas',
			params: [],
			id: 1,
		}, {
			headers: {
				'Content-Type': 'application/json',
			},
		});
		return pendingBaseFee.data.result;
	}
	catch (error) {
		console.log(`error caught: ${error}`);
	}
}

module.exports = getPendingBaseFee;


// const pendingBaseFee = (await axios.get(`${config.zondPubAPI}/pendingBaseFee`)).data.result;
