import axios from 'axios';

const response = await axios.post(
	'http://127.0.0.1:8545',
	'{"jsonrpc":"2.0",  \\ \n    "method":"zond_blockNumber",\\\n    "params":[], "id":1}',
	{
		headers: {
			'Content-Type': 'application/json',
		},
	},
);

module.exports = {
	block: function() {
		console.log(response);
		return response;
	},
};
