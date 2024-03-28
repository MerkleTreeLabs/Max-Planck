require('module-alias/register');

const { block } = require('@zond-api/blockLookup');

async function getBlockSub(interaction) {
	try {
		// get the block data
		const blockNumber = await block();
		// return the block number
		if (blockNumber) {
			return await interaction.reply(`Latest Zond Block:\t\`${parseInt(blockNumber.result, 16)}\``);
		}
		else {
			return await interaction.reply('Cannot retrieve the BlockNumber at this time...');
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

/*
// using the new api
const axios = require('axios');
const { apiPort } = require('../../config.json');
const PORT = apiPort || 3000

async function getBlockSub(interaction) {
	try {
		// Fetch the current block number from the API
		const response = await axios.get(`http://localhost:${PORT}/zond-block`);
		const blockNumber = response.data.currentBlock.number;

		// Return the block number
		if (blockNumber) {
			return await interaction.reply(`Latest Zond Block:\t\`${blockNumber}\``);
		} else {
			return await interaction.reply(`Cannot retrieve the BlockNumber at this time...\n\`${blockNumber}\``);
		}
	} catch (error) {
		// Handle the error
		const errorMessage = `Error occurred while fetching the block number: ${error.message}`;
		console.error(errorMessage);
		return await interaction.reply(`Looks like I'm struggling to complete that right now...\n\`${errorMessage}\``);
	}
}

module.exports = getBlockSub;

*/
