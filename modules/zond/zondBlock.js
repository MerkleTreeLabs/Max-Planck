const getBlock = require('../api/block');


async function getBlockSub(interaction) {
	// get the block data
	const blockNumber = await getBlock();
	// return the block number
	if (blockNumber) {
		return await interaction.reply(`Latest Block:\t${blockNumber}`);
	}
	else {
		return await interaction.reply(`'Cannot retrieve the BlockNumber at this time...\n${blockNumber}'`);
	}
}

module.exports.getBlockSub = getBlockSub;
