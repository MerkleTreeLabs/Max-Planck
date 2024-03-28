require('module-alias/register');

const axios = require('axios');
const { apiPort } = require('@config');

async function getBlockSub(interaction) {
	try {
		// Fetch the current block number from the API
		const response = await axios.get(`http://localhost:${apiPort}/v1/zond-block`);
		let blockNumber = 0;
		// Return the block number
		if (response.data.block.id === 1) {
			blockNumber = parseInt(response.data.block.result, 16);
			return await interaction.reply(`Latest Zond Block:\t\`${blockNumber}\``);
		}
		else {
			return await interaction.reply(`Cannot retrieve the BlockNumber at this time...\n\`${blockNumber}\``);
		}
	}
	catch (error) {
		// Handle the error
		const errorMessage = `Error occurred while fetching the block number: ${error.message}`;
		console.error(errorMessage);
		return await interaction.reply(`Looks like I'm struggling to complete that right now...\n\`${errorMessage}\``);
	}
}

module.exports = getBlockSub;
