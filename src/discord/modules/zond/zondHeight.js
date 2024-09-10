require('module-alias/register');

const axios = require('axios');
const { apiPort } = require('@config');

async function getHeightSub(interaction) {
	try {
		// Fetch the current block number from the API
		const response = await axios.get(`http://localhost:${apiPort}/v1/zond-height`);
		let blockNumber = 0;
		// Return the block number
		if (response.data.block.id === 1) {
			blockNumber = parseInt(response.data.block.result, 16);
			return await interaction.reply(`Latest Zond Block Height:\t\`${blockNumber}\``);
		}
		else {
			return await interaction.reply(`Cannot retrieve the Zond Block Height at this time...\n\`${blockNumber}\``);
		}
	}
	catch (error) {
		// Handle the error
		const errorMessage = `Error occurred while fetching the block height: ${error.message}`;
		console.error(errorMessage);
		return await interaction.reply(`Looks like I'm struggling to complete that right now...\n\`${errorMessage}\``);
	}
}

module.exports = getHeightSub;
