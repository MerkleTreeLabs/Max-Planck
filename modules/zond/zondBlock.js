const getBlock = require('../api/blockLookup');

async function getBlockSub(interaction) {
    try {
        // get the block data
        const blockNumber = await getBlock();
        // return the block number
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
