const helper = require('../helpers');
const getTransaction = require('../api/transactionLookup');

async function getTransactionSub(interaction) {
	const userTxHash = interaction.options.getString('hash');
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


			await interaction.reply({ content: `Transaction Data:\n\`\`\`json\n${JSON.stringify(txHashData, null, 4)}\n\`\`\``, ephemeral: true });
		}
		else {
			await interaction.reply(`Invalid txHash:\t${validationResults.error}`);
		}
	}
	catch (error) {
		const errorMessage = `An error occurred during Transaction retrieval: ${error.message}`;
		console.error(errorMessage);
		return await interaction.reply(`Looks like I'm struggling to complete that right now...\n${errorMessage}`);
	}
}

module.exports = getTransactionSub;
