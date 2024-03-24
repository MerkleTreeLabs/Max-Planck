const helper = require('../helpers');
const getTransaction = require('../api/transactionLookup');

async function getTransactionSub(interaction) {
	const userTxHash = interaction.options.getString('hash');
	await interaction.deferReply();
	try {
		const validationResults = await helper.validateTxHash(userTxHash);
		if (validationResults.isValid) {
			const txHashData = await getTransaction(validationResults.hash);
			const keysToConvert = [
				'blockNumber',
				'cumulativeGasUsed',
				'effectiveGasPrice',
				'gasUsed',
				'status',
				'transactionIndex',
				'type',
			];

			keysToConvert.forEach(key => {
				if (Object.prototype.hasOwnProperty.call(txHashData, key)) {
					txHashData[key] = helper.hexToDec(txHashData[key]);
				}
			});
			// public message
			await interaction.editReply(`Transaction Found in Block: ${txHashData.blockNumber}!`);
			// send user ephemeral message with details
			return await interaction.followUp({ content: `Transaction Data:\n\`\`\`json\n${JSON.stringify(txHashData, null, 4)}\n\`\`\``, ephemeral: true });

		}
		else {
			await interaction.editReply(`Invalid txHash:\t${validationResults.error}`);
		}
	}
	catch (error) {
		const errorMessage = `An error occurred during Transaction retrieval: ${error.message}`;
		console.error(errorMessage);
		return await interaction.editReply(`Looks like I'm struggling to complete that right now...\n${errorMessage}`);
	}
}

module.exports = getTransactionSub;
