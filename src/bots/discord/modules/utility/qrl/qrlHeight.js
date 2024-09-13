require('module-alias/register');

const axios = require('axios');
const { apiPort } = require('@config');

async function getQRLHeightSub(interaction) {
	await interaction.deferReply();
	try {
		// Fetch the current block number from the API
		const response = await axios.get(`http://localhost:${apiPort}/v1/qrl-height`);
		let blockNumber = 0;
		// Return the block number
		if (response.data.success) {
			blockNumber = parseInt(response.data.height);
			return await interaction.editReply(`Latest QRL Block Height:\t\`${blockNumber}\``);
		}
		else {
			// return a response so the discord api is happy
			return await interaction.editReply(`Cannot retrieve the QRL Block Height at this time...\n\`${blockNumber}\``);
		}
	}
	catch (error) {
		// Handle the error
		const errorMessage = `Error occurred while fetching the block number: ${error.message}`;
		console.error(errorMessage);
		return await interaction.editReply(`Looks like I'm struggling to complete that right now...\n\`${errorMessage}\``);
	}
}

module.exports = getQRLHeightSub;
