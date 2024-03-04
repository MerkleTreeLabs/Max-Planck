const helper = require('../helpers');
const getTransaction = require('../api/transaction');

async function getTransactionSub(interaction) {
	const userTxHash = interaction.options.getString('hash');
	try {
		const validationResults = await helper.validateTxHash(userTxHash);
		if (validationResults.isValid) {
			const txHashData = await getTransaction(validationResults.hash);
			await interaction.reply({ content: `Transaction Data:\n\`\`\`json\n${JSON.stringify(txHashData, null, 4)}\n\`\`\``, ephemeral: true });
		}
		else {
			await interaction.reply(`Invalid txHash:\t${validationResults.error}`);
		}
	}
	catch (error) {
		console.error('An error occurred during Transaction retrieval:', error);
		await interaction.reply('Looks like I\'m struggling to complete that right now...');
	}
}

module.exports = getTransactionSub;
